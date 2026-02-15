# MCP Server + Voyage Embeddings + pgRouting Graph

Reference architecture for semantic search and graph analysis over a large corpus, built on Supabase. Proven at scale: 275k nodes, 927k edges, 275k embeddings.

---

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Database | Supabase (Postgres) | Storage, RPC, RLS, pgvector, pgRouting |
| Embeddings | Voyage AI (voyage-4-large) | 1024-dim vectors for semantic search |
| Vector search | pgvector (ivfflat) | Cosine similarity via `<=>` operator |
| Graph | pgRouting + PostGIS | Dijkstra shortest path, driving distance, graph analysis |
| Interface | MCP Server (Model Context Protocol) | Tool-based access for Claude/LLMs |
| Client | @supabase/supabase-js | RPC calls from MCP tools to Postgres functions |

---

## 1. Schema Design

### Core table: nodes

```sql
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Domain-specific fields (adapt to your data)
  category TEXT NOT NULL,
  identifier TEXT NOT NULL,
  heading TEXT NOT NULL,
  full_text TEXT NOT NULL,

  -- Metadata
  source_url TEXT,
  word_count INT GENERATED ALWAYS AS (
    array_length(regexp_split_to_array(trim(full_text), '\s+'), 1)
  ) STORED,

  -- pgRouting integer node ID (added later via migration)
  graph_id INTEGER,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(category, identifier)
);
```

Key points:
- **UUID primary keys** for the application layer
- **graph_id INTEGER** for pgRouting (requires integer node IDs)
- **word_count as generated column** — free metadata, no maintenance
- **UNIQUE constraint** on natural key for idempotent upserts

### Embeddings table (pgvector)

```sql
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  embedding vector(1024) NOT NULL,
  model TEXT DEFAULT 'voyage-4-large',
  content_hash TEXT, -- SHA256 of input text, for idempotent re-embedding
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section_id, model)
);

CREATE INDEX embeddings_vector_idx ON embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Key points:
- **UNIQUE(section_id, model)** — one embedding per section per model. Allows multi-model storage.
- **content_hash** — SHA256 of the text that was embedded. Skip re-embedding if hash matches. Makes the pipeline idempotent.
- **ivfflat index** — `lists = 100` is good for up to ~500k rows. Scale `lists` as sqrt(n_rows).
- **vector(1024)** — Voyage voyage-4-large outputs 1024 dims. Adjust for your model.

### Relationship tables (the edges, pre-graph)

```sql
-- Direct references: node A cites node B
CREATE TABLE cross_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  reference_text TEXT, -- the raw reference string found in text
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_id, target_id)
);

-- Typed relationships (domain-specific)
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL, -- 'owns', 'implements', 'delegates', etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(parent_id, child_id)
);
```

### Graph edge table (for pgRouting)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgrouting;

CREATE TABLE graph_edges (
  id SERIAL PRIMARY KEY,
  source INTEGER NOT NULL,  -- graph_id of source section
  target INTEGER NOT NULL,  -- graph_id of target section
  cost DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  reverse_cost DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  edge_type TEXT NOT NULL   -- 'relationship', 'cross_reference', etc.
);

CREATE INDEX idx_ge_source ON graph_edges(source);
CREATE INDEX idx_ge_target ON graph_edges(target);
CREATE INDEX idx_ge_source_target ON graph_edges(source, target);
CREATE INDEX idx_ge_type ON graph_edges(edge_type);
```

Key points:
- **SERIAL id** — pgRouting requires integer edge IDs
- **source/target are INTEGER** — must reference graph_id, not UUID
- **cost/reverse_cost** — lower cost = stronger/preferred relationship. Set reverse_cost = cost for bidirectional, reverse_cost = -1 for one-way
- **edge_type** — allows filtering edges in pgRouting queries (pass different SQL strings)

---

## 2. Embedding Pipeline

### Voyage AI API

```typescript
async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "voyage-4-large",
      input: texts,
      input_type: "document", // "query" for search queries
    }),
  });
  const data = await response.json();
  return data.data.map((d: { embedding: number[] }) => d.embedding);
}
```

