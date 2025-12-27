# Solo Founder Guide

You've done this before — maybe with a team of 5, maybe 50. You know how to onboard someone, give them scope, check in at the right moments, and trust them to execute.

This is the same thing.

The difference: no hiring, no management overhead, no context decay across weekends. The trade-off: you have to be more explicit about what you'd normally communicate through culture and osmosis.

---

## The Technical Founder Profile

You're a technical founder who:

- **Can code** — but that's not always where you add the most value
- **Understands architecture** — so you can review and guide
- **Knows what good looks like** — so you can approve confidently
- **Could do everything yourself** — but that doesn't scale

The insight: **You can code, but you don't have to.** Agents do the implementation. You provide judgment, direction, and strategic intervention.

This isn't delegation to a black box. This is **amplification** — your technical intuition executed at scale.

---

## Your Four Modes

As a solo founder, you shift between modes throughout your work:

### 1. Architect Mode
*Setting technical direction*

You decide:
- Tech stack and patterns
- Data model design
- API contracts
- Security boundaries

Agents execute within the constraints you set.

**When:** Starting new features, major refactors, technical pivots

### 2. Builder Mode
*Hands on keyboard*

Sometimes you code:
- Complex business logic only you understand
- Critical paths that need your intuition
- Prototyping to explore possibilities
- Fixing something faster than explaining it

**When:** High-judgment code, explorations, urgent fixes

### 3. Reviewer Mode
*Approving agent work*

You review:
- Specs before implementation starts
- Architecture decisions before commitment
- Code at key checkpoints
- Final output before shipping

**When:** Checkpoint phases, security reviews, before-ship

### 4. Orchestrator Mode
*Conducting the team*

You manage:
- Work package definitions
- Phase transitions
- Decision queues
- Resource allocation (which agent on which task)

**When:** Morning planning, evening handoffs, context switches

---

## The Leverage Insight

**Traditional solo founder:**
```
You → Code → Ship
     (bottleneck is your typing speed)
```

**Agentic solo founder:**
```
You → Direction → Agents → Code → Ship
     (bottleneck is your judgment bandwidth)
```

The shift: From **doing** to **directing**.

But here's what makes it work: You *could* do. You understand what you're directing. This isn't blind delegation — it's informed orchestration.

---

## Structuring Your Day

### Morning Review (~15 min)
```
1. Check _AGENTS.md
   - Any blocked packages?
   - Any pending decisions?
   - What finished overnight?

2. Review decision queue
   - Make quick decisions
   - Queue complex ones for deep thought

3. Set the day's priorities
   - What work packages are active?
   - What do you need to architect or build today?
```

### Deep Work Blocks
```
Architect Block:
- Define new work package
- Make key technical decisions
- Review and approve specs

Builder Block (when needed):
- Write complex logic
- Prototype new ideas
- Fix what's faster to fix than explain

Review Block:
- Checkpoint reviews
- Code review before ship
- Security approvals
```

### Evening Handoff (~10 min)
```
1. Review what agents completed
2. Approve what's ready for next phase
3. Clear decision queue
4. Set up tomorrow's work
```

### Async Between
Agents work while you:
- Think about strategy
- Talk to users
- Handle non-coding founder tasks
- Rest

---

## Decision Velocity

The solo founder's bottleneck is decisions. Maximize velocity:

### Batch Decisions
Don't context-switch for every small decision. Let them queue up:

```markdown
## Decision Queue

### Non-Blocking (decide by EOD)
- [ ] Use Redis or in-memory cache for sessions?
- [ ] Include user avatar in list view?

### Blocking (need decision to proceed)
- [ ] Approval to deploy auth changes to production
```

### Pre-Decide Categories
Reduce runtime decisions by setting upfront policies:

```markdown
## Standing Decisions

**Technology:**
- Use existing libraries over custom code
- Prefer established patterns over clever solutions

**UX:**
- Mobile-first, responsive second
- Simple over feature-rich for MVP

**Security:**
- Err on the side of caution
- No security shortcuts for speed
```

### Decision Templates
For common decisions, create templates agents can follow:

