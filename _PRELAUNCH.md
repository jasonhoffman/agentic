# Pre-Launch Stabilization

## Why This Phase Exists

You've done this before. The last two weeks before launch, the rules change. No new features. No refactoring. Just fix what's broken, verify it works, ship it.

This is the same discipline, encoded for AI. Without it, agents will helpfully "improve" things right before launch. This tells them: don't.

---

## Current Mode: LAUNCH FREEZE

We are in pre-launch stabilization. The app is feature-complete.

### Rules for this phase:

1. **Fix only what is explicitly reported** - Do not improve, refactor, or "while I'm here" adjacent code

2. **Minimal diff principle** - The smallest change that fixes the bug. If a 2-line fix works, don't do a 20-line refactor

3. **One fix per task** - Complete it, test it, commit it. Then move to the next thing

4. **No new dependencies** - Do not add packages

5. **No schema changes** - Unless absolutely required for a fix, and flag it explicitly

6. **Verify before reporting done**:
   - `npx tsc --noEmit` passes
   - `npm test` passes
   - Manual test the specific fix
   - Check that adjacent features still work

7. **When uncertain, ask** - "This fix might affect X. Should I proceed or do you want to verify X first?"

8. **Commit message format**: `fix: [what was broken]` - not `feat`, not `refactor`

### What "done" looks like:
- The reported bug is fixed
- Nothing else changed
- Tests pass
- I've told you exactly what file(s) I modified and why

---

## Verification Gate

Run these checks at the start of every session:

```bash
npx tsc --noEmit          # Type check
npm test                   # All tests pass
```

If either fails, fix before doing anything else.

### Before Each Change

Use LSP-first exploration:

1. **Find all references** — How many places use this? What's the blast radius?
2. **Check type signature** — What flows in and out?
3. **Make the minimal change**
4. **Check diagnostics** — Did I introduce errors elsewhere?
5. **Full verification** — `tsc --noEmit` + tests

This is faster and more surgical than grep → read → change → hope.
