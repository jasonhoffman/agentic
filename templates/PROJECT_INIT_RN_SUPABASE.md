# Claude Code Initialization: Agentic Repository

## Context

This is a TypeScript monorepo with:
- **Supabase** (Postgres, RLS, Vault, Realtime)
- **React Native / Expo** (EAS builds for web, iOS, Android)
- **Google OAuth**
- **TanStack Query**

## Phase 1: Audit Current State

### 1.1 Scan Repository Structure

```bash
# Map the codebase
find . -type f -name "*.ts" -o -name "*.tsx" | head -100
ls -la lib/ 2>/dev/null || echo "No lib/ directory"
ls -la src/ 2>/dev/null || echo "No src/ directory"
cat package.json | jq '.dependencies, .devDependencies' 2>/dev/null
```

### 1.2 Check for Existing Patterns

```bash
# Data layer location
grep -rl "createClient\|supabase" --include="*.ts" --include="*.tsx" . | head -20

# Query patterns
grep -rl "useQuery\|useMutation" --include="*.tsx" . | head -20

# Environment usage
grep -rn "process.env.EXPO_PUBLIC" --include="*.ts" --include="*.tsx" . | head -10

# Hardcoded IDs (red flag)
grep -rn "org_\|tenant_\|user_" --include="*.ts" --include="*.tsx" . | grep -v "types\|interface" | head -10
```

### 1.3 Create Audit Report

Create `docs/ARCHITECTURE-AUDIT.md`:

```markdown
# Architecture Audit

## Current State

### Directory Structure
- [ ] /lib exists with data layer abstractions
- [ ] /components separate from data fetching
- [ ] /hooks for custom React hooks
- [ ] /types for shared TypeScript types

### Data Patterns
- [ ] Supabase client in single location
- [ ] RLS policies documented
- [ ] Query key factories (not string literals)
- [ ] No direct DB imports in components

### Configuration
- [ ] Centralized env config (not process.env scattered)
- [ ] No hardcoded org/tenant IDs in runtime code

### Code Quality
- [ ] Files under 300 lines
- [ ] No `as any` outside test mocks
- [ ] useEffect/useCallback deps complete

## Issues Found
[List issues here]

## Recommended Structure
[Propose /lib structure here]
```

---

## Phase 2: Establish /lib Structure

### 2.1 Core Directory Structure

```
lib/
├── config/
│   └── env.ts              # Single source for all env vars
├── supabase/
│   ├── client.ts           # Supabase client (single instance)
│   ├── types.ts            # Generated database types
│   └── helpers.ts          # RLS-safe query helpers
├── queries/
│   ├── keys.ts             # Query key factories
│   └── [domain].ts         # Domain-specific queries
├── constants/
│   ├── terminology.ts      # Standardized labels/names
│   └── units.ts            # Formatting functions
├── models/
│   ├── types.ts            # Shared business types
│   └── [domain].ts         # Domain logic (pure functions)
├── layout/                 # CRITICAL: Set up from day one
│   ├── constants.ts        # Breakpoints, widths, touch targets
│   ├── useLayout.ts        # Layout mode hook
│   ├── LayoutShell.tsx     # App-level layout wrapper
│   ├── useAdaptiveNavigation.ts  # Navigation that adapts to layout
│   ├── AdaptiveModal.tsx   # Modals that adapt to screen size
│   ├── ResponsiveGrid.tsx  # Auto-column grid
│   └── index.ts            # Exports
└── hooks/
    └── [domain].ts         # Domain-specific React hooks
```

**→ See `RESPONSIVE_LAYOUT_SYSTEM.md` for complete `/lib/layout` implementation.**

### 2.2 Create `/lib/config/env.ts`

