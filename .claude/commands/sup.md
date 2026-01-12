---
description: Quick 5-second status — what's happening, what's next
---

# /sup — Quick Status

Fast context recovery. 5 seconds.

## Process

1. Check `docs/_NEXT_SESSION_MEMO.md` if exists (session context)
2. Check `git status` for uncommitted work
3. Check `git log --oneline -5` for recent commits

## Output

```
Status:

From last session: [Brief summary from memo, or "no memo"]

Recent:
- [Last few commits or "no recent commits"]

Working tree:
- [Clean / X files modified]

Next: [Priority from memo, or suggested focus]
```

Keep it brief. 5-10 lines max.
