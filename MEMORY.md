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

## Red Flags

- `as any` on Supabase results
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
