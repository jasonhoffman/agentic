# Chapter 2: Your Role

What you do. What agents do. Where the line is.

---

## You Are the Founder

In a traditional startup, different people own different things:
- CEO owns vision and strategy
- CTO owns technical decisions
- Head of Product owns what to build
- Engineers own how to build it

With Agentic, you wear all the hats that require human judgment. Agents wear the hats that require execution.

---

## What You Actually Do

Day to day, you're doing four things:

**Setting direction:** What are we building? What matters? What stack?

```
You: We're building a mobile app for dog walkers. React Native, Supabase.
     Just booking for MVP — nothing else.
```

**Making decisions:** Agents surface options, you choose.

```
Chief of Staff: Backend needs to know — JWT or sessions?

You: JWT.

Chief of Staff: Done. They're proceeding.
```

**Reviewing work:** Before anything ships, you check it.

```
Chief of Staff: User profiles API is ready. Security review attached.

You: Looks good. Ship it.
```

**Writing code (when you want to):** You're the founder, not a manager.

```
You: I'll write the matching algorithm myself. It's subtle.

Chief of Staff: Makes sense. Let me know when you're done and I'll
document it for the team.
```

The ratio shifts depending on the day. Some days you're mostly reviewing. Some days you're heads-down coding. That's fine.

---

## What Only You Can Decide

Some decisions require human judgment:

| Category | Examples | Why You |
|----------|----------|---------|
| **Vision** | What to build, who it's for | Your values, your insight |
| **Strategy** | What's most important, what to defer | Your risk tolerance |
| **Scope** | What's in, what's out | Trade-offs only you can make |
| **Ship** | When to release | Business judgment |
| **Security** | Acceptable risk level | Accountability |
| **Money** | What to spend on | Your resources |

---

## What Agents Decide

Agents make implementation decisions within your constraints:

| Category | Examples | Why Them |
|----------|----------|----------|
| **How to code** | Variable names, function structure | Craft expertise |
| **Libraries** | Which npm package to use | Technical knowledge |
| **Patterns** | How to structure a component | Best practices |
| **Testing** | What to test, how to test it | Quality expertise |
| **Optimization** | How to make it faster | Technical skill |

**The rule:** Agents decide *how* within the *what* you've defined.

---

## How Agents Surface Decisions to You

When agents hit something they can't or shouldn't decide, they surface it:

```markdown
## Decision Needed

**Question:** Should we use WebSockets or polling for real-time updates?

**Options:**
1. WebSockets — Faster updates, more complex
2. Polling — Simpler, slightly delayed

**My Recommendation:** WebSockets (better user experience)

**Blocking:** Yes — can't proceed until decided
```

You respond: "WebSockets" and they proceed.

This means you're making decisions, not doing research. Agents do the analysis and present options. You choose.

---

## The Leverage Insight

Here's the key insight:

**You *can* do everything yourself. But you shouldn't.**

If you're technical, you could write all the code. You could do the designs. You could write the tests. But then you're limited by your typing speed and your hours.

With agents:
- You set direction (minutes)
- Agents execute (hours of equivalent work)
- You review (minutes)
- Repeat

Your judgment is applied to more work. That's leverage.

---

## What This Feels Like

**Before (traditional startup):**
- Hire people (weeks/months)
- Onboard people (weeks)
- Manage people (ongoing)
- Wait for people (always)
- Deal with turnover (repeatedly)

**After (Agentic):**
- Describe what you want
- Agents work
- Review what they did
- Ship

No hiring. No waiting. No turnover. Just building.

---

## A Typical Day

Here's what your day looks like:

**Morning (5 minutes):**

```
$ claude

You: today

Chief of Staff: Good morning. Here's what needs your attention:

**Blocking:**
- Auth: JWT vs sessions? (Backend Engineer waiting)

**Checkpoints:**
- User profiles API ready for review

**Since yesterday:**
- Login UI completed
- 3 tests added

What should we focus on first?

You: JWT for auth. And approve the profiles API.

Chief of Staff: Done. Backend Engineer proceeding with JWT.
Shall I bring in QA to test the profiles API?

You: Yes.

Chief of Staff: QA Engineer is on it. I'll let you know when testing is complete.
```

**Midday:**

You're doing founder work — user interviews, thinking about strategy, business stuff. Agents are working. You're not watching them.

**Afternoon (as needed):**

```
You: I want to write the matching algorithm myself. It's subtle.

Chief of Staff: Makes sense. I'll document what you build so other agents
can work around it. Let me know when you're done.

[You write code]

You: Done. It's in lib/matching.ts.

Chief of Staff: Got it. I've noted the location for Backend Engineer.
Anything else, or should we wrap for the day?
```

**Evening (2 minutes):**

```
You: wrap

Chief of Staff:

Wrap Summary:
- Committed: abc123 "feat(auth): JWT authentication"
- Profiles API in QA (2 minor issues found, being fixed)
- Matching algorithm documented

Tomorrow: QA should be done. Ready for security review.

Good night.
```

**Total time in Claude:** ~15-20 minutes
**Packages progressed:** 3
**Decisions made:** 2

---

## The Rule of Thumb

**If it requires judgment about *what* or *why*:** You do it.
**If it requires execution of *how*:** Agents do it.

You're the brain. They're the hands.

But you have hands too — use them when it makes sense.

---

## Summary

| You | Agents |
|-----|--------|
| Set direction | Execute the work |
| Make decisions | Surface options |
| Review before shipping | Build, test, secure |
| Write code when you want to | Write code when you ask them to |

**The rule:** You decide *what*. Agents figure out *how*.

---

→ [Chapter 3: The Agents](03_THE_AGENTS.md)

