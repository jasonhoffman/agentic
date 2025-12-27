# Getting Started

You already know how to run a team. This applies that to AI.

---

## What is Agentic?

The patterns that make human teams effective — context handoffs, role specialization, phase-appropriate discipline — work with AI for the same reasons.

This repository provides:

- **14 specialized roles** — The same specializations humans have
- **Coordination patterns** — How context persists across sessions
- **Decision frameworks** — What you decide vs. what agents decide
- **Project templates** — Structure that makes it all work

→ See [PHILOSOPHY.md](/PHILOSOPHY.md) for the deeper insight.

---

## The Key Idea

**You're running a team. The team is AI.**

As the human, you:
- Set vision and priorities (same as always)
- Make judgment calls and trade-offs (same as always)
- Orchestrate handoffs between specialists (same as always)
- Code when your judgment is needed in the details (same as always)

Agents:
- Execute within their scope
- Surface decisions they can't make
- Communicate through shared documents
- Hand off work to each other

---

## How It Works

### 1. Project Setup

Every project using Agentic has a `docs/` folder with standard files:

```
project/
└── docs/
    ├── _AGENTS.md        # Agent coordination (who's doing what)
    ├── _VISION.md        # What we're building and why
    ├── _ROADMAP.md       # Phases, milestones, priorities
    ├── _ARCHITECTURE.md  # Technical decisions
    └── _CONVENTIONS.md   # Coding standards
```

### 2. Agent Activation

Start a Claude session with a role:

```
You are ~/projects/agentic/docs/roles/frontend-engineer.md
```

Claude reads the role file, understands its identity, then reads your project's `docs/_AGENTS.md` to understand current context.

### 3. Work Happens

The agent:
- Checks its task queue
- Reads cross-agent notes for context
- Does the work
- Updates status and notes
- Hands off when appropriate

### 4. You Orchestrate

You:
- Review agent output
- Make decisions when surfaced
- Assign next tasks
- Activate next agents
- Keep things moving

---

## Agent Categories

| Category | Roles | When Active |
|----------|-------|-------------|
| **Engineering** | Frontend, Backend, Platform, QA, Security | Always-on (core team) |
| **Product** | Product Manager, UX Designer, UI Designer | Project phases |
| **Data** | Data Analyst, Growth Engineer | When measuring/optimizing |
| **Content** | Technical Writer, Customer Success | Documentation/support phases |
| **Operations** | Project Manager, Operations Manager | Coordination needs |

---

## Core Concepts

### Thinking Modes

Agents are grouped by how they think:

- **Implementation** — "How do I build this?"
- **Verification** — "Does this work correctly?"
- **Optimization** — "How can this be better?"

See [thinking-modes.md](../concepts/thinking-modes.md)

### Communication

Agents communicate through `_AGENTS.md`:
- Each agent has a section with status and task queue
- Cross-agent notes capture handoffs
- You maintain the overall state

See [communication.md](../concepts/communication.md)

### Decisions

Agents and humans share decision-making:
- Agents decide within their scope
- Agents surface boundary decisions to you
- You make judgment calls and trade-offs

See [decisions.md](../concepts/decisions.md)

---

## Quick Start Options

### Starting a New Project?

→ [New Project Guide](new-project.md)

### Have an Existing Project?

→ [Existing Project Guide](existing-project.md)

### Want to Understand Workflows?

→ [Feature Lifecycle](workflows/feature-lifecycle.md)

---

## The Human Role

You wear multiple hats:

| Role | Your Responsibility |
|------|---------------------|
| **CEO** | Vision, strategy, final decisions |
| **CTO** | Technical direction, architecture |
| **Head of Product** | Priorities, roadmap, trade-offs |
| **Developer** | Write code alongside agents |

Agents make you more effective — they don't replace your judgment.

---

## Next Steps

1. **Read the concepts** — [Thinking Modes](../concepts/thinking-modes.md), [Decisions](../concepts/decisions.md)
2. **Browse the roles** — See what each agent does
3. **Start a project** — [New Project](new-project.md) or [Existing Project](existing-project.md)
4. **Experiment** — Activate an agent, see how it works

---

> **Remember:** You're not learning a new tool. You're applying what you already know about running teams to a new substrate. The patterns are the same. The muscle memory transfers.
