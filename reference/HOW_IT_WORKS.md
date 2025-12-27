# How It Works

## Why It Works This Way

You're filling lag time. Claude works for 20 minutes; you do something else. That's the surface efficiency.

The deeper thing: you're running multiple workstreams the way you'd run a team. Each "terminal" is a team member with a focus. `_AGENTS.md` is your standup board. Handoffs are the notes you wish humans wrote.

The patterns feel familiar because they are. This is just team coordination made explicit enough for AI to follow.

---

Filling lag time. Staying oriented. Capturing context.

---

## The Basic Loop

You ask Claude to build something. It works for 20 minutes.

You could wait. Or you could open another terminal and do something else.

```
Terminal 1: Backend building the profiles API (takes 30 min)
Terminal 2: Tests running across the stack (takes 15 min)
Terminal 3: You reviewing the auth spec with Product Manager
Terminal 4: Documentation being updated
```

Now you're productive during the lag. When something finishes, you check in, give direction, move on.

---

## Why Roles

Each terminal needs a clear identity.

When you glance at Terminal 2, you should instantly know: "That's QA running tests." When you switch to Terminal 1 after an hour, you should know: "That's Backend on profiles."

Roles make context-switching clean. They're not capability limits — Backend can write frontend code if needed. They're **focus contexts** that help you and the agents stay oriented.

---

## Why `_AGENTS.md`

It's the source of truth for "where are we?"

When you come back to a terminal, you need to orient. When an agent starts a new session, it needs to know what's happening.

`_AGENTS.md` answers:
- Who's working on what
- What's done
- What's blocked
- Handoff notes from completed work

Every agent reads it at the start. Every agent updates it when finishing.

---

## Why Handoffs Capture "Why"

Not just what was done — why it was done that way.

**Weak handoff:**
```
Profiles API complete.
```

**Strong handoff:**
```
Profiles API complete.
- Used soft deletes because we need account restoration
- Rate limited to 100/min based on expected traffic
- Types in lib/types.ts, tests in __tests__/api/profiles.test.ts
```

When you pick up after an hour, or Frontend starts building against the API, the reasoning is there. No reverse-engineering context.

---

## The Commands

**`status`** — Where everything stands right now.

**`today`** — What needs your attention today.

**`wrap`** — Close out the current work:
1. Update `_AGENTS.md` with what's done
2. Write handoff notes (what and why)
3. Commit with a clear message
4. Report what shipped

---

## Single Terminal vs Multiple

**Single terminal:**
- Chief of Staff shifts between roles
- Sequential work
- You follow along in one conversation

**Multiple terminals:**
- Each has a dedicated role
- Parallel work
- You switch between them as things complete

Start with one. Add more when you have independent work and you're waiting.

---

## What You Decide vs What Agents Decide

**You:**
- What to build
- Priorities
- When to ship
- Major design decisions

**Agents:**
- Implementation details
- Code structure
- Library choices
- Test approach

You own direction. They figure out execution. You check in, review, course-correct.

---

## The Coordination Files

| File | Purpose |
|------|---------|
| `_AGENTS.md` | Who's doing what, handoffs, state |
| `_TODAY.md` | What needs attention today |
| `_VISION.md` | What we're building (stable) |
| `_ROADMAP.md` | Priorities (changes occasionally) |

Agents read these at the start of each session. They update `_AGENTS.md` and `_TODAY.md` as they work.

---

## The Result

You're running 4 terminals. One's been building for an hour. One just finished tests. One's updating docs. You're in the fourth discussing the next feature.

Each terminal has a clear role. `_AGENTS.md` shows the state. Handoffs explain the reasoning.

You switch focus as things complete, always productive, always oriented.