```markdown
When choosing between X and Y:
1. Prefer X if [condition]
2. Prefer Y if [condition]
3. Escalate if [condition]
```

---

## Work Package Management

### Keep It Small
Work packages should be:
- Shippable in 1-3 days of agent work
- Clear enough to not need daily check-ins
- Independent enough to parallelize

**Too big:** "Build user management" (weeks, many unknowns)
**Right size:** "Add password reset flow" (days, clear scope)

### Limit Work in Progress
You only have so much judgment bandwidth:
- 2-3 active work packages max
- 1 package in each phase is ideal
- Finishing > starting

### Trust the Auto-Proceed
Once spec is approved, trust agents to execute:
```
Spec          → CHECKPOINT (you approve)
Design        → Auto-proceed
Backend       → Auto-proceed
Frontend      → Auto-proceed
QA            → Auto-proceed (flag if failures)
Security      → CHECKPOINT (you approve)
Ship          → CHECKPOINT (you press the button)
```

You don't need to be in every handoff. That's the whole point.

---

## When to Step In

### Always Step In
- Spec approval (before significant work)
- Security review (before ship)
- Ship decision (you push the button)
- Blocked packages (they need you)

### Consider Stepping In
- Architecture seems wrong
- You have a better idea
- Agent is going in circles
- Critical path needs your intuition

### Don't Step In
- Implementation is proceeding fine
- Small decisions within approved scope
- Style preferences (document conventions instead)
- Things that would be faster for agent to fix than explain

---

## The "Could Code" Advantage

You have an advantage over non-technical founders:

### You Catch Problems Early
You read the code. You see the architecture. You spot issues before they compound.

### You Make Better Trade-offs
"This is over-engineered for MVP" or "This needs more robustness" — you know when to say which.

### You Can Jump In When Needed
When something is genuinely faster to fix than explain, you fix it.

### You Understand What You're Approving
Checkpoints are meaningful because you actually review the work.

---

## Anti-Patterns

### Micro-Managing Agents
**Symptom:** Reviewing every commit, commenting on style, checking in constantly
**Fix:** Set conventions upfront, checkpoint at phases, trust the process

### Never Building
**Symptom:** Always orchestrating, never touching code, losing technical edge
**Fix:** Keep Builder Mode in rotation, stay hands-on for complex work

### Always Building
**Symptom:** Doing everything yourself, agents idle, bottlenecked on your time
**Fix:** That's not leverage — let agents handle what they can handle

### Approval Bottleneck
**Symptom:** Work packages stuck in checkpoint, agents waiting on you
**Fix:** Time-box reviews, clear the queue daily, delegate more to auto-proceed

### Scattered Focus
**Symptom:** Too many packages active, context-switching constantly
**Fix:** Limit WIP, finish before starting, focus on one thing at a time

---

## The Daily Reality

**You wake up.** Check _AGENTS.md. Package A shipped overnight (auto-deployed). Package B is in QA with one minor issue noted. Package C needs your spec approval.

**Morning.** You approve Package C spec, quickly review Package B's issue (minor, agent can fix), then spend an hour architecting Package D — a complex feature only you fully understand.

**Midday.** You do user interviews. (Founder work that's not coding.)

**Afternoon.** Builder mode. You implement the tricky part of Package D that requires deep context. Document it for agents to build around.

**Evening.** Package B fixed and ready to ship. You approve. Package C backend is done, frontend starting. Package D spec is drafted by PM agent, you refine it. Set up tomorrow.

**Total coding time:** 1-2 hours
**Packages progressing:** 4
**Decisions made:** ~10
**Shipped:** 1

That's the leverage.

---

## Summary

| Concept | Description |
|---------|-------------|
| **Four Modes** | Architect, Builder, Reviewer, Orchestrator |
| **Leverage** | Your judgment at scale, not your typing |
| **Decision Velocity** | Batch, pre-decide, template |
| **WIP Limits** | 2-3 packages, finish > start |
| **The Advantage** | You could code, so you understand what you're directing |

**The goal:** Ship like a team of 12, with the judgment of one technical founder who knows when to direct, when to review, and when to build.

