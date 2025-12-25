# Chapter 5: Getting Started

Start building in 5 minutes.

---

## The Only Step

```bash
cd ~/.agentic
claude
```

That's it. Chief of Staff takes it from there.

---

## What Happens

```
Chief of Staff: Welcome to Agentic. What are you building?

You: A mobile app for dog walkers.

Chief of Staff: Great. Let me set up your project.

What do you want to call it?

You: dogwalker

Chief of Staff: Creating ~/projects/dogwalker...

[creates directory]
[initializes git]
[copies templates]

Done. Now tell me more about it:
- Who's the main user — dog owners or walkers?
- What's the one thing they should be able to do first?

You: Dog owners. They should be able to find and book a walker.

Chief of Staff: Got it. I've started your vision doc.

Want me to bring in the Product Manager to help define the MVP scope?

You: Yes.

Chief of Staff: Bringing in Product Manager.

Product Manager: I see you're building a dog walker booking app.
Let me ask a few questions to nail down the MVP...
```

The Chief of Staff:
1. Creates your project directory
2. Sets up git
3. Copies all the template files
4. Helps you fill in the vision
5. Brings in specialists when you're ready

You just have a conversation.

---

## Your Project After Setup

```
~/projects/dogwalker/
├── claude.md               # Connects to Agentic framework
└── docs/
    ├── _TODAY.md           # Your daily briefing
    ├── _AGENTS.md          # Agent coordination
    ├── _VISION.md          # What you're building
    ├── _ROADMAP.md         # Priorities
    ├── _ARCHITECTURE.md    # Tech decisions
    └── _CONVENTIONS.md     # Coding standards
```

Chief of Staff creates all of this. You don't touch files directly unless you want to.

---

## Starting Your Second Session

Once your project exists, start from there:

```bash
cd ~/projects/dogwalker
claude
```

```
Chief of Staff: Welcome back.

**Since last time:**
- Vision documented
- MVP scope defined with Product Manager

**Ready for:**
- Tech stack decisions
- Start building

What should we focus on?

You: Let's pick a tech stack and start building auth.

Chief of Staff: For tech stack, I recommend the default:
- React Native + Expo (mobile)
- Supabase (backend)
- TypeScript

Want me to set that up, or do you have preferences?

You: Default is fine.

Chief of Staff: Done. Now let me bring in Backend Engineer for auth.

Backend Engineer: I'll design the auth flow...
```

---

## If You Prefer Manual Setup

Some people prefer to set things up themselves. That's fine:

```bash
mkdir ~/projects/my-app
cd ~/projects/my-app
git init
cp ~/.agentic/templates/claude.md ./
cp -r ~/.agentic/templates/docs ./
```

Then edit `claude.md` and `docs/_VISION.md` with your project details.

But honestly, just tell Chief of Staff what you're building. It's faster.

---

## What's in the Template Files

### claude.md

Connects your project to the Agentic framework:
- Project name and description
- Points to ~/.agentic for Chief of Staff identity
- Current focus

### docs/_TODAY.md

Your daily briefing:
- Decisions waiting for you
- Work ready for review
- What happened recently

### docs/_AGENTS.md

Agent coordination:
- Who's working on what
- Handoff notes between agents
- Decision queue

### docs/_VISION.md

What you're building:
- The problem you're solving
- Who it's for
- What success looks like

### docs/_ROADMAP.md

Your priorities:
- Current phase
- What's in MVP
- What's deferred

### docs/_ARCHITECTURE.md

Technical decisions:
- Tech stack
- Key patterns
- Design choices

### docs/_CONVENTIONS.md

Coding standards:
- File naming
- Code style
- Testing approach

---

## Tips

### Start Small

Your first feature should be tiny. Learn the flow before tackling big things.

### Stay in Conversation

You can do everything through conversation with Chief of Staff. They'll tell you when you need to look at a file.

### You're Still the Builder

Agents help, but make sure you understand what's being built. Ask to see the code. Review it.

---

## Summary

| What | How |
|------|-----|
| Start a new project | `cd ~/.agentic && claude` → "I want to build X" |
| Continue a project | `cd ~/projects/my-app && claude` |
| Set up tech stack | "I want the default stack" |
| Start building | "Let's build the auth flow" |

**Time:** 5 minutes to your first feature.

---

→ [Chapter 6: Your First Day](06_YOUR_FIRST_DAY.md)
