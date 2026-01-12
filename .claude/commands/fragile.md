---
description: Check danger zones before touching risky code — read _FRAGILE.md and warn
allowed-tools: Read, Glob, Grep
---

# /fragile — Danger Zone Check

Safety check before touching risky code. Prevents disasters.

## When to Use

- Before modifying auth, payments, or other critical paths
- Before touching code you're unfamiliar with
- When a change feels risky
- Automatically suggested when files match danger zones

## Process

1. **Read _FRAGILE.md**
   - Load the project's danger zone documentation
   - If file doesn't exist, note that no danger zones are documented

2. **Check current context**
   - What files are being modified?
   - What area of the codebase?

3. **Match against danger zones**
   - Compare current work to documented risk areas
   - Check the risk heatmap

4. **Report findings**

## Output Format

### If Danger Zone Matched

```
⚠️  DANGER ZONE: [Area Name]

Risk Level: 🔴 High / 🟡 Medium

Why it's fragile:
- [Reason 1]
- [Reason 2]

Historical issues:
- [Past incident and how it was fixed]

Before proceeding:
- [ ] [Precaution 1]
- [ ] [Precaution 2]
- [ ] [Required test/verification]

Files involved:
- `path/to/file.ts` — [what it does]

Gotchas:
- [Non-obvious thing to watch out for]
```

### If No Danger Zone

```
✓ No known danger zones affected.

Current work touches:
- [file1.ts]
- [file2.ts]

These files are not in documented danger zones.
Standard development practices apply.
```

### If _FRAGILE.md Missing

```
⚠️  No _FRAGILE.md found.

Danger zones aren't documented for this project.
Consider creating docs/_FRAGILE.md to track:
- Areas that have caused incidents
- Complex multi-service integrations
- Security-critical code paths

Proceeding without danger zone awareness.
```

## Example Output

```
⚠️  DANGER ZONE: Authentication Flow

Risk Level: 🔴 High

Why it's fragile:
- Multi-service (Supabase Auth + OAuth providers)
- State machine with many edge cases
- Security-critical — bugs can be exploited

Historical issues:
- v1.2: Token refresh caused logout loops (fixed with retry logic)
- v1.5: Session not cleared on password change (fixed in middleware)

Before proceeding:
- [ ] Read existing tests in `__tests__/auth/`
- [ ] Understand all auth state transitions
- [ ] Test with expired tokens
- [ ] Get security review for auth changes

Files involved:
- `lib/auth.ts` — Core auth logic
- `lib/supabase.ts` — Token storage with chunking
- `middleware.ts` — Session validation

Gotchas:
- SecureStore has 2048 byte limit — tokens are chunked
- Profile ID ≠ Auth User ID for pre-staged profiles
```

## Automatic Triggers

Consider running /fragile automatically when:
- File path matches a danger zone pattern
- Commit touches auth/*, payment/*, security/*
- PR modifies RLS policies
