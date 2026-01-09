# Roles

Roles give each terminal a clear identity. When you have 5 terminals open, you glance at one and know: "That's Backend on the profiles API."

---

## How Roles Work

You open a terminal and say: "You're Backend Engineer. Build the profiles API."

Now that terminal has a focus. It thinks about APIs, database schema, server patterns. When you come back after an hour, you know exactly what it was doing.

The role is a **context lens**, not a capability limit.

---

## Core Roles (8)

These are battle-tested — used in real production projects.

### Engineering

| Role | Focus |
|------|-------|
| **Backend Engineer** | APIs, database, server logic, business rules |
| **Frontend Engineer** | UI, screens, components, client state |
| **Platform Engineer** | Deploy, CI/CD, infrastructure, monitoring |
| **QA Engineer** | Testing, quality, edge cases, RLS security |

### Investigation

| Role | Focus |
|------|-------|
| **Researcher** | Codebase exploration, pattern analysis, investigation |
| **Debugger** | Root cause analysis, incident response, log analysis |

### Design & Docs

| Role | Focus |
|------|-------|
| **Designer** | UX flows, wireframes, visual design, components |
| **Technical Writer** | Documentation, guides, API docs |

---

## Situational Roles

Use these when the situation calls for them.

| Role | When Needed |
|------|-------------|
| **Security Engineer** | Auth changes, security audits, penetration testing |
| **Product Manager** | Complex specs, multi-stakeholder projects |
| **Growth Engineer** | Post-launch optimization, A/B tests, funnels |
| **Data Analyst** | Metrics, dashboards, insights (needs users first) |

---

## Chief of Staff

The default when you just say "hi" without specifying a role.

Reads project context, knows where things stand, can shift into any specialist. Handles:
- Planning and coordination (absorbs Project Manager)
- Process decisions (absorbs Operations Manager)
- Quick specs (can delegate to Product Manager for complex ones)

When you need focused work, it either:
- **Shifts** — Becomes that specialist in the same terminal
- **Delegates** — You open another terminal with that role

---

## Multiple Terminals, Same Role

You can have three Backend Engineers:

```
Terminal 1: "You're Backend. Build the profiles API."
Terminal 2: "You're Backend. Build the payments API."
Terminal 3: "You're Backend. Build the notifications API."
```

Three independent workstreams. Each knows its scope. They coordinate through `_AGENTS.md`.

---

## Coordination

Terminals don't talk to each other. They read and write files.

| File | Purpose |
|------|---------|
| `docs/_AGENTS.md` | Who's doing what, handoffs, blockers |
| `docs/_SESSION_MEMO.md` | What happened, why, what's next |
| `docs/_FRAGILE.md` | Danger zones to check before changes |

When Backend finishes the API:
1. Updates `_AGENTS.md` — "Profiles API done"
2. Writes handoff — "Endpoints: GET/POST /api/profiles. Used soft deletes because... Types in lib/types.ts"

When Frontend starts:
1. Reads `_AGENTS.md`
2. Has context, knows where to begin

---

## Why "Why" Matters

Handoffs should capture reasoning, not just facts.

**Weak:** "Added rate limiting."

**Strong:** "Added rate limiting at 100/min. Based on expected 50 users, 2 requests each. Can increase if needed."

When you come back after an hour, or the next agent picks up, the reasoning is there.

---

## Role Files

Each role has a detailed file in `reference/roles/`:

- What they focus on
- How they typically work
- What files they touch
- When to escalate

Claude reads these when shifting into a role.
