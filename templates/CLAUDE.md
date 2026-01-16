# Claude Code Instructions

> Read this file at the start of every session.

## Stack

- **Runtime**: TypeScript, React Native (Expo), EAS builds (web/iOS/Android)
- **Database**: Supabase (Postgres, RLS, Vault, Realtime)
- **Auth**: Google OAuth via Supabase
- **Data Fetching**: TanStack Query
- **State**: React Context + Query cache

---

## Before Any Change

- Run lint and tests first — never break them
- Check `docs/_FRAGILE.md` for danger zones
- Auth/payments/RLS: extra review required
- Don't refactor code you weren't asked to touch
- Don't add features beyond what's asked

---

## Architecture: /lib is the Data Layer

```
lib/
├── config/env.ts           # ALL env vars (never process.env elsewhere)
├── supabase/
│   ├── client.ts           # Single Supabase instance
│   ├── types.ts            # Generated DB types
│   └── queries/keys.ts     # TanStack Query key factories
├── constants/
│   ├── terminology.ts      # Neutral scenario names
│   └── units.ts            # Formatters (formatTokens, etc.)
├── models/                 # Pure business logic (calculations)
└── hooks/                  # Domain-specific React hooks
```

**Enforced**:
- Components import from `lib/`, never directly from Supabase/env
- No `process.env.EXPO_PUBLIC_*` outside `lib/config/env.ts`
- No `createClient` outside `lib/supabase/client.ts`
- No string literal query keys—use factories from `lib/supabase/queries/keys.ts`
- No duplicate formatters—use `lib/constants/units.ts`

---

## Data Architecture Principle

**Single source of truth**: All model data flows from database → `/lib/models` → hooks → components.

- Projection data comes from `/lib/models/`, not hardcoded in components
- Claims/assumptions stored in DB with fallbacks in `/lib/models/assumptions.ts`
- Terminology is neutral ("baseline/high/full", never "aggressive/conservative")

---

## Multi-Tenant / Context IDs

```typescript
// ❌ NEVER
const orgId = 'org_abc123';

// ✅ ALWAYS
const { orgId } = useOrganization();
```

Hardcoded IDs allowed ONLY in: `scripts/`, seed files, tests.

---

## React Hooks

```typescript
// ❌ Missing deps
useEffect(() => {
  fetchData(orgId);
}, []); // orgId missing!

// ✅ Complete deps with useCallback
const fetchData = useCallback(async () => {
  const result = await loadData(orgId);
  if (!cancelled) setData(result);
}, [orgId]);

useEffect(() => {
  let cancelled = false;
  fetchData();
  return () => { cancelled = true; };
}, [fetchData]);
```

- useCallback/useEffect deps must include all context values (org, tenant, user IDs)
- Wrap async load functions in useCallback before using in useEffect deps
- Use `useMemo` for logical expressions: `useMemo(() => data?.items ?? [], [data?.items])`
- Never ignore exhaustive-deps warnings — fix them or restructure

---

## TanStack Query

```typescript
// ❌ String literal key
useQuery({ queryKey: ['org', orgId] });

// ✅ Factory from lib
import { queryKeys } from '@/lib/supabase/queries/keys';
useQuery({ queryKey: queryKeys.org.byId(orgId) });
```

- Query key factories, not string literals
- Invalidation keys must exactly match query keys
- Invalidate on context switches (org, user, kid mode)
- Optimistic updates: `onMutate` (cancel + store previous), `onError` (rollback)

---

## Supabase & RLS

- RLS policies must **never** query other RLS-protected tables — use SECURITY DEFINER helpers
- Test RLS as: owner, member, visitor, unauthenticated
- Nested selects (`select('*, relation(*)')`) return different shapes — validate before accessing
- Profile ID ≠ Auth User ID — pre-staged profiles have null `auth_user_id`
- `timestamptz` always, never `timestamp`

---

## Expo & React Native

- Never use `process.env.EXPO_PUBLIC_*` directly — import from centralized config
- iOS SecureStore: 2048 byte limit, tokens must be chunked
- Modal + WebView doesn't composite — use absolute positioning for video

### Responsive Layout (iPhone / iPad / Web) — Build From Day One

**Never assume single-column.** iPad multi-pane and web layouts must work from the first commit.

```typescript
// lib/hooks/useLayout.ts — REQUIRED in every project
import { useWindowDimensions } from 'react-native';

export type LayoutMode = 'compact' | 'medium' | 'expanded';

export function useLayout() {
  const { width } = useWindowDimensions();

  const mode: LayoutMode =
    width < 600 ? 'compact' :      // iPhone, small Android
    width < 1024 ? 'medium' :      // iPad portrait, small tablets
    'expanded';                     // iPad landscape, web

  return {
    mode,
    isCompact: mode === 'compact',
    isMedium: mode === 'medium',
    isExpanded: mode === 'expanded',
    showSidebar: mode !== 'compact',
    showDetailPane: mode === 'expanded',
    width,
  };
}
```

