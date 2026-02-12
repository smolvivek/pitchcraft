# BRAND.md — Brand Personality & Voice

## Who PitchCraft Is

**"The editor who makes you look sharp"**

PitchCraft is the tool that gets creators ready for the producer's table.

- **In service of the creator** — Amplifies their vision, never imposes our own
- **Gives capabilities they didn't have** — AI tools for images and text
- **Makes sharing effortless** — One link, shareable everywhere (social bios, emails, etc.)
- **Enables professional fundraising** — Easy to use, never amateur-looking
- **Trusted collaborator** — Knows what you need, doesn't second-guess your work

---

## Voice & Tone

**Foundation: David Ogilvy + British dry humor**

### Core Principles

1. **Sharp and economical** — No wasted words. Every sentence earns its place.
2. **Specific and concrete** — "Eight fields" not "a few fields". "15 minutes" not "quickly".
3. **Benefits-focused** — What the creator gets, not what the feature does.
4. **Self-aware observational wit** — Warm, relatable, understated. Never snarky or condescending.
5. **Friendly and warm** — Like an editor giving honest feedback, not a critic judging.

### Examples (Approved)

**Project published:**
```
Your work is ready. Now the hard part: sharing it.
```

**Empty state:**
```
Nothing here. Time to fix that.
```
OR
```
No projects yet. Rectify this.
```

**After save:**
```
Saved.
```

**Character limit exceeded:**
```
Too long. Edit.
```

**Dashboard after deleting last project:**
```
Back to square one.
```

### What NOT to Say

❌ "Share wisely" (condescending, parental)
❌ "Send it to someone who matters" (judgmental, superior)
❌ "Eight required fields" (highlighting friction, not value)
❌ "Your first project starts here" (cliché, forgettable)
❌ Exclamation marks (except critical errors)
❌ Marketing speak ("game-changer", "seamless", "revolutionary")

---

## Terminology

**Use "project" throughout the UI** (not "pitch")

- "Create project" (not "Create pitch")
- "Your projects" (not "Your pitches")
- "Share your work" (not "Share your pitch")

**Why:** Product name "PitchCraft" is a working title and will change. Using "project" keeps UI copy neutral and adaptable.

**Database/code** can use `pitches` table internally, but user-facing language = "project"

---

## Visual Personality

**Maximum restraint. Confidence through subtraction.**

Inspired by: Teenage Engineering, Dieter Rams, A24, Apple (Jony Ive era)

### Core Traits

1. **Negative space as active element** — Not just "clean", but breathing room that creates structure
2. **Typography as hierarchy** — Scale and weight do the work, not decoration
3. **Monochrome + terracotta** — Limited palette, used with precision
4. **Every element has purpose** — If you can't explain why it's there, remove it
5. **Personality emerges from precision** — Not from decoration or cleverness

---

## Terracotta Accent Strategy

**Use terracotta like Teenage Engineering uses orange: sparingly, structurally, purposefully.**

### Only Use Terracotta For:

1. **Active states** — Current section in sidebar, selected item
2. **Primary actions** — ONE per page (the main CTA)
3. **Progress indicators** — Completion marks, filled progress bars
4. **User-created content markers** — Elements the creator added (not system UI)

### Never Use Terracotta For:

1. **Hover states** — Use subtle gray instead
2. **Multiple buttons on same screen** — Only the primary action gets terracotta
3. **Decorative accents** — No terracotta borders, backgrounds, or flourishes
4. **Non-interactive text** — Labels, body copy, metadata stay monochrome

### The Test

**If you remove all terracotta from the page, it should still work.**

Terracotta is the **signal**, not the structure.

---

## Motion Design Philosophy

**Quality bar: Lando Norris website, Wall-E, Ghibli films, Ghost in the Shell**

### Principles

1. **Cinematic patience** — Moves slowly, deliberately. Never rushes.
2. **Reveals structure and meaning** — Animation shows how things work, not just decoration
3. **Senior-level craft** — Every animation is considered, purposeful, polished
4. **Earns its place** — If animation doesn't add understanding or delight, cut it

### Reference Points

- **Lando Norris website** — Split-text reveals, smooth easing, large-scale typography in motion
- **Wall-E** — Character through subtle movement, personality in micro-gestures
- **Ghibli films** — Patience, weight, natural physics
- **Ghost in the Shell** — Cinematic UI, information reveals, technical precision

### Never

- Generic fade-ins or slide-ups
- Bouncy/springy effects (unless structurally motivated like TE knobs)
- Loading spinners (use progress indicators or subtle patterns)
- Motion for motion's sake

---

## What PitchCraft Is NOT

Actively avoid these personalities:

- ❌ **Generic SaaS** — No "seamless workflows" or "powerful dashboards"
- ❌ **Tech startup** — No Silicon Valley energy or growth-hacking language
- ❌ **Design tool** — Not Figma/Canva (we're for presentation, not creation)
- ❌ **Hollywood studio** — Not corporate, not bureaucratic
- ❌ **Precious art gallery** — Not elitist or unapproachable
- ❌ **Cold engineering tool** — Precise but warm, never sterile

---

## Brand Adjectives (Approved)

**Primary traits:**
- Confident
- Precise
- Warm
- Understated
- Intentional

**Secondary traits:**
- Direct
- Refined
- Grounded
- Assured
- Cinematic

---

## Implementation Notes

- All new copy must pass the "Ogilvy test" — sharp, specific, benefit-focused
- All new UI must pass the "terracotta test" — used sparingly and structurally
- All new animations must pass the "senior craft test" — Lando/Wall-E quality bar
- When in doubt, subtract. Restraint is the brand.

---

**This document is authoritative for all brand decisions. Update it when brand evolves, but changes require deliberate approval.**
