# /diff-review

Review staged or unstaged git changes for issues before committing.

## Steps

1. Run `git diff` (unstaged) and `git diff --cached` (staged)
2. Check for:
   - **Secrets:** API keys, passwords, tokens, connection strings in diff
   - **Debug code:** `console.log`, `debugger`, `TODO` left in production paths
   - **Hardcoded values:** Hex colours not using design tokens, magic numbers not using spacing tokens
   - **Type safety:** Any `as any`, untyped parameters, missing return types on exported functions
   - **Dead code:** Commented-out code blocks, unused imports, unreachable code
   - **Constraint violations:** Does the change introduce anything that violates CONSTRAINTS.md?
   - **Design drift:** Does any styling deviate from DESIGN.md?

3. For each issue found:
   - File and line number
   - What the problem is
   - Severity: BLOCK (must fix) / WARN (should fix) / NOTE (consider)

## Output Format

```
DIFF REVIEW
-------------------------------
Files changed: [N]
Additions: +[N] lines
Deletions: -[N] lines

Issues:
[BLOCK] file.tsx:42 — Hardcoded hex #FF0000, use bg-pop
[WARN]  file.tsx:88 — console.log left in component
[NOTE]  file.tsx:12 — Unused import 'useState'

-------------------------------
Verdict: CLEAN / [N] blocks, [N] warns, [N] notes
```
