# Product Requirements Documents (PRD)

Product documents that describe **what** to build and why.

## Purpose

PRDs capture product decisions, requirements, and specifications. They answer:
- What problem are we solving?
- Who are we solving it for?
- What does success look like?
- What are the requirements?

## Naming Convention

`PRD_NNNN_SHORT_NAME.md`

Examples:
- `PRD_0001_USER_AUTHENTICATION.md`
- `PRD_0002_DASHBOARD_REDESIGN.md`
- `PRD_0003_PAYMENT_INTEGRATION.md`

## Status

| Status | Meaning |
|--------|---------|
| `draft` | Under discussion, not ready for implementation |
| `approved` | Ready for implementation |
| `in_progress` | Currently being built |
| `shipped` | Deployed to production |
| `deferred` | Postponed to a future release |

## Index

| # | Title | Status |
|---|-------|--------|
| 0001 | [Feature Name] | [status] |

---

## PRD Template

When creating a new PRD, use this structure:

```markdown
---
status: draft
---

# [Feature Name]

> **Target Release:** vX.Y.Z
> **Status:** [Status]

---

## Overview

[Problem statement - what problem does this solve?]

[Solution overview - how will we solve it?]

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| [Metric 1] | [Target] | [Measurement method] |

---

## User Stories

As a [user type], I want to [action] so that [benefit].

---

## Requirements

### Must Have (P0)

- [ ] [Requirement]
- [ ] [Requirement]

### Should Have (P1)

- [ ] [Requirement]

### Nice to Have (P2)

- [ ] [Requirement]

---

## Design

[Link to designs, wireframes, or describe UI/UX]

---

## Technical Considerations

[Any technical constraints, dependencies, or considerations]

---

## Out of Scope

- [What we're explicitly NOT doing]

---

## Open Questions

- [Question that needs resolution]

---

## Timeline

| Milestone | Target |
|-----------|--------|
| Design Complete | [Date] |
| Implementation Start | [Date] |
| Testing Complete | [Date] |
| Release | [Date] |
```

---

## Related Documents

- **[RFD/](../RFD/)** - Technical design documents (how to build)
- **[_VISION.md](../_VISION.md)** - Product vision and roadmap
- **[_ARCHITECTURE.md](../_ARCHITECTURE.md)** - Technical architecture