**Layout patterns:**

```typescript
// ❌ NEVER — assumes single column
<ScrollView>
  <List onSelect={item => navigation.navigate('Detail', { id: item.id })} />
</ScrollView>

// ✅ ALWAYS — responsive from start
const { showDetailPane } = useLayout();

<View style={{ flexDirection: 'row', flex: 1 }}>
  <View style={{ width: showDetailPane ? 320 : '100%' }}>
    <List onSelect={setSelectedId} />
  </View>
  {showDetailPane && (
    <View style={{ flex: 1 }}>
      <Detail id={selectedId} />
    </View>
  )}
</View>
```

**Navigation must be layout-aware:**

```typescript
// lib/navigation/useAdaptiveNavigation.ts
export function useAdaptiveNavigation() {
  const { showDetailPane } = useLayout();
  const navigation = useNavigation();

  const navigateToDetail = useCallback((id: string) => {
    if (showDetailPane) {
      // iPad/web: update state, detail pane shows inline
      setSelectedId(id);
    } else {
      // iPhone: push to stack
      navigation.navigate('Detail', { id });
    }
  }, [showDetailPane, navigation]);

  return { navigateToDetail };
}
```

**Component checklist:**
- [ ] Uses `useLayout()` not hardcoded widths
- [ ] List/detail patterns handle inline AND navigation
- [ ] Modals adapt size (full-screen on compact, centered on expanded)
- [ ] Touch targets ≥44pt on all layouts
- [ ] Sidebar collapses on compact, persists on expanded

---

## Async Patterns

- `.then()` chains need `.catch()`
- Long/streaming fetches need AbortController
- Multiple state updates: use `Promise.all` for atomic updates

---

## Type Safety

- `as any` is a last resort — if you cast the same thing repeatedly, create a typed wrapper
- Acceptable casts: test mocks, platform-specific code with documented @ts-ignore
- Supabase query results: use typed helpers in lib/, not inline casts in components

---

## Code Organization

- **300 lines max** — split into focused modules early
- Data layer (DB/API clients) only in `lib/` — components use abstractions
- All imports before any code — no inline imports after statements
- Remove unused variables immediately

---

## Red Flags — Stop and Fix

| Pattern | Problem |
|---------|---------|
| `as any` | Create typed wrapper (except test mocks) |
| `.then()` without `.catch()` | Add error handling |
| `process.env.EXPO_PUBLIC_*` in component | Move to lib/config |
| `useQuery(['string'` | Use query key factory |
| File > 300 lines | Split now |
| RLS subquery on RLS table | Use SECURITY DEFINER |
| Optimistic updates without rollback | Add onError handler |
| useCallback/useEffect missing context deps | Include org/tenant/user IDs |
| Hardcoded org/tenant IDs in runtime | Use context |
| "aggressive" / "conservative" terminology | Use neutral terms |
| Duplicate formatTokens() / formatPower() | Import from lib/constants/units |
| `navigation.navigate` in list items | Use `useAdaptiveNavigation` |
| `width: [fixed number]` without useLayout | Won't adapt to iPad/web |
| `<Modal presentationStyle="fullScreen">` | Use `AdaptiveModal` |
| No `useLayout` in screen component | Probably not responsive |

---

## LLM Decision Making

- Never factor "tedious" or "repetitive" into recommendations — mechanical work is instant
- Prefer technically cleaner solutions over "easier" ones
- Don't estimate human time — focus on dependencies and risk
- Bias toward "do it right now" vs "do it later" if it's cleaner
- Codemod-style migrations are trivial — never defer for effort reasons

---

## Claude Code Tool Selection

| Need | Tool |
|------|------|
| Open-ended exploration ("where does X happen?") | `Task(Explore)` |
| Complex features | `EnterPlanMode` → plan → `ExitPlanMode` → implement |
| Quick search with known pattern | Direct Glob/Grep |
| E2E click-through testing | Chrome integration (`/chrome`) |
| External library docs | Context7 MCP |
| Background work | `Task` with `run_in_background: true` |

---

## Session Workflow

- **Start**: Read `docs/_NEXT_SESSION_MEMO.md` if exists
- **End**: Run `/wrap` to update docs and write next memo
- **Status check**: `/sup`
- **Complex features**: Use `EnterPlanMode` first

---

## Documentation Locations

| File | Purpose |
|------|---------|
| `docs/ARCHITECTURE.md` | System overview |
| `docs/DATA-MODEL.md` | Supabase schema |
| `docs/RLS-POLICIES.md` | All RLS policies |
| `docs/_FRAGILE.md` | Danger zones |
| `docs/_NEXT_SESSION_MEMO.md` | Session handoff |
