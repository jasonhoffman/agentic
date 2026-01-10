---
description: End of session — commit and summarize what shipped
---

# /wrap — Session Closure

End-of-session workflow.

## Steps

1. **Check changes**
   ```bash
   git status
   git diff --stat
   ```

2. **Stage and commit** (if changes exist)
   - Clear commit message
   - Include Co-Authored-By line

3. **Report**
   ```
   Wrapped:
   - [What was completed]
   - Commit: [hash] [message]
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

Next session: Hook up avatar upload
```
