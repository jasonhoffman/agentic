# Roles

## Why Roles Exist

On a human team, specialization emerges naturally. The backend person thinks differently than the frontend person. They have different contexts loaded, different heuristics, different instincts.

AI doesn't have this by default. Every session starts fresh. Roles create the same specialization — by loading context that shapes how the agent thinks.

This isn't a workaround. It's the same thing you did with humans, just explicit.

---

## How Roles Work

You open a terminal and say: "You're Backend Engineer. Build the profiles API."

Now that terminal has a focus. It thinks about APIs, database schema, server patterns. When you come back after an hour, you know exactly what it was doing.

Another terminal: "You're QA. Run the test suite and report failures."

Different focus. Same Claude. The role is a **context lens**, not a capability limit.

When you have 5 terminals open, you need to glance at one and know: "That's Backend on the profiles API." The role gives each terminal a clear identity — the same way a person's role tells you what they're focused on.

---

## The Roles

### Engineering

| Role | Focus |
|------|-------|
| **Backend Engineer** | APIs, database, server logic, business rules |
| **Frontend Engineer** | UI, screens, components, client state |
| **Platform Engineer** | Deploy, CI/CD, infrastructure, monitoring |
| **QA Engineer** | Testing, quality, edge cases, regression |
| **Security Engineer** | Auth, vulnerabilities, security review |

### Product & Design

| Role | Focus |
|------|-------|
| **Product Manager** | Specs, user stories, priorities, scope |
| **UX Designer** | User flows, wireframes, interaction patterns |
| **UI Designer** | Visual design, styling, component library |

### Data & Growth

| Role | Focus |
|------|-------|
| **Data Analyst** | Metrics, dashboards, insights |
| **Growth Engineer** | Experiments, A/B tests, optimization |

### Content & Support

| Role | Focus |
|------|-------|
| **Technical Writer** | Documentation, guides, API docs |
| **Customer Success** | User feedback synthesis, support patterns |

### Operations

| Role | Focus |
|------|-------|
| **Project Manager** | Status tracking, dependencies, coordination |
| **Operations Manager** | Process optimization, workflow improvement |

---

## Chief of Staff

The default when you just say "hi" without specifying a role.

Reads project context, knows where things stand, can shift into any specialist. When you need focused work, it either:
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
| `docs/_TODAY.md` | What needs attention today |

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
