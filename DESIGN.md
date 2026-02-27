# DESIGN.md — Design System & Aesthetic Direction

**For brand personality, voice, and pop colour usage strategy, see [BRAND.md](./BRAND.md)**

---

## Design Philosophy

Pitchcraft's design draws from two influences:

### 1. A24 — "Cinematic Confidence"
- Dark backgrounds, content as the light source
- Type is the primary visual element — large, precise, unhurried
- Full-bleed imagery against darkness — photos and stills POP
- Restrained luxury: no decoration, no gradients, no visual noise
- The pitch view page should feel like opening a film's press kit in a dark screening room

### 2. Jony Ive — "Material Honesty"
- Depth through subtle layering, not ornamentation
- The interface recedes so the creator's work speaks
- Precision in every detail — spacing, alignment, contrast
- Sacred 8px grid, pixel-perfect alignment
- Progressive disclosure (one section at a time during creation)

**The result:** A product that feels like a premium screening room for creative professionals. Dark, cinematic, confident. The creator's work is the only thing that matters.

---

## Core Design Principles

### 1. Dark Canvas, Bright Content
- Near-black backgrounds let images, text, and media command attention
- Creator content is the light source — everything else recedes
- No visual competition between UI chrome and creative work

### 2. Function Before Beauty
- Every visual choice solves a problem
- Decorative elements don't exist
- If it doesn't clarify, it doesn't ship

### 3. Consistency Over Novelty
- One accent color (pop `#E8503A` — warm coral-red, visible on dark)
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
- No constant-running ambient animations

---

## Visual System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#0A0A0A` | Page backgrounds — near-black |
| **Surface** | `#141414` | Cards, sidebar, elevated surfaces |
| **Surface hover** | `#1A1A1A` | Hover state for surfaces |
| **Border** | `#262626` | Subtle borders, barely visible |
| **Border hover** | `#333333` | Border hover/focus state |
| **Text primary** | `#F5F5F5` | Body text and headings |
| **Text secondary** | `#999999` | Captions, metadata, help text |
| **Text disabled** | `#555555` | Non-interactive elements |
| **Pop** (`--color-pop`) | `#E8503A` | Non-text: focus rings, progress bars, active indicators |
| **Pop hover** (`--color-pop-hover`) | `#F06B55` | Pop colour hover state (lightens) |
| **Pop active** (`--color-pop-active`) | `#D44030` | Pop colour pressed state |
| **Link** (`--color-link`) | `#E8503A` | Text links, tertiary buttons |
| **Button** (`--color-btn`) | `#F5F5F5` | Primary button background (white on dark) |
| **Button hover** (`--color-btn-hover`) | `#FFFFFF` | Button hover state |
| **Button active** (`--color-btn-active`) | `#CCCCCC` | Button pressed state |
| **Status: Development** | `#FF6B6B` | Red dot + label |
| **Status: Production** | `#FFCA28` | Amber dot + label |
| **Status: Completed** | `#66BB6A` | Green dot + label |
| **Error** | `#FF6B6B` | Form validation |
| **Success** | `#66BB6A` | Confirmations |

**Background texture:** Subtle CSS grain overlay (SVG noise pattern, ~4% opacity). Adds analog film texture without competing with content.

**Dark mode only.** The design system is calibrated for near-black backgrounds. No `light:` variants.

---

### Pop Colour Usage Rules (NON-NEGOTIABLE)

Pop colour (`#E8503A`) is the visual signal. Primary buttons use white (`#F5F5F5`), not the pop colour — buttons earn trust through clarity, not color.

**Use pop colour for:**
1. Active states (current section in sidebar, selected item)
2. Focus rings and progress indicators
3. Completion marks and filled progress bars
4. Links and tertiary text actions (via `--color-link`)

**Use white (`--color-btn`) for:**
1. Primary action buttons (ONE per page — the main CTA)
2. Button text: dark (`#0A0A0A`) on white background

