# /sync — Context Synchronization

Full context recovery after a break or context switch. More thorough than /sup.

## When to Use

- Returning after hours/days away
- Switching between projects
- After someone else worked on the codebase
- When you feel out of sync with project state

## What to Read

Read ALL Tier 1 and Tier 2 files:

**Tier 1 (Always):**
1. `docs/_SESSION_MEMO.md` — Recent session history
2. `docs/_AGENTS.md` — Active work, handoffs, decisions
3. `docs/_TODAY.md` — Current priorities

**Tier 2 (Context):**
4. `docs/_FRAGILE.md` — Danger zones relevant to current work
5. `docs/_DEVELOPMENT_WORKFLOW.md` — How changes should be made
6. `CLAUDE.md` — Project-specific context and gotchas

**Also check:**
7. `git log --oneline -10` — Recent commits
8. `git status` — Uncommitted changes

## Output Format

```
Synced: [Project Name]

---

## Recent History

Last session ([date]):
- [What was completed]
- [Key decisions made]

Commits since then:
- [hash] [message]
- [hash] [message]

---

## Current State

Active work:
- [Task] — [owner] — [status]

Blocked:
- [What] — waiting on [what/whom]

Pending decisions:
- [Decision needed] — [options]

---

## Danger Zones

Relevant to current work:
- [Area] — [risk level] — [key gotcha]

---

## Uncommitted Changes

[git status summary or "Working tree clean"]

---

## Suggested Focus

Based on state:
1. [Priority 1 — why]
2. [Priority 2 — why]

Ready to continue.
```

## Difference from /sup

| /sup | /sync |
|------|-------|
| Quick glance (5 seconds) | Full context (30 seconds) |
| 3 files | 6+ files + git |
| Current state only | History + state + suggestions |
| Use frequently | Use after breaks |

## Example Output

```
Synced: Judoka AI

---

## Recent History

Last session (Jan 7):
- Fixed Kid Mode indicators across all tabs
- Added AI youth safety guidelines
- Fixed onboarding pendingOrg persistence

Commits since then:
- beac2b9 fix(onboarding): persist pendingOrg to AsyncStorage
- 3a1c2d4 feat(ai): add youth safety guidelines
- 9f8e7d6 fix(kid-mode): show indicators on all tabs

---

## Current State

Active work:
- Platform Launch 2.0 Phase 5 — QA — pending

Blocked:
- SEO meta tags (F11) — waiting on SSR setup

Pending decisions:
- None

---

## Danger Zones

Relevant to current work:
- Auth Flow — 🔴 High — token chunking in SecureStore
- Onboarding — 🟡 Medium — 8-step wizard, state persistence critical

---

## Uncommitted Changes

Working tree clean

---

## Suggested Focus

Based on state:
1. Q1-Q2: RLS policy tests — blocking QA phase
2. T1: Dojo owner guide — can run parallel with QA

Ready to continue.
```