### Batch processing pattern

```typescript
const BATCH_SIZE = 128; // Voyage max is 128 for voyage-4-large
const sections = await fetchUnembeddedSections();

for (let i = 0; i < sections.length; i += BATCH_SIZE) {
  const batch = sections.slice(i, i + BATCH_SIZE);
  const texts = batch.map(s => `${s.heading}\n\n${s.full_text}`.slice(0, 16000));
  const hashes = texts.map(t => sha256(t));

  // Skip already-embedded (idempotent)
  const existing = await supabase
    .from("embeddings")
    .select("section_id, content_hash")
    .in("section_id", batch.map(s => s.id));

  const existingMap = new Map(
    (existing.data ?? []).map(e => [e.section_id, e.content_hash])
  );

  const toEmbed = batch.filter((s, idx) =>
    existingMap.get(s.id) !== hashes[idx]
  );

  if (toEmbed.length === 0) continue;

  const embedTexts = toEmbed.map((s, idx) => texts[batch.indexOf(s)]);
  const embeddings = await embedBatch(embedTexts);

  // Upsert with content_hash for future idempotency
  await supabase.from("embeddings").upsert(
    toEmbed.map((s, idx) => ({
      section_id: s.id,
      embedding: JSON.stringify(embeddings[idx]),
      model: "voyage-4-large",
      content_hash: hashes[batch.indexOf(s)],
    })),
    { onConflict: "section_id,model" }
  );
}
```

### Server-side similarity search (RPC function)

```sql
CREATE OR REPLACE FUNCTION match_sections(
  query_embedding vector(1024),
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 20
)
RETURNS TABLE (section_id UUID, similarity FLOAT)
LANGUAGE plpgsql STABLE
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT e.section_id,
         (1 - (e.embedding <=> query_embedding))::FLOAT AS similarity
  FROM public.embeddings e
  WHERE (1 - (e.embedding <=> query_embedding)) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

Key points:
- **`<=>` is cosine distance** — similarity = 1 - distance
- **SET search_path = ''** — required for Supabase RLS compatibility
- **Filter in the query** — don't fetch all then filter client-side
- **match_threshold 0.3** — good default for voyage-4-large. Tighten for precision, loosen for recall.

### Lessons learned (embeddings)

- **content_hash makes it idempotent.** You can re-run the pipeline and it skips unchanged sections. Critical for incremental updates.
- **Voyage batch limit is 128.** Exceeding it returns a 422. Respect it.
- **input_type matters.** Use `"document"` when embedding corpus content, `"query"` when embedding search queries. Voyage optimizes differently for each.
- **Truncate to 16k chars.** voyage-4-large has a token limit. 16k chars is safe. For longer sections, embed heading + first 16k of body.
- **ivfflat vs hnsw:** ivfflat is faster to build, hnsw is faster to query. For < 500k rows, ivfflat is fine. For millions, consider hnsw.

---

## 3. pgRouting Graph

### Setting up graph_id on existing table

pgRouting requires integer node IDs. Add them to your sections table:

```sql
-- Increase timeout for large tables
SET LOCAL statement_timeout = '600s';

-- Add column
ALTER TABLE sections ADD COLUMN IF NOT EXISTS graph_id INTEGER;

-- Backfill
UPDATE sections SET graph_id = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id)::INTEGER AS rn
  FROM sections
) sub
WHERE sections.id = sub.id
  AND sections.graph_id IS NULL;

-- Sequence for future inserts
CREATE SEQUENCE IF NOT EXISTS sections_graph_id_seq;
SELECT setval('sections_graph_id_seq', COALESCE((SELECT MAX(graph_id) FROM sections), 0));

ALTER TABLE sections
  ALTER COLUMN graph_id SET DEFAULT nextval('sections_graph_id_seq'),
  ALTER COLUMN graph_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sections_graph_id ON sections(graph_id);
