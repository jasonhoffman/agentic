#!/usr/bin/env node

/**
 * Multimodel MCP Server
 *
 * Provides tools for querying multiple LLM providers (OpenAI, Gemini, Voyage).
 * Claude Code as orchestrator calls these to cross-validate, research, or embed.
 *
 * API Key Resolution:
 *   1. Try Supabase Vault via get_api_key() RPC
 *   2. Fall back to .env.local / environment variables
 */

import { config } from "@dotenvx/dotenvx";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../../..");

// Load .env.local from project root (fallback source for keys)
config({ path: resolve(projectRoot, ".env.local") });

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    available: ["gemini-3-pro-preview", "gemini-3-flash-preview", "gemini-2.5-pro", "gemini-2.5-flash"],
  },
  voyage: {
    default: "voyage-3",
  },
} as const;

// =============================================================================
// API Key Resolution
// =============================================================================

let supabase: SupabaseClient | null = null;
const keyCache: Record<string, string> = {};
const keySource: Record<string, string> = {};

function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("[multimodel] No Supabase credentials, Vault unavailable");
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

async function getApiKey(provider: "openai" | "google" | "voyage"): Promise<string> {
  if (keyCache[provider]) {
    return keyCache[provider];
  }

  const vaultNames: Record<string, string> = {
    openai: "openai_api_key",
    google: "gemini_api_key",
    voyage: "voyage_api_key",
  };
  const envNames: Record<string, string> = {
    openai: "OPENAI_API_KEY",
    google: "GEMINI_API_KEY",
    voyage: "VOYAGE_API_KEY",
  };

  // Try Vault first
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.rpc("get_api_key", {
        key_name: vaultNames[provider],
      });

      if (!error && data) {
        keyCache[provider] = data;
        keySource[provider] = "vault";
        console.error(`[multimodel] ${provider} key loaded from Vault`);
        return data;
      }
    } catch (e) {
      console.error(`[multimodel] Vault lookup failed for ${provider}: ${e}`);
    }
  }

  // Fall back to environment variable
  const envKey = process.env[envNames[provider]];
  if (envKey) {
    keyCache[provider] = envKey;
    keySource[provider] = "env";
    console.error(`[multimodel] ${provider} key loaded from env`);
    return envKey;
  }

  throw new Error(`No API key found for ${provider} (checked Vault and env)`);
}

// =============================================================================
// Lazy Client Initialization
// =============================================================================

let openaiClient: OpenAI | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

async function getOpenAI(): Promise<OpenAI> {
  if (openaiClient) return openaiClient;
  const apiKey = await getApiKey("openai");
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

async function getGemini(): Promise<GoogleGenerativeAI> {
  if (geminiClient) return geminiClient;
  const apiKey = await getApiKey("google");
  geminiClient = new GoogleGenerativeAI(apiKey);
  return geminiClient;
}

async function getVoyageKey(): Promise<string> {
  return getApiKey("voyage");
}

async function queryOpenAIResponses(
  prompt: string,
  systemPrompt: string | undefined,
  model: string,
  maxTokens: number
): Promise<{ content: string; model: string; usage: unknown }> {
  const apiKey = await getApiKey("openai");

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
      max_output_tokens: maxTokens,
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
            max_tokens: { type: "number", description: "Max tokens (default: 4096)" },
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
        const { prompt, system_prompt, model = MODELS.openai.default, max_tokens = 4096 } = args as {
          prompt: string;
          system_prompt?: string;
          model?: string;
          max_tokens?: number;
        };

        if ((MODELS.openai.responsesApi as readonly string[]).includes(model)) {
          const result = await queryOpenAIResponses(prompt, system_prompt, model, max_tokens);
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                ...result,
                key_source: keySource["openai"],
              }, null, 2),
            }],
          };
        }

        const openai = await getOpenAI();
        const messages: OpenAI.ChatCompletionMessageParam[] = [];
        if (system_prompt) messages.push({ role: "system", content: system_prompt });
        messages.push({ role: "user", content: prompt });

        const response = await openai.chat.completions.create({
          model,
          messages,
          max_completion_tokens: max_tokens,
        });

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              content: response.choices[0]?.message?.content,
              model: response.model,
              usage: response.usage,
              key_source: keySource["openai"],
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

        const genAI = await getGemini();
        const geminiModel = genAI.getGenerativeModel({
          model,
          systemInstruction: system_prompt,
        });

        const result = await geminiModel.generateContent(prompt);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              content: result.response.text(),
              model,
              usage: result.response.usageMetadata,
              key_source: keySource["google"],
            }, null, 2),
          }],
        };
      }

      case "embed_voyage": {
        const { text, input_type = "document" } = args as {
          text: string;
          input_type?: string;
        };

        const voyageKey = await getVoyageKey();
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
              key_source: keySource["voyage"],
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
              const result = await queryOpenAIResponses(prompt, system_prompt, openai_model, 4096);
              return { ...result, key_source: keySource["openai"] };
            }

            const openai = await getOpenAI();
            const messages: OpenAI.ChatCompletionMessageParam[] = [];
            if (system_prompt) messages.push({ role: "system", content: system_prompt });
            messages.push({ role: "user", content: prompt });
            const response = await openai.chat.completions.create({
              model: openai_model,
              messages,
              max_completion_tokens: 4096,
            });
            return {
              model: openai_model,
              content: response.choices[0]?.message?.content,
              usage: response.usage,
              key_source: keySource["openai"],
            };
          })(),
          (async () => {
            const genAI = await getGemini();
            const model = genAI.getGenerativeModel({
              model: gemini_model,
              systemInstruction: system_prompt,
            });
            const result = await model.generateContent(prompt);
            return {
              model: gemini_model,
              content: result.response.text(),
              usage: result.response.usageMetadata,
              key_source: keySource["google"],
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
