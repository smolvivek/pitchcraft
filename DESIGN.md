# DESIGN.md — Design System & Aesthetic Direction

(Working title product: TBD)

**For brand personality, voice, and pop colour usage strategy, see [BRAND.md](./BRAND.md)**

---

## Design Philosophy

Pitchcraft's design draws from three influences:

### 1. Teenage Engineering — "Precision Instrument"
- Monospace for all metadata (versions, counts, timestamps)
- Sidebar as step sequencer during pitch creation
- Numbers celebrated, not hidden (char count, word count, version)
- Satisfying state transitions (SVG draw animations, 300ms)

### 2. Dieter Rams — "The Tool Disappears"
- Pitch view page = creator's work, not Pitchcraft's UI
- Color restraint: pop colour only on primary actions + status indicators
- Typography IS the hierarchy (no decorative elements needed)
- Sacred 8px grid, pixel-perfect alignment

### 3. Apple — "Invisible Power"
- Progressive disclosure (one section at a time during creation)
- Keyboard shortcuts for power users (invisible until needed)
- Smart defaults (genre selection reorders optional sections)

**The result:** A product that feels like a precision instrument for creative professionals. Serious but warm. Purposeful but not austere.

---

## Core Design Principles

### 1. No Loud UI
- No bright gradients, animated mascots, or attention-grabbing colors
- No card shadows that scream "interact here"
- Design whispers. It doesn't shout.

### 2. Function Before Beauty
- Every visual choice solves a problem
- Decorative elements don't exist
- If it doesn't clarify, it doesn't ship

### 3. Consistency Over Novelty
- One accent color (pop `#AF2E1B` — Braun Signal Red, from DR05 Dieter Rams palette)
- Three fonts (heading, body, metadata monospace)
- Consistent 8px spacing grid
- Same aesthetic everywhere

### 4. Respect Creator Time
- Minimal scrolling
- Clear information hierarchy
- Progressive disclosure (advanced options hidden by default)
- No friction in the critical path (building a pitch)

### 5. Calm Interactions
- Animations clarify, they don't distract
- Transitions are snappy (200–300ms, not slow)
- Hover states are subtle (not dramatic)

---

## Visual System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#DBDDD0` (Braun warm gray, DR05) | Page backgrounds, content areas |
| **Surface** | `#D0D2C5` | Hover states, sidebar, subtle differentiation |
| **Border** | `#B3B5A8` | Warm neutral border, visible on #DBDDD0 |
| **Text primary** | `#1A1A1A` | Near-black, body and headings |
| **Text secondary** | `#6B6560` | Warm muted, captions, help text |
| **Text disabled** | `#A8A29E` | Non-interactive elements |
| **Pop** (`--color-pop`) | `#AF2E1B` | Non-text: focus rings, progress bars, active indicators |
| **Pop hover** (`--color-pop-hover`) | `#952717` | Pop colour hover state |
| **Pop active** (`--color-pop-active`) | `#7E2213` | Pop colour pressed state |
| **Link** (`--color-link`) | `#AF2E1B` | Text links, tertiary buttons |
| **Button** (`--color-btn`) | `#1A1A1A` | Primary button background (dark charcoal, white text) |
| **Button hover** (`--color-btn-hover`) | `#333333` | Button hover state |
| **Button active** (`--color-btn-active`) | `#000000` | Button pressed state |
| **Status: Development** | `#D32F2F` | Red dot + label |
| **Status: Production** | `#E8A817` | Amber dot + label |
| **Status: Completed** | `#388E3C` | Green dot + label |
| **Error** | `#D32F2F` | Form validation |
| **Success** | `#4CAF50` | Confirmations |

**Background texture:** Subtle CSS grain overlay (SVG noise pattern, ~3% opacity). Adds tactile warmth without competing with content.

**No Dark Mode.** Light mode only. The design system is calibrated for warm cream backgrounds. No `dark:` variants, no `prefers-color-scheme` media queries.

---

### Pop Colour Usage Rules (NON-NEGOTIABLE)

**Use pop colour like Teenage Engineering uses orange: sparingly, structurally, purposefully.**

