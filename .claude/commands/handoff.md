# /handoff — Structured Handoff

Create a clear handoff to another role. Ensures context isn't lost between agents.

## Usage

```
/handoff <role>
```

Examples:
- `/handoff frontend`
- `/handoff qa`
- `/handoff backend`

## Process

1. **Identify what was completed**
   - What work is being handed off?
   - What files were created/modified?

2. **Document the "why"**
   - Why was it built this way?
   - What trade-offs were made?
   - What alternatives were considered?

3. **Specify what's next**
   - What should the receiving role do?
   - What dependencies are ready?
   - What's still blocked?

4. **Update _AGENTS.md**
   - Add handoff section
   - Update task statuses
   - Tag receiving role

## Handoff Template

```markdown
### Handoff: [From Role] → [To Role] | [Date]

**Work Completed:**
- [What was done]
- [Files: `path/to/file.ts`]

**Why This Approach:**
- [Design decision and rationale]
- [Trade-offs considered]

**For [Receiving Role]:**
- [Specific instruction 1]
- [Specific instruction 2]
- [File reference: `path/to/file.ts:line`]

**Ready to Start:**
- [Task ID]: [description]
- [Task ID]: [description]

**Still Blocked:**
- [Task ID]: waiting on [what]

**Gotchas:**
- [Non-obvious thing to watch for]
```

## Output Format

After creating handoff:

```
Handoff: [From] → [To]

Completed:
- [Summary of work]

Handed off:
- [What the next role can now do]

Updated _AGENTS.md with handoff notes.

[To Role] can now start:
- [Task 1]
- [Task 2]
```

## Example

```
/handoff frontend

---

### Handoff: Backend → Frontend | Jan 8

**Work Completed:**
- Profiles API (GET, POST, PATCH, DELETE)
- RLS policies for profile access
- Types exported to `lib/types.ts`

**Why This Approach:**
- Used soft deletes for profile data (users may want recovery)
- Rate limited to 100 req/min (based on 50 expected users)
- Returned minimal data in list endpoint (full data in detail)

**For Frontend:**
- Endpoints ready: `/api/profiles`, `/api/profiles/:id`
- Use `Profile` type from `lib/types.ts`
- Avatar upload goes to `/api/profiles/:id/avatar`
- Check `useProfile` hook pattern in existing code

**Ready to Start:**
- F1: Profile list screen
- F2: Profile detail screen
- F3: Profile edit form

**Still Blocked:**
- F4: Avatar cropping — waiting on design specs

**Gotchas:**
- Profile ID ≠ Auth User ID for pre-staged profiles
- Always use `profileId` from context, not `userId`

---

Updated _AGENTS.md.

Frontend can now start F1, F2, F3.
```

## When to Use

- Completing a phase of work
- Switching roles in the same terminal
- End of day with work continuing tomorrow
- After completing blocking work for another role

## Handoff Quality Checklist

- [ ] Files and paths are specific (not vague)
- [ ] Reasoning is explained (why, not just what)
- [ ] Next steps are actionable
- [ ] Blockers are clearly marked
- [ ] Gotchas from experience are noted
