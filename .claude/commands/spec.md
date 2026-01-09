# /spec — Feature Specification

Create a structured spec that enables parallel work.

## Usage

```
/spec <feature-name>
```

## Process

1. **Clarify scope**
   - What's the user-facing goal?
   - What's in scope? Out of scope?
   - Any decisions already made?

2. **Create task breakdown**
   Use this format:

   ```markdown
   # Feature: [Name]

   ## Objective
   [One sentence: what does this do for users?]

   ## Success Criteria
   - [ ] [User-visible outcome 1]
   - [ ] [User-visible outcome 2]

   ## Task Breakdown

   ### Backend
   | ID | Task | Depends On | Output |
   |----|------|------------|--------|
   | B1 | [Task] | — | [deliverable] |
   | B2 | [Task] | B1 | [deliverable] |

   ### Frontend
   | ID | Task | Depends On | Output |
   |----|------|------------|--------|
   | F1 | [Task] | B2 | [deliverable] |
   | F2 | [Task] | B2 | [deliverable] |

   ### QA
   | ID | Task | Depends On | Output |
   |----|------|------------|--------|
   | Q1 | [Task] | F1, F2 | [deliverable] |

   ## Decisions Made
   | Decision | Choice | Rationale |
   |----------|--------|-----------|
   | [Topic] | [Choice] | [Why] |
   ```

3. **Identify parallel tracks**
   - Which tasks can run simultaneously?
   - What are the blocking dependencies?

4. **Add to _AGENTS.md**
   - Create task queues per role
   - Mark dependencies clearly

## Task ID Convention

| Prefix | Role |
|--------|------|
| B | Backend |
| F | Frontend |
| P | Platform |
| Q | QA |
| S | Security |
| D | Design |

## Dependency Notation

- `—` = No dependencies, can start immediately
- `B1` = Depends on Backend task 1
- `B1, B2` = Depends on multiple tasks

## Output

After creating the spec:

```
Spec created: [Feature Name]

Tasks: [X] Backend, [Y] Frontend, [Z] QA

Parallel tracks:
- B1, B2 can start immediately
- F1, F2 can start after B3
- Q1 after all implementation

Added to _AGENTS.md. Ready for parallel work.
```

## Example

```
/spec user-profiles

---

# Feature: User Profiles

## Objective
Users can view and edit their profile information.

## Success Criteria
- [ ] Users can view their profile
- [ ] Users can edit name and avatar
- [ ] Other users can view public profiles

## Task Breakdown

### Backend
| ID | Task | Depends On | Output |
|----|------|------------|--------|
| B1 | Add profile fields migration | — | `migrations/xxx.sql` |
| B2 | RLS policies (own profile) | B1 | RLS policies |
| B3 | GET/PATCH /api/profiles/:id | B1 | Endpoints |
| B4 | Export Profile type | B3 | `lib/types.ts` |

### Frontend
| ID | Task | Depends On | Output |
|----|------|------------|--------|
| F1 | Profile view screen | B4 | `app/profile/[id].tsx` |
| F2 | Profile edit form | B4 | `components/ProfileForm.tsx` |
| F3 | Avatar upload | B3 | `components/AvatarUpload.tsx` |

### QA
| ID | Task | Depends On | Output |
|----|------|------------|--------|
| Q1 | RLS policy tests | B2 | `__tests__/rls/profiles.test.ts` |
| Q2 | E2E profile flow | F1, F2 | `e2e/profile.spec.ts` |
```
