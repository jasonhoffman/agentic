#!/usr/bin/env node

/**
 * Multimodel MCP Server
 *
 * Provides tools for querying multiple LLM providers (OpenAI, Gemini, Voyage).
 * API keys come from environment variables (passed via MCP config env block).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// =============================================================================
// Model Configuration
// =============================================================================

const MODELS = {
  openai: {
    default: "gpt-5.2-pro-2025-12-11",
    available: ["gpt-5.2-pro-2025-12-11", "gpt-5.2-2025-12-11"],
    // Models that use Responses API instead of Chat Completions
    responsesApi: ["gpt-5.2-pro-2025-12-11"],
  },
  gemini: {
    default: "gemini-3-pro-preview",
    available: ["gemini-3-pro-preview", "gemini-3-flash-preview"],
  },
  voyage: {
    default: "voyage-3",
  },
} as const;

// =============================================================================
// API Key Resolution — env vars only
// =============================================================================

const ENV_NAMES: Record<string, string> = {
  openai: "OPENAI_API_KEY",
  google: "GEMINI_API_KEY",
  voyage: "VOYAGE_API_KEY",
};

function getApiKey(provider: "openai" | "google" | "voyage"): string {
  const key = process.env[ENV_NAMES[provider]];
  if (!key) {
    throw new Error(`${ENV_NAMES[provider]} not set`);
  }
  return key;
}

// =============================================================================
// Lazy Client Initialization
// =============================================================================

let openaiClient: OpenAI | null = null;
let geminiClient: GoogleGenAI | null = null;

function getOpenAI(): OpenAI {
  if (openaiClient) return openaiClient;
  openaiClient = new OpenAI({ apiKey: getApiKey("openai") });
  return openaiClient;
}

function getGemini(): GoogleGenAI {
  if (geminiClient) return geminiClient;
  geminiClient = new GoogleGenAI({ apiKey: getApiKey("google") });
  return geminiClient;
}

async function queryOpenAIResponses(
  prompt: string,
  systemPrompt: string | undefined,
  model: string,
): Promise<{ content: string; model: string; usage: unknown }> {
  const apiKey = getApiKey("openai");

  const input = systemPrompt
    ? [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    : prompt;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Responses API error: ${response.status}`);
  }

  const data = await response.json();

  const outputText = data.output
    ?.filter((item: { type: string }) => item.type === "message")
    ?.map((item: { content: Array<{ type: string; text: string }> }) =>
      item.content?.filter((c: { type: string }) => c.type === "output_text")?.map((c: { text: string }) => c.text).join("")
    )
    .join("") || "";

  return {
    content: outputText,
    model: data.model || model,
    usage: data.usage,
  };
}

// =============================================================================
// MCP Server
// =============================================================================

const server = new Server(
  {
    name: "multimodel-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_openai",
        description: `Query OpenAI models (${MODELS.openai.available.join(", ")})`,
        inputSchema: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "The prompt to send" },
            system_prompt: { type: "string", description: "Optional system prompt" },
            model: {
              type: "string",
              description: `Model (default: ${MODELS.openai.default})`,
              enum: MODELS.openai.available,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "query_gemini",
        description: `Query Gemini models (${MODELS.gemini.available.join(", ")})`,
        inputSchema: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "The prompt to send" },
            system_prompt: { type: "string", description: "Optional system instruction" },
            model: {
              type: "string",
              description: `Model (default: ${MODELS.gemini.default})`,
              enum: MODELS.gemini.available,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "embed_voyage",
        description: `Get Voyage AI embeddings (${MODELS.voyage.default}, 1024 dims)`,
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to embed" },
            input_type: {
              type: "string",
              description: "Type (document or query)",
              enum: ["document", "query"],
            },
          },
          required: ["text"],
        },
      },
      {
        name: "parallel_query",
        description: "Query OpenAI and Gemini in parallel for cross-validation",
        inputSchema: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "Prompt for both models" },
            system_prompt: { type: "string", description: "Optional system prompt" },
            openai_model: {
              type: "string",
              description: `OpenAI model (default: ${MODELS.openai.default})`,
              enum: MODELS.openai.available,
            },
            gemini_model: {
              type: "string",
              description: `Gemini model (default: ${MODELS.gemini.default})`,
              enum: MODELS.gemini.available,
            },
          },
          required: ["prompt"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "query_openai": {
        const { prompt, system_prompt, model = MODELS.openai.default } = args as {
          prompt: string;
          system_prompt?: string;
          model?: string;
        };

        if ((MODELS.openai.responsesApi as readonly string[]).includes(model)) {
          const result = await queryOpenAIResponses(prompt, system_prompt, model);
          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2),
            }],
          };
        }

        const openai = getOpenAI();
        const messages: OpenAI.ChatCompletionMessageParam[] = [];
        if (system_prompt) messages.push({ role: "system", content: system_prompt });
        messages.push({ role: "user", content: prompt });

        const response = await openai.chat.completions.create({
          model,
          messages,
        });

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              content: response.choices[0]?.message?.content,
              model: response.model,
              usage: response.usage,
            }, null, 2),
          }],
        };
      }

      case "query_gemini": {
        const { prompt, system_prompt, model = MODELS.gemini.default } = args as {
          prompt: string;
          system_prompt?: string;
          model?: string;
        };

        const ai = getGemini();
        const result = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            ...(system_prompt && { systemInstruction: system_prompt }),
          },
        });

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              content: result.text,
              model,
              usage: result.usageMetadata,
            }, null, 2),
          }],
        };
      }

      case "embed_voyage": {
        const { text, input_type = "document" } = args as {
          text: string;
          input_type?: string;
        };

        const voyageKey = getApiKey("voyage");
        const response = await fetch("https://api.voyageai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${voyageKey}`,
          },
          body: JSON.stringify({
            model: MODELS.voyage.default,
            input: [text],
            input_type,
          }),
        });

        const data = await response.json();

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              embedding: data.data?.[0]?.embedding,
              dimensions: data.data?.[0]?.embedding?.length,
              usage: data.usage,
            }, null, 2),
          }],
        };
      }

      case "parallel_query": {
        const { prompt, system_prompt, openai_model = MODELS.openai.default, gemini_model = MODELS.gemini.default } = args as {
          prompt: string;
          system_prompt?: string;
          openai_model?: string;
          gemini_model?: string;
        };

        const [openaiResult, geminiResult] = await Promise.allSettled([
          (async () => {
            if ((MODELS.openai.responsesApi as readonly string[]).includes(openai_model)) {
              return queryOpenAIResponses(prompt, system_prompt, openai_model);
            }

            const openai = getOpenAI();
            const messages: OpenAI.ChatCompletionMessageParam[] = [];
            if (system_prompt) messages.push({ role: "system", content: system_prompt });
            messages.push({ role: "user", content: prompt });
            const response = await openai.chat.completions.create({
              model: openai_model,
              messages,
            });
            return {
              model: openai_model,
              content: response.choices[0]?.message?.content,
              usage: response.usage,
            };
          })(),
          (async () => {
            const ai = getGemini();
            const result = await ai.models.generateContent({
              model: gemini_model,
              contents: prompt,
              config: {
                ...(system_prompt && { systemInstruction: system_prompt }),
              },
            });
            return {
              model: gemini_model,
              content: result.text,
              usage: result.usageMetadata,
            };
          })(),
        ]);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              openai: openaiResult.status === "fulfilled"
                ? openaiResult.value
                : { error: (openaiResult as PromiseRejectedResult).reason?.message },
              gemini: geminiResult.status === "fulfilled"
                ? geminiResult.value
                : { error: (geminiResult as PromiseRejectedResult).reason?.message },
            }, null, 2),
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 2),
      }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Multimodel MCP server running");
}

main().catch(console.error);
