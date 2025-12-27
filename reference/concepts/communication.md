# Communication

## Why Files, Not Memory

On a human team, context lives in people's heads. When someone leaves, context leaves. When someone joins, they need ramp-up time. When you're out for a week, things drift.

AI has a more extreme version of this: every session starts with zero context. Without explicit coordination, you'd repeat yourself constantly.

`_AGENTS.md` is the team's shared memory. It's what you'd have if humans actually documented things the way they should.

---

Agents communicate through shared documentation. No hidden state, no private channels.

## The _AGENTS.md File

Every project has `docs/_AGENTS.md`. This is the single point of truth for agent coordination.

### Structure

```markdown
# Agents

## Active Agents
[Which roles are currently engaged]

## Agent 1: [Role Name]
### Current Status
| Field | Value |
|-------|-------|
| Status | Active / Paused / Complete |
| Current Task | What they're working on |
| Last Updated | Timestamp |

### Task Queue
1. [ ] First priority
2. [ ] Second priority

### Recently Completed
- [x] What was done (date)

## Cross-Agent Notes
[Messages between agents, handoff context]
```

### How Agents Use It

**On activation:**
1. Read the entire file
2. Find your section
3. Check cross-agent notes for context
4. Review your task queue

**While working:**
1. Update status as you progress
2. Add notes for other agents
3. Mark tasks complete
4. Add new discovered tasks

**On completion:**
1. Mark task complete
2. Write handoff notes if needed
3. Update status

## Structured Handoffs

Handoffs serve two audiences: the next agent (needs machine-readable detail) and the founder (needs quick scan).

### Handoff Format

```markdown
### Handoff: [From Agent] → [To Agent]

**Work Package:** [Name]
**Phase Transition:** [From Phase] → [To Phase]
**State:** [Complete/Partial] | [Auto-Proceed/Checkpoint]

---

**For [Next Agent]:**
- Specific instruction 1
- Specific instruction 2
- Files: `path/to/file.ts:line`

**For Founder (FYI):**
- One-line summary of what was done
- Any notable decisions made
- Any concerns (or "No concerns")

**Artifacts:**
- [x] Types defined in `lib/types.ts`
- [x] API documented in cross-agent notes
- [ ] Tests pending (next agent's job)
```

### Example: Backend → Frontend

```markdown
### Handoff: Backend Engineer → Frontend Engineer

**Work Package:** User Authentication
**Phase Transition:** Backend → Frontend
**State:** Complete | Auto-Proceed

---

**For Frontend Engineer:**
- Auth endpoints ready: POST /api/auth/login, POST /api/auth/logout
- Types in `lib/types.ts` (AuthUser, LoginRequest, LoginResponse)
- Use `useAuth` hook pattern from existing code
- Token stored in secure httpOnly cookie (no client handling needed)
- See tests in `__tests__/api/auth.test.ts` for expected behavior

**For Founder (FYI):**
- Implemented session-based auth as specified
- Added rate limiting (10 attempts per minute per IP)
- No concerns

**Artifacts:**
- [x] API endpoints implemented
- [x] Types exported
- [x] Tests passing (12 new tests)
- [x] Rate limiting configured
```

### Simple Handoff (Low Ceremony)

For auto-proceed phases with straightforward work:

```markdown
### Handoff: Design → Build

API spec ready in cross-agent notes. Types in `lib/types.ts`. Proceed.
```

## Decision Queue

The founder makes decisions in batches, not one at a time. Queue decisions appropriately:

### Decision Queue Format

