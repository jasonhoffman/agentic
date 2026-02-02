# Multimodel MCP: What We Built vs What We Used

## The Pattern

Claude Code as orchestrator + MCP server for external model access.

```
User → Claude crafts prompt → parallel_query → Claude synthesizes
```

## What We Thought We Needed

- Protocol definitions (system prompts, response schemas, similarity strategies)
- Prompt versioning with quality scoring
- Job queues with retry logic
- Consensus items with embeddings for similarity matching
- Quorum configuration (min_consensus, voting strategies)
- Audit trail (jobs → results → consensus_items)
- 720 lines of schema

## What We Actually Used

- `parallel_query` tool
- Claude synthesizes the responses
- Natural language instructions ("review this for X", "extract claims from Y")

## The Shift

Pre-agentic thinking builds infrastructure to compensate for dumb execution. You define protocols because the system can't figure out what you mean. You version prompts because the system can't write good ones. You build consensus algorithms because the system can't judge quality.

Claude Code doesn't need that scaffolding. It writes prompts contextually, judges responses, synthesizes disagreements, and adapts to what you actually asked for.

## The Minimum Capability

```
MCP server (stdio, not ports)
  → query_openai
  → query_gemini
  → embed_voyage
  → parallel_query

Keys from Vault or .env.local
```

~380 lines of TypeScript. Claude does the rest.

## Usage

No commands to memorize. No scripts to invoke.

- "Use the multimodel MCP to review the code in xyz.ts"
- "Use the multimodel MCP to extract claims from this URL"
- "Query both models and tell me what they agree on"

## When You Might Want More

- Cost tracking (if budget matters)
- Response caching (if you're hitting the same queries)
- Team audit requirements (compliance, not capability)

Start without it. Add when the need is real, not anticipated.

## Architecture Notes

- Each Claude Code session spawns its own MCP server subprocess
- Communication via stdio pipes, not network ports
- Multiple terminals = multiple independent subprocesses, no conflict
- Keys: Supabase Vault (recommended) or .env.local fallback
