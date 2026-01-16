# Templates

Copy these to your project to get started with comprehensive documentation.

---

## Quick Start

### For React Native + Supabase Projects (Recommended)

```bash
# From your project directory
cp /path/to/agentic/templates/CLAUDE.md ./
cp -r /path/to/agentic/templates/docs ./
```

### For Other Stacks

```bash
# Use the minimal template instead
cp /path/to/agentic/templates/CLAUDE-minimal.md ./CLAUDE.md
cp -r /path/to/agentic/templates/docs ./
```

You'll have:

```
your-project/
├── CLAUDE.md                        # Project context for AI assistants
└── docs/
    ├── _NEXT_SESSION_MEMO.md        # Session continuity (update every session)
    ├── _ARCHITECTURE.md             # Technical architecture & decisions
    ├── _DEV_SETUP.md                # Development environment setup
    ├── _FRAGILE.md                  # Danger zones and gotchas
    ├── _PLATFORM_ACCOUNTS.md        # API keys and service accounts
    ├── _RELEASES.md                 # Deployment procedures
    ├── _RELEASE_NOTES.md            # Version history
    ├── _SCHEMA.md                   # Database schema
    ├── _VISION.md                   # Product vision and roadmap
    ├── _VOCABULARY.md               # Canonical terminology
    ├── PRD/
    │   └── README.md                # Product requirements docs index
    └── RFD/
        └── README.md                # Technical design docs index
```

Also available in root templates:
- `_DEVELOPMENT_WORKFLOW.md` — Standard development phases

---

## What Each File Does

### Project Context Files

**`CLAUDE.md`** (Comprehensive — React Native + Supabase)
- Default template for React Native + Expo + Supabase projects
- Includes architectural patterns, responsive layout guide, red flags table
- Opinionated: assumes TypeScript, TanStack Query, RLS
- Use when building with the default stack (see `TECH_STACK.md`)

**`CLAUDE-minimal.md`** (Generic — Any Stack)
- Minimal template for projects using different stacks
- No assumptions about framework or database
- Fill-in-the-blank format
- Use when React Native/Supabase doesn't fit

### Core Documentation (`_*.md`)

| File | Purpose | Who Updates |
|------|---------|-------------|
| `CLAUDE.md` | Comprehensive project instructions for AI | You (when project starts) |
| `_NEXT_SESSION_MEMO.md` | Session continuity — "I'm going to sleep" doc | End of every session |
| `_ARCHITECTURE.md` | Tech stack, structure, decisions | Engineers |
| `_DEV_SETUP.md` | Environment setup guide | Engineers |
| `_FRAGILE.md` | Danger zones, gotchas, edge cases | Anyone who discovers issues |
| `_PLATFORM_ACCOUNTS.md` | API keys, service accounts, OAuth setup | Ops/Engineers |
| `_RELEASES.md` | Deployment procedures, version management | Engineers |
| `_RELEASE_NOTES.md` | Changelog, version history | Release manager |
| `_SCHEMA.md` | Database tables, relationships, queries | Engineers |
| `_VISION.md` | Product vision, roadmap, strategy | Product/Founder |
| `_VOCABULARY.md` | Canonical terms, disambiguation | Anyone |

### Subdirectories

| Directory | Purpose | Document Type |
|-----------|---------|---------------|
| `PRD/` | Product requirements | **What** to build |
| `RFD/` | Technical designs | **How** to build |

---

## After Copying

**If using comprehensive `CLAUDE.md` (React Native + Supabase):**
- Template is pre-filled with architectural patterns
- Review and remove sections that don't apply
- Add project-specific details (project name, current focus)

**If using minimal `CLAUDE.md` (other stacks):**
- Fill in project name, stack, and key decisions
- Add gotchas as you discover them

**For all projects:**

**Day 1:**
1. **Customize `CLAUDE.md`** — Project name, current focus, key decisions
2. **Start `_FRAGILE.md`** — Empty is fine; add gotchas as you discover them
3. **Start `_NEXT_SESSION_MEMO.md`** — Update at end of first session

**Week 1:**
4. **Fill in `_ARCHITECTURE.md`** — Document your tech stack as you build
5. **Fill in `_SCHEMA.md`** — Database tables and relationships

**As needed:**
6. **Fill in `_VISION.md`** — Describe what you're building and why
7. **Set up `_DEV_SETUP.md`** — Guide for new developers
8. **Create first PRD/RFD** — When planning features

---

## Conventions

### Underscore Prefix (`_*.md`)

Files prefixed with `_` are canonical source-of-truth documents:
- Read by AI assistants for context
- Updated when significant changes occur
- Cross-reference each other

### PRD vs RFD

| Document | Answers | When to Write |
|----------|---------|---------------|
| **PRD** (Product Requirements) | What to build, why, for whom | New features, product changes |
| **RFD** (Request for Discussion) | How to build, trade-offs, alternatives | Architecture decisions, technical designs |

### Status Tracking

Both PRD and RFD use YAML front matter for status:

```yaml
---
status: draft|approved|in_progress|shipped|implemented|superseded
---
```

---

## Project-Specific Templates

Beyond general documentation templates, specialized project patterns are available in `project-types/`:

### Data Modeling Projects

**Location:** `project-types/data-modeling/`

For projects with complex data projections, scenarios, and database-driven calculations:
- Complete Supabase schema (claims, scenarios, projections)
- `/lib` structure with single source of truth pattern
- TanStack Query with optimistic updates
- Verification scripts to catch violations
- Seed data scripts

See [`project-types/data-modeling/PROJECT_INITIATION.md`](project-types/data-modeling/PROJECT_INITIATION.md) for setup guide.

**When to use:**
- Modeling applications (economic, infrastructure, population)
- Research/analysis platforms
- Multi-scenario analysis tools
- Apps requiring audit trails

---

## Best Practices

1. **Keep docs current** — Update after significant changes
2. **Cross-reference** — Link between related documents
3. **Use templates** — Start from PRD/RFD templates for consistency
4. **Version awareness** — Note version numbers in docs when relevant
5. **Avoid duplication** — Single source of truth for each topic

---

## Skill Integration

Templates work with agentic skills:

| Skill | Uses These Templates |
|-------|---------------------|
| `/sup` | Reads `_NEXT_SESSION_MEMO.md` for session context |
| `/wrap` | Updates `_NEXT_SESSION_MEMO.md` at session end |
| `/fragile` | Reads `_FRAGILE.md` to check danger zones |
| `/plan` | References `_ARCHITECTURE.md` and `_FRAGILE.md` during exploration |
| `/research` | Explores all docs in forked context |

**Workflow integration:**
- `/sup` → Read session memo → Work → `/fragile` (before risky changes) → `/wrap`
- `/plan` or `/feature-dev` for non-trivial features → PRD/RFD as needed

---

## MCP Configuration (Optional)

For team-shared integrations, create `.mcp.json` at project root:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Common servers:
- **context7** — Live framework documentation
- **github** — GitHub integration for issues/PRs
- **supabase** — Database schema inspection

---

*These templates are based on production documentation patterns.*