```markdown
## Decision Queue

### Blocking (work stopped until decided)
| Package | Question | Options | Agent Rec | Added |
|---------|----------|---------|-----------|-------|
| Auth | Use JWT or sessions? | JWT (stateless), Sessions (simpler) | Sessions | Jan 15 |

### Non-Blocking (decide by EOD)
| Package | Question | Options | Agent Rec | Added |
|---------|----------|---------|-----------|-------|
| Dashboard | Cache TTL? | 5 min, 15 min, 1 hour | 15 min | Jan 15 |
| Profile | Show email publicly? | Yes, No, User choice | User choice | Jan 15 |

### Decided (for reference)
| Package | Decision | Rationale | Decided | By |
|---------|----------|-----------|---------|-----|
| Auth | Use Google OAuth | Simplicity for MVP | Jan 14 | Founder |
```

### When to Mark Blocking

**Blocking:** Work cannot proceed without this decision
- Architecture choices that affect everything downstream
- Security trade-offs
- Scope decisions (in/out)

**Non-Blocking:** Work can continue on other aspects
- UI details
- Performance optimizations
- Nice-to-haves

### Agent Recommendations

Always include your recommendation:
- Makes founder's decision faster
- Shows you've thought it through
- Can be approved with one word ("approved" or "yes")

## Escalation

When you need the founder's immediate attention:

```markdown
### Escalation: [Agent Name]
**Urgency:** High / Medium / Low
**Question:** Should we use WebSocket or polling for real-time updates?

**Context:** Real-time updates needed for [feature]. Decision affects [scope].

**Options:**
1. WebSocket — Lower latency, more complex, better UX
2. Polling — Simpler, higher server load, slight delay

**My Recommendation:** WebSocket for production scale

**Blocking:** Yes

**What happens if not decided today:** Frontend work pauses
```

### Escalation vs Decision Queue

| Use | When |
|-----|------|
| **Decision Queue** | Normal flow, batch-friendly |
| **Escalation** | Urgent, time-sensitive, unusual |

Most decisions should queue. Escalation is for exceptions.

## Patterns

### Good Communication
- Specific file paths and line numbers
- Clear next steps
- Context for why, not just what
- Explicit blocking vs informational

### Anti-Patterns
- Vague handoffs ("check the code")
- Missing context ("I fixed the bug")
- No file references
- Assuming others know what you know

## Work Package Tracking

_AGENTS.md tracks active work packages:

```markdown
## Work Packages

### Active
| Package | Phase | Agent | State | Blocking? |
|---------|-------|-------|-------|-----------|
| User Auth | Frontend | Frontend Eng | Working | No |
| Dashboard | Spec | Product Mgr | Checkpoint | Yes - scope |

### Queued
| Package | Next Phase | Waiting For |
|---------|------------|-------------|
| Notifications | Spec | User Auth complete |
```

See [Work Packages](work-packages.md) for the full concept.

## Solo Founder Optimization

Communication patterns optimized for one human:

### Scan-First Format
Structure everything so the founder can scan quickly:
- Tables over paragraphs
- Status fields at the top
- Blocking items highlighted
- Recommendations included

### Async by Default
Agents don't wait for real-time responses:
- Queue decisions, don't escalate
- Continue on non-blocked work
- Leave clear state for pickup

### Low-Ceremony When Possible
Match ceremony to risk:
- Simple handoffs for auto-proceed phases
- Detailed handoffs for checkpoints
- Minimal for bug fixes

## Beyond _AGENTS.md

Other shared docs agents may reference:

| File | Purpose |
|------|---------|
| `_ARCHITECTURE.md` | Technical decisions, patterns |
| `_SCHEMA.md` | Database design |
| `_ROADMAP.md` | Product priorities |
| `_CONVENTIONS.md` | Coding standards |
| `_SECURITY_AUDIT.md` | Security findings |

Agents read these for context. The founder maintains them.

---

## Summary

| Component | Purpose |
|-----------|---------|
| **_AGENTS.md** | Single source of truth for coordination |
| **Structured Handoffs** | Clear state for next agent + quick scan for founder |
| **Decision Queue** | Batch decisions, minimize interrupts |
| **Escalation** | Urgent exceptions only |
| **Work Package Tracking** | What's active, blocked, queued |
