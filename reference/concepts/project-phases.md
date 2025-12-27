# Project Phases

Projects go through phases that change agent behavior. Phase files live at the project root.

---

## Available Phases

| Phase | File | What It Means |
|-------|------|--------------|
| Pre-Launch | `_PRELAUNCH.md` | Launch freeze — bug fixes only, minimal changes |

---

## Pre-Launch Phase

When `_PRELAUNCH.md` exists, the project is feature-complete and stabilizing.

### Rules

1. **Fix only what's reported** — No improvements, no "while I'm here" changes
2. **Minimal diffs** — Smallest change that fixes the bug
3. **One fix per task** — Complete it, test it, commit it
4. **No new dependencies** — Don't add packages
5. **No schema changes** — Unless absolutely required (flag explicitly)
6. **Verify before done** — `tsc`, tests, manual check
7. **When uncertain, ask** — "This might affect X. Proceed?"
8. **Commit format** — `fix: [what was broken]`

### What "Done" Looks Like

- The reported bug is fixed
- Nothing else changed
- Tests pass
- You've stated exactly what files changed and why

---

## Adding New Phases

Create a `_PHASENAME.md` file at project root. Document:
- What the phase means
- How agent behavior should change
- Rules for this phase

Update CLAUDE.md to reference the new phase.
