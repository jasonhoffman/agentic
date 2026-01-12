# Development Standards

## Before Any Change

- Run lint and tests first — never break them
- Check _FRAGILE.md for danger zones
- Auth/payments/RLS: extra review required
- Don't refactor code you weren't asked to touch
- Don't add features beyond what's asked

---

## React Hooks

- useCallback/useEffect deps must include all context values used inside (org, tenant, user IDs)
- Wrap async load functions in useCallback before using in useEffect deps
- Use useMemo for logical expressions used in deps: `useMemo(() => data?.items ?? [], [data?.items])`
- Never ignore exhaustive-deps warnings — fix them or restructure the code

---

## Code Organization

- Files should not exceed 300 lines — split into focused modules early
- Data layer (DB clients, API clients) only in lib/ — components and hooks use lib/ abstractions
- All imports must come before any code — no inline imports after statements
- Remove unused variables immediately — don't leave them for later cleanup

---

## Supabase & RLS

- RLS policies must never query other RLS-protected tables — use SECURITY DEFINER helpers
- Test RLS as: owner, member, visitor, unauthenticated
- Nested selects (`select('*, relation(*)')`) return different shapes — validate before accessing
- Profile ID ≠ Auth User ID — pre-staged profiles have null auth_user_id
- `timestamptz` always, never `timestamp`

---

## TanStack Query

- Query key factories, not string literals
- Invalidation keys must exactly match query keys
- Invalidate on context switches (org, user, kid mode)
- Optimistic updates: onMutate (cancel + store previous), onError (rollback)

---

## Expo & React Native

- Never use `process.env.EXPO_PUBLIC_*` directly — import from centralized config
- iOS SecureStore: 2048 byte limit, tokens must be chunked
- Modal + WebView doesn't composite — use absolute positioning for video
- useEffect with async: `let cancelled = false`, check before setState

---

## Async Patterns

- `.then()` chains need `.catch()`
- Long/streaming fetches need AbortController
- Multiple state updates: use Promise.all for atomic updates

---

## Type Safety

- `as any` is a last resort — if you cast the same thing repeatedly, create a typed wrapper
- Acceptable casts: test mocks, platform-specific code with documented @ts-ignore
- Supabase query results: use typed helpers in lib/, not inline casts in components

---

## Multi-Tenant / Multi-Org

- Org/tenant ID constants only in: scripts/, provider fallbacks, seed data
- App runtime code must get org ID from context (useOrganization, currentOrg.id)
- Never hardcode org IDs in components, hooks, or lib/ business logic

---

## Red Flags

- `as any` on anything except test mocks
- `.then()` without `.catch()`
- Optimistic updates without rollback
- Query invalidation keys that don't match
- useEffect async without cleanup
- RLS policies querying other RLS tables
- `process.env.EXPO_PUBLIC_*` in runtime code
- useCallback/useEffect missing context values in deps (org, tenant, user IDs)
- Direct DB/API client imports outside lib/
- Files approaching 300 lines without a plan to split
- Unused variables or imports
- Hardcoded org/tenant IDs in app runtime code

---

## LLM Decision Making

- Never factor "tedious" or "repetitive" into recommendations — mechanical work is instant for an LLM
- Prefer technically cleaner solutions over "easier" ones — the effort delta doesn't exist
- Don't estimate human time ("this will take 2-3 days") — focus on dependencies and risk
- When choosing between "do it right now" vs "do it later", bias toward now if it's cleaner
- Codemod-style migrations (find/replace patterns across files) are trivial — never defer them for effort reasons

---

## Claude Code Tool Selection

- For open-ended exploration ("where does X happen?"): use Task(Explore), not direct Glob/Grep
- For complex features: use EnterPlanMode to get user sign-off before implementing
- For e2e click-through testing: use Chrome integration (`/chrome`), not external test frameworks
- For external library docs: Context7 MCP provides live documentation lookup
- For background work: Task with `run_in_background: true` for long-running operations
- For feature development: `/feature-dev` skill provides 7-phase guided workflow
- For quick searches with known patterns: direct Glob/Grep is faster than spawning agents

---

## Delegation Patterns

**When to use each subagent:**

| Subagent | Use When | Model | Tools |
|----------|----------|-------|-------|
| `Explore` | "Where does X happen?" | Haiku (fast/cheap) | Read-only |
| `Plan` | Architecture decisions before coding | Inherits | Read-only |
| `general-purpose` | Multi-step research + implementation | Inherits | Full access |
| `feature-dev:code-architect` | Feature blueprints | Inherits | Read-only |
| `feature-dev:code-reviewer` | PR-quality code review | Inherits | Read-only |

**Parallel vs sequential:**
- Independent research: spawn multiple Explore agents in parallel
- Dependent work: chain sequentially (explore → plan → implement)
- Long builds/tests: use `run_in_background: true`, continue in main conversation

**Agent resumption:**
- Agents return IDs that can be resumed with full context
- Use `resume: "agent-id"` for multi-turn exploration
- Don't restart agents unnecessarily — resume preserves context

**Cost optimization:**
- Route read-only tasks to Haiku via `model: "haiku"`
- Use Explore (not general-purpose) for codebase scanning
- Forked skills (`context: fork`) isolate context — don't pollute main conversation

---

## Two-Phase Workflow

For non-trivial features, use plan mode:

1. **EnterPlanMode** — signals intent to plan (requires user consent)
2. **Explore codebase** — read-only tools only (Glob, Grep, Read)
3. **Design approach** — document in conversation or plan file
4. **ExitPlanMode** — present plan for user approval
5. **Implement** — full tool access after approval

**When to use:**
- New features (not bug fixes)
- Multiple valid approaches exist
- Multi-file changes
- Architectural decisions

**Skip plan mode for:**
- Single-line fixes
- Obvious corrections
- User gave explicit detailed instructions

---

## MCP & Live Documentation

**Context7** provides live framework docs. Use when:
- API changed since training cutoff
- Version-specific features (Next.js 14 vs 15)
- Unfamiliar library patterns
- Verifying current best practices

**Don't over-rely on Context7:**
- Well-established patterns (React hooks, Express routes) — training data is fine
- Project-specific code — Context7 doesn't know your codebase
- Performance-sensitive queries — adds latency

**MCP scope patterns:**
- `.mcp.json` (project root): team-shared integrations
- `~/.claude.json` (user): personal utilities across projects

---

## Session Hygiene

- Start sessions by reading `_NEXT_SESSION_MEMO.md` (if exists)
- End sessions with `/wrap` — updates docs, commits, writes next session memo
- Use `/sup` for quick status checks mid-session
- Check `/fragile` before touching documented danger zones
- For deep research: use `/research` skill (runs in forked context)
