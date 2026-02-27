# SKILLS.md — Claude Code Custom Skills

Custom slash commands for PitchCraft development. Located in `.claude/skills/`.

---

## Available Commands

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/design-check` | Audits a component against A24 dark design system (colours, spacing, typography, radius, animations) | Before shipping any UI change |
| `/constraint-check` | Verifies a feature/change against all 13 CONSTRAINTS.md boundaries | Before planning or shipping any feature |
| `/feature-plan` | Scaffolds a full feature plan (what ships, what doesn't, files, acceptance criteria) | Before writing any code for a new feature |
| `/deploy-check` | Pre-deploy safety: build, types, secrets, git status, console.logs | Before pushing to main or deploying |
| `/copy-review` | Reviews UI/marketing text against brand voice (Apple-level economy, cinematic confidence) | Before shipping any user-facing text |
| `/diff-review` | Reviews git diff for secrets, debug code, hardcoded values, dead code, constraint violations | Before committing changes |

---

## Usage

Type the command in Claude Code. Provide context if needed:

```
/design-check components/ui/Button.tsx
/constraint-check "Add view count to shared pitches"
/feature-plan "Add version history to pitches"
/deploy-check
/copy-review components/landing/LandingHero.tsx
/diff-review
```

---

## Skill Details

### `/design-check`
Reads DESIGN.md, then audits the specified file for:
- Hardcoded hex values (must use tokens)
- Spacing not on 8px grid
- Wrong font families
- Border radius not 4px
- `accent-*` Tailwind v4 conflict
- Constant animations without reduced-motion support
- Any light-mode styles

Returns: PASS/FAIL checklist per category.

### `/constraint-check`
Reads CONSTRAINTS.md, then checks the proposed change against all 13 constraints:
- No AI content generation (C1)
- No ranking/scoring (C2)
- No marketplace (C3)
- No analytics/surveillance (C4)
- No templates (C5)
- No social features (C6)
- No attention harvesting (C7)
- No forced upsell (C8)
- No silent automation (C9)
- No mission creep (C10)
- No data extraction (C11)
- No algo judgement (C12)
- No forced bundling (C13)

Returns: CLEAR/VIOLATION per constraint.

### `/feature-plan`
Produces a structured plan per CLAUDE.md §5:
- What ships (specific)
- What does NOT ship (explicit exclusions)
- Files to modify (table)
- Data model changes
- Acceptance criteria (testable)
- Testing instructions
- Constraint check

Does NOT write code. Plan only.

### `/deploy-check`
Runs:
1. `npx next build` — zero errors
2. `npx tsc --noEmit` — zero type errors
3. `git status` — clean working tree
4. Secret scan — no API keys in tracked files
5. Console.log scan — no debug statements in components
6. Dependency check — no unused packages

Returns: PASS/FAIL per check, deploy readiness verdict.

### `/copy-review`
Reviews text against PitchCraft voice:
- Apple-level word economy
- Cinematic confidence (filmmaker, not marketer)
- Concrete over abstract
- Active voice
- No startup jargon
- No filler words

Returns: Current text, problem, rewrite for each issue.

### `/diff-review`
Reviews `git diff` for:
- Exposed secrets
- Debug code left in
- Hardcoded values (colours, magic numbers)
- Type safety issues (`as any`)
- Dead code (commented blocks, unused imports)
- Constraint violations
- Design drift

Returns: BLOCK/WARN/NOTE per issue.

---

## Adding New Skills

Create a markdown file in `.claude/skills/`:
```
.claude/skills/my-skill.md
```

The filename (minus `.md`) becomes the slash command: `/my-skill`

The file content is the prompt Claude executes when the command is invoked.
