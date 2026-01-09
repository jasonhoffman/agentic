# /wrap — Closure Protocol

End-of-session workflow. Ensures consistent handoffs and documentation.

## Steps

1. **Check staged changes**
   ```bash
   git status
   git diff --staged --stat
   ```

2. **Update _AGENTS.md**
   - Mark current task as complete in Active Work table
   - Move to Recently Completed with date
   - Add handoff notes if another role continues

3. **Update _SESSION_MEMO.md**
   For each piece of work completed, add an entry:
   ```markdown
   ### [Feature/Fix Name] - COMPLETE ✅

   **Problem:** [User-facing issue or goal]

   **Root Cause:** [Why it happened — for bugs]

   **Solution:**
   1. [Change 1] (`path/to/file.ts:line`)
   2. [Change 2] (`path/to/file.ts:line`)

   **Commits:** [will be filled after commit]

   **Deployed:** [OTA / Native / Not yet]
   ```

4. **Stage changes**
   ```bash
   git add [relevant files]
   ```

5. **Code review** (skip for trivial changes)
   - For non-trivial work: Run `/code-review` on staged changes
   - Skip for: typos, config tweaks, doc-only changes
   - If blocking issues found: fix them, re-stage

6. **Commit**
   - Write clear commit message (type(scope): description)
   - Include Co-Authored-By line

7. **Report**
   Summarize what shipped:
   ```
   Wrapped:
   - [What was completed]
   - Commit: [hash] [message]
   - Handoff: [role] can now [do what]
   ```

## Skip Steps When

- **No code changes:** Skip steps 4-6, just update docs
- **Trivial fix:** Skip code review (step 5)
- **Mid-session checkpoint:** Just update _AGENTS.md, skip commit

## Example Output

```
Wrapped:

Completed:
- Profiles API (4 endpoints, types exported)
- Profile edit screen

Commit: a1b2c3d - "feat(profiles): add user profile management"

Handoff for QA:
- New endpoints at /api/profiles
- Test profile creation and edit flows
- RLS policies need verification

Session memo updated.
```
