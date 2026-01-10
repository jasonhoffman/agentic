# Development Environment Setup

> **Comprehensive guide for setting up the development environment**
>
> Covers all services, tools, and integrations required for full functionality.
>
> **Last Updated:** [Date]

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Git Configuration](#git-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Mobile Development](#mobile-development)
7. [Third-Party Services](#third-party-services)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 10+ | Package manager |
| Git | 2.40+ | Version control |
| GitHub CLI (`gh`) | 2.40+ | PR/issue management |
| [Platform CLI] | Latest | [Platform-specific tooling] |

### Platform-Specific

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew packages
brew install node git gh
```

**Windows (WSL2 required):**
```bash
# In WSL2 Ubuntu
sudo apt update && sudo apt install -y nodejs npm git
npm install -g gh
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
```

---

## Quick Start

```bash
# 1. Clone repository (use SSH)
git clone git@github.com:[org]/[repo].git
cd [repo]

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables section)

# 4. Verify setup
npm test                    # Run tests
npx tsc --noEmit           # Type check

# 5. Start development
npm run dev                 # Start development server
```

---

## Git Configuration

### SSH Keys (Required)

SSH is required for Claude Code sessions and avoids OAuth token issues.

**Check if configured:**
```bash
ssh -T git@github.com
# Should say: "Hi [username]! You've successfully authenticated..."
```

**Set up SSH:**
```bash
# 1. Generate key
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519 -N ""

# 2. Start agent and add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copy public key
cat ~/.ssh/id_ed25519.pub
# Add to: https://github.com/settings/ssh/new

# 4. Test connection
ssh -T git@github.com

# 5. Set remote to SSH
git remote set-url origin git@github.com:[org]/[repo].git
```

### GitHub CLI

```bash
gh auth login
# Choose: GitHub.com -> SSH -> Login with browser

gh auth status  # Verify
```

---

## Environment Variables

### Client-Side Variables (`.env.local`)

Create `.env.local` in project root:

```bash
# =============================================================================
# CORE SERVICES (Required)
# =============================================================================
# [SERVICE_NAME]_URL=https://...
# [SERVICE_NAME]_KEY=...

# =============================================================================
# AUTHENTICATION (Required)
# =============================================================================
# Configure at: [provider console URL]
# [AUTH_PROVIDER]_CLIENT_ID=...

# =============================================================================
# OPTIONAL SERVICES
# =============================================================================
# [SERVICE]_API_KEY=...
```

### Server-Side Variables

Set via your deployment platform's secrets management:

```bash
# Core services (typically auto-injected)
# SERVICE_URL=...
# SERVICE_KEY=...

# Third-party integrations
# [SERVICE]_API_KEY=...
# [SERVICE]_WEBHOOK_SECRET=...
```

---

## Database Setup

### Local Development

```bash
# Install CLI
npm install -g [database-cli]

# Login
[database-cli] login

# Link to project
[database-cli] link --project-ref [project-id]

# Pull remote schema
[database-cli] db pull

# Run migrations locally
[database-cli] db reset

# Deploy functions
[database-cli] functions deploy [function-name]
[database-cli] functions deploy --all  # Deploy all

# View function logs
[database-cli] functions logs [function-name] --tail
```

### Direct Database Access

```bash
# Get connection string from Dashboard
psql "postgresql://[user]:[password]@[host]:[port]/[database]"
```

---

## Mobile Development

### Setup

```bash
# Login to build service
npx eas-cli login

# Verify login
npx eas-cli whoami
```

### Development Modes

| Command | Use Case |
|---------|----------|
| `npx expo start` | Local development (same network) |
| `npx expo start --tunnel` | Physical devices on different networks |
| `npx expo start --web` | Web browser development |
| `npx expo start --ios` | iOS Simulator |
| `npx expo start --android` | Android Emulator |

### Build Profiles

| Profile | Purpose | Distribution |
|---------|---------|--------------|
| `development` | Dev builds with dev-client | Internal |
| `preview` | Testing builds | Internal/TestFlight |
| `production` | Release builds | App Store/Play Store |

```bash
# Create builds
npx eas-cli build --profile production --platform ios
npx eas-cli build --profile production --platform android

# OTA updates (no new build required)
npx eas-cli update --channel production --message "fix: description"

# List recent builds
npx eas-cli build:list --limit 5
```

---

## Third-Party Services

### Service Setup Checklist

For each integration:

1. [ ] Create account at provider
2. [ ] Get API keys from dashboard
3. [ ] Configure webhook endpoints (if applicable)
4. [ ] Add secrets to environment
5. [ ] Test integration

### Common Integrations

| Service | Purpose | Dashboard |
|---------|---------|-----------|
| [Auth Provider] | Authentication | [URL] |
| [Database] | Data storage | [URL] |
| [Payments] | Payment processing | [URL] |
| [Email] | Transactional email | [URL] |
| [Analytics] | Usage analytics | [URL] |
| [Error Tracking] | Error monitoring | [URL] |

---

## Testing

### Test Suite

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
npm run test:ci             # CI mode
```

### Test Accounts

| Email | Role | Auth Method |
|-------|------|-------------|
| [test-email] | [role] | [method] |

### Test Organizations/Environments

| Environment | ID | Purpose |
|-------------|-----|---------|
| [Staging] | `...` | Internal testing |
| [Production] | `...` | Live environment |

---

## Troubleshooting

### Git Issues

**"Write access to repository not granted" (403):**
```bash
# Option 1: Refresh auth
gh auth refresh -h github.com -s repo
gh auth setup-git
git push

# Option 2: Switch to SSH (permanent fix)
git remote set-url origin git@github.com:[org]/[repo].git
```

**"Permission denied (publickey)":**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Build Issues

**Bundler issues:**
```bash
npm start -- --clear  # Clear cache
rm -rf node_modules && npm install
```

**Type errors:**
```bash
npx tsc --noEmit  # Check types
```

### Environment Variable Issues

**Variables not loading:**
- Ensure `.env.local` exists (not `.env`)
- Restart dev server after changes
- Client-side variables must have correct prefix

---

## Quick Reference

```bash
# === DAILY DEVELOPMENT ===
npm run dev                          # Start dev server
npm test                             # Run tests
npx tsc --noEmit                     # Type check

# === GIT ===
git push origin main                 # Push changes
gh pr create                         # Create PR

# === BUILDS ===
npx eas-cli build --profile development --platform ios    # Dev build
npx eas-cli update --channel production --message "..."   # OTA update

# === DATABASE ===
[cli] functions deploy --all         # Deploy all functions
[cli] functions logs [name] --tail   # View logs
[cli] db pull                        # Pull remote schema

# === DEBUGGING ===
npx expo-doctor                      # Check for issues
npx eas-cli build:list --limit 5     # Recent builds
```

---

## Service URLs

| Service | Dashboard URL |
|---------|---------------|
| [Service 1] | [URL] |
| [Service 2] | [URL] |

---

*Keep this document updated as the development environment evolves.*
