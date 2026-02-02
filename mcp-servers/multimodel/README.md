# Multimodel MCP Server

Query multiple LLM providers from Claude Code. Cross-validate, research, or embed.

## Setup

```bash
cd mcp-servers/multimodel && npm install
```

## API Keys

Option 1: Environment variables in `.env.local` at project root:
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
VOYAGE_API_KEY=vo-...
```

Option 2: Supabase Vault (recommended for teams)
- Add keys to Vault: `openai_api_key`, `gemini_api_key`, `voyage_api_key`
- Add `get_api_key()` function (see `supabase/get_api_key.sql`)
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

## Tools

| Tool | Description |
|------|-------------|
| `query_openai` | Query OpenAI models |
| `query_gemini` | Query Gemini models |
| `embed_voyage` | Get Voyage AI embeddings |
| `parallel_query` | Query OpenAI + Gemini simultaneously |

## Usage

Claude Code calls these via MCP:

```
mcp__multimodel__parallel_query({ prompt: "What is X?" })
```

Claude synthesizes the responses. No automated consensus needed.
