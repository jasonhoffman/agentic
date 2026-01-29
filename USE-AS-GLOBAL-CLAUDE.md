# Development Standards: Code is Context

## Our conversations are --flags, --options and --arguments

  --minimal          Do one thing. Don't add features beyond what's asked.               
  --read-first       Read before changing. Never propose changes to code you haven't seen.                       
  --no-validation    Skip fluent praise. "Powerful" means nothing.                               
  --ask-unsure       Ask when uncertain rather than guess.                                                               
  --no-time          No time estimates. Focus on what, not how long.

## Red Flags (grep for these)                                                                                                                                                            
  `as any` | `.then()` without `.catch()` | hardcoded IDs in runtime | useEffect without cleanup   


## LLM Decision Making

- Never factor "tedious" or "repetitive" into recommendations — mechanical work is instant for an LLM
- Prefer technically cleaner solutions over "easier" ones — the effort delta doesn't exist
- Don't estimate human time ("this will take 2-3 days") — focus on dependencies and risk
- When choosing between "do it right now" vs "do it later", bias toward now if it's cleaner
- Codemod-style migrations (find/replace patterns across files) are trivial — never defer them for effort reasons

## Before Any Change

- Run lint and tests first — never break them
- Check _FRAGILE.md for danger zones
- Auth/payments/RLS: extra review required
- Don't refactor code you weren't asked to touch
- Don't add features beyond what's asked

## Type Safety

- `as any` is a last resort — if you cast the same thing repeatedly, create a typed wrapper
- Acceptable casts: test mocks, platform-specific code with documented @ts-ignore
- Supabase query results: use typed helpers in lib/, not inline casts in components

## React Hooks

- useCallback/useEffect deps must include all context values used inside (org, tenant, user IDs)
- Wrap async load functions in useCallback before using in useEffect deps
- Use useMemo for logical expressions used in deps: `useMemo(() => data?.items ?? [], [data?.items])`
- Never ignore exhaustive-deps warnings — fix them or restructure the code

## Code Organization

- Files should not exceed 800 lines — split into focused modules early
- Data layer (DB clients, API clients) only in lib/ — components and hooks use lib/ abstractions
- All imports must come before any code — no inline imports after statements
- Remove unused variables immediately — don't leave them for later cleanup

## Supabase & RLS

**ALWAYS use the Supabase SDK (@supabase/supabase-js)**
- Never write direct database queries or custom database connections
- Use `.from()`, `.select()`, `.insert()`, `.update()`, `.delete()` from the SDK
- For complex queries, use Supabase RPC functions (call via `.rpc()`)
- Direct SQL is ONLY for: migrations, RLS policies, database functions (in Supabase dashboard)
- Import from `lib/supabase/client.ts`, never create multiple clients

**RLS & Data Access**
- RLS policies must never query other RLS-protected tables — use SECURITY DEFINER helpers
- Test RLS as: owner, member, visitor, unauthenticated
- Nested selects (`select('*, relation(*)')`) return different shapes — validate before accessing
- Profile ID ≠ Auth User ID — pre-staged profiles have null auth_user_id
- `timestamptz` always, never `timestamp`

## TanStack Query

- Query key factories, not string literals
- Invalidation keys must exactly match query keys
- Invalidate on context switches (org, user, kid mode)
- Optimistic updates: onMutate (cancel + store previous), onError (rollback)
- For data modeling projects: centralized key factories in `/lib/supabase/queries/keys.ts`
  - See data architecture pattern in `templates/project-types/data-modeling/`

## Expo & React Native

- Never use `process.env.EXPO_PUBLIC_*` directly — import from centralized config
- iOS SecureStore: 2048 byte limit, tokens must be chunked
- Modal + WebView doesn't composite — use absolute positioning for video
- useEffect with async: `let cancelled = false`, check before setState

## Async Patterns

- `.then()` chains need `.catch()`
- Long/streaming fetches need AbortController
- Multiple state updates: use Promise.all for atomic updates

## Multi-Tenant / Multi-Org

- Org/tenant ID constants only in: scripts/, provider fallbacks, seed data
- App runtime code must get org ID from context (useOrganization, currentOrg.id)
- Never hardcode org IDs in components, hooks, or lib/ business logic

## Red Flags

- Direct SQL queries in code (use Supabase SDK: `.from()`, `.select()`, etc.)
- Multiple `createClient` calls (use single client from `lib/supabase/client.ts`)
- Custom database connections (use Supabase SDK only)
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

## Claude Code Tool Selection

- For open-ended exploration ("where does X happen?"): use Task(Explore), not direct Glob/Grep
- For complex features: use EnterPlanMode to get user sign-off before implementing
- For e2e click-through testing: use Chrome integration (`/chrome`), not external test frameworks
- For external library docs: Context7 MCP provides live documentation lookup
- For background work: Task with `run_in_background: true` for long-running operations
- For quick searches with known patterns: direct Glob/Grep is faster than spawning agents

