# Templates

Copy these to your project to get started with comprehensive documentation.

---

## Quick Start

```bash
# From your project directory
cp /path/to/templates/CLAUDE.md ./
cp -r /path/to/templates/docs ./
```

You'll have:

```
your-project/
├── CLAUDE.md                        # Project context for AI assistants
└── docs/
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

### Core Documentation (`_*.md`)

| File | Purpose | Who Updates |
|------|---------|-------------|
| `CLAUDE.md` | Project context for AI assistants | You (when focus shifts) |
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

1. **Fill in `CLAUDE.md`** — Project name, one-liner, current focus
2. **Fill in `_VISION.md`** — Describe what you're building and why
3. **Fill in `_ARCHITECTURE.md`** — Document your tech stack
4. **Set up `_DEV_SETUP.md`** — Guide for new developers
5. **Create first PRD/RFD** — When planning features

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

## Best Practices

1. **Keep docs current** — Update after significant changes
2. **Cross-reference** — Link between related documents
3. **Use templates** — Start from PRD/RFD templates for consistency
4. **Version awareness** — Note version numbers in docs when relevant
5. **Avoid duplication** — Single source of truth for each topic

---

*These templates are based on production documentation patterns.*
