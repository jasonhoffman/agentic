# Chapter 3: The Agents

Your team: one Chief of Staff who becomes 14 specialists.

---

## The Chief of Staff

When you type `claude`, you're talking to the Chief of Staff. They're your single point of contact.

```
$ claude

Chief of Staff: Welcome to Agentic. What are you building?

You: A mobile app for dog walkers.

Chief of Staff: Great. Let me set up your project...
[creates ~/projects/dogwalker]
[copies templates]

Now let's define your vision. Who's the primary user — dog owners or walkers?
```

The Chief of Staff:
- **Greets you** and helps you get started
- **Sets up projects** — creates repos, copies templates
- **Becomes specialists** — shifts into Backend Engineer, QA, etc. as needed
- **Coordinates** — handles handoffs between specialists
- **Provides continuity** — maintains context across the whole conversation

You never "activate" agents separately. You talk to the Chief of Staff, and they bring in specialists:

```
You: I need the user profiles API built.

Chief of Staff: Let me bring in the Backend Engineer.

Backend Engineer: I'll design the profiles schema and API...
[works]
Backend Engineer: Done. Ready for frontend.

Chief of Staff: Should I bring in Frontend Engineer?
```

---

## The Specialists

The Chief of Staff can become any of these 14 specialists:

### Core Engineering (Use Most Often)

| Agent | What They Do |
|-------|-------------|
| **Frontend Engineer** | Builds user interfaces — screens, components, interactions |
| **Backend Engineer** | Builds server logic — APIs, databases, business rules |
| **Platform Engineer** | Handles deployment — CI/CD, environments, infrastructure |
| **QA Engineer** | Tests everything — finds bugs, verifies fixes, ensures quality |
| **Security Engineer** | Protects the app — audits code, reviews auth, checks vulnerabilities |

### Product & Design (Use for Features)

| Agent | What They Do |
|-------|-------------|
| **Product Manager** | Defines what to build — specs, user stories, priorities |
| **UX Designer** | Designs how it works — user flows, wireframes, interactions |
| **UI Designer** | Designs how it looks — visual design, component styles |

### Data & Growth (Use for Optimization)

| Agent | What They Do |
|-------|-------------|
| **Data Analyst** | Analyzes data — metrics, insights, dashboards |
| **Growth Engineer** | Builds for growth — experiments, analytics, optimization |

### Content & Support (Use as Needed)

| Agent | What They Do |
|-------|-------------|
| **Technical Writer** | Writes documentation — guides, API docs, help content |
| **Customer Success** | Synthesizes feedback — user research, support patterns |

### Operations (Use for Organization)

| Agent | What They Do |
|-------|-------------|
| **Project Manager** | Tracks work — status, blockers, coordination |
| **Operations Manager** | Optimizes process — workflows, efficiency, automation |

---

## Which Agents You'll Use Most

For most projects, your core team is:

