# Agent Roles Reference

Detailed role definitions. 8 core roles, plus situational roles for specific needs.

For the authoritative role catalog, see [ROLES.md](../../ROLES.md).

---

## How to Use These Files

Each role file defines:
- What the agent does and doesn't do
- Thinking mode and autonomy level
- Plugins and tools available
- Handoff patterns
- When to escalate to you

To activate an agent:
```
You are ~/projects/agentic/reference/roles/[role-name].md

[Your task here]
```

---

## Plugins

Claude Code plugins extend what agents can do. They're **available when relevant**, not required.

### Global (All Roles)

| Plugin | Purpose |
|--------|---------|
| `typescript-lsp`, `pyright-lsp`, `gopls-lsp` | Language servers — auto-activate based on file types |
| `context7` | Look up current library documentation |
| `commit-commands` | `/commit`, `/commit-push-pr` available via wrap |

### Role-Specific Defaults

| Role | Default Plugin | Purpose |
|------|----------------|---------|
| Backend Engineer | `supabase` | Database operations, RLS, migrations |
| Designer | `frontend-design` | Production-grade UI generation |
| Platform Engineer | `vercel` | Deployment, environment management |
| Security Engineer | `code-review` | PR security review |
| Product Manager | `feature-dev` | Structured feature development |
| Growth Engineer | `stripe` | Payment experiments |

See individual role files for full plugin lists.

---

## Core Roles (8)

### Engineering

- [backend-engineer.md](backend-engineer.md) — APIs, database, business logic
- [frontend-engineer.md](frontend-engineer.md) — UI, screens, components
- [platform-engineer.md](platform-engineer.md) — CI/CD, infrastructure
- [qa-engineer.md](qa-engineer.md) — Testing, quality, RLS security

### Investigation

- [researcher.md](researcher.md) — Codebase exploration, pattern analysis
- [debugger.md](debugger.md) — Root cause analysis, incident response

### Design & Docs

- [designer.md](designer.md) — UX flows, visual design, components
- [technical-writer.md](technical-writer.md) — Documentation, guides

---

## Situational Roles

Use these when the situation calls for them:

- [security-engineer.md](security-engineer.md) — Auth changes, security audits
- [product-manager.md](product-manager.md) — Complex specs, multi-stakeholder projects
- [growth-engineer.md](growth-engineer.md) — Post-launch optimization
- [data-analyst.md](data-analyst.md) — Metrics, dashboards (needs users first)

---

## Archived Roles

These roles were merged or absorbed:

| Archived | Now Handled By |
|----------|----------------|
| UX Designer | [Designer](designer.md) |
| UI Designer | [Designer](designer.md) |
| Project Manager | Chief of Staff |
| Operations Manager | Chief of Staff |
| Customer Success | Product Manager or Chief of Staff |

Archived files available in `archive/` for reference.
