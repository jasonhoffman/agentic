# Agentic

A minimal setup for Claude Code projects.

---

## What This Is

A lightweight starting point:
- **CLAUDE.md** — Comprehensive project instructions for React Native + Supabase (or use CLAUDE-minimal.md for other stacks)
- **MEMORY.md** — Behavioral constraints to copy into `/memory`
- **_FRAGILE.md** — Template for documenting danger zones in your codebase
- **Skills** — `/wrap`, `/sup`, `/fragile` for session hygiene
- **Project patterns** — Data modeling templates for specialized projects

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
or 

```
cp MEMORY.md ~/.claude/CLAUDE.me

```

**2. For new projects** — Choose your template:

React Native + Supabase projects (default stack):
```bash
cp ~/.agentic/templates/CLAUDE.md ./
cp ~/.agentic/templates/_FRAGILE.md ./docs/
```

Other stacks (minimal template):
```bash
cp ~/.agentic/templates/CLAUDE-minimal.md ./CLAUDE.md
cp ~/.agentic/templates/_FRAGILE.md ./docs/
```

**3. Start working** — Say "hi" and go.

---

## Template Growth Trajectory

Don't fill everything day one. Templates grow with your project:

**Day 1 (bootstrap)**
- `CLAUDE.md` — What is this? What's the stack?
- `_FRAGILE.md` — Start empty, add gotchas as you discover them

**Week 1 (shipping code)**
- `_ARCHITECTURE.md` — Document decisions as you make them
- `_SCHEMA.md` — Database tables and relationships
- `_NEXT_SESSION_MEMO.md` — Start updating at end of each session

**Month 1 (features accumulating)**
- `PRD/` — Product requirements for major features
- `RFD/` — Technical designs for complex implementations
- `_DEV_SETUP.md` — When onboarding becomes non-trivial

**Ongoing (production)**
- `_RELEASE_NOTES.md` — Update per version
- `_FRAGILE.md` — Add danger zones after incidents
- `_NEXT_SESSION_MEMO.md` — Update every session

Real projects hit 30,000+ lines of documentation supporting 180,000 lines of code. The templates scale.

---

## Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Chief of Staff identity for agentic repo |
| `MEMORY.md` | Behavioral constraints to add to `/memory` |
| `templates/CLAUDE.md` | Comprehensive template (React Native + Supabase) |
| `templates/CLAUDE-minimal.md` | Minimal template (any stack) |
| `templates/_FRAGILE.md` | Danger zone documentation template |
| `templates/_NEXT_SESSION_MEMO.md` | Session continuity — "I'm going to sleep" doc |
| `templates/_VOCABULARY.md` | Canonical terms (optional) |
| `templates/_DEVELOPMENT_WORKFLOW.md` | Change process (optional) |

---

## Project-Specific Templates

Beyond general templates, agentic includes specialized project patterns:

### Data Modeling Projects

**Location:** `templates/project-types/data-modeling/`

For projects with:
- Complex data projections and scenarios
- Database-driven calculations
- Verified claims with sources
- Multi-scenario analysis

**What you get:**
- Complete database schema (claims, scenarios, projections)
- `/lib` structure with single source of truth pattern
- TanStack Query integration with optimistic updates
- Verification scripts to catch architecture violations
- Seed data scripts

**When to use:**
- Modeling applications (economic, infrastructure, population)
- Research/analysis platforms
- Tools with multiple scenario comparisons
- Apps requiring audit trails for data changes

See [`templates/project-types/data-modeling/PROJECT_INITIATION.md`](templates/project-types/data-modeling/PROJECT_INITIATION.md) for the complete setup guide.

---

## Skills

| Command | What |
|---------|------|
| `/wrap` | End of session — update docs, commit |
| `/sup` | Quick 5-second status |
| `/fragile` | Review danger zones before changes |
| `/plan` | Two-phase workflow — explore read-only, then implement |
| `/research` | Deep exploration in forked context (doesn't pollute main conversation) |
| `/e2e` | Chrome integration for click-through testing |

---

## Philosophy

**Use /memory for universal constraints** — lint rules, test requirements, anti-patterns. These persist across all projects.

**Use _FRAGILE.md for project-specific danger zones** — RLS recursion, payment flows, auth edge cases. Document what breaks and how.

**Use CLAUDE.md for project context** — what you're building, current focus, key decisions. Keep it under a page.

**Trust shorter prompts** — "add auth" often beats a detailed spec. Let Claude ask clarifying questions.

---

## When to Use Which Skill

| Situation | Skill |
|-----------|-------|
| Complex feature, need full ceremony | `/feature-dev` |
| Non-trivial feature, need plan approval | `/plan` |
| Deep codebase exploration | `/research` |
| Quick status check | `/sup` |
| Before touching risky code | `/fragile` |
| End of session | `/wrap` |
| E2E click-through testing | `/e2e` |

For simple tasks, just work together. The Chief of Staff identity knows when to go deeper.

---

## Claude Code v2.1.5 Integration

This framework leverages native Claude Code capabilities:

**Delegation patterns** — Route tasks to appropriate subagents:
- `Task(Explore)` for codebase scanning (fast, cheap, read-only)
- `Task(Plan)` for architecture before implementation
- `Task(general-purpose)` for multi-step research + implementation

**Forked contexts** — `/research` runs in isolated context:
- Exploration doesn't pollute main conversation
- Results summarized back to main thread

**MCP integration** — Context7 for live documentation:
- Use when framework APIs changed since training
- Skip for well-established patterns

**Background execution** — Long-running tasks don't block:
- Builds, tests, migrations run in background
- Continue working while they complete

See `MEMORY.md` for detailed guidance on when to use each pattern.

---

MIT License
