# Tech Stack

The default stack. Move fast without piecing things together.

> **How to use this doc:**
> - **For new projects:** Reference this when bootstrapping. Chief of Staff knows this stack.
> - **For existing projects:** Your stack goes in `docs/_ARCHITECTURE.md`, not here.
> - **This is a reference**, not a template to copy. It documents the recommended defaults.

---

## The Easy Way

Tell your Chief of Staff what you need:

```
You: I want the default stack — mobile app, web, database, and AI.

Chief of Staff: Got it. I'll set up React Native + Expo, Supabase, and Claude.

First, let's get your accounts set up. I'll need some API keys.

1. **Expo** — Go to https://expo.dev and create an account.
   Then: expo.dev → Account Settings → Access Tokens → Create
   Paste your token here when ready.

You: [pastes token]

Chief of Staff: Saved. Next:

2. **Supabase** — Go to https://supabase.com and create a project.
   Then: Project Settings → API → Copy the URL and anon key.

You: [pastes keys]

Chief of Staff: Connected. Your database is ready.

3. **Anthropic** (for Claude) — Go to https://console.anthropic.com
   Then: API Keys → Create Key

You: [pastes key]

Chief of Staff: All set. Your stack is configured.

What are we building?
```

That's it. Chief of Staff walks you through each service, tells you exactly what to click, and configures everything.

---

## Setup Checklist

If you prefer to set everything up yourself, here's the complete checklist:

### Required Services

