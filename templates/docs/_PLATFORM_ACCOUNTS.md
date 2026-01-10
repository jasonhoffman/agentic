# Platform Accounts & API Setup

> **Status:** [Active/Pending]
> **Last Updated:** [Date]

---

## Quick Reference

| Platform | Purpose | Status |
|----------|---------|--------|
| [Platform 1] | [Purpose] | ✓ Configured |
| [Platform 2] | [Purpose] | Pending |
| [Platform 3] | [Purpose] | ✓ Working |

---

## Authentication Providers

### [Auth Provider 1]

| Field | Value |
|-------|-------|
| Provider | [Name] |
| Console | [Dashboard URL] |
| Client ID | `[client-id]` |

**Setup Steps:**
1. Go to [Console URL]
2. Create OAuth application
3. Configure redirect URIs:
   ```
   https://[your-domain]/auth/callback
   ```
4. Get credentials and add to environment

**Credentials Location:** [Where stored]
- `[VAR_NAME]` ✓
- `[VAR_NAME]` ✓

### [Auth Provider 2]

| Field | Value |
|-------|-------|
| Provider | [Name] |
| Console | [Dashboard URL] |

**Setup Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Payment Services

### [Payment Provider]

| Field | Value |
|-------|-------|
| Dashboard | [URL] |
| Mode | [Test/Live] |

**Setup:**
1. Create account at [URL]
2. Get API keys from Dashboard > Developers > API keys
3. Create webhook endpoint: `https://[your-domain]/webhooks/[provider]`
4. Subscribe to events: `[event.type]`, `[event.type]`
5. Save webhook signing secret

**Credentials Location:** [Where stored]
- `[SECRET_KEY]` ✓
- `[WEBHOOK_SECRET]` ✓

**Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## Video/Media Services

### [Video Platform]

| Field | Value |
|-------|-------|
| Plan | [Plan name] |
| Dashboard | [URL] |
| Developer Portal | [URL] |

**Credentials Location:** [Where stored]
- `[ACCESS_TOKEN]` ✓
- `[CLIENT_ID]` ✓

**API Usage Example:**

```typescript
// Example API call
const response = await fetch('[api-url]', {
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});
```

---

## Email Services

### [Email Provider]

| Field | Value |
|-------|-------|
| Dashboard | [URL] |
| Verified Domain | [domain] |

**Setup:**
1. Create account
2. Verify domain
3. Generate API key
4. Add to secrets

**Credentials Location:** [Where stored]
- `[API_KEY]` ✓

---

## Analytics & Monitoring

### [Error Tracking Service]

| Field | Value |
|-------|-------|
| Dashboard | [URL] |
| Project | [Project name] |

**Configuration:**
- [Platform 1]: [Status]
- [Platform 2]: [Status]

**Credentials Location:** `[file path]`

### [Analytics Service]

| Field | Value |
|-------|-------|
| Project ID | `[project-id]` |
| Console | [URL] |

**Configuration Files:**
- [Platform 1]: `[config file]`
- [Platform 2]: `[config file]`

---

## AI Services

### [AI Provider]

| Field | Value |
|-------|-------|
| Dashboard | [URL] |
| Models Used | [Model names] |

**Setup:**
1. Create account
2. Generate API key
3. Add to secrets

**Credentials Location:** [Where stored]
- `[API_KEY]` ✓

**Rate Limits:**
- [Limit description]

---

## Third-Party Integrations

### [Integration Name]

| Field | Value |
|-------|-------|
| Dashboard | [URL] |
| OAuth App | [App name] |

**OAuth Flow:**
```typescript
// 1. Generate auth URL
const authUrl = `https://[provider]/oauth/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${CALLBACK_URL}&` +
  `scope=[scopes]`;

// 2. Exchange code for tokens (in callback handler)
// 3. Store tokens securely
```

**Credentials Location:** [Where stored]
- `[CLIENT_ID]` ✓
- `[CLIENT_SECRET]` ✓

---

## Environment Variables Summary

### Local Environment (`.env.local`)

```bash
# Core Services
[PREFIX]_[SERVICE]_URL=[value]
[PREFIX]_[SERVICE]_KEY=[value]

# Auth
[PREFIX]_[AUTH]_CLIENT_ID=[value]
```

### Server-Side Secrets

```bash
# Core
[SERVICE]_KEY=[value]

# Third-Party
[PROVIDER]_API_KEY=[value]
[PROVIDER]_SECRET=[value]
```

**View current secrets:**
```bash
[cli-command] secrets list
```

**Set a secret:**
```bash
[cli-command] secrets set KEY=value
```

---

## Staging/Development Environments

| Resource | Purpose |
|----------|---------|
| [Staging Env] | Internal testing |
| [Preview Channel] | Pre-release testing |

---

## Account Access

### Admin Access

| Service | Access Method |
|---------|---------------|
| [Service 1] | [How to access] |
| [Service 2] | [How to access] |

### API Keys Rotation

When rotating keys:
1. Generate new key in provider dashboard
2. Update secret: `[cli] secrets set [KEY]=new_value`
3. Verify functionality
4. Revoke old key in provider dashboard

---

*Update this document as accounts are configured or credentials change.*