```

### Populating edges

Map your domain relationships to edges with meaningful costs:

```sql
-- Strong relationships (cost 1.0)
INSERT INTO graph_edges (source, target, cost, reverse_cost, edge_type)
SELECT DISTINCT
  parent.graph_id,
  child.graph_id,
  1.0,
  1.0,
  'relationship'
FROM relationships r
JOIN sections parent ON parent.id = r.parent_id
JOIN sections child ON child.id = r.child_id;

-- Weaker relationships (cost 2.0)
INSERT INTO graph_edges (source, target, cost, reverse_cost, edge_type)
SELECT DISTINCT
  src.graph_id,
  tgt.graph_id,
  2.0,
  2.0,
  'cross_reference'
FROM cross_references cr
JOIN sections src ON src.id = cr.source_id
JOIN sections tgt ON tgt.id = cr.target_id;
```

### Cost model

Lower cost = preferred path. Design costs so Dijkstra naturally prefers the connections you care about:

| Edge type | Cost | Meaning |
|-----------|------|---------|
| Direct ownership/authority | 1.0 | Strongest — A directly controls B |
| Cross-reference/citation | 2.0 | Informational — A mentions B |
| Structural proximity | 3.0 | Same parent/category — A and B are siblings |

Bidirectional (`reverse_cost = cost`) means traversal in either direction. Set `reverse_cost = -1` for one-way edges.

### Core pgRouting functions

**Shortest path between two nodes:**

```sql
CREATE OR REPLACE FUNCTION find_path(
  source_uuid UUID,
  target_uuid UUID
)
RETURNS TABLE (
  seq INTEGER,
  section_id UUID,
  edge_type TEXT,
  step_cost DOUBLE PRECISION,
  total_cost DOUBLE PRECISION
) AS $$
DECLARE
  src_node INTEGER;
  tgt_node INTEGER;
BEGIN
  SELECT graph_id INTO src_node FROM sections WHERE id = source_uuid;
  SELECT graph_id INTO tgt_node FROM sections WHERE id = target_uuid;

  IF src_node IS NULL OR tgt_node IS NULL THEN RETURN; END IF;

  RETURN QUERY
  SELECT
    p.seq::INTEGER,
    s.id,
    e.edge_type,
    p.cost,
    p.agg_cost
  FROM pgr_dijkstra(
    'SELECT id, source, target, cost, reverse_cost FROM graph_edges',
    src_node, tgt_node,
    directed := false
  ) p
  LEFT JOIN sections s ON s.graph_id = p.node
  LEFT JOIN graph_edges e ON e.id = p.edge
  ORDER BY p.seq;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Reach analysis (everything reachable within cost limit):**

```sql
CREATE OR REPLACE FUNCTION node_reach(
  section_uuid UUID,
  max_cost DOUBLE PRECISION DEFAULT 5.0,
  edge_type_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  section_id UUID,
  total_cost DOUBLE PRECISION
) AS $$
DECLARE
  edges_sql TEXT;
  start_node INTEGER;
BEGIN
  SELECT graph_id INTO start_node FROM sections WHERE id = section_uuid;
  IF start_node IS NULL THEN RETURN; END IF;

  IF edge_type_filter IS NOT NULL THEN
    edges_sql := format(
      'SELECT id, source, target, cost, reverse_cost FROM graph_edges WHERE edge_type = %L',
      edge_type_filter
    );
  ELSE
    edges_sql := 'SELECT id, source, target, cost, reverse_cost FROM graph_edges';
  END IF;

  RETURN QUERY
  SELECT s.id, r.agg_cost
  FROM pgr_drivingDistance(edges_sql, start_node, max_cost, directed := false) r
  JOIN sections s ON s.graph_id = r.node
  WHERE s.id != section_uuid
  ORDER BY r.agg_cost;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Orphan analysis (nodes that lose all connections if a node is removed):**

```sql
CREATE OR REPLACE FUNCTION find_orphans(
  section_uuid UUID
)
RETURNS TABLE (orphaned_id UUID) AS $$
SELECT child.id
FROM relationships r
JOIN sections child ON child.id = r.child_id
WHERE r.parent_id = section_uuid
  AND NOT EXISTS (
    SELECT 1 FROM relationships other
    WHERE other.child_id = child.id
      AND other.parent_id != section_uuid
  );