| Service | Sign Up | What You Need | Where It Goes |
|---------|---------|---------------|---------------|
| **Expo** | [expo.dev](https://expo.dev) | Access Token | `EXPO_TOKEN` |
| **Supabase** | [supabase.com](https://supabase.com) | Project URL + Anon Key | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |

### Optional (for AI features)

| Service | Sign Up | What You Need | Where It Goes |
|---------|---------|---------------|---------------|
| **Anthropic** | [console.anthropic.com](https://console.anthropic.com) | API Key | `ANTHROPIC_API_KEY` |
| **Voyage AI** | [voyageai.com](https://www.voyageai.com) | API Key | `VOYAGE_API_KEY` |

### Step-by-Step

#### 1. Expo (required for mobile)

1. Go to [expo.dev](https://expo.dev)
2. Create account or sign in with GitHub
3. Go to **Account Settings** → **Access Tokens**
4. Click **Create Token**
5. Copy the token

```bash
# Add to your environment
export EXPO_TOKEN="your-token-here"
```

#### 2. Supabase (required for backend)

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Create a new project (remember the database password)
4. Wait for project to provision (~2 minutes)
5. Go to **Project Settings** → **API**
6. Copy:
   - **Project URL** (looks like `https://xyz.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

```bash
# Add to your environment
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="eyJ..."
```

#### 3. Anthropic (optional, for AI)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account
3. Go to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-...`)

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

#### 4. Voyage AI (optional, for embeddings)

1. Go to [voyageai.com](https://www.voyageai.com)
2. Create account
3. Go to **API Keys** in dashboard
4. Create and copy key

```bash
export VOYAGE_API_KEY="your-voyage-key"
```

#### 5. Cloudflare or Vercel (optional, for web)

**Cloudflare:**
1. Go to [cloudflare.com](https://cloudflare.com)
2. Create account
3. Go to **My Profile** → **API Tokens**
4. Create token with Workers permissions

**Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Go to **Settings** → **Tokens**
4. Create token

---

## The Stack

Here's what you get with the default setup:

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | React Native + Expo | Cross-platform mobile, web capable, JavaScript ecosystem |
| **Backend** | Supabase | Auth, database, storage, realtime, edge functions — all in one |
| **Language** | TypeScript | Type safety without enterprise complexity |
| **Deployment** | Expo EAS + Cloudflare/Vercel | Push-button deploys, no DevOps required |
| **AI** *(optional)* | Claude + Voyage AI + pgvector | LLM reasoning, embeddings, vector search — all in Supabase |

This stack powers real production apps. It's optimized for speed to market with a small team (or one person with agents).

---

## Why These Choices

### React Native + Expo

**What it is:** A framework for building mobile apps with JavaScript/TypeScript. Expo adds tooling that handles the hard parts.

**Why it works:**
- One codebase for iOS, Android, and web
- Huge ecosystem of libraries
- Fast development with hot reloading
- Expo handles app store builds, updates, notifications

**The alternative:** Build separate iOS (Swift) and Android (Kotlin) apps. 2-3x the work.

### Supabase

**What it is:** An open-source Firebase alternative. Gives you a Postgres database plus auth, storage, realtime subscriptions, and edge functions.

**Why it works:**
- **Auth built-in** — Google, Apple, email/password, magic links. No Auth0 integration needed.
- **Database included** — Postgres with a nice UI. Row-level security for authorization.
- **Storage included** — File uploads handled. No S3 configuration.
- **Realtime included** — Subscriptions to database changes. No WebSocket setup.
- **Edge functions** — Serverless functions when you need custom logic.

**The alternative:** Separate services for each (Auth0 + RDS + S3 + Pusher + Lambda). More to configure, more to pay for, more to break.

### TypeScript

**What it is:** JavaScript with type checking.

**Why it works:**
- Catches errors before runtime
- Better autocomplete and refactoring
- Shared types between frontend and backend
- Works with the entire JS ecosystem

**The alternative:** Plain JavaScript. Faster to write initially, harder to maintain.

### Expo EAS + Cloudflare/Vercel

**What it is:**
- Expo EAS (Expo Application Services) builds, submits, and hosts your mobile apps
- Cloudflare or Vercel hosts your web app and serverless functions

**Why it works:**
- Push code, get builds. No Xcode or Android Studio configuration.
- App store submission handled
- Over-the-air updates for instant fixes
- EAS Update for instant mobile updates without app store review
- Cloudflare/Vercel deploy on git push

**Cloudflare vs Vercel:**
- Cloudflare: Cheaper at scale, global edge network, Workers for serverless
- Vercel: Better DX, great for Next.js, simpler to start

**The alternative:** Manage your own CI/CD, build servers, signing certificates. Hours of DevOps.

---

## Adding AI/LLM Capabilities

If your app uses AI — chat, semantic search, recommendations, content generation — here's the stack:

| Layer | Technology | Why |
|-------|------------|-----|
| **LLM** | Claude (Anthropic) | Best reasoning, tool use, long context |
| **Embeddings** | Voyage AI | High-quality embeddings, better than OpenAI for retrieval |
| **Vector Store** | pgvector (in Supabase) | Vector search in your existing Postgres — no separate service |
| **RAG Pipeline** | Custom + Supabase | Retrieval-Augmented Generation using your own data |

### How It Fits Together

```
┌─────────────────────────────────────────────────────────────┐
│                      AI-POWERED APP                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   User Query: "How do I reset my password?"                 │
│                          │                                  │
│                          ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    Voyage AI                         │   │
│   │              (embed the query)                       │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Supabase + pgvector                     │   │
│   │         (find similar documents)                     │   │
│   │                                                      │   │
│   │   SELECT * FROM documents                            │   │
│   │   ORDER BY embedding <=> query_embedding             │   │
│   │   LIMIT 5;                                           │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    Claude                            │   │
│   │   (answer using retrieved context)                   │   │
│   │                                                      │   │
│   │   "Based on your docs, here's how to reset..."      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Setting Up pgvector in Supabase

Supabase includes pgvector. Enable it:

```sql
-- Enable the extension
create extension if not exists vector;

-- Create a table with embeddings
create table documents (
  id uuid primary key default gen_random_uuid(),
  content text,
  embedding vector(1024),  -- Voyage AI dimension
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Create an index for fast similarity search
create index on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
```

### Generating Embeddings with Voyage AI

```typescript
import Anthropic from '@anthropic-ai/sdk';

const voyageClient = new Anthropic({
  apiKey: process.env.VOYAGE_API_KEY,
  baseURL: 'https://api.voyageai.com/v1',
});

async function getEmbedding(text: string): Promise<number[]> {
  const response = await voyageClient.embeddings.create({
    model: 'voyage-3',
    input: text,
  });
  return response.data[0].embedding;
}
```

### RAG Query Flow

```typescript
async function askWithContext(question: string): Promise<string> {
  // 1. Embed the question
  const queryEmbedding = await getEmbedding(question);

  // 2. Find similar documents
  const { data: docs } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_count: 5,
  });

  // 3. Build context
  const context = docs.map(d => d.content).join('\n\n');

  // 4. Ask Claude with context
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Context:\n${context}\n\nQuestion: ${question}`,
    }],
  });

  return response.content[0].text;
}
```

### Supabase Function for Similarity Search

```sql
create or replace function match_documents(
  query_embedding vector(1024),
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### When to Use RAG

**Good for:**
- Help/support bots that know your product
- Search over your own content
- Personalized recommendations
- Q&A over documents

**Not needed for:**
- General chat (Claude already knows a lot)
- Simple classification tasks
- Code generation

---

## The Full Picture

```
┌─────────────────────────────────────────────────────────────┐
│                         YOUR APP                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              React Native + Expo                     │   │
│   │                                                      │   │
│   │   iOS App    Android App    Web App                  │   │
│   │      │            │            │                     │   │
│   │      └────────────┴────────────┘                     │   │
│   │                    │                                 │   │
│   └────────────────────┼─────────────────────────────────┘   │
│                        │                                     │
│                        ▼                                     │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                   Supabase                           │   │
│   │                                                      │   │
│   │   ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│   │   │   Auth   │ │ Database │ │ Storage  │            │   │
│   │   │          │ │ Postgres │ │  Files   │            │   │
│   │   └──────────┘ └──────────┘ └──────────┘            │   │
│   │                                                      │   │
│   │   ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│   │   │ Realtime │ │  Edge    │ │ pgvector │            │   │
│   │   │ Subscr.  │ │ Functions│ │ (AI/RAG) │            │   │
│   │   └──────────┘ └──────────┘ └──────────┘            │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                        │                                     │
│                        ▼ (optional)                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                   AI Services                        │   │
│   │                                                      │   │
│   │   ┌──────────┐ ┌──────────┐                         │   │
│   │   │  Claude  │ │ Voyage   │                         │   │
│   │   │  (LLM)   │ │ (Embed)  │                         │   │
│   │   └──────────┘ └──────────┘                         │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started With This Stack

### 1. Create Expo Project

```bash
npx create-expo-app my-app --template expo-template-blank-typescript
cd my-app
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key
4. Install the client:

```bash
npm install @supabase/supabase-js
```

5. Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Set Up Auth

Supabase auth works out of the box:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
});
```

### 4. Create Your Database

In Supabase dashboard, create tables. Example:

```sql
create table profiles (
  id uuid references auth.users primary key,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

### 5. Query Data

```typescript
// Read
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);

// Write
const { data, error } = await supabase
  .from('profiles')
  .insert({ id: userId, name: 'John' });

// Realtime subscription
supabase
  .channel('profiles')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' },
    (payload) => console.log(payload))
  .subscribe();
```

### 6. Deploy

**Mobile (Expo EAS):**
```bash
npm install -g eas-cli
eas build --platform all
eas submit --platform all
```

**Web (Vercel):**
```bash
npm install -g vercel
vercel
```

---

## Project Structure

A typical project using this stack:

```
my-app/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/             # Auth screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (main)/             # Main app screens
│   │   ├── index.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
│
├── components/             # Reusable UI components
│   ├── Button.tsx
│   └── Card.tsx
│
├── lib/                    # Business logic
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Auth helpers
│   └── types.ts            # TypeScript types
│
├── hooks/                  # React hooks
│   ├── useAuth.ts
│   └── useProfile.ts
│
├── constants/              # App constants
│   ├── colors.ts
│   └── config.ts
│
├── docs/                   # Agentic docs (copied from templates)
│   ├── _TODAY.md
│   ├── _AGENTS.md
│   └── ...
│
└── package.json
```

---

## When This Stack Fits

**Good for:**
- Mobile apps (iOS + Android)
- Web apps
- Apps with user accounts
- Apps that need realtime features
- Solo founders or small teams
- MVPs and production apps

**Consider alternatives for:**
- High-performance games (use Unity or native)
- Heavy computation (may need dedicated backend)
- Enterprise with existing infrastructure
- Apps that must be purely native

---

## Cost

For an early-stage product:

| Service | Free Tier | Paid Starts |
|---------|-----------|-------------|
| Supabase | 500MB DB, 1GB storage, 50K auth users | $25/mo |
| Expo EAS | 30 builds/mo | $99/mo |
| Cloudflare | Generous free tier | $5/mo (Workers) |
| Vercel | 100GB bandwidth | $20/mo |
| Claude API | — | ~$3/M input tokens, $15/M output |
| Voyage AI | — | ~$0.06/M tokens |

You can build and launch a real product on free tiers. AI costs scale with usage but are very low for early products. Costs kick in with success.

---

## Summary

| Layer | Choice |
|-------|--------|
| **Frontend** | React Native + Expo |
| **Backend** | Supabase |
| **Language** | TypeScript |
| **Deploy** | Expo EAS + Cloudflare/Vercel |
| **AI/LLM** | Claude + Voyage AI + pgvector (optional) |

This stack is:
- Fast to set up
- Well-documented
- Production-ready
- Cost-effective
- Perfect for agents to work with (standard patterns, good types)

You can debate alternatives forever. Or you can use this and start building.

---

→ Back to [README](README.md)

