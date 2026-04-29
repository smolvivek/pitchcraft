# SKILLS.md — Claude Code Custom Skills

Custom slash commands for PitchCraft development. Located in `.claude/skills/`.

---

## Available Commands

| Command | What it does | When to use |
|---------|-------------|-------------|
| `/moth` | Spawns Moth — independent code auditor. Flags broken flows, ghost features, constraint drift, security holes, silent failures | Any time. Especially when something feels off. |
| `/design-check` | Audits a component against A24 dark design system (colours, spacing, typography, radius, animations) | Before shipping any UI change |
| `/constraint-check` | Verifies a feature/change against all 13 CONSTRAINTS.md boundaries | Before planning or shipping any feature |
| `/feature-plan` | Scaffolds a full feature plan (what ships, what doesn't, files, acceptance criteria) | Before writing any code for a new feature |
| `/deploy-check` | Pre-deploy safety: build, types, secrets, git status, console.logs | Before pushing to main or deploying |
| `/copy-review` | Reviews UI/marketing text against brand voice (Apple-level economy, cinematic confidence) | Before shipping any user-facing text |
| `/diff-review` | Reviews git diff for secrets, debug code, hardcoded values, dead code, constraint violations | Before committing changes |
| `/explain-code` | Explains code with ASCII diagrams, analogies, step-by-step walkthrough, and gotchas | When you want to understand how something works |

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

## Installed Plugin Skills (Claude Code Marketplace)

| Command | Plugin | What it does | When to use |
|---------|--------|-------------|-------------|
| `/simplify` | bundled | 3 parallel agents: Reuse · Quality · Efficiency — finds and fixes all issues | After every implementation session, before marking feature done |
| `/commit` | bundled | Auto-drafts commit message from diff, stages and commits | Quick checkpoint without writing commit messages manually |
| `/update-config` | bundled | Safely merges settings into `~/.claude/settings.json` (hooks, MCP, permissions) | Adding new MCP servers or hooks |
| `/frontend-design` | frontend-design | Reviews component structure, layout, accessibility, design system adherence | After building any UI component — catches BRAND.md drift |
| `/ralph-loop` | ralph-loop | Autonomous iteration loop — feeds same task back until completion promise is true | UX polish, animation refinement, accessibility sweeps |
| `/cancel-ralph` | ralph-loop | Stops an active Ralph loop | When a loop is running and you want to abort |
| `/feature-dev` | feature-dev | Guided feature dev: discovery → clarification → architecture → code | Starting a new BUILD_SEQUENCE feature |
| `/code-review` | code-review | 5-agent PR review: CLAUDE.md, bugs, git history, prior PR comments, code comments | Before merging any significant PR |
| `/review-pr` | pr-review-toolkit | Targeted PR review — pass aspects like `security`, `accessibility` | When you want focused review rather than full sweep |
| `/commit-push-pr` | commit-commands | Commit + push + open PR in one flow | Feature complete and ready for review |
| `/clean-gone` | commit-commands | Prune stale remote-tracking branches | Periodic repo hygiene |

### Ralph Loop Usage Example
```
/ralph-loop "make the pitch creation form frictionless" --max-iterations 5 --completion-promise "all steps have inline validation, no wall-of-fields, no dead ends"
```

---

## MCP Servers (configured — activate on session restart)

| Server | Package | What it does | In Pitchcraft |
|--------|---------|-------------|---------------|
| Playwright | `@playwright/mcp@latest` | Full browser automation: navigate, click, fill forms, screenshot | UX audits of all flows end-to-end |
| Puppeteer | `@modelcontextprotocol/server-puppeteer` | Headless Chrome: screenshots, console errors, perf | Visual regression checks, JS error detection |

---

## Active Hooks

| Hook | Trigger | What it does |
|------|---------|-------------|
| tsc check | PostToolUse on `Write\|Edit` of `.ts`/`.tsx` | Runs `tsc --noEmit` — surfaces type errors immediately at edit time |

---

## When to Use What (Decision Guide)

| Situation | Use |
|-----------|-----|
| Finished implementing a component | `/simplify` |
| Starting a new BUILD_SEQUENCE feature | `/feature-dev` |
| Iterating until something is truly polished | `/ralph-loop` |
| Checking UI for BRAND.md / design system compliance | `/frontend-design` + `/design-check` |
| Reviewing code before merging | `/code-review` or `/review-pr` |
| Reviewing UI copy | `/copy-review` |
| Pre-deploy gate | `/deploy-check` |
| UX audit of a live flow (browser) | Playwright MCP |
| Visual regression / console errors | Puppeteer MCP |
| Adding hooks or MCP servers | `/update-config` |
| Understanding how a file or feature works | `/explain-code` |

---

## Adding New Skills

Create a markdown file in `.claude/skills/`:
```
.claude/skills/my-skill.md
```

The filename (minus `.md`) becomes the slash command: `/my-skill`

The file content is the prompt Claude executes when the command is invoked.
