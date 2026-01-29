# Agentic

Understanding AI collaboration. The tools already exist: Claude Code, terminal, text, conversation.

> Unix tools work because the philosophy is embodied, not documented.

---

## What This Is

- `docs/dialogues/` — patterns observed, lessons earned
- `USE-AS-GLOBAL-CLAUDE.md` — development standards for `~/.claude/CLAUDE.md`
- `human-instructions.md` + `scaffold-lib.sh` — practical bootstrapping

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

---

## Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Instructions for working in this repo |
| `USE-AS-GLOBAL-CLAUDE.md` | Global standards (symlink to `~/.claude/CLAUDE.md`) |
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
