# Releases & Deployment

> **Canonical reference for all releases and deployments.**
>
> For detailed release notes, see **[_RELEASE_NOTES.md](./_RELEASE_NOTES.md)**.
>
> **Last Updated:** [Date]

---

## Current Deployments

| Platform | Version | Status | Channel |
|----------|---------|--------|---------|
| [Platform 1] | X.Y.Z | [Status] | [Channel] |
| [Platform 2] | X.Y.Z | [Status] | [Channel] |
| Web | X.Y.Z | [Status] | — |

### Current OTA-Capable Builds

> **Before pushing OTA**, verify fingerprint matches

| Platform | Fingerprint | Version | Built |
|----------|-------------|---------|-------|
| [Platform 1] | `xxxx` | vX.Y.Z | [Date] |
| [Platform 2] | `xxxx` | vX.Y.Z | [Date] |

---

## Mental Model: Web vs Mobile

Think of mobile releases as **two separate deployments**:

| Concept | Web Equivalent | Mobile Equivalent |
|---------|---------------|-------------------|
| **Native Build** | Deploying server/infrastructure | Building app binary |
| **OTA Update** | Deploying frontend code | Pushing JS bundle updates |
| **Store** | DNS/CDN configuration | Distribution channel |

```
WEB:        Code → Build → Deploy → Users get it instantly

MOBILE:     Code → Build → Store Review → Users download → THEN you can OTA
                   ↓
            Once approved, OTA updates are instant (like web!)
```

**The magic:** After initial store approval, JS updates push instantly without review.

---

## Version Management

### Convention

```
X.Y.0 = Native build (submitted to stores)
X.Y.Z = OTA patch to that native build
```

**Examples:**
- `2.2.0` → Native build submitted to stores
- `2.2.1` → OTA update #1 to 2.2.0 users
- `2.3.0` → New native build (requires store submission)

### Configuration

```json
// eas.json (or equivalent)
{
  "cli": { "appVersionSource": "remote" },
  "build": { "production": { "autoIncrement": true } }
}
```

---

## Release Scenarios

### Scenario 1: Bug Fix / Small Change (OTA Only)

**When:** JS/TS changes, no native dependencies changed.

```bash
# 1. Test on preview first
npx eas-cli update --channel preview --message "fix: description"

# 2. Push to production
npx eas-cli update --channel production --message "fix: description"
```

**Time:** ~2 minutes. No review needed.

### Scenario 2: New Version Release (Build + Submit)

**When:** New features, want new version visible to users.

```bash
# 1. Bump version in config
#    "version": "X.Y.0" → "X.Y+1.0"

# 2. Commit and tag
git add [config-file] && git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z && git push && git push --tags

# 3. Build both platforms
npx eas-cli build --profile production --platform all

# 4. Submit to stores (after build completes)
npx eas-cli submit --platform ios --latest
npx eas-cli submit --platform android --latest

# 5. Deploy web
npx eas-cli deploy --prod
```

### Scenario 3: Hotfix to Production

```bash
# Option A: OTA (if no native changes) - instant
npx eas-cli update --channel production --message "hotfix: critical bug"

# Option B: New build (if native changes required)
npx eas-cli build --profile production --platform all
npx eas-cli submit --platform ios --latest
# Request expedited review if urgent
```

---

## Decision Tree

```
START: I made changes and want to release
         │
         ▼
    Did I change native code?
    (npm package with native, config, SDK)
         │                    │
        YES                   NO
         │                    │
         ▼                    ▼
    Need new builds     Significant release?
         │              (want version in Settings)
         │                   │           │
         │                  YES          NO
         │                   │           │
         ▼                   ▼           ▼
    ┌─────────────┐   ┌─────────┐   ┌─────────┐
    │ Bump version│   │ Bump    │   │ Just    │
    │ Build both  │   │ version │   │ push    │
    │ Submit      │   │ Build   │   │ OTA     │
    └─────────────┘   └─────────┘   └─────────┘
```

