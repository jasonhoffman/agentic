# Database Schema

> **Canonical Documentation** - This file is the source of truth for database structure.
>
> See [_ARCHITECTURE.md](./_ARCHITECTURE.md) for architecture and business logic.
>
> **Last Updated:** [Date]
> **Migrations:** [N]+ migrations in `[migrations path]`

---

## Schema Walkthrough

This section provides a conceptual tour of how data flows through the system.

### The [Core System] Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                        [SYSTEM NAME]                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [external_system]                                                 │
│        │                                                            │
│        ▼                                                            │
│   ┌─────────┐     ┌──────────────┐     ┌───────────────┐          │
│   │ table_1 │────▶│   table_2    │◀────│    table_3    │          │
│   └─────────┘     └──────────────┘     └───────────────┘          │
│        │                 │                                          │
│        │           (relationship                                    │
│        │            description)                                    │
│        ▼                                                            │
│   ┌──────────────┐                                                 │
│   │   table_4    │  (purpose description)                          │
│   └──────────────┘                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key concepts:**
- **[Concept 1]** = [Definition]
- **[Concept 2]** = [Definition]
- **[Concept 3]** = [Definition]

### The [Another System] Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                       [SYSTEM NAME]                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌───────────────────┐                                            │
│   │    parent_table   │  [Description]                             │
│   └─────────┬─────────┘                                            │
│             │                                                       │
│             ▼                                                       │
│   ┌───────────────────┐     ┌─────────────────┐                   │
│   │   child_table_1   │────▶│  child_table_2  │                   │
│   └───────────────────┘     └─────────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Table Overview

### [Category 1] ([N] tables)

| Table | Purpose |
|-------|---------|
| `table_name` | Short purpose description |
| `table_name` | Short purpose description |
| `table_name` | Short purpose description |

### [Category 2] ([N] tables)

| Table | Purpose |
|-------|---------|
| `table_name` | Short purpose description |
| `table_name` | Short purpose description |

### [Category 3] ([N] tables)

| Table | Purpose |
|-------|---------|
| `table_name` | Short purpose description |
| `table_name` | Short purpose description |

---

## Detailed Tables

### [Category Name]

#### `table_name` — [Purpose]

```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields
  name TEXT NOT NULL,
  description TEXT,

  -- Foreign keys
  related_id UUID REFERENCES other_table(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_constraint UNIQUE (field1, field2)
);

-- Indexes
CREATE INDEX idx_table_field ON table_name(field);

-- Triggers
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Columns:**

| Column | Type | Purpose | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | Primary key | Auto-generated |
| `name` | `TEXT` | [Purpose] | Required |
| `related_id` | `UUID` | FK to [table] | Nullable |
| `created_at` | `TIMESTAMPTZ` | Creation time | Auto-set |

**Relations:**
- Joins to `other_table` via `related_id`
- Has many `child_table` via `parent_id`

**RLS Policies:**
- Read: [Policy description]
- Write: [Policy description]

**Common Queries:**

```typescript
// Fetch with related data
const { data } = await supabase
  .from('table_name')
  .select('*, related:other_table(*)')
  .eq('field', value);

// Create new record
const { data } = await supabase
  .from('table_name')
  .insert({ name: 'value', related_id: 'uuid' })
  .select()
  .single();
```

---

### [Another Category]

#### `another_table` — [Purpose]

```sql
CREATE TABLE another_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- fields...
);
```

**Columns:**

| Column | Type | Purpose | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | Primary key | Auto-generated |

---

## Enums and Types

### `enum_name`

```sql
CREATE TYPE enum_name AS ENUM (
  'value_1',
  'value_2',
  'value_3'
);
```

| Value | Meaning |
|-------|---------|
| `value_1` | [Description] |
| `value_2` | [Description] |
| `value_3` | [Description] |

---

## Functions and RPCs

### `function_name(params)`

```sql
CREATE OR REPLACE FUNCTION function_name(
  param1 UUID,
  param2 TEXT DEFAULT NULL
)
RETURNS [return_type]
LANGUAGE plpgsql
SECURITY [DEFINER|INVOKER]
AS $$
BEGIN
  -- Implementation
END;
$$;
```

**Purpose:** [What this function does]

**Parameters:**
- `param1` — [Description]
- `param2` — [Description] (optional)

**Returns:** [Description of return value]

**Usage:**

```typescript
const { data } = await supabase.rpc('function_name', {
  param1: 'value',
  param2: 'value',
});
```

---

## Views

### `view_name`

```sql
CREATE VIEW view_name AS
SELECT
  t1.id,
  t1.name,
  t2.related_field
FROM table_1 t1
JOIN table_2 t2 ON t1.id = t2.table_1_id;
```

**Purpose:** [What this view provides]

---

## Business Logic

### [Feature Name] Flow

1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

```sql
-- Example query for this flow
SELECT * FROM table WHERE condition;
```

### [Another Feature] Flow

1. [Step 1]
2. [Step 2]

---

## RLS Policies Summary

| Table | Read Policy | Write Policy |
|-------|-------------|--------------|
| `table_1` | Authenticated users | Owner only |
| `table_2` | Public | Admin only |
| `table_3` | Organization members | Organization admins |

### RLS Best Practices

- Never query other RLS-protected tables from within RLS policies (causes recursion)
- Use `SECURITY DEFINER` helper functions for cross-table checks
- All helper functions must set explicit `search_path`

---

## Migrations

Total: [N] migrations

Recent migrations:
- `YYYYMMDD_NNNNNN_description.sql` — [What it does]
- `YYYYMMDD_NNNNNN_description.sql` — [What it does]
- `YYYYMMDD_NNNNNN_description.sql` — [What it does]

### Migration Commands

```bash
# Create new migration
[cli] migration new description_of_change

# Apply migrations
[cli] db push

# Check migration status
[cli] db diff
```

---

## Troubleshooting

### Issue: [Common Problem]

**Cause:** [Root cause]

**Solution:**
```sql
-- SQL to diagnose or fix
SELECT * FROM table WHERE condition;
```

### Issue: [Another Problem]

**Cause:** [Root cause]

**Solution:** [Steps to fix]

---

## Conventions

- Use `snake_case` for table and column names
- Use `TIMESTAMPTZ` for all timestamps (never `TIMESTAMP`)
- Always include `created_at` and `updated_at` columns
- Use UUIDs for primary keys
- Foreign key columns end with `_id`
- Soft deletes use `deleted_at` column where needed

---

*Last verified: [Date]*