$$ LANGUAGE sql STABLE;
```

**Most connected nodes (degree centrality):**

```sql
CREATE OR REPLACE FUNCTION most_connected(
  n INTEGER DEFAULT 20
)
RETURNS TABLE (
  section_id UUID,
  out_degree BIGINT,
  in_degree BIGINT,
  total_degree BIGINT
) AS $$
SELECT
  s.id,
  COALESCE(o.cnt, 0),
  COALESCE(i.cnt, 0),
  COALESCE(o.cnt, 0) + COALESCE(i.cnt, 0) AS total
FROM sections s
LEFT JOIN (SELECT source, COUNT(*) cnt FROM graph_edges GROUP BY source) o
  ON o.source = s.graph_id
LEFT JOIN (SELECT target, COUNT(*) cnt FROM graph_edges GROUP BY target) i
  ON i.target = s.graph_id
WHERE (COALESCE(o.cnt, 0) + COALESCE(i.cnt, 0)) > 0
ORDER BY total DESC
LIMIT n;
$$ LANGUAGE sql STABLE;
```

**Graph rebuild (after new data ingestion):**

```sql
CREATE OR REPLACE FUNCTION rebuild_graph()
RETURNS void AS $$
BEGIN
  UPDATE sections SET graph_id = sub.rn
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id)::INTEGER AS rn
    FROM sections
  ) sub
  WHERE sections.id = sub.id;

  PERFORM setval('sections_graph_id_seq', (SELECT MAX(graph_id) FROM sections));

  TRUNCATE graph_edges;

  INSERT INTO graph_edges (source, target, cost, reverse_cost, edge_type)
  SELECT DISTINCT p.graph_id, c.graph_id, 1.0, 1.0, 'relationship'
  FROM relationships r
  JOIN sections p ON p.id = r.parent_id
  JOIN sections c ON c.id = r.child_id;

  INSERT INTO graph_edges (source, target, cost, reverse_cost, edge_type)
  SELECT DISTINCT src.graph_id, tgt.graph_id, 2.0, 2.0, 'cross_reference'
  FROM cross_references cr
  JOIN sections src ON src.id = cr.source_id
  JOIN sections tgt ON tgt.id = cr.target_id;