**NEVER use pop colour for:**
1. Primary button backgrounds
2. Decorative accents (no pop colour borders, backgrounds, or flourishes)
3. Non-interactive text (labels, body copy, metadata stay monochrome)

**The test:** If you remove all pop colour from the page, it should still work. Pop colour is the **signal**, not the structure.

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
- Background: `#F5F5F5` (white — dark text, high contrast on dark bg)
- Text: `#0A0A0A` (near-black)
- Padding: 12px 24px (height ~44px for touchability)
- Border radius: 4px
- Font: 14px / 600 weight
- Hover: `#FFFFFF`
- Active: `#CCCCCC`
- Disabled: `#262626` background, `#555555` text
- Transition: 200ms ease-out

**Secondary Button** (Less important: "Cancel", "Skip", "Preview")
- Background: Transparent
- Border: 1px solid `#262626`
- Text: `#F5F5F5`
- Padding: 12px 24px
- Hover: Background `#1A1A1A`, border `#333333`
- Active: Background `#141414`

**Tertiary Button** (Minimal action: "Learn more", "Help")
- Background: Transparent
- Border: None
- Text: `#E8503A` (`--color-link`)
- Padding: 8px 16px
- Hover: Underline
- Active: `#D44030` text

**Button Layout:**
- Primary buttons flush left in forms
- Multiple buttons: Primary on left, secondary/cancel on right
- Button text: Sentence case, action-oriented ("Save draft", not "SAVE DRAFT")

---

### Form Design

**Input Fields:**
- Background: `#141414` (surface)
- Border: 1px solid `#262626`
- Padding: 12px 16px (height ~44px)
- Border radius: 4px
- Font: 14px / 400 weight (Inter)
- Text: `#F5F5F5`
- Placeholder text: `#555555`
- Focus state: Border `2px solid #E8503A` (`--color-pop`), no box-shadow, no glow
- Error state: Border `2px solid #FF6B6B`, error text below field
- Disabled: Background `#0A0A0A`, text `#555555`, border `#1A1A1A`

**Textarea/Large Input:**
- Same as input, but min-height 120px
- Line height: 1.5 for readability
- Allow user resize

**Checkboxes:**
- Size: 20x20px (touchable)
- Color: `#E8503A` (`--color-pop`) when checked
- Border: 2px solid `#262626`
- Label: 14px, to the right, clickable
- Spacing: 8px gap between checkbox and label

**Select/Dropdown:**
- Same padding/height as input (44px)
- Arrow icon: `#E8503A` (`--color-pop`), right-aligned
- Hover: Background `#1A1A1A`

**Form Layout:**
- One column on mobile and desktop (keep it simple)
- Labels above inputs, never to the side
- Required fields marked with asterisk (`*`) in `#FF6B6B`
- Help text below field in `#999999`, 14px
- Validation errors below field in `#FF6B6B`

---

### Cards & Containers

**Section Container:**
- Background: `#141414` (surface)
- Border: 1px solid `#262626`
- Padding: 24px
- Border radius: 4px
- Shadow: None (flat on dark)
- Margin below: 24px

**Pitch Card** (in listings):
- Same as section container
- Title: 18px / 600 weight (Space Grotesk)
- Metadata below in JetBrains Mono (status badge, date, version)
- Hover: Border `#333333`, faint glow `rgba(255,255,255,0.02)`

**Status Badge:**
- Format: `[colored dot] Status`
- Dot size: 8px diameter
- Text: 14px / 400 weight (Inter)
- Colors: Red (`#FF6B6B`), Amber (`#FFCA28`), Green (`#66BB6A`)
- No shadow, no rounded background (just the dot + text)

---

### Navigation & Structure

**Top Navigation Bar:**
- Height: 64px
- Background: `#0A0A0A` (same as page)
- Border-bottom: 1px solid `#262626`
- Logo: Left side, `#F5F5F5`
- Navigation links: Right side, 14px / 400 weight (Inter), `#999999`
- Active link: Pop colour underline (`#E8503A`)
- Mobile: Hamburger at < 768px

