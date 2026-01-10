# Request for Discussion (RFD)

Technical design documents that describe **how** to build something.

## Purpose

RFDs capture technical decisions, architecture designs, and implementation approaches. They answer:
- How will we implement this?
- What are the trade-offs?
- Why did we choose this approach?
- What alternatives were considered?

## Naming Convention

`RFD_NNNN_SHORT_NAME.md`

Examples:
- `RFD_0001_AUTH_ARCHITECTURE.md`
- `RFD_0002_DATABASE_SHARDING.md`
- `RFD_0003_API_VERSIONING.md`

## Status

| Status | Meaning |
|--------|---------|
| `draft` | Under discussion, soliciting feedback |
| `accepted` | Approved for implementation |
| `implemented` | Built and deployed |
| `superseded` | Replaced by a newer RFD |

## Index

| # | Title | Status |
|---|-------|--------|
| 0001 | [Technical Design] | [status] |

---

## RFD Template

When creating a new RFD, use this structure:

```markdown
---
status: draft
---

# [Technical Design Title]

> [One-line summary of what this design accomplishes]

---

## Context

[Background information - why are we doing this?]

[Link to related PRD if applicable]

---

## Goals

- [Goal 1]
- [Goal 2]

## Non-Goals

- [What we're explicitly not trying to solve]

---

## Current State

[Description of how things work today, if applicable]

---

## Proposed Solution

### Overview

[High-level description of the solution]

### Architecture

```
[ASCII diagram or architecture overview]
```

### Implementation Details

#### [Component 1]

[Detailed description]

```typescript
// Code examples if helpful
```

#### [Component 2]

[Detailed description]

---

## Alternatives Considered

### Alternative 1: [Name]

**Approach:** [Description]

**Pros:**
- [Pro]

**Cons:**
- [Con]

**Why not chosen:** [Reason]

### Alternative 2: [Name]

**Approach:** [Description]

**Why not chosen:** [Reason]

---

## Security Considerations

[Security implications and how they're addressed]

---

## Testing Strategy

- [How will this be tested?]
- [What test cases are needed?]

---

## Migration Plan

[If this changes existing behavior, how will we migrate?]

---

## Rollback Plan

[How do we rollback if something goes wrong?]

---

## Known Limitations

- [Limitation 1 with workaround if any]
- [Limitation 2]

---

## Future Work

- [Enhancement that could come later]
- [Related work not in scope]

---

## References

- [Link to relevant documentation]
- [Link to related discussions]

---

*Decision made: [Date] by [Author]*
```

---

## When to Write an RFD

Write an RFD when:
- Making significant architectural changes
- Introducing new patterns or technologies
- Changes affect multiple systems or teams
- The decision is non-obvious and worth documenting
- You want feedback before implementing

Don't write an RFD for:
- Bug fixes
- Small features with obvious implementations
- Refactoring that doesn't change behavior

---

## Related Documents

- **[PRD/](../PRD/)** - Product requirements (what to build)
- **[_ARCHITECTURE.md](../_ARCHITECTURE.md)** - Current architecture
- **[_SCHEMA.md](../_SCHEMA.md)** - Database schema
