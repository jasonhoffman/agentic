# Stack & Type Boundaries

Project-specific technology choices and type topology.

---

## Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | | |
| **Backend** | | |
| **Database** | | |
| **Auth** | | |
| **Deployment** | | |

---

## Type Topology

Where types are defined and how they flow through the system.

### Source of Truth

| Domain | Source | Generated From |
|--------|--------|----------------|
| Database | `prisma/schema.prisma` | Prisma generates types |
| API | `src/server/routers/` | tRPC infers from handlers |
| Validation | `src/lib/schemas/` | Zod schemas, inferred types |
| UI | Inferred | From API + validation types |

### Type Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Database  │ ──▶ │    API      │ ──▶ │   Frontend  │
│   (Prisma)  │     │   (tRPC)    │     │   (React)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Generated           Inferred           Inferred
     types            from handlers      from queries
```

### Key Files

| Purpose | Location |
|---------|----------|
| Database types | `node_modules/.prisma/client/index.d.ts` |
| API types | `src/server/routers/*.ts` |
| Shared types | `src/lib/types.ts` |
| Validation schemas | `src/lib/schemas/*.ts` |

---

## Verification Commands

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Test
npm test

# Prisma: regenerate types after schema change
npx prisma generate
```

---

## Constraints

- [ ] No `any` without documented reason
- [ ] No `// @ts-ignore` without documented reason
- [ ] All API responses typed
- [ ] All form inputs validated with Zod
- [ ] Database schema changes require `prisma generate`

---

## Notes

[Project-specific notes about the stack, quirks, or decisions]
