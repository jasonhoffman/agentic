# Pre-Launch Stabilization

## Why This Phase Exists

You've done this before. The last two weeks before launch, the rules change. No new features. No refactoring. Just fix what's broken, verify it works, ship it.

This is the same discipline, encoded for AI. Without it, agents will helpfully "improve" things right before launch. This tells them: don't.

---

## Current Mode: LAUNCH FREEZE

The app is feature-complete. We are stabilizing for release.

---

## Timeline & Milestones

| Date | Milestone | Focus |
|------|-----------|-------|
| [Date] | Stabilization Start | Fix bugs, verify core flows |
| [Date] | Alpha | Invite testers |
| [Date] | Beta | Broader availability |
| [Date] | Production Launch | Live and in use |
| [Date] | [Post-launch event] | App must be stable by this date |

---

## Launch Freeze Rules

1. **Fix only what is explicitly reported** — No improvements, no "while I'm here" changes
2. **Minimal diff principle** — Smallest change that fixes the bug
3. **One fix per task** — Complete it, test it, commit it
4. **No new dependencies** — Don't add packages
5. **No schema changes** — Unless critical fix requires it (flag explicitly)
6. **Verify before done** — Type check, tests, manual verification
7. **When uncertain, ask** — "This might affect X. Proceed?"
8. **Commit format** — `fix: [what was broken]`

### What "Done" Looks Like

- The reported bug is fixed
- Nothing else changed
- Tests pass
- Stated exactly what files changed and why

---

## Verification Gate

Run at the start of every session:

```bash
npx tsc --noEmit          # Type check
npm test                   # All tests pass
# [Add project-specific health checks]
```

If any fail, fix before doing anything else.

### Before Each Change (LSP-First)

1. **Find all references** — How many places use this? What's the blast radius?
2. **Check type signature** — What flows in and out?
3. **Make the minimal change**
4. **Check diagnostics** — Did I introduce errors elsewhere?
5. **Full verification** — Type check + tests

---

## Platform Testing Matrix

| Platform | URL/Method | Priority | When |
|----------|------------|----------|------|
| [Primary platform] | [URL or method] | Primary | Every fix |
| [Secondary platform] | [URL or method] | Secondary | Verify no regression |
| [Other platforms] | [URL or method] | Low | Before beta |

### Platform Strategy

- All testing focuses on [primary platform]
- After fixes, smoke test on [secondary] to ensure no regression
- Don't chase [secondary]-only bugs unless they affect [primary] too
- [Deferred platform] polish happens post-launch

---

## Bug Triage Process

When a bug is reported:

1. **Reproduce** — Confirm the issue on affected platform(s)
2. **Isolate** — Identify the minimal code path
3. **Fix** — Smallest change that resolves it
4. **Verify** — Type check + tests + manual test the fix
5. **Commit** — `fix: [what was broken]`
6. **Deploy** — Staging first, then production

---

## Manual Testing Checklist

### Quick Regression (5 min) — Before Each Deploy

- [ ] [Critical flow 1]
- [ ] [Critical flow 2]
- [ ] [Critical flow 3]

### Full Regression (30 min) — Before Production Release

- [ ] [Full flow 1]
- [ ] [Full flow 2]
- [ ] [Full flow 3]
- [ ] [Edge cases]

---

## Deployment Commands

```bash
# Staging
[staging deploy command]

# Production
[production deploy command]

# Rollback (if critical issue)
[rollback command]
```

---

## Test Accounts

| Email | Role | Use For |
|-------|------|---------|
| [account] | [role] | [purpose] |
| [account] | [role] | [purpose] |

---

## UX North Star

[What experience are you protecting? What should every interaction feel like?]

Examples:
- Every interaction should feel faster than the old way
- Users should want to open the app
- Value must be obvious within first 30 seconds
- No friction, no confusion, no dead ends

---

## Stabilization Week Activities

### Daily Workflow

1. **Morning** — Run verification gate (type check, tests)
2. **Active** — Fix reported bugs using minimal diff approach
3. **Per fix** — Deploy to staging → test on primary platform
4. **Evening** — Smoke test on secondary platform

### Testing Priority

1. [Most critical flow]
2. [Second most critical]
3. [Third most critical]
4. [Onboarding / first-time experience]
5. [Realistic daily use]

---

## Alpha/Beta Prep

Before inviting testers:

- [ ] Production deployed and stable
- [ ] Test accounts verified working
- [ ] Onboarding flow tested (new user signs up)
- [ ] Feedback channel prepared (email? form?)
- [ ] Known quirks documented for testers

---

## Type Safety in Launch Freeze

### Principles

- **Type errors are bugs** — Blocking, not warnings
- **`as any` requires approval** — Every cast is a red flag
- **`// @ts-ignore` requires justification** — Document why, or fix it
- **Impact assessment before changes** — If 10+ references, report before proceeding

### Current Type Topology

| Domain | Source | Notes |
|--------|--------|-------|
| Database | [e.g., Supabase-generated] | |
| API | [e.g., tRPC / hooks] | |
| Validation | [e.g., Zod schemas] | |
| UI | [Inferred from above] | |

---

## What NOT To Do

- No new features
- No refactoring
- No "while I'm here" improvements
- No new dependencies
- No schema changes (unless critical)
- No adding tests for coverage (only for fixing bugs)

---

## Key Files

- `docs/_PRELAUNCH_STABILIZATION.md` — This file
- `docs/_MANUAL_TESTING.md` — Manual test checklist
- `docs/_DEPLOYMENT.md` — Deployment commands
- [Other relevant files]
