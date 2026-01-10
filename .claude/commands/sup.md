---
description: Quick 5-second status — what's happening, what's next
---

# /sup — Quick Status

Fast context recovery. 5 seconds.

## Process

1. Check `git status` for uncommitted work
2. Check `git log --oneline -5` for recent commits
3. Glance at _FRAGILE.md if it exists

## Output

```
Status:

Recent:
- [Last few commits or "no recent commits"]

Working tree:
- [Clean / X files modified]

Next: [Suggested focus based on what you see]
```

Keep it brief. 5-10 lines max.
