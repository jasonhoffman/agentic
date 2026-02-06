#!/bin/bash

# scaffold-lib.sh
# Run this to create the /lib structure if it doesn't exist

set -e

echo "🏗️  Scaffolding /lib structure..."

# Create directories
mkdir -p lib/config
mkdir -p lib/supabase
mkdir -p lib/queries
mkdir -p lib/models
mkdir -p lib/hooks
mkdir -p lib/constants
mkdir -p lib/layout
mkdir -p docs

# Create lib/config/env.ts
if [ ! -f lib/config/env.ts ]; then
cat > lib/config/env.ts << 'EOF'
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
    clientId: optional('EXPO_PUBLIC_GOOGLE_CLIENT_ID', ''),
    iosClientId: optional('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', ''),
    androidClientId: optional('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID', ''),
  },
  app: {
    environment: optional('EXPO_PUBLIC_ENV', 'development'),
    isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  },
} as const;
EOF
echo "✅ Created lib/config/env.ts"
fi

# Create lib/supabase/client.ts
if [ ! -f lib/supabase/client.ts ]; then
cat > lib/supabase/client.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';
import type { Database } from './types';

export const supabase = createClient<Database>(
  ENV.supabase.url,
  ENV.supabase.anonKey,
  {
    auth: {
      persistSession: true,
    },
  }
);

// Typed query helpers
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
EOF
echo "✅ Created lib/supabase/client.ts"
fi

# Create lib/supabase/types.ts placeholder
if [ ! -f lib/supabase/types.ts ]; then
cat > lib/supabase/types.ts << 'EOF'
/**
 * Database types - generate with:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
 */