---

## Quick Reference Commands

```bash
# === STATUS ===
npx eas-cli build:list --limit 5              # Recent builds
npx eas-cli update:list --channel production  # Recent OTAs
npx eas-cli build:version:get --platform ios  # Current remote version

# === DEVELOPMENT ===
npm run dev                                    # Local dev
npx eas-cli build --profile development --platform all    # Dev builds

# === PREVIEW/STAGING ===
npx eas-cli build --profile preview --platform all        # New preview builds
npx eas-cli update --channel preview --message "..."      # OTA to preview

# === PRODUCTION ===
npx eas-cli build --profile production --platform all     # New prod builds
npx eas-cli submit --platform ios --latest                # Submit iOS
npx eas-cli submit --platform android --latest            # Submit Android
npx eas-cli update --channel production --message "..."   # OTA to prod

# === ROLLBACK ===
npx eas-cli update:republish --group <id> --channel production  # OTA rollback
```

---

## Pre-Deployment Checklist

Before any production deployment:

- [ ] Tests passing: `npm test`
- [ ] TypeScript clean: `npx tsc --noEmit`
- [ ] Changes committed and pushed to `main`
- [ ] Tested on preview first (for significant changes)

---

## Build Profiles

| Stage | Profile | Channel | Output |
|-------|---------|---------|--------|
| **Development** | `development` | — | Dev builds |
| **Preview** | `preview` | `preview` | Test builds |
| **Production** | `production` | `production` | Release builds |

---

## Web Deployments

```bash
# Staging
npx eas-cli deploy --alias staging
# URL: https://[project]--staging.[host]/

# Production
npx eas-cli deploy --prod
# URL: https://[your-domain]/
```

---

## Store Checklists

### iOS (TestFlight / App Store)

1. [ ] Bump `version` in config
2. [ ] `npx eas-cli build --profile production --platform ios`
3. [ ] Wait for build
4. [ ] `npx eas-cli submit --platform ios --latest`
5. [ ] Build appears in TestFlight
6. [ ] For App Store: Add release notes, submit for review

### Android (Google Play)

1. [ ] Bump `version` in config
2. [ ] `npx eas-cli build --profile production --platform android`
3. [ ] Wait for build
4. [ ] `npx eas-cli submit --platform android --latest`
5. [ ] In Play Console: Add release notes, rollout

---

## Git Tagging

```bash
# Tag a release
git tag vX.Y.Z
git push --tags

# List recent tags
git tag --sort=-version:refname | head -10

# Commits since last release
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

---

## Backend/API Deployments

```bash
# Deploy single function
[cli] functions deploy <function-name>

# Deploy all functions
[cli] functions deploy --all
```

### Functions Requiring Special Config

| Function | Reason | Command |
|----------|--------|---------|
| [function] | [Why special] | `[command]` |

---

## URLs Reference

| Type | Staging | Production |
|------|---------|------------|
| **Web App** | [staging URL] | [production URL] |
| **Dashboard** | — | [dashboard URL] |
| **Deep Links** | — | `[scheme]://` |

---

## Troubleshooting

### OTA update not appearing

1. Check user's version matches
2. Verify channel: `npx eas-cli update:list --channel production`
3. App needs restart to pick up update
4. Check fingerprint matches

### "Version already exists" error

```bash
npx eas-cli build:version:get --platform ios
npx eas-cli build:version:set --platform ios  # Set higher
```

### Development build not connecting

```bash
# Clear cache
npm start -- --clear

# Verify build profile
npx eas-cli build:list --limit 5
```

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| **X.Y.Z** | [Date] | **"[Theme]"** — [Summary] |
| **X.Y.0** | [Date] | **"[Theme]"** — [Summary] |

> For detailed notes, see **[_RELEASE_NOTES.md](./_RELEASE_NOTES.md)**.

---

*Update this document when deployment procedures change.*
