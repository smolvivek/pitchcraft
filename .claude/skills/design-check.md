# /design-check

Audit the specified component or file against PitchCraft's A24 dark design system.

## Steps

1. Read `DESIGN.md` for the canonical design tokens
2. Read the file(s) the user specifies (or the last-edited component)
3. Check every instance of:
   - **Colours:** Must use design tokens (`pop`, `surface`, `background`, `border`, `text-primary`, `text-secondary`, `text-disabled`). No hardcoded hex values. No `dark:` variants. No light-mode colours.
   - **Spacing:** Must follow 8px grid (`8, 16, 24, 32, 40, 48, 56, 64, 80, 96`). Flag odd values.
   - **Typography:** Headings use `var(--font-heading)`, body uses `var(--font-body)`, mono uses `var(--font-mono)`. No system fonts directly.
   - **Border radius:** 4px only (`rounded-[4px]` or `radius-sm`). No `rounded-lg`, `rounded-xl`.
   - **Tailwind v4:** No `accent-*` custom colours (reserved keyword). Token names: `pop`, `link`, `btn`, `surface`, `surface-hover`, `border`, `border-hover`.
   - **Animations:** No constant-running ambient animations unless explicitly approved. `prefers-reduced-motion` must be respected.
   - **Dark only:** No `bg-white`, no light backgrounds, no `dark:` prefix anywhere.

4. Return a checklist: PASS or FAIL for each category, with specific line numbers for violations.

## Output Format

```
DESIGN AUDIT: [filename]
-------------------------------
Colours:      PASS / FAIL (details)
Spacing:      PASS / FAIL (details)
Typography:   PASS / FAIL (details)
Radius:       PASS / FAIL (details)
Tailwind v4:  PASS / FAIL (details)
Animations:   PASS / FAIL (details)
Dark only:    PASS / FAIL (details)
-------------------------------
Verdict:      CLEAN / [N] issues found
```
