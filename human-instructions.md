# Human Instructions

> Everything a human needs to do to bootstrap a React Native + Supabase project.

---

## 1. Create Project

```bash
npx create-expo-app my-app --template expo-template-blank-typescript
cd my-app
```

## 2. Scaffold /lib Structure

```bash
cp ~/.agentic/templates/scaffold-lib.sh ./
chmod +x scaffold-lib.sh
./scaffold-lib.sh
```

This creates the complete `/lib` structure with working starter files.

## 3. Install Dependencies

```bash
npm install @supabase/supabase-js @tanstack/react-query
npm install -D @types/react
```

---

## 4. Supabase Setup

1. Create project at https://supabase.com
2. Get URL and anon key from Settings → API
3. Create `.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
```

4. Generate types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

5. Configure RLS policies in Supabase Dashboard

---

## 5. Google OAuth Setup

### Supabase Dashboard
1. Authentication → Providers → Google
2. Enable Google provider
3. Add client IDs from Google Cloud Console

### Google Cloud Console
1. Create project at https://console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Create separate clients for:
   - Web application
   - iOS app (bundle ID)
   - Android app (package name + SHA-1)

4. Add to `.env.local`:

```bash
EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxx
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx
```

---

## 6. Third-Party Services

### Priority 1: Core

| Service | Setup |
|---------|-------|
| **Supabase** | Project created, RLS configured |
| **EAS** | `npm install -g eas-cli && eas build:configure` |

### Priority 2: Essential

| Service | Setup |
|---------|-------|
| **Sentry** | Create project, get DSN, add `EXPO_PUBLIC_SENTRY_DSN` |
| **Resend** | Verify domain, generate API key |

### Priority 3: Payments

| Service | Setup |
|---------|-------|
| **Stripe** | Account verified, webhooks configured |
| **RevenueCat** | Connected to App Store Connect and Google Play |

### Server Secrets (Supabase Edge Functions)

```bash
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=xxx
npx supabase secrets set STRIPE_SECRET_KEY=xxx
npx supabase secrets set STRIPE_WEBHOOK_SECRET=xxx
npx supabase secrets set RESEND_API_KEY=xxx
npx supabase secrets set ANTHROPIC_API_KEY=xxx
```

---

## 7. App Store Setup

### iOS (App Store Connect)

1. Enroll in Apple Developer Program ($99/year)
2. Create app record
3. Configure TestFlight
4. Generate push notification certificate
5. Add provisioning profiles to EAS

### Android (Google Play Console)

1. Create developer account ($25 one-time)
2. Create app
3. Set up internal testing track
4. Generate service account JSON for automated publishing

---

## 8. EAS Build Configuration

Create `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "ios": { "autoIncrement": "buildNumber" },
      "android": { "autoIncrement": "versionCode" }
    }
  }
}
```

---

## 9. Responsive Layout

Build responsive from day one. iPad multi-pane and web layouts must work from first commit.

The scaffold script creates basic layout files. For full implementation:

**Required files in `/lib/layout/`:**
- `constants.ts` — breakpoints, widths
- `useLayout.ts` — layout mode hook
- `LayoutShell.tsx` — app wrapper
- `useAdaptiveNavigation.ts` — navigation that adapts
- `AdaptiveModal.tsx` — modals that adapt
- `ResponsiveGrid.tsx` — auto-column grid

**Test on:**
- iPhone SE (compact)
- iPad portrait (medium)
- iPad landscape (expanded)
- Web at various widths

---

## 10. Verification

Run these checks before shipping:

```bash
# No direct env access outside lib/config
grep -rn "process.env.EXPO_PUBLIC" --include="*.ts" --include="*.tsx" . | grep -v "lib/config" | wc -l
# Should be 0

# No direct supabase client creation outside lib/supabase
grep -rn "createClient" --include="*.ts" --include="*.tsx" . | grep -v "lib/supabase" | wc -l
# Should be 0

# No hardcoded org/tenant IDs
grep -rn '"org_\|"tenant_' --include="*.ts" --include="*.tsx" . | grep -v "scripts/\|seed\|test" | wc -l
# Should be 0

# All files under 800 lines
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 800 {print}'
# Should be empty
```

---

## Quick Reference

### Environment Variables (Public)

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
```

### Directory Structure

```
lib/
├── config/env.ts           # ALL env vars
├── supabase/
│   ├── client.ts           # Single Supabase instance
│   └── types.ts            # Generated DB types
├── queries/keys.ts         # TanStack Query key factories
├── constants/units.ts      # Formatters
├── models/                 # Pure business logic
├── layout/                 # Responsive layout system
└── hooks/                  # Domain hooks
```
