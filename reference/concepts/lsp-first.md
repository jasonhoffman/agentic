# LSP-First Exploration

Use language server capabilities before text search. The LSP understands code structure; grep understands text.

---

## The Pattern

When exploring or modifying TypeScript code:

1. **Find references** before changing a function or type
2. **Go to definition** to understand what something is
3. **Check type info** to understand what flows in and out
4. **Then grep** only for things LSP can't find (comments, strings, config)

---

## Why This Matters

**Grep finds text:**
```bash
grep "getUserProfile"
# Returns: every mention, including comments, strings, imports
```

**LSP finds meaning:**
```
Find references: getUserProfile
# Returns: actual call sites, with context
```

For refactoring, impact analysis, and understanding code flow — LSP is more precise.

---

## Before Changing Code

Always ask:

1. **How many places call this?**
   - LSP: find all references
   - If many, consider the blast radius

2. **What types flow through here?**
   - LSP: hover for type info
   - Understand inputs and outputs before modifying

3. **What will break?**
   - Run `tsc --noEmit` after changes
   - Type errors show impact immediately

---

## Impact Assessment Pattern

For pre-launch or any careful change:

```
Before changing `src/lib/auth.ts:validateToken`:

1. Find references: 12 call sites across 4 files
2. Type signature: (token: string) => Promise<User | null>
3. Used by: middleware, API routes, WebSocket handler

Impact: Medium. Affects auth flow.
Proceed? [Ask if uncertain]
```

This pattern prevents "I changed one thing and broke three others."

---

## When to Use Grep Instead

LSP doesn't help with:
- Configuration files (JSON, YAML)
- Comments and documentation
- String literals and magic values
- Files outside the TypeScript project

For these, use Grep or Glob.

---

## Practical Commands

In Claude Code, these translate to:

| Intent | Approach |
|--------|----------|
| Find all usages of a function | Read the file, then ask about references |
| Understand a type | Read the type definition file |
| Check what imports a module | Grep for the import path |
| Find where an error is thrown | Grep for the error message |

The LSP runs automatically when reading TypeScript files. Type information is available in the response.

---

## Integration with Pre-Launch Mode

In pre-launch (stabilization), LSP-first is mandatory:

1. Find all references to the thing you're fixing
2. Understand the type boundaries
3. Make the minimal change
4. Verify with `tsc --noEmit`
5. Check that references still work

No "while I'm here" changes. The LSP shows you exactly what's connected — fix only what's broken.
