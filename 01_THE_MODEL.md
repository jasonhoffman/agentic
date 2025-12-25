# Chapter 1: The Model

The mechanics behind your AI team.

---

## How Agents Work

Agents are AI (like Claude) given a specific role and context. When you ask for something, the right agent:

1. **Reads its role** — Understands what it does and doesn't do
2. **Reads project status** — Knows what's happening, what's needed
3. **Does the work** — Writes code, creates specs, runs tests
4. **Updates status** — Records what happened for you and other agents

Agents don't have memory between sessions. They get context by reading files. This means everything important is written down — which is how good teams work anyway.

---

## How Work Flows

You say what you want. Agents make it happen.

```
You: Build password reset.

[Product Manager specs it]
[Designer flows it]
[Engineers build it]
[QA tests it]
[Security reviews it]

Chief of Staff: Password reset ready. Ship it?

You: Ship it.

Chief of Staff: Live.
```

Behind the scenes, agents hand off to each other. You don't manage that — it just happens.

---

## Where You're Involved

You're not involved in every step — that would defeat the purpose.

You show up for three things:
1. **Approve the spec** — Before major work starts
2. **Approve security** — Before shipping
3. **Approve ship** — When it goes live

Everything else flows without you. Design to build to test — agents handle it.

---

## Coordination Through Files

Agents coordinate by reading and writing shared files:

| File | Purpose |
|------|---------|
| `_TODAY.md` | What needs your attention today |
| `_AGENTS.md` | Status of all agents and work packages |
| `_VISION.md` | What you're building and why |
| `_ROADMAP.md` | Priorities and phases |

When the Backend Engineer finishes an API, they write a note in `_AGENTS.md`:

```markdown
### Handoff: Backend Engineer → Frontend Engineer

API for user auth is ready:
- POST /api/auth/login
- POST /api/auth/logout
- Types in lib/types.ts

Proceed with frontend implementation.
```

When the Frontend Engineer starts, they read this note and know exactly what to do.

---

## Why This Works

1. **Shared context** — Everything is written down. No tribal knowledge.
2. **Clear roles** — Each agent knows what they do and don't do.
3. **Defined handoffs** — Agents know how to pass work to each other.
4. **Your judgment where it matters** — You decide strategy and approve key moments.
5. **Execution without you** — Agents work between your check-ins.

---

## What You're Not Doing

You're not:
- Managing calendars and meetings
- Explaining the same context to new hires
- Waiting for people to have availability
- Dealing with sick days, vacations, or turnover
- Negotiating salaries or equity

You're just:
- Setting direction
- Making decisions
- Reviewing work
- Shipping

---

## Summary

| Concept | What It Means |
|---------|--------------|
| **Agents** | AI given specific roles (Product Manager, Engineer, etc.) |
| **Chief of Staff** | Your single point of contact — brings in specialists |
| **Checkpoints** | The 3 moments where you review and decide |
| **Shared files** | How everyone stays coordinated |

You say what you want. Agents build it. You approve at key moments. Ship.

---

→ [Chapter 2: Your Role](02_YOUR_ROLE.md)

