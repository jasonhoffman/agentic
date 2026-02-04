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
- When choosing between "do it right now" vs "do it later", bias toward now if it's cleaner
- Codemod-style migrations are trivial — never defer them for effort reasons

## The Disintermediation Principle

Keep frontier models in the critical path. Build infrastructure that amplifies model capabilities, not replaces them.

- **Do:** MCP tools, compute infrastructure, data access layers
- **Don't:** Consensus algorithms, prompt management systems, hardcoded reasoning flows

When new models drop, apps with reasoning flowing through models get better automatically. Apps with logic baked into code get nicer explanations of the same outputs.

## Before Any Change

- Run lint and tests first — never break them
- Auth/payments/RLS: extra review required
- Don't refactor code you weren't asked to touch

## Supabase & RLS

- Single client from `lib/supabase/client.ts` — never multiple createClient calls
- Direct SQL only for: migrations, RLS policies, database functions
- RLS policies must never query other RLS-protected tables — use SECURITY DEFINER helpers
- Nested selects (`select('*, relation(*)')`) return different shapes — validate before accessing
- Profile ID ≠ Auth User ID — pre-staged profiles have null auth_user_id
- `timestamptz` always, never `timestamp`

## TanStack Query

- Query key factories in `lib/queries/keys.ts`, not string literals
- Invalidation keys must exactly match query keys
- Optimistic updates need rollback in onError

## Expo & React Native

- Never use `process.env.EXPO_PUBLIC_*` directly — import from `lib/config/env.ts`
- iOS SecureStore: 2048 byte limit, tokens must be chunked
- Modal + WebView doesn't composite — use absolute positioning for video

## Multi-Tenant / Multi-Org

- Org/tenant ID constants only in: scripts/, provider fallbacks, seed data
- App runtime code must get org ID from context, never hardcoded
