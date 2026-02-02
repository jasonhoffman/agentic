# Human Instructions

> Everything a human needs to do to bootstrap a project. Step-by-step for browser stuff (dummy mode).

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
npm install @supabase/supabase-js @tanstack/react-query @dotenvx/dotenvx
npm install -D @types/react
```

---

## 4. dotenvx Setup

Encrypted secrets management. Commit `.env` to git, keep private key separate.

1. Install CLI:
```bash
brew install dotenvx/brew/dotenvx
```

2. Create `.env` with your secrets:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

3. Encrypt:
```bash
dotenvx encrypt
```

4. This creates:
   - `.env` — now encrypted, safe to commit
   - `.env.keys` — private keys, add to `.gitignore`

5. Add to `.gitignore`:
```bash
.env.keys
```

6. Share `DOTENV_PRIVATE_KEY` securely with team (not in git)

Run commands with decryption:
```bash
dotenvx run -- npm start
```

Or set `DOTENV_PRIVATE_KEY` in your shell and use normally.

---

## 5. Supabase Setup

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

## 6. MCP Servers Setup

```bash
cp -r ~/.agentic/mcp-servers ./
cp ~/.agentic/.mcp.json ./
cd mcp-servers/multimodel && npm install && cd ..
cd serverless && npm install && cd ../..
```

Restart Claude Code after setup.

---

## 7. Supabase Vault (Optional)

> **Skip this if solo.** dotenvx handles secrets. Vault is for teams or centralized key management across machines.

### When to use Vault

- Team needs shared access to API keys
- Multiple machines need same keys without sharing private key
- Want keys stored in Supabase rather than git

### Setup

1. Supabase Dashboard → SQL Editor
2. Run contents of `~/.agentic/supabase/get_api_key.sql`

3. Supabase Dashboard → Settings → Vault
4. Add secrets:
   - `openai_api_key` → your OpenAI key
   - `gemini_api_key` → your Gemini key
   - `voyage_api_key` → your Voyage key

5. MCP servers need service role key to access Vault. Add to `.env`:
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

Get service role key from: Supabase Dashboard → Settings → API → service_role (secret)

The MCP servers try Vault first, fall back to dotenvx/.env automatically.

---

## 8. Modal Setup

1. Create account at https://modal.com

2. Install Modal:
```bash
# macOS
brew install pipx
pipx install modal

# Ubuntu/WSL
sudo apt update && sudo apt install python3 python3-pip
pip install modal
```

4. Setup and authenticate:
```bash
python3 -m modal setup
```

5. Verify:
```bash
modal app list
```

### Optional: Create modal/ directory
```bash
mkdir modal
```

Deploy functions with `modal deploy modal/your-function.py`

---

## 9. Google OAuth Setup (if needed)

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

## 10. Third-Party Services

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

## 11. App Store Setup (if native)

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

## 12. EAS Build Configuration

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

## 13. Responsive Layout

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

## 14. Verification

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
