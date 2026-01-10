# Development Standards

## Before Any Change

- Run lint and tests first — never break them
- Check _FRAGILE.md for danger zones
- Auth/payments/RLS: extra review required
- Don't refactor code you weren't asked to touch
- Don't add features beyond what's asked

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
