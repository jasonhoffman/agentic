# Pre-Launch Stabilization

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