Pop colour (`#AF2E1B`) is the visual accent. Primary buttons use dark charcoal (`#1A1A1A`), not the pop colour — buttons earn trust through restraint, not brightness.

**✅ ONLY use pop colour for:**
1. Active states (current section in sidebar, selected item)
2. Focus rings and progress indicators
3. Completion marks and filled progress bars
4. Links and tertiary text actions (via `--color-link`)

**✅ Use dark charcoal (`--color-btn`) for:**
1. Primary action buttons (ONE per page — the main CTA)
2. Button hover/active states darken further

**❌ NEVER use pop colour for:**
1. Hover states (use subtle gray `#D0D2C5` instead)
2. Primary button backgrounds (buttons are dark charcoal, not pop)
3. Decorative accents (no pop colour borders, backgrounds, or flourishes)
4. Non-interactive text (labels, body copy, metadata stay monochrome)

**The test:** If you remove all pop colour from the page, it should still work. Pop colour is the **signal**, not the structure.

See [BRAND.md](./BRAND.md) for complete pop colour strategy.

---

### Typography

| Use | Font | Weight | Size |
|-----|------|--------|------|
| **Page title** | Space Grotesk | 600 | 32px / 40px line-height |
| **Section header** | Space Grotesk | 600 | 24px / 32px line-height |
| **Subsection** | Space Grotesk | 600 | 18px / 28px line-height |
| **Body** | Inter | 400 | 16px / 24px line-height |
| **Small/caption** | Inter | 400 | 14px / 20px line-height |
| **Label/input** | Inter | 500 | 14px / 20px line-height |
| **Metadata** (versions, timestamps, counts) | JetBrains Mono | 400 | 13px / 20px line-height |

**Letter Spacing:**
- Headings: `-0.02em` (slight tightening, professional)
- Body: `0em` (default, readable)

**Font Weights:** Only 400, 500, 600. No variable font weights.

---

### Spacing & Grid

**8px Base Unit:**
- All spacing multiples of 8px: 8, 16, 24, 32, 40, 48, 56, 64, 80, 96
- Margins between sections: 32–48px
- Padding within containers: 16–24px
- Gap between form fields: 16px
- Gap between buttons: 8px

**Responsive Spacing:**
- Mobile (< 768px): Compressed spacing (16px margins, 12px gaps)
- Desktop (768px+): Full spacing (32px margins, 16px gaps)

---

### Button Design

**Primary Button** (Main action: "Create Project", "Share Link", "Save Draft")
- Background: `#1A1A1A` (dark charcoal — white text, high contrast)
- Text: White (`#FFFFFF`)
- Padding: 12px 24px (height ~44px for touchability)
- Border radius: 4px
- Font: 14px / 600 weight
- Hover: `#333333`
- Active: `#000000`
- Disabled: `#B3B5A8` background, `#A8A29E` text
- Transition: 200ms ease-out

**Secondary Button** (Less important: "Cancel", "Skip", "Preview")
- Background: Transparent
- Border: 1px solid `#B3B5A8`
- Text: `#1A1A1A`
- Padding: 12px 24px
- Hover: Background `#D0D2C5`
- Active: Background `#E8E0D8`

**Tertiary Button** (Minimal action: "Learn more", "Help")
- Background: Transparent
- Border: None
- Text: `#AF2E1B` (`--color-link`)
- Padding: 8px 16px
- Hover: Underline
- Active: `#333333` text

**Button Layout:**
- Primary buttons flush left in forms
- Multiple buttons: Primary on left, secondary/cancel on right
- Button text: Sentence case, action-oriented ("Save draft", not "SAVE DRAFT")

---

### Form Design

**Input Fields:**
- Background: `#FFFFFF`
- Border: 1px solid `#B3B5A8`
- Padding: 12px 16px (height ~44px)
- Border radius: 4px
- Font: 14px / 400 weight (Inter)
- Placeholder text: `#A8A29E`
- Focus state: Border `2px solid #AF2E1B` (`--color-pop`), no box-shadow, no glow
- Error state: Border `2px solid #D32F2F`, error text below field
- Disabled: Background `#D0D2C5`, text `#A8A29E`, border `#B3B5A8`

