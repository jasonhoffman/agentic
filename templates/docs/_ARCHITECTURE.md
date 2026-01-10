# Architecture & Context - [Project Name]

> **Canonical Documentation** - This file and other `_*.md` files in `/docs` are the source of truth.
> Other instances of Claude Code should update these docs when making significant changes.
>
> **Last Updated:** [Date] (v[Version] "[Release Theme]")

## Project Context

**What:** [One-line description of what this project is]

**Current Phase:** [Phase name] — [What's being worked on]
**Next Milestone:** [Version] — [Description]
**Future Vision:** [Long-term goal]

**Related Documentation:**
- [Database Schema](./_SCHEMA.md) - All table definitions
- [Releases & Deployment](./_RELEASES.md) - Version management, deployment
- [Release Notes](./_RELEASE_NOTES.md) - Version history and changelog
- [Fragile Areas](./_FRAGILE.md) - Known gotchas and edge cases
- [Dev Setup](./_DEV_SETUP.md) - Development environment setup
- [Vision](./_VISION.md) - Product vision and roadmap
- [PRD/](./PRD/) - Product Requirements Documents
- [RFD/](./RFD/) - Requests for Discussion (technical designs)

---

## What's Built (v[Version] — [Month] [Year])

### Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| [Core Feature 1] | ✅ | [Context/notes] |
| [Core Feature 2] | ✅ | [Context/notes] |
| [Feature Group] | | |
| [Sub-feature] | ✅ | [Context/notes] |
| [Sub-feature] | ✅ | [Context/notes] |

### Database

- **[Entity count]** ([description])
- **[N] migrations** in `[migrations path]`
- **[N] Edge Functions/APIs** ([description])

### Recent Changes

> For detailed release notes, see **[_RELEASE_NOTES.md](./_RELEASE_NOTES.md)**.

**v[Version] "[Theme]" ([Date]):**
- [Summary point 1]
- [Summary point 2]
- [Summary point 3]

### Not Yet Built

| Feature | Priority | Notes |
|---------|----------|-------|
| [Planned Feature 1] | High | [Context] |
| [Planned Feature 2] | Medium | [Context] |
| [Planned Feature 3] | Future | [Context] |

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Framework + Version] |
| Language | [Language + Version] |
| Routing | [Router + Version] |
| Backend | [Backend stack] |
| Auth | [Auth provider/method] |
| State | [State management] |
| Styling | [CSS/styling approach] |

### Key Dependencies

- `[package]` - [purpose]
- `[package]` - [purpose]
- `[package]` - [purpose]

---

## Code Organization

```
/[directory]                  # [Description]
  /[subdirectory]/            # [Description]
  /[subdirectory]/            # [Description]
/[directory]                  # [Description]
  /[subdirectory]/            # [Description]
/[directory]                  # [Description]
/[directory]                  # [Description]
```

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        [SYSTEM NAME]                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Component A]                                                     │
│        │                                                            │
│        ▼                                                            │
│   ┌─────────┐     ┌──────────────┐     ┌───────────────┐          │
│   │ [Box 1] │────▶│   [Box 2]    │◀────│    [Box 3]    │          │
│   └─────────┘     └──────────────┘     └───────────────┘          │
│        │                 │                                          │
│        ▼                 ▼                                          │
│   [Component B]    [Component C]                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Concepts

- **[Concept 1]** = [Definition]
- **[Concept 2]** = [Definition]
- **[Concept 3]** = [Definition]

---

## Navigation/Routing Architecture

### Route Structure

```
/[route-group]/
  [route-1]                   # [Description]
  [route-2]                   # [Description]
  /[nested-group]/
    [route-3]                 # [Description]
```

### Role-Based Access

| Screen/Feature | All Users | [Role 1] | [Role 2] | [Role 3] |
|----------------|-----------|----------|----------|----------|
| [Screen 1] | ✅ | ✅ | ✅ | ✅ |
| [Screen 2] | ✅ | ✅ | ✅ | — |
| [Admin Feature] | — | — | ✅ | — |
| [Dev Tools] | — | — | — | ✅ |

---

## Data Model

### Entity Relationships

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id              │
│ email           │
│ name            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   [Entity 2]    │────▶│   [Entity 3]    │
└─────────────────┘     └─────────────────┘
```

### Key Relationships

- **[Entity A] → [Entity B]**: [Relationship description]
- **[Entity B] → [Entity C]**: [Relationship description]

---

## API/Backend Structure

### Endpoints Overview

| Endpoint | Purpose | Auth Required |
|----------|---------|---------------|
| `[route]` | [Description] | Yes/No |
| `[route]` | [Description] | Yes/No |

### Edge Functions / Serverless

| Function | Purpose | Required Secrets |
|----------|---------|------------------|
| `[function]` | [Description] | `[SECRET_KEY]` |
| `[function]` | [Description] | `[SECRET_KEY]`, `[OTHER_KEY]` |

---

## Environment Variables

### Client-Side (Public)

```bash
[PREFIX]_[VAR_NAME]=value       # [Description]
[PREFIX]_[VAR_NAME]=value       # [Description]
```

### Server-Side (Secrets)

```bash
[VAR_NAME]=value                # [Description]
[VAR_NAME]=value                # [Description]
```

---

## Hardcoded Values

> Values that should be configurable but are currently hardcoded

```typescript
const EXAMPLE_CONSTANT = 'value';  // Context: why this is hardcoded
```

---

## Security

### Authentication Flow

1. User initiates auth via [method]
2. [Step 2]
3. [Step 3]
4. Token stored in [location]

### Authorization / RLS Strategy

| Table/Resource | Read | Write |
|----------------|------|-------|
| [Resource 1] | [Policy] | [Policy] |
| [Resource 2] | [Policy] | [Policy] |

### Security Decisions

#### [Decision Category]: [Chosen Approach] ([Month Year])

**Decision:** [What was chosen]

**Rationale:**
- [Why 1]
- [Why 2]
- [Why 3]

**Alternatives Considered:**
1. [Option A] — Why rejected
2. [Option B] — Why rejected

---

## Conventions

### Code Style

- [Convention 1]
- [Convention 2]
- [Convention 3]

### File Naming

- [Pattern 1]: `[example]`
- [Pattern 2]: `[example]`

### Things to Avoid

- [Anti-pattern 1]
- [Anti-pattern 2]
- [Anti-pattern 3]

---

## Development

### Running Locally

```bash
npm install
npm run dev
```

### Testing

```bash
npm test                    # Run all tests
npx tsc --noEmit           # Type check
npm run lint               # Lint
```

### Deployment

See **[_RELEASES.md](./_RELEASES.md)** for complete deployment procedures.

---

## Future Work

> For detailed roadmap, see **[_VISION.md](./_VISION.md)** and **[PRD/](./PRD/)**.

### v[Next Version] — [Phase Name]

- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

---

## External Resources

- **App/Site:** [URL]
- **API Docs:** [URL]
- **Dashboard:** [URL]
- **Repository:** [URL]

---

*Update this document when architecture changes significantly.*
