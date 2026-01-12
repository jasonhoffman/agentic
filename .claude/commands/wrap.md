---
description: End of session — commit and summarize what shipped
---

# /wrap — Session Closure

End-of-session workflow. The "I'm going to sleep" command.

## Steps

1. **Check changes**
   ```bash
   git status
   git diff --stat
   ```

2. **Stage and commit** (if changes exist)
   - Clear commit message
   - Include Co-Authored-By line

3. **Update session memo** (if `docs/_NEXT_SESSION_MEMO.md` exists)
   - What shipped this session
   - Current state (version, tests, build)
   - In-progress items
   - Next session priorities

4. **Report**
   ```
   Wrapped:
   - [What was completed]
   - Commit: [hash] [message]
   - Session memo updated
   ```

## Skip When

- No changes to commit
- Mid-session checkpoint — just note where you are

## Example

```
Wrapped:

Completed:
- Profiles API (4 endpoints)
- Profile edit screen

Commit: a1b2c3d - "feat(profiles): add user profile management"

Session memo updated:
- Added to "What Just Shipped"
- Next priorities: Avatar upload, profile settings

Ready for next session.
```
