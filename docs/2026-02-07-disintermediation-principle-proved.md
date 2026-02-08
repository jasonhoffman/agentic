# The Disintermediation Principle, Proved by Its Own Negation

*Or: I spent six weeks compensating for what Claude Code couldn't do yet, and then it could.*

---

On Christmas Eve 2025 I started a repo called `agentic`. The first commit was 2,312 lines across 19 files: 14 agent roles — frontend engineer, security engineer, QA, product manager, technical writer — plus orchestration concepts, communication protocols, and a template called `_AGENTS.md` that you'd copy into any project to coordinate them all.

I wasn't building a product. I was building scaffolding to make Claude Code work the way I needed it to work *right now* — because the tool didn't do these things yet, and I had a production app to ship.

Six weeks and 79 commits later, on February 5th 2026, Anthropic released Claude Code 2.1.32 alongside Opus 4.6. Agent teams. Auto-memory. Task lists with dependency tracking. Plan mode. Explore agents. Subagent orchestration. Context compaction for indefinite sessions.

I deleted 800 net lines that day. The tool had caught up to the workarounds.

This is a story about compensating for gaps, watching the gaps close, and realizing that the pattern of what got absorbed — and what didn't — is the most useful thing I learned.

## The workflow I was running

By mid-January, the process for building [judoka.ai](https://judoka.ai) looked like this:

I'd open 10-15 terminal windows. Each one loaded a persona prompt — a markdown file that made Claude behave as a specific agent. A security reviewer. A performance analyst. A QA engineer writing end-to-end tests. A documentation writer.

I maintained a `MEMORY.md` for cross-session state — what had been decided, what was blocked, what the current architecture looked like. I wrote RFDs (Requests for Discussion) with phases and tasks, then assigned phases to different terminal personas. When a persona finished its chunk, I'd review the output, update MEMORY.md, and spin up the next assignment.

I built custom slash commands: `/plan` for architecture decisions, `/research` for codebase exploration, `/spec` for generating specifications, `/e2e` for end-to-end test generation, `/fragile` for identifying brittle code, `/sup` for cross-session status, `/wrap` for session summaries. I generated `_FRAGILE.md` files that flagged dangerous areas of the codebase so agents wouldn't blunder into them.

The results were real: 309,000 lines of code, 2,726 tests, 165 screens, shipped in 27 days for about $1,800 in API costs. The process worked because it applied familiar engineering management to agents that, unlike humans, actually follow process.

But the process itself was scaffolding — and scaffolding gets absorbed.

## The mapping

Here is what I built in December and January, and what Anthropic shipped in February:

| What I built | What they shipped | Version |
|---|---|---|
| 14 persona role files, manually loaded per terminal | Subagent types with custom system prompts, spawned automatically by the Task tool | 2.1.0+ |
| `MEMORY.md` maintained by hand across sessions | Auto-memory: Claude reads and writes its own persistent memory files | 2.1.32 |
| `_NEXT_SESSION_MEMO.md` for session continuity | `--resume` with context compaction, sessions persist indefinitely | 2.1.30+ |
| `/plan` custom command | Built-in `EnterPlanMode` tool with user approval flow | 2.1.3+ |
| `/research` custom command | Built-in `Explore` subagent, optimized for read-heavy codebase analysis | 2.1.0+ |
| Manual RFDs with phases and task assignments | `TaskCreate`/`TaskUpdate`/`TaskList` with dependency DAGs, blocking relationships, status tracking | 2.1.16+ |
| 10-15 terminal windows with persona prompts | Agent teams: one lead session coordinates teammates, shared task lists via `CLAUDE_CODE_TASK_LIST_ID` | 2.1.32 |
| `/sup` for cross-session status | Agents can read each other's task lists, `TeammateIdle` and `TaskCompleted` hook events | 2.1.32 |
| `/wrap` for session summaries | Context compaction with `summarize from here` | 2.1.32 |
| `_FRAGILE.md` flagging brittle code | Model judgment with 1M context window — the model just reads more code | 2.1.32 |
| `/e2e`, `/spec` custom commands | General-purpose subagent with full tool access, spawned for complex multi-step tasks | 2.1.0+ |

Every single pattern. Not approximately. Not "inspired by." The same workflow, implemented as platform features.

## This is the disintermediation principle eating itself

In late January, after a 3 AM session exploring what the `agentic` repo should actually be, I wrote down what I called the disintermediation principle:

> Keep frontier models in the critical path. Build infrastructure that amplifies model capabilities, not replaces them.
>
> **Do:** MCP tools, compute infrastructure, data access layers
> **Don't:** Consensus algorithms, prompt management systems, hardcoded reasoning flows
>
> When new models drop, apps with reasoning flowing through models get better automatically. Apps with logic baked into code get nicer explanations of the same outputs.

And then I looked at what I'd been building: persona prompts, orchestration protocols, task assignment systems, session management workflows. Every one of these was a *hardcoded reasoning flow*. I was building consensus algorithms for agents. I was building a prompt management system. Not because I set out to — but because those were the gaps, and I needed to fill them to get work done.

I was compensating. And compensation, by definition, is temporary.

The proof arrived two weeks later when Anthropic shipped it all as product features. My workarounds weren't wrong — they worked, they shipped an app — but they were *destined* to be absorbed, because they existed in the exact layer that platform vendors optimize: the gap between what models can do and what users need to manage.

## Why the workarounds look like the product

The patterns I put in place weren't novel inventions. They were the obvious things to do when you understood how Claude Code actually worked and what it needed to be productive. Persona files, shared memory, task decomposition — these are what any experienced engineer would build after a week of heavy usage, because they're the gaps you hit immediately.

Anthropic's developers are also power users of their own tool. They're shipping Claude Code with Claude Code. They hit the same gaps, have the same understanding of what's missing, and arrive at the same solutions — except they can implement them at the runtime level, integrated into the agent loop with access to context windows, token budgets, and tool permissions that no external workaround can touch.

This is the dynamic that matters: the vendor is dogfooding at extremely high velocity. The Claude Code team isn't designing features in a vacuum and shipping them quarterly. They're using the tool daily, feeling the friction, and closing gaps in weeks. My 14-role framework was ~2,300 lines of markdown compensating for something the team was already building.

The convergence isn't mysterious. When experienced engineers use the same tool intensively, they identify the same gaps and reach for the same solutions. The difference is that one group can patch around the gaps and the other can close them permanently.

This tells you something about where to invest your effort. The workarounds that any power user would build — task coordination, session memory, role specialization — those are the gaps the vendor will close, because they're feeling them too. The things that *won't* converge are your domain-specific constraints. The Supabase RLS rules that prevent recursive policy queries. The iOS SecureStore 2048-byte limit requiring token chunking. The fact that TanStack Query invalidation keys must exactly match query keys. These are the things Anthropic's team will never ship, because they're yours. These are what belong in `CLAUDE.md`.

## What survived

The `agentic` repo went from 7,113 lines (Christmas Eve peak) to ~2,100 lines by February 5th. Here's what's left:

- **Two MCP servers** (~700 lines) — one for querying OpenAI, Gemini, and Voyage models; one for discovering and invoking Supabase edge functions. These give the model *capabilities* it doesn't have natively. They survived because they're infrastructure, not workflow.
- **A shell script** (~450 lines) — bootstraps a React Native + Supabase `/lib` directory structure. Survived because it encodes specific architectural decisions, not process.
- **A human setup checklist** (~330 lines) — step-by-step browser instructions for configuring third-party services. Survived because it's the one thing a terminal agent literally cannot do.
- **Four dialogues** — the conversations where the lessons were earned. Survived because they're context, not code.
- **A 34-line CLAUDE.md** — the distillation of everything.

Everything that encoded *workflow* — how to assign tasks, how to manage sessions, how to coordinate agents — was deleted. Everything that encoded *constraints* — domain-specific rules, capability extensions, earned knowledge — survived.

## The pattern

If you're building tooling for AI coding agents today, here's the test:

**Will this get better when the next model drops?** If yes — if it's a data access layer, a capability extension, a compute substrate — build it. If no — if it's workflow orchestration, session management, prompt engineering — it's scaffolding, and the platform will absorb it.

The timeline on absorption is shortening. In December I had a multi-week lead building agent coordination patterns. By February they were product features. Nicholas Carlini's [parallel C compiler](https://www.anthropic.com/engineering/building-c-compiler) used file-based task locking across Docker containers — essentially the same coordination pattern Anthropic now ships as agent teams with `CLAUDE_CODE_TASK_LIST_ID`.

The agentic repo is now radically minimal: 34 lines of principles, two MCP servers, a shell script, some earned conversations. Everything else was absorbed into the tool I was using to build it.

That's the disintermediation principle working correctly. The workarounds did their job — they shipped an app — and then the tool caught up and made them unnecessary. The best outcome for scaffolding is that you get to delete it.

---

*This is Part 5 of an ongoing series. Previously: [On Running a Startup of Claude Code Agents](https://fullhoffman.com/2026/01/19/on-running-a-startup-of-claude-code-agents-what-you-get-for-a-billion-tokens-a-month/), [What I Learned About Power Users by Failing One](https://fullhoffman.com/2026/01/20/what-i-learned-about-power-users-by-failing-one/), [Dialogues with Claude Code](https://fullhoffman.com/2026/01/22/dialogues-with-claude-code/), [Zen of Unix Tools: Code is Context](https://fullhoffman.com/2026/01/29/zen-of-unix-tools-code-is-context/).*
