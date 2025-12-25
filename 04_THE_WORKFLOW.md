# Chapter 4: The Workflow

How work flows from idea to shipped.

---

## The Simple Version

```
You: I need password reset.

Chief of Staff: Got it. Let me spec that out.

[Product Manager specs it]
[Designers flow it]
[Engineers build it]
[QA tests it]
[Security reviews it]

Chief of Staff: Password reset is ready. Security approved. Ship it?

You: Ship it.

Chief of Staff: Done. It's live.
```

That's the workflow. You say what you want. Agents build it. You approve at key moments.

---

## Your Three Decision Points

You're not involved in every step. Just three:

1. **Approve the spec** — Before work starts, make sure it's right
2. **Approve security** — Before shipping, make sure it's safe
3. **Approve ship** — When it's ready, decide to go live

Everything else flows automatically.

```
You: Build the checkout flow.

Chief of Staff: Here's the spec. [shows spec] Approve?

You: Approved.

[... time passes, agents work ...]

Chief of Staff: Checkout built and tested. Security review:
- Payment handling: secure
- Session management: secure
- Rate limiting: in place
Approve?

You: Approved.

Chief of Staff: Ready to ship. Go live?

You: Ship it.

Chief of Staff: Live.
```

---

## Shortcuts

Not everything needs the full flow:

**Bug fix:**
```
You: Users can't log in on Safari.

Chief of Staff: Let me look into that.

[Engineers fix it, QA verifies]

Chief of Staff: Fixed. Ship it?
```

**Quick experiment:**
```
You: Let's try a different signup flow.

Chief of Staff: I'll set that up behind a feature flag.

[Growth Engineer builds it]

Chief of Staff: Ready. Want to enable it for 10% of users?
```

---

## When Things Go Wrong

**Bug found in testing:**
```
Chief of Staff: QA found an issue — the reset link doesn't expire.

You: Fix it.

[Engineers fix, QA re-tests]

Chief of Staff: Fixed and verified. Continuing to security review.
```

**Security issue:**
```
Chief of Staff: Security found a problem — tokens are predictable.

You: Fix it.

[Engineers fix, Security re-reviews]

Chief of Staff: Security approved.
```

**Scope creep:**
```
Chief of Staff: Building this requires a notification system we don't have.

You: Add it to scope.
— or —
You: Defer that. Ship without it for now.
```

You decide. Agents execute.

---

## Under the Hood

If you want to understand what's happening behind the scenes:

**The phases:**
```
IDEA → SPEC → DESIGN → BUILD → TEST → SECURITY → PERFORMANCE → SHIP
```

| Phase | Agent | You Involved? |
|-------|-------|---------------|
| Spec | Product Manager | **Yes** — you approve |
| Design | UX/UI Designer | No |
| Build | Backend + Frontend Engineers | No |
| Test | QA Engineer | Only if bugs |
| Security | Security Engineer | **Yes** — you approve |
| Performance | Platform Engineer | Only if issues |
| Ship | Platform Engineer | **Yes** — you decide |

**Handoffs:**

Agents leave notes for each other in `_AGENTS.md`:

```markdown
### Handoff: Backend → Frontend

API ready:
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

Types in lib/types.ts.
```

The next agent reads these notes and continues.

**Parallel work:**

You can have multiple features flowing at once. Chief of Staff coordinates. But don't go crazy — 2-3 active features is usually right.

---

## Summary

| What | How |
|------|-----|
| Start a feature | Tell Chief of Staff what you want |
| Get updates | Say `status` |
| Approve things | Chief of Staff asks you at key moments |
| Ship | Say "ship it" when ready |

**Your involvement:** 3 decisions per feature.
**Agents handle:** Everything between.

---

→ [Chapter 5: Getting Started](05_GETTING_STARTED.md)