**Textarea/Large Input:**
- Same as input, but min-height 120px
- Line height: 1.5 for readability
- Allow user resize

**Checkboxes:**
- Size: 20x20px (touchable)
- Color: `#AF2E1B` (`--color-pop`) when checked
- Border: 2px solid `#B3B5A8`
- Label: 14px, to the right, clickable
- Spacing: 8px gap between checkbox and label

**Select/Dropdown:**
- Same padding/height as input (44px)
- Arrow icon: `#AF2E1B` (`--color-pop`), right-aligned
- Hover: Background `#D0D2C5`

**Form Layout:**
- One column on mobile and desktop (keep it simple)
- Labels above inputs, never to the side
- Required fields marked with asterisk (`*`) in `#D32F2F`
- Help text below field in `#6B6560`, 14px
- Validation errors below field in `#D32F2F`

---

### Cards & Containers

**Section Container:**
- Background: `#FFFFFF`
- Border: 1px solid `#B3B5A8`
- Padding: 24px
- Border radius: 4px
- Shadow: None (keep flat)
- Margin below: 24px

**Pitch Card** (in listings):
- Same as section container
- Title: 18px / 600 weight (Space Grotesk)
- Metadata below in JetBrains Mono (status badge, date, version)
- Hover: Background `#D0D2C5`

**Status Badge:**
- Format: `[colored dot] Status`
- Dot size: 8px diameter
- Text: 14px / 400 weight (Inter)
- Colors: Red (`#D32F2F`), Amber (`#E8A817`), Green (`#388E3C`)
- No shadow, no rounded background (just the dot + text)

---

### Navigation & Structure

**Top Navigation Bar:**
- Height: 64px
- Background: `#DBDDD0`
- Border-bottom: 1px solid `#B3B5A8`
- Logo: Left side
- Navigation links: Right side, 14px / 400 weight (Inter)
- Active link: Pop colour underline (`#AF2E1B`)
- Mobile: Hamburger at < 768px

**Sidebar (Pitch Creation — Step Sequencer):**
- Width: 240px
- Background: `#D0D2C5` (surface color)
- Border-right: 1px solid `#B3B5A8`
- Sections 01–08 (required) always visible as numbered steps
- Completion indicators: SVG draw animation on completion (300ms)
- Active section: Left border `#AF2E1B` (`--color-pop`), bolder text
- Monospace section numbers (JetBrains Mono)

**Sidebar "More" Pattern (Optional Sections):**
- Below section 08: **"More"** label/button, always visible
- Clicking "More" expands a scrollable panel showing all optional sections (09–27)
- Each optional section has a toggle — enable it and it appears as a numbered step in the main sidebar
- Enabled optional sections continue numbering: 09, 10, 11...
- User can enable sections at ANY time — before, during, or after filling required fields
- Disabled sections visible in "More" panel but don't clutter the main sidebar
- Each section in "More" shows name + one-line description
- "More" panel is collapsible (▼/▲ chevron)

**Per-Section Media Capabilities (All Optional Sections):**
- Notes field (textarea)
- Reference image uploads (multiple per section, with optional per-image captions)
- Video/link embeds (YouTube, Vimeo, or any URL)

---

### Animations & Interactions

**Quality bar: Lando Norris website, Wall-E, Ghibli films, Ghost in the Shell**

All animations must be senior-level craft — cinematic patience, reveals structure/meaning, never decoration. See [BRAND.md](./BRAND.md) for motion design philosophy.

---

#### Signature Animation 1: Scroll-Driven Landing Page

The landing page is a sequence you move through, not a static page you read. The user's scroll IS the film reel advancing.

- **Hero headline:** Three lines ("Present your work." / "Fund your vision." / "Own your story.") clip-reveal horizontally left-to-right as the user scrolls into them, staggered 300ms apart. `cubic-bezier(0.16, 1, 0.3, 1)`. Subheading fades in 400ms after last line. CTA button cuts in last — no animation, just appears.
- **Each landing section** enters through scroll position — content transforms as you scroll, not just "appears when in viewport." Scroll position controls the animation progress directly.
- **Typography is the visual element.** Large-scale type moves with cinematic intention. No floating shapes, no decorative elements — the words themselves are the motion.
- Total hero sequence: ~1.8s from first scroll trigger.