```
┌─────────────────────────────────────────────────────────┐
│                     YOUR DAILY TEAM                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   Chief of Staff      → Your main contact (always)       │
│                          ↓                               │
│   Product Manager     → Specs and priorities             │
│   Backend Engineer    → Server and database              │
│   Frontend Engineer   → User interface                   │
│   QA Engineer         → Testing                          │
│   Security Engineer   → Security review                  │
│   Platform Engineer   → Deployment                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

The others are on-demand — Chief of Staff brings them in when you need that expertise.

---

## Agent Profiles

### Frontend Engineer

**What they're good at:**
- Building screens and components
- Making things look right and feel smooth
- Handling user interactions
- Accessibility and responsive design

**What they won't touch:**
- Database changes
- Server-side logic
- Security configurations

**When you need this:**
- "Build the login screen"
- "Fix this component layout"
- "Add loading states to the dashboard"

---

### Backend Engineer

**What they're good at:**
- Database schema design
- API endpoints
- Business logic
- Data validation

**What they won't touch:**
- UI components
- Visual styling
- User interactions

**When you need this:**
- "Design the database for user profiles"
- "Build the API for creating orders"
- "Add caching to the search endpoint"

---

### Product Manager

**What they're good at:**
- Breaking features into user stories
- Defining acceptance criteria
- Prioritizing work
- Clarifying requirements

**What they won't touch:**
- How things are implemented
- Technical decisions
- Code

**When you need this:**
- "Help me spec out the notifications feature"
- "What should MVP scope be for this?"
- "Prioritize the backlog for next month"

---

### QA Engineer

**What they're good at:**
- Writing tests
- Finding bugs
- Verifying fixes
- Ensuring quality

**What they won't touch:**
- Implementing features
- Making design decisions
- Changing architecture

**When you need this:**
- "Write tests for the auth flow"
- "Test this feature before we ship"
- "Review test coverage for critical paths"

---

### Security Engineer

**What they're good at:**
- Auditing for vulnerabilities
- Reviewing authentication
- Checking authorization rules
- Security best practices

**What they won't touch:**
- Feature implementation
- UI/UX decisions
- Performance optimization

**When you need this:**
- "Review the auth flow before launch"
- "Audit this feature for security issues"
- "Check our database policies"

---

### Platform Engineer

**What they're good at:**
- CI/CD pipelines
- Deployment automation
- Environment configuration
- Infrastructure management

**What they won't touch:**
- Feature code
- Business logic
- UI components

**When you need this:**
- "Set up automatic deploys"
- "Configure the staging environment"
- "This feature is ready — deploy it"

---

## Working With Specialists

You don't activate agents directly. You tell the Chief of Staff what you need:

```
You: I need help speccing out a password reset feature.

Chief of Staff: Let me bring in the Product Manager.

Product Manager: For password reset, let's think through the flow...
```

```
You: Build the user profile API.

Chief of Staff: Bringing in Backend Engineer.

Backend Engineer: I'll design the schema and endpoints...
```

```
You: Test the notifications feature before we ship.

Chief of Staff: Bringing in QA Engineer.

QA Engineer: Testing notifications now...
```

The Chief of Staff knows which specialist to bring in based on what you ask for.

---

## How Agents Hand Off to Each Other

Agents coordinate by leaving notes in `_AGENTS.md`:

```markdown
### Handoff: Backend Engineer → Frontend Engineer

**Work Package:** User Auth
**Phase:** Backend → Frontend

**For Frontend Engineer:**
- API endpoints ready: /api/auth/login, /api/auth/logout
- Types in lib/types.ts
- See tests in __tests__/api/auth.test.ts for expected behavior

**For Founder (FYI):**
- Used session-based auth as specified
- Added rate limiting
- No concerns
```

When the Frontend Engineer starts work, they read this note and know exactly what's ready for them.

---

## Deep Dives

Each agent has a detailed role file in `reference/roles/`. These files contain:

- Exactly what they do and don't do
- How they should work
- What files they own
- When to escalate to you
- How to work with you as a technical founder

You don't need to read them all now. Reference them when you want to understand an agent better or customize their behavior.

---

## Summary

**Entry point:** Chief of Staff (always)

**Specialists:** 14, brought in as needed by Chief of Staff

| Agent Type | Who | When |
|------------|-----|------|
| **Core Engineering** | Frontend, Backend, Platform, QA, Security | Every project, most days |
| **Product & Design** | PM, UX, UI | When defining or designing features |
| **Data & Growth** | Data Analyst, Growth Engineer | When optimizing |
| **Content & Support** | Tech Writer, Customer Success | When documenting or researching |
| **Operations** | Project Manager, Ops Manager | When organizing |

**Typical flow:**
```
Chief of Staff → Product Manager → Backend → Frontend → QA → Security → Ship
         ↑                                                              |
         └──────────────────────────────────────────────────────────────┘
```

---

→ [Chapter 4: The Workflow](04_THE_WORKFLOW.md)

