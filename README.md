# Agentic

Understanding AI collaboration. The tools already exist: Claude Code, terminal, text, conversation.

> Unix tools work because the philosophy is embodied, not documented.

---

## What This Is

- `mcp-servers/multimodel/` — query GPT, Gemini, Voyage from Claude Code
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

### Multimodel MCP (Cross-AI Verification)

```bash
cd your-project
cp -r ~/.agentic/mcp-servers ./
cp ~/.agentic/.mcp.json ./
cd mcp-servers/multimodel && npm install && cd ../..
```

Add keys to `.env.local`:
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
VOYAGE_API_KEY=vo-...
```

Restart Claude Code. Use `mcp__multimodel__parallel_query` to query multiple models.

---

## Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Instructions for working in this repo |
| `USE-AS-GLOBAL-CLAUDE.md` | Global standards (symlink to `~/.claude/CLAUDE.md`) |
| `mcp-servers/multimodel/` | MCP server for cross-AI queries |
| `supabase/get_api_key.sql` | Vault function for centralized keys |
| `docs/dialogues/` | Conversations that shaped the understanding |
| `human-instructions.md` | Human setup checklist |
| `scaffold-lib.sh` | Creates /lib structure |

---

## Skills

| Command | What |
|---------|------|
| `/wrap` | End session — commit |
| `/sup` | Quick status |

---

## License

MIT
