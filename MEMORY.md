# Memory Template

Copy this into your Claude Code memory using `/memory add`.

---

## Development Standards

### Before Committing
- Run lint (`npm run lint` or equivalent)
- Run existing tests — never break them
- If tests fail, fix them or explain why they should change

### Code Quality
- No secrets in code — use environment variables
- Check for race conditions in async code
- Validate at system boundaries only (user input, external APIs)
- Don't add comments to code you didn't write

### Supabase/RLS Specific
- RLS policies must have tests
- Never query RLS-protected tables inside RLS policies — use SECURITY DEFINER helpers
- Test as multiple user types (owner, member, visitor)

### What Not To Do
- Don't add docstrings/comments where code is self-evident
- Don't create abstractions for one-time operations
- Don't refactor code you weren't asked to touch
- Don't add error handling for scenarios that can't happen

---

## Customization

Add project-specific constraints as needed:

```
### [Project] Specific
- [Constraint 1]
- [Constraint 2]
```

Keep it short. If it's longer than a page, you're over-documenting.
