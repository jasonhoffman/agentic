# Agentic

> Fundamentally just me finding my way in the wilderness post claude-code 2.1.x and keeping notes, probability of there being something materially better is very high
 
> Minimal Claude Code setup for React Native + Supabase projects

Build production-ready mobile apps with Claude from day one. No heavy frameworks, just proven patterns and automation.

---

## What You Get

**For React Native + Supabase projects:**
- **Comprehensive CLAUDE.md** — Architecture patterns, responsive layout, red flags
- **Automated `/lib` setup** — One script creates complete data layer structure
- **Responsive layout system** — iPhone/iPad/web support from first commit
- **Initialization audit** — Find and fix violations before they spread
- **Data modeling patterns** — For projection/scenario-heavy apps

**For any stack:**
- **Minimal CLAUDE.md** — Generic template for non-React-Native projects
- **Session hygiene skills** — `/wrap`, `/sup`, `/fragile`, `/research`
- **Documentation templates** — Scale from prototype to production

---

## Quick Start

### Installation

```bash
git clone https://github.com/jasonhoffman/agentic ~/.agentic
```

### Setup Global Standards (One Time)

Symlink development standards to Claude Code:

```bash
ln -s ~/.agentic/MEMORY.md ~/.claude/CLAUDE.md
```

Changes to MEMORY.md are now automatically reflected globally.

---

## For React Native + Supabase Projects

### 1. Copy Templates

```bash
cd your-project
cp ~/.agentic/templates/CLAUDE.md ./
cp ~/.agentic/templates/_FRAGILE.md ./docs/
```

### 2. Scaffold /lib Structure

```bash
cp ~/.agentic/templates/scaffold-lib.sh ./
chmod +x scaffold-lib.sh
./scaffold-lib.sh
```

This creates in < 1 second:
- `lib/config/env.ts` — Centralized environment variables
- `lib/supabase/client.ts` — Single Supabase instance + helpers
- `lib/queries/keys.ts` — TanStack Query key factories
- `lib/hooks/useAuth.ts` — Complete auth hook with Google OAuth
- `lib/layout/` — Responsive layout foundation
- `docs/` — Architecture and fragile areas documentation

### 3. Complete Setup with Claude

```
I'm starting a new React Native + Expo + Supabase project. I've run scaffold-lib.sh.
Please continue with the initialization phases in ~/.agentic/templates/PROJECT_INIT_RN_SUPABASE.md
to audit the codebase and complete the setup.
```

Claude will:
- Generate database types from Supabase
- Add remaining responsive layout files (LayoutShell, AdaptiveModal, etc.)
- Verify no architecture violations
- Create RLS policies documentation

### 4. Start Building

```
Hi! Let's build [feature name].
```

---

## For Other Stacks

```bash
cd your-project
cp ~/.agentic/templates/CLAUDE-minimal.md ./CLAUDE.md
cp ~/.agentic/templates/_FRAGILE.md ./docs/
```

Then customize CLAUDE.md with your stack details.

---

## Key Features

### Responsive Layout System (CRITICAL)

Multi-pane layouts for iPad and web from day one. Retrofitting later breaks navigation, state, and styling.

**Files:** `templates/RESPONSIVE_LAYOUT_SYSTEM.md`

**What you get:**
- `useLayout()` — Hook for breakpoints (compact/medium/expanded)
- `LayoutShell` — App wrapper with sidebar + detail pane
- `useAdaptiveNavigation()` — Navigation that adapts to layout
- `AdaptiveModal` — Modals that adapt to screen size
- `ResponsiveGrid` — Auto-column grid

**Supports:**
- iPhone: single column, stack navigation
- iPad portrait: sidebar + main, stack navigation
- iPad landscape: sidebar + list + detail pane (inline)
- Web: responsive to browser width

### Initialization Audit

**File:** `templates/PROJECT_INIT_RN_SUPABASE.md`