export type Database = {
  public: {
    Tables: {
      // Generated types go here
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
EOF
echo "✅ Created lib/supabase/types.ts (placeholder - run supabase gen types)"
fi

# Create lib/queries/keys.ts
if [ ! -f lib/queries/keys.ts ]; then
cat > lib/queries/keys.ts << 'EOF'
/**
 * Query key factories
 * All TanStack Query keys defined here
 */

export const queryKeys = {
  user: {
    all: ['user'] as const,
    profile: (userId: string) => ['user', 'profile', userId] as const,
    settings: (userId: string) => ['user', 'settings', userId] as const,
  },

  org: {
    all: ['org'] as const,
    byId: (orgId: string) => ['org', orgId] as const,
    members: (orgId: string) => ['org', orgId, 'members'] as const,
  },

  // Add more domains as needed
} as const;
EOF
echo "✅ Created lib/queries/keys.ts"
fi

# Create lib/constants/units.ts
if [ ! -f lib/constants/units.ts ]; then
cat > lib/constants/units.ts << 'EOF'
/**
 * Formatting utilities - import from here, don't duplicate
 */

export function formatNumber(value: number, precision = 0): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPercent(value: number, precision = 1): string {
  return `${(value * 100).toFixed(precision)}%`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(d);
}
EOF
echo "✅ Created lib/constants/units.ts"
fi

# Create lib/hooks/useAuth.ts
if [ ! -f lib/hooks/useAuth.ts ]; then
cat > lib/hooks/useAuth.ts << 'EOF'
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

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
EOF
echo "✅ Created lib/hooks/useAuth.ts"
fi

# Create lib/models/types.ts
if [ ! -f lib/models/types.ts ]; then
cat > lib/models/types.ts << 'EOF'
/**
 * Shared business types
 * Domain-specific types that aren't tied to database schema
 */

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Add domain types here
EOF
echo "✅ Created lib/models/types.ts"
fi

# Create lib/layout/constants.ts
if [ ! -f lib/layout/constants.ts ]; then
cat > lib/layout/constants.ts << 'EOF'
/**
 * Layout breakpoints and constants
 * Based on Apple HIG and Material Design
 */

export const BREAKPOINTS = {
  compact: 0,      // 0-599: iPhone, Android phones
  medium: 600,     // 600-1023: iPad portrait, small tablets
  expanded: 1024,  // 1024+: iPad landscape, desktop
} as const;

export const SIDEBAR_WIDTH = {
  collapsed: 0,
  compact: 72,
  medium: 240,
  expanded: 320,
} as const;

export const DETAIL_PANE = {
  minWidth: 400,
  preferredWidth: 480,
  maxWidth: 600,
} as const;

export const MODAL_WIDTH = {
  compact: '100%' as const,
  medium: 540,
  expanded: 640,
} as const;

export const TOUCH_TARGET = {
  minimum: 44,
  comfortable: 48,
} as const;
EOF
echo "✅ Created lib/layout/constants.ts"
fi

# Create lib/layout/useLayout.ts
if [ ! -f lib/layout/useLayout.ts ]; then
cat > lib/layout/useLayout.ts << 'EOF'
import { useWindowDimensions, Platform } from 'react-native';
import { useMemo } from 'react';
import { BREAKPOINTS, SIDEBAR_WIDTH, DETAIL_PANE } from './constants';

export type LayoutMode = 'compact' | 'medium' | 'expanded';

export interface LayoutInfo {
  mode: LayoutMode;
  isCompact: boolean;
  isMedium: boolean;
  isExpanded: boolean;
  showSidebar: boolean;
  showDetailPane: boolean;
  sidebarWidth: number;
  width: number;
  height: number;
  isWeb: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function useLayout(): LayoutInfo {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const mode: LayoutMode =
      width < BREAKPOINTS.medium ? 'compact' :
      width < BREAKPOINTS.expanded ? 'medium' :
      'expanded';

    const isCompact = mode === 'compact';
    const isMedium = mode === 'medium';
    const isExpanded = mode === 'expanded';

    const showSidebar = !isCompact;
    const showDetailPane = isExpanded &&
      width >= (SIDEBAR_WIDTH.medium + 300 + DETAIL_PANE.minWidth);

    const sidebarWidth = isCompact
      ? SIDEBAR_WIDTH.collapsed
      : isMedium
        ? SIDEBAR_WIDTH.medium
        : SIDEBAR_WIDTH.expanded;

    return {
      mode,
      isCompact,
      isMedium,
      isExpanded,
      showSidebar,
      showDetailPane,
      sidebarWidth,
      width,
      height,
      isWeb: Platform.OS === 'web',
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',
    };
  }, [width, height]);
}
EOF
echo "✅ Created lib/layout/useLayout.ts"
fi

# Create docs/ARCHITECTURE.md
if [ ! -f docs/ARCHITECTURE.md ]; then
cat > docs/ARCHITECTURE.md << 'EOF'
# Architecture

## Stack
- TypeScript
- React Native (Expo)
- EAS (web, iOS, Android builds)
- Supabase (Postgres, RLS, Vault, Realtime)
- Google OAuth
- TanStack Query

## Directory Structure

```
lib/                    # Data layer (ONLY place for DB/API access)
├── config/env.ts       # Environment variables
├── supabase/           # Supabase client and types
├── queries/keys.ts     # TanStack Query key factories
├── models/             # Pure business logic
├── hooks/              # React hooks
└── constants/          # Shared constants and formatters

components/             # React components (no direct data fetching)
screens/                # Screen components
app/                    # Expo Router pages
docs/                   # Documentation
scripts/                # Build/seed scripts
```

## Key Principles

1. **Single source of truth**: All env vars in `lib/config/env.ts`
2. **Data layer isolation**: Components never import Supabase directly
3. **Query key factories**: No string literal query keys
4. **Context-based IDs**: No hardcoded org/tenant IDs in runtime code
5. **300 line limit**: Split files before they grow too large
EOF
echo "✅ Created docs/ARCHITECTURE.md"
fi

# Create index files
echo "export * from './env';" > lib/config/index.ts
echo "export * from './client';" > lib/supabase/index.ts
echo "export * from './keys';" > lib/queries/index.ts
echo "export * from './units';" > lib/constants/index.ts
echo "export * from './useAuth';" > lib/hooks/index.ts
echo "export * from './types';" > lib/models/index.ts
echo "export * from './constants';" > lib/layout/index.ts
echo "export * from './useLayout';" >> lib/layout/index.ts

echo ""
echo "✅ /lib structure scaffolded!"
echo ""
echo "Next steps:"
echo "1. Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts"
echo "2. Review lib/config/env.ts and add any missing env vars"
echo "3. Add domain-specific queries to lib/queries/"
echo "4. Add domain-specific hooks to lib/hooks/"
echo "5. See RESPONSIVE_LAYOUT_SYSTEM.md for remaining layout files"
echo ""