**Sidebar (Pitch Creation — Step Sequencer):**
- Width: 240px
- Background: `#141414` (surface)
- Border-right: 1px solid `#262626`
- Sections 01–08 (required) always visible as numbered steps
- Completion indicators: Pop colour dot on completion
- Active section: Left border `#E8503A` (`--color-pop`), text `#F5F5F5`
- Inactive: text `#999999`
- Monospace section numbers (JetBrains Mono)

**Sidebar "More" Pattern (Optional Sections):**
- Below section 08: **"More"** label/button, always visible
- Clicking "More" expands a scrollable panel showing all optional sections (09–27)
- Each optional section has a toggle — enable it and it appears as a numbered step in the main sidebar
- Enabled optional sections continue numbering: 09, 10, 11...
- User can enable sections at ANY time — before, during, or after filling required fields
- Disabled sections visible in "More" panel but don't clutter the main sidebar
- Each section in "More" shows name + one-line description
- "More" panel is collapsible (chevron)

**Per-Section Media Capabilities (All Optional Sections):**
- Notes field (textarea)
- Reference image uploads (multiple per section, with optional per-image captions)
- Video/link embeds (YouTube, Vimeo, or any URL)

---

### Animations & Interactions

**Quality bar: Lando Norris website, Wall-E, Ghibli films, Ghost in the Shell**

All animations must be senior-level craft — cinematic patience, reveals structure/meaning, never decoration. See [BRAND.md](./BRAND.md) for motion design philosophy.

**No constant-running ambient animations.** All animations are triggered by user interaction or page entry, then settle to rest.

---

#### Signature Animation 1: Scroll-Driven Landing Page

The landing page is a sequence you move through, not a static page you read. The user's scroll IS the film reel advancing.

- **Hero headline:** Three lines clip-reveal horizontally left-to-right as the user scrolls into them, staggered 300ms apart. `cubic-bezier(0.16, 1, 0.3, 1)`. Subheading fades in 400ms after last line. CTA button cuts in last — no animation, just appears.
- **Each landing section** enters through scroll position — content transforms as you scroll, not just "appears when in viewport."
- **Typography is the visual element.** Large-scale type moves with cinematic intention. No floating shapes, no decorative elements — the words themselves are the motion.
- Total hero sequence: ~1.8s from first scroll trigger.

#### Signature Animation 2: Section Transition (A24 Title Card)

The defining animation of the product. Every time you move between sections in create/edit, this happens:

1. Current content drops to opacity 0 (150ms ease-out)
2. Section number appears large (72px JetBrains Mono, weight 500), centered in the content area
3. Number holds for 350ms — this is the title card moment. The hold is where the confidence lives.
4. Number fades as new section content fades in behind it (300ms)
5. Total: ~1s. Patient but not slow.

---

#### Timing

- Short transitions (state changes): 150–200ms
- Medium transitions (page/section): 250–300ms
- Long transitions (major changes): 400–500ms
- Cinematic transitions (hero, section titles): 750ms–1s, `cubic-bezier(0.16, 1, 0.3, 1)`
- Easing: `ease-out` for most. No spring easing unless structurally motivated.

#### Micro-Interactions

**Button Press:** Scale to 0.98x on press, immediate. Returns to 1.0 on release (100ms ease-out). Like pressing a physical key. No spring.

**Input Focus:** Border color change to `#E8503A`, 200ms ease-out. No glow, no shadow.

**Save/Create Success:** Button text swaps to "Saved" (or "Created") — instant, no animation. Reverts after 1.2s. Inline feedback — no floating toasts.

**Sidebar Completion:** Section number color shifts from neutral to pop `#E8503A` (200ms ease-out). Binary state change.

**Section Navigation:** Signature Animation 2 (A24 title card — see above).

**Rolling Digits:** Word count, char count, and version numbers roll like a mechanical counter. Each digit column scrolls independently, staggered 30ms per column right-to-left. 200ms per roll, ease-out.

**Progress Bar:** Ease-out fill, NO overshoot. 400ms. At 8/8 complete: bar and label shift to `#66BB6A`. No pulse. No glow.