#### Signature Animation 2: Section Transition (A24 Title Card)

The defining animation of the product. Every time you move between sections in create/edit, this happens:

1. Current content drops to opacity 0 (150ms ease-out)
2. Section number appears large (72px JetBrains Mono, weight 500), centered in the content area
3. Number holds for 350ms — this is the title card moment. The hold is where the confidence lives.
4. Number fades as new section content fades in behind it (300ms)
5. Total: ~1s. Patient but not slow.

This happens dozens of times per session. If it feels cinematic every time, the whole product feels cinematic. This is the one animation worth real investment in craft.

---

#### Timing

- Short transitions (state changes): 150–200ms
- Medium transitions (page/section): 250–300ms
- Long transitions (major changes): 400–500ms
- Cinematic transitions (hero, section titles): 750ms–1s, `cubic-bezier(0.16, 1, 0.3, 1)`
- Easing: `ease-out` for most. No spring easing unless structurally motivated.

#### Micro-Interactions

**Button Press:** Scale to 0.98x on press, immediate. Returns to 1.0 on release (100ms ease-out). Like pressing a physical key. No spring.

**Input Focus:** Border color change to `#AF2E1B`, 200ms ease-out. No glow, no shadow.

**Save/Create Success:** Button text swaps to "Saved" (or "Created") — instant, no animation. Reverts after 1.2s. For create: standard page navigation to dashboard. No fade to black. No glow on new card. The absence of fanfare IS the design. Inline feedback — no floating toasts.

**Sidebar Completion:** Section number color shifts from neutral to pop `#AF2E1B` (200ms ease-out). Tick mark appears instantly — no drawn animation. Like a hardware toggle clicking into position. Binary state change.

**Section Navigation:** Signature Animation 2 (A24 title card — see above).