END;
$$ LANGUAGE plpgsql;
```

### Lessons learned (pgRouting)

- **SET LOCAL statement_timeout = '600s'** in migrations that UPDATE large tables. Supabase default is ~8s. A 275k row UPDATE takes ~30s.
- **pgRouting depends on PostGIS.** Always `CREATE EXTENSION IF NOT EXISTS postgis` first, even if you don't use geographic features.
- **directed := false** for most pathfinding. Your relationships are conceptually directed but you usually want to find connections in either direction.
- **directed := true** for reach/impact analysis. "What does this node affect downstream?" is inherently directional.
- **Edge SQL is a string.** pgRouting takes a SQL query string as its first argument. This allows dynamic filtering to restrict traversal to specific edge types.
- **graph_id must be assigned before edges.** The edge table references graph_ids, so populate them first.
- **TRUNCATE + re-INSERT for graph rebuilds.** Incremental edge updates are complex and error-prone. For < 1M edges, a full rebuild takes seconds.
- **PostgREST has a default 1000 row limit** on RPC results. For full results, call from the MCP server where you control the client.

---

## 4. MCP Server Pattern

### Tool pattern

Every tool follows the same shape:

```typescript
server.tool(
  "tool_name",
  "Human-readable description of what this tool does",
  {
    param1: z.string().describe("What this parameter is"),
    param2: z.number().optional().default(20).describe("Optional with default"),
  },
  async ({ param1, param2 }) => {
    // Call Supabase RPC (for SQL functions)
    const { data, error } = await supabase.rpc("my_sql_function", {
      arg1: param1,
      arg2: param2,
    });

    if (error) throw new Error(error.message);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);
```

### Embedding search tool

```typescript
server.tool(
  "search",
  "Semantic search across the corpus",
  {
    query: z.string().describe("Natural language search query"),
    limit: z.number().optional().default(20),
  },
  async ({ query, limit }) => {
    // Embed the query (note: input_type = "query", not "document")
    const embedding = await embedQuery(query);

    const { data: matches } = await supabase.rpc("match_sections", {
      query_embedding: JSON.stringify(embedding),
      match_threshold: 0.3,
      match_count: limit,
    });

    const ids = (matches ?? []).map((m: any) => m.section_id);
    const { data: sections } = await supabase
      .from("sections")
      .select("id, category, identifier, heading, full_text")
      .in("id", ids);

    const sectionMap = new Map((sections ?? []).map(s => [s.id, s]));
    const results = (matches ?? []).map((m: any) => ({
      ...sectionMap.get(m.section_id),
      similarity: Math.round(m.similarity * 1000) / 1000,
    }));

    return {
      content: [{ type: "text" as const, text: JSON.stringify({ results }, null, 2) }],
    };
  }
);
```

### Identifier resolver pattern

If your tools accept both UUIDs and human-readable identifiers:

```typescript
async function resolveId(input: string): Promise<string> {
  if (input.match(/^[0-9a-f-]{36}$/i)) return input;

  const parsed = parseIdentifier(input); // domain-specific parsing
  if (!parsed) throw new Error(`Could not parse: ${input}`);

  const { data, error } = await supabase
    .from("sections")
    .select("id")
    .eq("category", parsed.category)
    .eq("identifier", parsed.identifier)
    .single();

  if (error || !data) throw new Error(`Not found: ${input}`);
  return data.id;
}
```

### Lessons learned (MCP)

- **Log to stderr, not stdout.** MCP protocol uses stdout for JSON-RPC. `console.error()` for diagnostics.
- **Zod schemas become the tool's input schema.** The MCP SDK converts Zod to JSON Schema automatically. Use `.describe()` on every field.
- **Always return `{ content: [{ type: "text", text: "..." }] }`.** The MCP protocol requires this shape.
- **`as const` on type field.** TypeScript needs `type: "text" as const` to narrow the union type.
- **Use service role key in the MCP server.** The server runs locally as a trusted process. Service role avoids RLS complications for complex queries.
- **API keys via MCP config env block.** Pass keys in the `env` field of `.mcp.json` rather than loading from dotenv files.

---

## 5. Typical Tool Inventory

| Type | Examples |
|------|----------|
| Semantic | Search by embedding similarity, find related nodes |
| Lookup | Load full node with relationships, trace connections |
| Query | Filter by metadata, aggregations, statistics |
| Graph | Shortest path, reach analysis, degree centrality, orphan detection |

---

## 6. Migration Order

Run in sequence. Each builds on the previous.

```
01_create_schema.sql      -- sections, cross_refs, relationships, embeddings, match_sections RPC
02_graph.sql              -- postgis, pgrouting, graph_id, graph_edges, graph functions
```

Then run scripts:
```
embed.ts                  -- Voyage embeddings (idempotent, can re-run)
rebuild_graph()           -- Call after any data ingestion to refresh edges
```

---

## 7. Supabase Gotchas

- **Statement timeout in migrations.** Supabase has an ~8s default. Add `SET LOCAL statement_timeout = '600s'` before large UPDATE/INSERT.
- **PostgREST 1000 row limit.** RPC calls return max 1000 rows by default. For full results, call from server-side code (MCP server), not the REST API directly.
- **pgvector search_path.** After `CREATE EXTENSION vector WITH SCHEMA extensions`, you need `SET search_path TO public, extensions` or qualify types as `extensions.vector(1024)`.
- **RLS on all tables.** Enable RLS + public read policy on every table, or PostgREST returns empty results for anon-key queries.
- **RPC functions need `SET search_path = ''`** for Supabase security. Without it, the function runs with the caller's search_path, which may not include `extensions`.
- **Prefer: count=estimated** for large tables. `count=exact` does a full table scan. `count=estimated` reads pg_class stats (instant but approximate).
