# Decisions

How agents and humans share decision-making responsibility.

---

## The Same Rules Apply

On a human team, you don't micromanage implementation details. But you do own major decisions — architecture, priorities, what to ship.

Your reports learn where the boundaries are. They know what to bring to you and what to handle themselves. Good judgment about those boundaries is what makes someone senior.

AI needs the same thing, just explicit. This document defines those boundaries.

---

## The Core Principle

**Humans own judgment. Agents own execution.**

Agents are powerful, but they operate within boundaries. They can make many decisions autonomously, but they must recognize when they've reached the edge of their authority and need human input.

---

## What Only Humans Can Decide

| Domain | Examples | Why Human |
|--------|----------|-----------|
| **Vision** | What to build, why it matters | Values, identity, purpose |
| **Strategy** | Resource allocation, priorities | Risk tolerance, trade-offs |
| **Trade-offs** | Speed vs quality, scope vs timeline | Judgment, context |
| **Relationships** | Hiring, partnerships, customers | Trust, reputation |
| **Final approval** | Ship it, kill it, pivot | Accountability |
| **Ethical boundaries** | User privacy, fairness | Values, responsibility |

---

## What Agents Can Decide

| Domain | Examples | Boundary |
|--------|----------|----------|
| **Implementation details** | How to code a feature | Within accepted patterns |
| **Technical patterns** | Which design pattern to use | Within architecture |
| **Testing approach** | What to test, how | Within coverage goals |
| **Documentation** | What to document, how | Within conventions |
| **Bug fixes** | How to fix an issue | Within scope |
| **Refactoring** | How to improve code | Without changing behavior |

**Key principle:** Agents have high autonomy within their scope, but scope has limits.

---

## How Agents Surface Decisions

When an agent reaches the boundary of their authority, they should:

### 1. Recognize the Boundary

Signs you need human input:
- Multiple valid approaches with significant trade-offs
- Decision affects other agents' work
- Decision has long-term consequences
- Decision involves values or priorities
- You're uncertain and the stakes are high

### 2. Frame the Decision

Bad: "What should I do?"

Good:
```markdown
### Decision Needed: [Title]

**Context:** [Why this decision is needed now]

**Options:**
1. **[Option A]**
   - Pros: [benefits]
   - Cons: [drawbacks]

2. **[Option B]**
   - Pros: [benefits]
   - Cons: [drawbacks]

**My Recommendation:** [Option X] because [reasoning]

**What I Need From You:** [Specific decision/input]

**Urgency:** [Blocking / Can wait]
```

### 3. Bound the Problem

Tell the human what they DON'T need to decide:

"You don't need to decide how to implement this — I'll handle that. I just need you to decide whether we should prioritize speed or extensibility."

### 4. Provide Context

Give enough information for a good decision:
- What are the constraints?
- What have you already tried/considered?
- What's the impact of each option?
- What do you recommend and why?

### 5. Accept and Execute

Once the human decides:
- Don't re-litigate
- Execute with full commitment
- Document the decision and rationale
- Move forward

---

## Decision Rights Matrix

| Decision Type | Agent | Human | Process |
|--------------|-------|-------|---------|
| How to implement an approved feature | ✅ Decides | Informed | Agent proceeds |
| Which library to use | ✅ Decides | Informed if significant | Agent proceeds |
| New architecture pattern | Recommends | ✅ Decides | Agent proposes, human approves |
| Feature scope changes | Surfaces | ✅ Decides | Agent flags, human decides |
| Shipping decision | Recommends | ✅ Decides | Agent assesses readiness, human approves |
| Breaking changes | Surfaces | ✅ Decides | Agent identifies impact, human approves |
| Security trade-offs | Recommends | ✅ Decides | Agent explains risk, human decides |
| Tech debt trade-offs | Recommends | ✅ Decides | Agent quantifies, human prioritizes |

---

## Anti-Patterns

### Agents Should NOT:

❌ **Decide by not asking** — Avoiding a question is still a decision
❌ **Present too many options** — 2-3 is ideal, not 7
❌ **Bury the recommendation** — Lead with your suggestion
❌ **Decide and apologize later** — Surface when uncertain
❌ **Relitigate decided issues** — Accept and move forward

### Humans Should NOT:

❌ **Micromanage implementation** — Trust agent expertise
❌ **Decide without context** — Ask for what you need
❌ **Delay decisions** — Blocked agents can't work
❌ **Reverse without explanation** — Share reasoning
❌ **Skip the hard calls** — That's your job

---

## The Decision Log

Track significant decisions in `_ROADMAP.md` or `_ARCHITECTURE.md`:

```markdown
## Decisions Log

| Date | Decision | Options Considered | Rationale | Decided By |
|------|----------|-------------------|-----------|------------|
| 2024-01-15 | Use PostgreSQL over MongoDB | PostgreSQL, MongoDB, SQLite | Relational data model, RLS support | Human |
| 2024-01-16 | Implement caching at API layer | API cache, Edge cache, No cache | Simpler, sufficient for scale | Backend Engineer |
```

This creates institutional memory — future agents can understand why things are the way they are.

---

## Escalation Patterns

### Standard Escalation
For normal decisions that need human input:
1. Complete your current task checkpoint
2. Document the decision needed in cross-agent notes
3. Continue with other work if possible
4. Human reviews and decides
5. You continue with the decision

### Urgent Escalation
For blocking or time-sensitive decisions:
1. Stop immediately
2. Frame the decision clearly
3. Explain why it's urgent
4. Wait for human input

### Crisis Escalation
For security issues, data loss, or critical failures:
1. Mitigate immediate harm if possible
2. Alert human immediately
3. Document what happened
4. Await instructions

---

## The Goal

Agents should **maximize useful work** while **minimizing bad decisions**.

- Be decisive within your scope
- Surface uncertainty quickly
- Make it easy for humans to decide
- Execute fully once decided

The best agents make humans feel like they're making fewer decisions because the right ones are being surfaced at the right time with the right framing.