**Rolling Digits:** Word count, char count, and version numbers roll like a mechanical counter. Each digit column scrolls independently, staggered 30ms per column right-to-left. 200ms per roll, ease-out (odometers don't bounce). At 80% limit: digits shift to `#AF2E1B` instantly. Over limit: `#D32F2F` instantly. Teenage Engineering–style.

**Progress Bar:** Ease-out fill, NO overshoot. 400ms. Precision is the point. At 8/8 complete: bar and label shift to `#388E3C`. No pulse. No glow. A gauge reads "complete" — it doesn't dance.

**Budget Segment Selection:** No scale. Selected segment fills with `#AF2E1B`, text goes white. 150ms ease-out. Previous segment returns to neutral simultaneously. One on, one off. Like radio presets on a Braun receiver.

**Status Radio Selection:** Dot appears at full size, color fills instantly. Card border shifts to status color (200ms ease-out). No spring. No glow.

**Cast/Team Member Add:** New card appears at full size. Opacity 0 → 1, 150ms ease-out. First input auto-focuses — the focus ring IS the attention signal. No slide. No scale. No glow.

**Flow Beats (Horizontal Scroll):** Each beat scales from 0.95 → 1.0 on viewport entry with staggered timing offset. Cinematic reveal.

**Modal/Overlay:** Backdrop dims 40% black, no blur. Modal appears at full size, opacity 0 → 1, 200ms ease-out. No scale animation.

**Drag Reorder:** Dragged item lifts (subtle shadow + scale 1.02x). Other items shift to make room. Snaps into place. Tactile.

**Loading States:** Skeleton screens with subtle pulse animation. Content-shaped placeholders.

**Empty States:** Text + single action button. Optionally with large background section number (oversized, 8–10% opacity) as a structural visual element. No self-drawing illustrations.

**Keyboard Shortcuts:** Hold-to-reveal — holding modifier key (Cmd/Ctrl) shows shortcut hints on relevant buttons. Invisible until needed.

**Grain Texture:** Shifts subtly on scroll/click (CSS transform offset on `::before`, triggered by scroll events). Reactive, not continuous. Zero CPU cost at rest.

**Sound Design (Toggleable, TE OP-1 style — clean, digital, short):**
- Soft click on save
- Subtle tick on section completion
- Muted pop on publish
- All sounds can be toggled off in settings
- No sound on first visit (opt-in)

**No confetti, no bounce animations, no spring overshoot, no slide transitions, no floating toasts, no glow effects, no ambient floating shapes.**

---

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px–1024px
- Desktop: > 1024px

**Mobile Strategy:**
- Single-column layout
- Tap targets: Minimum 44x44px
- Text size: Never below 16px
- Spacing: Compress from 32px to 16px margins
- Navigation: Hamburger menu, nav slides in

**Tablet Strategy:**
- Two-column layout where appropriate (sidebar + content)
- Full spacing

**Desktop Strategy:**
- Multi-column layouts, more whitespace
- Content max-width for readability

---

### Accessibility

**Color Contrast:**
- All text: WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- Status colors: Always include text label alongside color dot
- Never rely on color alone

**Keyboard Navigation:**
- All interactive elements focusable via Tab
- Focus state: 2px `#AF2E1B` (`--color-pop`) outline
- No keyboard traps
- Logical tab order (left-to-right, top-to-bottom)

**Screen Readers:**
- All images have alt text
- Form labels properly associated with inputs
- Semantic HTML headings (`<h1>`, `<h2>`, etc.)
- Skip-to-content link

**Mobile Accessibility:**
- Touch targets minimum 44x44px
- No auto-playing media

---

## Creation Experience

**Hybrid: Instrument panel + writing surface**

- Sidebar = step sequencer (8 required sections as channel strip, completion indicators that draw themselves on completion)
- Main content = clean distraction-free editor (generous whitespace, warm cream background, no chrome)
- Context switches seamlessly: sidebar for navigation/status, main area for focused writing

---

## Pitch View Page (Shared Link)

Film lookbook + A24 branding confidence:

- Minimal top bar: Pitchcraft mark, version badge (JetBrains Mono), share button
- Logline at 36px Space Grotesk, semibold
- Metadata row in JetBrains Mono (genre, status, budget)
- Text max-width 680px (comfortable reading)
- Images and Flow section break to full bleed
- No dark mode. Light only.

---

## Background Texture

Subtle CSS grain overlay applied to `<body>`:
- SVG noise pattern at ~3% opacity
- Fixed position, pointer-events: none
- Adds tactile warmth without competing with content
- Barely visible on screens, perceptible as texture

---

## Voice & Tone

**See [BRAND.md](./BRAND.md) for complete voice guidelines and approved copy examples.**

**Foundation:** David Ogilvy + British dry humor. Sharp, economical, warm. Self-aware wit, never condescending.

**Personality:** "The editor who makes you look sharp" — in service of the creator, never judging.

**Terminology:** Use "project" (not "pitch") throughout UI. Product name is working title and will change.

**Quick reference examples:**

| ❌ Generic SaaS | ✅ Our Voice |
|----------------|-------------------|
| "Welcome back! Let's make today amazing!" | "Welcome back, [Name]" |
| "You have 0 projects. Get started by creating your first project!" | "Nothing here. Time to fix that." |
| "Oops! Something went wrong. Please try again later." | "Save failed. Try again" |
| "Your project was successfully saved!" | "Saved" |
| "Are you absolutely sure you want to delete this?" | "Delete project? This action can't be undone." |

**Approved copy (from BRAND.md):**
- Project published: "Your work is ready. Now the hard part: sharing it."
- Empty state: "Nothing here. Time to fix that." OR "No projects yet. Rectify this."
- After save: "Saved."
- Character limit: "Too long. Edit."
- Back to empty: "Back to square one."

**Never:**
- Exclamation marks (except critical errors)
- Emoji
- Marketing speak, corporate jargon
- Condescending tone ("Share wisely", "Send it to someone who matters")

---

## Final Design Principle

**Good design is invisible.**

If a user notices the design, we've failed. The tool should disappear. Only the creator's work should be visible.

Restrain. Clarify. Respect.