```typescript
/**
 * SINGLE SOURCE for all environment variables
 * Never use process.env.EXPO_PUBLIC_* directly elsewhere
 */

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const optional = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

export const ENV = {
  supabase: {
    url: required('EXPO_PUBLIC_SUPABASE_URL'),
    anonKey: required('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  },
  google: {
    clientId: required('EXPO_PUBLIC_GOOGLE_CLIENT_ID'),
    // iOS and Android may need separate client IDs
    iosClientId: optional('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', ''),
    androidClientId: optional('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID', ''),
  },
  app: {
    environment: optional('EXPO_PUBLIC_ENV', 'development'),
    isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  },
} as const;
```

### 2.3 Create `/lib/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';
import type { Database } from './types';

// Single client instance
export const supabase = createClient<Database>(
  ENV.supabase.url,
  ENV.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      // React Native specific storage if needed
    },
  }
);

// Typed helpers for common patterns
export async function fetchOne<T>(
  query: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await query;
  if (error) throw error;
  if (!data) throw new Error('Not found');
  return data;
}

export async function fetchMany<T>(
  query: Promise<{ data: T[] | null; error: any }>
): Promise<T[]> {
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
```

### 2.4 Create `/lib/queries/keys.ts`

```typescript
/**
 * Query key factories
 * All TanStack Query keys defined here, nowhere else
 */

export const queryKeys = {
  // User domain
  user: {
    all: ['user'] as const,
    profile: (userId: string) => ['user', 'profile', userId] as const,
    settings: (userId: string) => ['user', 'settings', userId] as const,
  },

  // Organization domain
  org: {
    all: ['org'] as const,
    byId: (orgId: string) => ['org', orgId] as const,
    members: (orgId: string) => ['org', orgId, 'members'] as const,
    settings: (orgId: string) => ['org', orgId, 'settings'] as const,
  },

  // Add domains as needed
} as const;

// Type helper for invalidation
export type QueryKeyFactory = typeof queryKeys;
```

### 2.5 Create `/lib/hooks/useAuth.ts`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Platform-specific redirect handling
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
}
```

---

## Phase 3: Migrate Existing Code

### 3.1 Find and Fix Direct Supabase Imports

```bash
# Find components directly importing supabase
grep -rn "from.*supabase.*createClient\|import.*supabase" --include="*.tsx" . | grep -v "lib/"
```

For each file found:
1. Remove direct supabase import
2. Import from `/lib/supabase/client` instead
3. Or better: use a hook from `/lib/hooks/`

### 3.2 Find and Fix Direct Env Access

```bash
# Find direct process.env usage
grep -rn "process.env.EXPO_PUBLIC" --include="*.ts" --include="*.tsx" . | grep -v "lib/config"
```

For each file found:
1. Remove process.env reference
2. Import from `/lib/config/env` instead

### 3.3 Find and Fix Query Key Strings

```bash
# Find string literal query keys
grep -rn "useQuery.*\['" --include="*.tsx" .
grep -rn "queryKey:.*\['" --include="*.tsx" .
```

For each file found:
1. Add key to `/lib/queries/keys.ts`
2. Import and use the factory

### 3.4 Find and Fix Missing Hook Deps

```bash
# Find useEffect/useCallback that might have missing deps
grep -rn "useEffect\|useCallback" --include="*.tsx" . -A 5 | grep -B 5 "orgId\|tenantId\|userId"
```

Check each for complete dependency arrays.

---

## Phase 4: Database Setup

### 4.1 RLS Policy Checklist

For every table with RLS:

```sql
-- Document in /docs/RLS-POLICIES.md

-- Table: [table_name]
-- RLS: ENABLED

-- Policy: [policy_name]
-- For: SELECT/INSERT/UPDATE/DELETE
-- Using: [expression]
-- With check: [expression]

-- ⚠️ Does this policy query another RLS table?
-- If yes, use SECURITY DEFINER helper instead
```

### 4.2 Create RLS-Safe Helpers

```sql
-- /supabase/migrations/xxx_rls_helpers.sql

-- Helper to check org membership without hitting RLS
CREATE OR REPLACE FUNCTION is_org_member(check_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_members
    WHERE org_id = check_org_id
    AND user_id = auth.uid()
  );
$$;
```

### 4.3 Verify Profile vs Auth User

```sql
-- Check for pre-staged profiles
SELECT
  COUNT(*) as total_profiles,
  COUNT(auth_user_id) as linked_profiles,
  COUNT(*) - COUNT(auth_user_id) as unlinked_profiles
FROM profiles;
```

Document this in `/docs/DATA-MODEL.md`.

---

## Phase 5: Verify & Document

### 5.1 Run Verification

```bash
# No direct env access outside lib/config
grep -rn "process.env.EXPO_PUBLIC" --include="*.ts" --include="*.tsx" . | grep -v "lib/config" | wc -l
# Should be 0

# No direct supabase client creation outside lib/supabase
grep -rn "createClient" --include="*.ts" --include="*.tsx" . | grep -v "lib/supabase" | wc -l
# Should be 0

# No hardcoded org/tenant IDs in runtime code
grep -rn '"org_\|"tenant_' --include="*.ts" --include="*.tsx" . | grep -v "scripts/\|seed\|test" | wc -l
# Should be 0

# All files under 300 lines
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 300 {print}'
# Should be empty or have a documented reason
```

### 5.2 Update Documentation

Create/update these files:

```
docs/
├── ARCHITECTURE.md         # Overall structure
├── DATA-MODEL.md           # Supabase schema, relationships
├── RLS-POLICIES.md         # All RLS policies documented
├── _FRAGILE.md             # Danger zones (auth, payments, RLS)
└── _NEXT_SESSION_MEMO.md   # For session handoff
```

### 5.3 Final Checklist

```markdown
## Initialization Complete When:

### /lib Structure
- [ ] /lib/config/env.ts - single source for env vars
- [ ] /lib/supabase/client.ts - single supabase instance
- [ ] /lib/supabase/types.ts - generated database types
- [ ] /lib/queries/keys.ts - query key factories
- [ ] /lib/layout/ - responsive layout system (see RESPONSIVE_LAYOUT_SYSTEM.md)
- [ ] /lib/hooks/ - domain hooks

### Migrations Done
- [ ] Zero direct process.env.EXPO_PUBLIC_ outside lib/config
- [ ] Zero createClient calls outside lib/supabase
- [ ] Zero string literal query keys
- [ ] Zero hardcoded org/tenant IDs in runtime

### Documentation
- [ ] ARCHITECTURE.md exists
- [ ] RLS-POLICIES.md documents all policies
- [ ] _FRAGILE.md lists danger zones

### Code Quality
- [ ] All files under 300 lines (or documented exception)
- [ ] No `as any` outside test mocks
- [ ] useEffect/useCallback deps include context values
```

---

## Red Flags to Check

During initialization, flag these immediately:

| Pattern | Location | Action |
|---------|----------|--------|
| `as any` | Outside tests | Create typed wrapper |
| `.then()` without `.catch()` | Anywhere | Add error handling |
| `process.env.EXPO_PUBLIC_*` | Outside lib/config | Migrate to ENV |
| `createClient` | Outside lib/supabase | Use shared client |
| `useQuery(['string'` | Anywhere | Use query key factory |
| Hardcoded `org_*` ID | Runtime code | Use context |
| File > 300 lines | Anywhere | Plan to split |
| RLS policy with subquery on RLS table | Supabase | Use SECURITY DEFINER |

---

## Usage

Copy this prompt to Claude when initializing a new React Native + Supabase project:

```
I'm starting a new React Native + Expo + Supabase project. Please run through the initialization phases in templates/PROJECT_INIT_RN_SUPABASE.md to audit the codebase and establish proper architecture patterns.
```

Or for existing projects:

```
This is an existing React Native + Supabase project that needs architectural cleanup. Please follow templates/PROJECT_INIT_RN_SUPABASE.md to audit current state and migrate to proper patterns.
```
