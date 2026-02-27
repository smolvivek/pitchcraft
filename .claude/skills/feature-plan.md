# /feature-plan

Scaffold a feature plan following CLAUDE.md Section 5 (Planning Before Execution).

## Steps

1. Read `CLAUDE.md` (especially sections 4, 5, 6)
2. Read `CONSTRAINTS.md` to check for violations
3. Read `product.md` for product context
4. Read relevant existing code to understand current state

5. Produce a plan with these exact sections:

## Output Format

```markdown
# Feature: [Name]

## What Ships
- Bullet list of exactly what will be built
- Be specific: "Add X button to Y page" not "improve the UI"

## What Does NOT Ship
- Explicitly state what's out of scope
- Prevents creep during implementation

## Files to Modify

| # | File | Changes |
|---|------|---------|
| 1 | path/to/file | What changes |

## New Files (if any)

| # | File | Purpose |
|---|------|---------|

## Data Model Changes
- Any new tables, columns, or migrations
- Or "None"

## Acceptance Criteria
- [ ] Testable criterion 1
- [ ] Testable criterion 2
- [ ] Edge case handled

## Testing Instructions
- Step-by-step manual testing guide
- What the creator should check

## Constraint Check
- Confirm no CONSTRAINTS.md violations
```

6. Do NOT write any code. Plan only.
7. Wait for explicit approval before proceeding.