Five-phase audit and migration guide:
1. **Audit** — Scan for violations (hardcoded IDs, scattered env vars, string query keys)
2. **Establish /lib** — Create proper structure (or use scaffold script)
3. **Migrate** — Fix all violations with grep scripts
4. **Database** — RLS policies, SECURITY DEFINER helpers
5. **Verify** — Run verification commands, complete checklist

### Data Modeling Template

**Location:** `templates/project-types/data-modeling/`

For apps with projections, scenarios, verified claims:
- Complete Supabase schema (claims, scenarios, projections, audit trail)
- Single source of truth pattern (DB → models → hooks → components)
- Verification scripts to catch violations
- Seed data generation

**Use for:** Economic models, infrastructure planning, population projections, research platforms

---

## Files Reference

| File | Purpose |
|------|---------|
| **Templates** | |
| `templates/CLAUDE.md` | Comprehensive (React Native + Supabase) |
| `templates/CLAUDE-minimal.md` | Minimal (any stack) |
| `templates/scaffold-lib.sh` | Automated /lib structure creation |
| `templates/PROJECT_INIT_RN_SUPABASE.md` | Initialization audit guide |
| `templates/RESPONSIVE_LAYOUT_SYSTEM.md` | Complete responsive layout implementation |
| **Documentation** | |
| `templates/_FRAGILE.md` | Danger zones template |
| `templates/_NEXT_SESSION_MEMO.md` | Session continuity |
| `templates/_VOCABULARY.md` | Canonical terms |
| `templates/_DEVELOPMENT_WORKFLOW.md` | Development phases |
| `templates/_THIRD_PARTY_SERVICES.md` | Complete third-party services checklist |
| **Project Types** | |
| `templates/project-types/data-modeling/` | Data modeling patterns |
| **Global** | |
| `MEMORY.md` | Global development standards (symlinked to `~/.claude/CLAUDE.md`) |
| `CLAUDE.md` | Chief of Staff identity for this repo |
| `TECH_STACK.md` | Default stack reference |
| **Learning** | |
| `docs/dialogues/` | Earned lessons — conversations that shaped the standards |

---

## Skills

| Command | What |
|---------|------|
| `/wrap` | End session — update docs, commit |
| `/sup` | Quick 5-second status |
| `/fragile` | Check danger zones before changes |
| `/plan` | Two-phase workflow — plan, then implement |
| `/research` | Deep exploration (forked context) |
| `/e2e` | Chrome integration for testing |

---

## Architecture Principles

**Single source of truth**
- All env vars in `lib/config/env.ts`
- All query keys in `lib/queries/keys.ts`
- All formatters in `lib/constants/units.ts`
- Components never import Supabase directly

**Supabase SDK only**
- Always use Supabase SDK (@supabase/supabase-js)
- Never write direct SQL queries in code
- Use `.from()`, `.select()`, `.insert()`, `.update()`, `.delete()`
- Complex queries: use Supabase RPC functions
- Direct SQL only for: migrations, RLS policies, database functions

**Data flow**
```
Database → lib/supabase/queries → lib/models → lib/hooks → Components
```

**Context-based IDs**
- No hardcoded org/tenant IDs in runtime code
- Use `useOrganization()`, never `const orgId = 'org_123'`

**Responsive from day one**
- Use `useLayout()` not hardcoded widths
- Use `useAdaptiveNavigation()` not `navigation.navigate`
- Use `AdaptiveModal` not `presentationStyle="fullScreen"`

**File size limits**
- 300 lines max — split earlier
- Data layer only in `lib/` — components are pure UI

---

## Philosophy

**Minimal by design**

Claude Code v2.x internalized most framework features:
- Better memory (3x improvement)
- LSP integration (less hallucination)
- Skill hot-reloading
- Forked sub-agents

Heavy instruction sets are now overhead. Short prompts + context beats long role definitions.

**Use /memory for universal constraints**
- Lint rules, test requirements, anti-patterns
- Persist across all projects

**Use _FRAGILE.md for project dangers**
- RLS recursion, payment flows, auth edge cases
- Document what breaks and how

