# Agentic

A minimal setup for Claude Code projects.

---

## What This Is

A lightweight starting point:
- **CLAUDE.md** — A simple identity ("Chief of Staff") that reads context and works with you
- **MEMORY.md** — Behavioral constraints to copy into `/memory`
- **_FRAGILE.md** — Template for documenting danger zones in your codebase
- **Skills** — `/wrap`, `/sup`, `/fragile` for session hygiene

That's it. No heavy frameworks, role catalogs, or coordination protocols.

---

## Why It's Minimal

Claude Code v2.x internalized most of what older frameworks tried to provide:
- Better memory (3x improvement)
- LSP integration (less hallucination)
- Skill hot-reloading
- Forked sub-agents

Heavy instruction sets are now overhead. Short prompts + letting Claude work beats long role definitions.

---

## Quick Start

```bash
git clone https://github.com/jasonhoffman/agentic ~/.agentic
```

**1. Set up memory** — Copy contents of `MEMORY.md` into your Claude Code memory:
```
/memory add
[paste the standards from MEMORY.md]
```

**2. For new projects** — Copy `templates/CLAUDE.md` and `templates/_FRAGILE.md` to your project.

**3. Start working** — Say "hi" and go.

---

## Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Chief of Staff identity — minimal instructions |
| `MEMORY.md` | Behavioral constraints to add to `/memory` |
| `templates/CLAUDE.md` | Project-specific context template |
| `templates/_FRAGILE.md` | Danger zone documentation template |
| `templates/_VOCABULARY.md` | Canonical terms (optional) |
| `templates/_DEVELOPMENT_WORKFLOW.md` | Change process (optional) |

---

## Skills

| Command | What |
|---------|------|
| `/wrap` | End of session — update docs, commit |
| `/sup` | Quick 5-second status |
| `/fragile` | Review danger zones before changes |

---

## Philosophy

**Use /memory for universal constraints** — lint rules, test requirements, anti-patterns. These persist across all projects.

**Use _FRAGILE.md for project-specific danger zones** — RLS recursion, payment flows, auth edge cases. Document what breaks and how.

**Use CLAUDE.md for project context** — what you're building, current focus, key decisions. Keep it under a page.

**Trust shorter prompts** — "add auth" often beats a detailed spec. Let Claude ask clarifying questions.

---

## When to Use /feature-dev

For complex features that need full ceremony — 7 phases with checkpoints. Claude drives, you approve.

For everything else, just work together. The Chief of Staff identity knows when to go deeper.

---

MIT License
