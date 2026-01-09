# /sup — Quick Status

Fast context recovery. Get up to speed in 5 seconds.

## What to Read

1. **_SESSION_MEMO.md** — What happened last session
2. **_AGENTS.md** — Active work, blockers, handoffs
3. **_TODAY.md** — Current priorities (if exists)

## Output Format

```
Status:

Last session: [Brief summary of what was completed]

Active:
- [Task 1] — [status]
- [Task 2] — [status]

Blocked:
- [Blocker] — waiting on [what]

Recent:
- [Completed item 1]
- [Completed item 2]

Next: [Suggested focus based on context]
```

## Rules

- **Be brief** — 5-10 lines max
- **Highlight blockers** — These need attention
- **Suggest next step** — Don't leave it open-ended
- **Skip empty sections** — If nothing blocked, don't mention blockers

## Example Output

```
Status:

Last session: Completed dojo directory UI (F1-F3), claim flow backend (B8-B9)

Active:
- AI onboarding chat UI (F7) — in progress
- Public profile page (F10) — waiting on F7

Blocked:
- None

Recent:
- Directory search and filtering
- Near Me geolocation
- Claim verification endpoints

Next: Continue F7 (onboarding chat), then F10.
```

## When Files Don't Exist

If coordination files don't exist, say:
```
No session state found. This looks like a fresh start or the project
hasn't set up coordination files yet.

Want me to create _AGENTS.md and _SESSION_MEMO.md?
```