**Use CLAUDE.md for project context**
- What you're building, current focus, key decisions
- Keep it actionable

**Trust shorter prompts**
- "add auth" often beats a detailed spec
- Let Claude ask clarifying questions
- Document decisions as you make them

---

## Documentation Growth

Don't fill everything day one. Templates grow with your project:

**Day 1 (bootstrap)**
- `CLAUDE.md` — Stack and architecture
- `_FRAGILE.md` — Start empty, add gotchas

**Week 1 (shipping code)**
- `_ARCHITECTURE.md` — Decisions as you make them
- `_SCHEMA.md` — Database tables
- `_NEXT_SESSION_MEMO.md` — Session handoffs

**Month 1 (features)**
- `PRD/` — Product requirements
- `RFD/` — Technical designs
- `_DEV_SETUP.md` — Onboarding guide

**Production**
- `_RELEASE_NOTES.md` — Version history
- `_FRAGILE.md` — Danger zones from incidents
- Comprehensive architecture docs

Real projects hit 30,000+ lines of documentation supporting 180,000 lines of code.

---

## Claude Code Integration

**Delegation patterns:**
- `Task(Explore)` for codebase scanning (fast, cheap, read-only)
- `Task(Plan)` for architecture decisions
- `Task(general-purpose)` for multi-step research + implementation

**Forked contexts:**
- `/research` runs in isolated context
- Exploration doesn't pollute main conversation

**MCP integration:**
- Context7 for live framework docs
- Use when APIs changed since training

**Background execution:**
- Builds, tests, migrations run async
- Continue working while tasks complete

See `MEMORY.md` for detailed guidance (loaded globally via symlink).

---

## When to Use What

| Situation | Tool |
|-----------|------|
| New React Native + Supabase project | Full stack (CLAUDE.md + scaffold-lib.sh + RESPONSIVE_LAYOUT_SYSTEM.md) |
| Other stack project | Minimal template (CLAUDE-minimal.md) |
| Data modeling app | Add data-modeling project type |
| Existing project cleanup | PROJECT_INIT_RN_SUPABASE.md audit |
| Complex feature | `/plan` → get approval → implement |
| Deep codebase exploration | `/research` in forked context |
| Before touching auth/payments/RLS | `/fragile` |
| End of session | `/wrap` |

---

## Examples

### React Native + Supabase Startup

```bash
# Clone agentic
git clone https://github.com/jasonhoffman/agentic ~/.agentic

# Create project
npx create-expo-app my-app --template expo-template-blank-typescript
cd my-app

# Copy templates
cp ~/.agentic/templates/CLAUDE.md ./
cp ~/.agentic/templates/_FRAGILE.md ./docs/

# Scaffold /lib
cp ~/.agentic/templates/scaffold-lib.sh ./
./scaffold-lib.sh

# Tell Claude
# "I've scaffolded /lib. Complete the setup per PROJECT_INIT_RN_SUPABASE.md"
```

### Data Modeling App

Same as above, plus:

```bash
# Copy data modeling template
cp ~/.agentic/templates/project-types/data-modeling/PROJECT_INITIATION.md ./docs/
```

Tell Claude:
```
Follow docs/PROJECT_INITIATION.md to set up the data architecture.
```

### Generic Project

```bash
git clone https://github.com/jasonhoffman/agentic ~/.agentic
cd your-project

cp ~/.agentic/templates/CLAUDE-minimal.md ./CLAUDE.md
cp ~/.agentic/templates/_FRAGILE.md ./docs/

# Edit CLAUDE.md with your stack details
```

---

## Contributing

Have a proven pattern? Consider adding:
1. New project type in `templates/project-types/`
2. Skill in `.claude/commands/`
3. Verification script
4. Update this README

Keep it minimal. Only add what's genuinely reusable.

---

## License

MIT

---

## Links

- [Claude Code](https://claude.com/claude-code)
- [Tech Stack Reference](TECH_STACK.md)
- [Development Standards](MEMORY.md)
