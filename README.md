# Agentic

Radically minimal. Maximum leverage from model improvements.

> Unix tools work because the philosophy is embodied, not documented.

---

## What This Is

- `mcp-servers/` — MCP servers for Claude Code (multimodel, serverless)
- `USE-AS-GLOBAL-CLAUDE.md` — development standards for `~/.claude/CLAUDE.md`
- `human-instructions.md` + `scaffold-lib.sh` — practical bootstrapping
- `docs/dialogues/` — patterns observed, lessons earned

---

## Setup

### Global Standards

```bash
git clone https://github.com/jasonhoffman/agentic ~/.agentic
ln -s ~/.agentic/USE-AS-GLOBAL-CLAUDE.md ~/.claude/CLAUDE.md
```

### New React Native + Supabase Project

```bash
cd your-project
cp ~/.agentic/scaffold-lib.sh ./
./scaffold-lib.sh
```

See `human-instructions.md` for complete setup checklist.

### MCP Servers

```bash
cd your-project
cp -r ~/.agentic/mcp-servers ./
cp ~/.agentic/.mcp.json ./
cd mcp-servers/multimodel && npm install && cd ..
cd serverless && npm install && cd ../..
```

Add keys to `.env.local`:
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
VOYAGE_API_KEY=vo-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Restart Claude Code.

| MCP | Tools | Purpose |
|-----|-------|---------|
| `multimodel` | parallel_query, query_openai, query_gemini, embed_voyage | Cross-AI verification |
| `serverless` | discover, invoke | Find and call edge functions (Supabase, Modal) |

---

## Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Instructions for working in this repo |
| `USE-AS-GLOBAL-CLAUDE.md` | Global standards (symlink to `~/.claude/CLAUDE.md`) |
| `mcp-servers/multimodel/` | MCP server for cross-AI queries |
| `mcp-servers/serverless/` | MCP server for edge function discovery and invocation |
| `supabase/get_api_key.sql` | Vault function for centralized keys |
| `docs/dialogues/` | Conversations that shaped the understanding |
| `human-instructions.md` | Human setup checklist |
| `scaffold-lib.sh` | Creates /lib structure |

---

## License

MIT