**Budget Segment Selection:** Selected segment fills with `#E8503A`, text goes white. 150ms ease-out.

**Status Radio Selection:** Dot appears at full size, color fills instantly. Card border shifts to status color (200ms ease-out).

**Cast/Team Member Add:** New card appears at full size. Opacity 0 → 1, 150ms ease-out. First input auto-focuses.

**Modal/Overlay:** Backdrop dims 60% black. Modal appears at full size, opacity 0 → 1, 200ms ease-out. No scale animation.

**Drag Reorder:** Dragged item lifts (subtle glow + scale 1.02x). Other items shift to make room. Snaps into place.

**Loading States:** Skeleton screens with subtle pulse animation. Content-shaped placeholders on dark surface.

**Empty States:** Text + single action button. Optionally with large background section number (oversized, 4–6% opacity) as a structural visual element.

**Grain Texture:** Static SVG noise overlay at ~4% opacity. No movement at rest.

**Sound Design (Toggleable, TE OP-1 style — clean, digital, short):**
- Soft click on save
- Subtle tick on section completion
- Muted pop on publish
- All sounds can be toggled off in settings
- No sound on first visit (opt-in)

**No confetti, no bounce animations, no spring overshoot, no slide transitions, no floating toasts, no glow effects, no ambient floating shapes, no constant-running animations.**

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
- Primary text (#F5F5F5) on background (#0A0A0A) = 18.3:1 — exceeds AAA
- Status colors: Always include text label alongside color dot
- Never rely on color alone

**Keyboard Navigation:**
- All interactive elements focusable via Tab
- Focus state: 2px `#E8503A` (`--color-pop`) outline
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

- Sidebar = step sequencer (8 required sections as channel strip, completion indicators)
- Main content = clean distraction-free editor (generous space, dark background, no chrome)
- Context switches seamlessly: sidebar for navigation/status, main area for focused writing

---

## Pitch View Page (Shared Link)

A24 press kit in a dark screening room:

- Minimal top bar: Pitchcraft mark, version badge (JetBrains Mono)
- Project name at 36px Space Grotesk, semibold, `#F5F5F5`
- Logline at 18px Inter, `#999999`
- Metadata row in JetBrains Mono (genre, status, budget)
- Text max-width 680px (comfortable reading)
- Images break to full bleed against `#0A0A0A` — they are the light
- Cast/team cards: `#141414` surface with `#262626` border

---

## Background Texture

Subtle CSS grain overlay applied to `<body>`:
- SVG noise pattern at ~4% opacity
- Fixed position, pointer-events: none
- Adds analog film texture without competing with content
- Barely visible, perceptible as texture — like film grain in a dark theater

---

## Voice & Tone

**See [BRAND.md](./BRAND.md) for complete voice guidelines and approved copy examples.**

**Foundation:** David Ogilvy + British dry humor. Sharp, economical, warm. Self-aware wit, never condescending.

**Personality:** "The editor who makes you look sharp" — in service of the creator, never judging.

**Terminology:** Use "project" (not "pitch") throughout UI. Product name is working title and will change.

**Quick reference examples:**

| Generic SaaS | Our Voice |
|----------------|-------------------|
| "Welcome back! Let's make today amazing!" | "Welcome back, [Name]" |
| "You have 0 projects. Get started by creating your first project!" | "Nothing here. Time to fix that." |
| "Oops! Something went wrong. Please try again later." | "Save failed. Try again" |
| "Your project was successfully saved!" | "Saved" |
| "Are you absolutely sure you want to delete this?" | "Delete project? This action can't be undone." |

**Never:**
- Exclamation marks (except critical errors)
- Emoji
- Marketing speak, corporate jargon
- Condescending tone

---

## Final Design Principle

**The interface disappears. Only the creator's work remains.**

Dark backgrounds, precise typography, restrained color. The tool is invisible. The screening room is dark. The creator's work is the only light.

Restrain. Clarify. Respect.
