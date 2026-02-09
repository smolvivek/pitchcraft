# DESIGN.md — Design System & Aesthetic Direction

(Working title product: TBD)

## Design Philosophy

Pitchcraft's design draws from three influences:

### 1. Teenage Engineering — "Precision Instrument"
- Monospace for all metadata (versions, counts, timestamps)
- Sidebar as step sequencer during pitch creation
- Numbers celebrated, not hidden (char count, word count, version)
- Satisfying state transitions (SVG draw animations, 300ms)

### 2. Dieter Rams — "The Tool Disappears"
- Pitch view page = creator's work, not Pitchcraft's UI
- Color restraint: accent only on primary actions + status indicators
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
- One accent color (terracotta, not borrowed from competitors)
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
| **Background** | `#FAF8F5` (warm cream) | Page backgrounds, content areas |
| **Surface** | `#F3EDE6` | Hover states, sidebar, subtle differentiation |
| **Border** | `#D9D0C7` | Warm neutral, not cold gray |
| **Text primary** | `#1A1A1A` | Near-black, body and headings |
| **Text secondary** | `#6B6560` | Warm muted, captions, help text |
| **Text disabled** | `#A8A29E` | Non-interactive elements |
| **Accent (visual)** | `#D4654A` (warm terracotta) | Non-text: focus rings, progress bars, decorative borders |
| **Accent text** | `#A8432D` | Text on cream: tertiary buttons, links (5.46:1 WCAG AA) |
| **Accent button** | `#B8503A` | Primary button background (white text: 4.51:1 WCAG AA) |
| **Accent button hover** | `#9C3F2E` | Button hover state |
| **Accent button active** | `#863525` | Button pressed state |
| **Status: Looking** | `#D32F2F` | Red dot + label |
| **Status: In Progress** | `#E8A817` | Amber dot + label |
| **Status: Complete** | `#388E3C` | Green dot + label |
| **Error** | `#D32F2F` | Form validation |
| **Success** | `#4CAF50` | Confirmations |

**Background texture:** Subtle CSS grain overlay (SVG noise pattern, ~3% opacity). Adds tactile warmth without competing with content.

**No Dark Mode.** Light mode only. The design system is calibrated for warm cream backgrounds. No `dark:` variants, no `prefers-color-scheme` media queries.

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

**Primary Button** (Main action: "Create Pitch", "Share Link", "Save Draft")
- Background: `#B8503A` (accessible terracotta — white text passes WCAG AA at 4.51:1)
- Text: White (`#FFFFFF`)
- Padding: 12px 24px (height ~44px for touchability)
- Border radius: 4px
- Font: 14px / 600 weight
- Hover: `#9C3F2E`
- Active: `#863525`
- Disabled: `#D9D0C7` background, `#A8A29E` text
- Transition: 200ms ease-out

**Secondary Button** (Less important: "Cancel", "Skip", "Preview")
- Background: Transparent
- Border: 1px solid `#D9D0C7`
- Text: `#1A1A1A`
- Padding: 12px 24px
- Hover: Background `#F3EDE6`
- Active: Background `#E8E0D8`

**Tertiary Button** (Minimal action: "Learn more", "Help")
- Background: Transparent
- Border: None
- Text: `#A8432D` (accessible terracotta — passes WCAG AA at 5.46:1 on cream)
- Padding: 8px 16px
- Hover: Underline
- Active: `#9C3F2E` text

**Button Layout:**
- Primary buttons flush left in forms
- Multiple buttons: Primary on left, secondary/cancel on right
- Button text: Sentence case, action-oriented ("Save draft", not "SAVE DRAFT")

---

### Form Design

**Input Fields:**
- Background: `#FFFFFF`
- Border: 1px solid `#D9D0C7`
- Padding: 12px 16px (height ~44px)
- Border radius: 4px
- Font: 14px / 400 weight (Inter)
- Placeholder text: `#A8A29E`
- Focus state: Border `2px solid #D4654A`, no box-shadow, no glow
- Error state: Border `2px solid #D32F2F`, error text below field
- Disabled: Background `#F3EDE6`, text `#A8A29E`, border `#D9D0C7`

**Textarea/Large Input:**
- Same as input, but min-height 120px
- Line height: 1.5 for readability
- Allow user resize

**Checkboxes:**
- Size: 20x20px (touchable)
- Color: `#D4654A` when checked
- Border: 2px solid `#D9D0C7`
- Label: 14px, to the right, clickable
- Spacing: 8px gap between checkbox and label

**Select/Dropdown:**
- Same padding/height as input (44px)
- Arrow icon: `#D4654A`, right-aligned
- Hover: Background `#F3EDE6`

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
- Border: 1px solid `#D9D0C7`
- Padding: 24px
- Border radius: 4px
- Shadow: None (keep flat)
- Margin below: 24px

**Pitch Card** (in listings):
- Same as section container
- Title: 18px / 600 weight (Space Grotesk)
- Metadata below in JetBrains Mono (status badge, date, version)
- Hover: Background `#F3EDE6`

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
- Background: `#FAF8F5`
- Border-bottom: 1px solid `#D9D0C7`
- Logo: Left side
- Navigation links: Right side, 14px / 400 weight (Inter)
- Active link: Terracotta underline
- Mobile: Hamburger at < 768px

**Sidebar (Pitch Creation — Step Sequencer):**
- Width: 240px
- Background: `#F3EDE6` (surface color)
- Border-right: 1px solid `#D9D0C7`
- 8 required sections as channel strip items
- Completion indicators: SVG draw animation on completion (300ms)
- Active section: Left border `#D4654A`, bolder text
- Monospace section numbers (JetBrains Mono)

---

### Animations & Interactions

**Timing:**
- Short transitions (state changes): 150–200ms
- Medium transitions (page/section): 250–300ms
- Long transitions (major changes): 400–500ms
- Easing: `ease-out` for most. `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring effects.

**Button Press:** Scale to 0.98x on active (minimal spring). Background color change 200ms ease-out.

**Input Focus:** Border color change, 200ms ease-out. No glow, no shadow.

**Save/Publish Confirmation:** Button shrinks to 0.96x, text fades, checkmark draws (300ms), returns to normal. Inline feedback — no floating toasts. Feedback at point of contact.

**Sidebar Completion:** Dot scales 1.2x then settles (spring). Checkmark draws over green circle (300ms). Satisfying mechanical state change.

**Section Navigation:** Instant cut, new content fades in (200ms). No slide transitions.

**Rolling Digits:** Word count, char count, and version numbers roll like a mechanical counter when values change. Teenage Engineering–style.

**Progress Bar:** Ease-out fill with ~2% overshoot, then settles back (spring physics). Feels alive.

**Flow Beats (Horizontal Scroll):** Each beat scales from 0.95 → 1.0 on viewport entry with staggered timing offset. Cinematic reveal — A24 title card energy.

**Modal/Overlay:** Backdrop blur 4px + dim 30% black. Modal scale-up from center 250ms ease-out.

**Drag Reorder:** Dragged item lifts (subtle shadow + scale 1.02x). Other items spring apart to make room. Snaps into place. Tactile.

**Loading States:** Skeleton screens with subtle pulse animation. Content-shaped placeholders.

**Empty States:** Text only + single action button. Whitespace speaks. No illustrations.

**Keyboard Shortcuts:** Hold-to-reveal — holding modifier key (Cmd/Ctrl) shows shortcut hints on relevant buttons. Invisible until needed.

**Grain Texture:** Shifts subtly on scroll/click (CSS transform offset on `::before`, triggered by scroll events). Reactive, not continuous. Zero CPU cost at rest.

**Sound Design (Toggleable):**
- Soft click on save
- Subtle tick on section completion
- Muted pop on publish
- All sounds can be toggled off in settings
- No sound on first visit (opt-in)

**No confetti, no bounce animations, no slide transitions, no floating toasts.**

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
- Focus state: 2px `#D4654A` outline
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

Pitchcraft speaks to **creative professionals**: filmmakers, writers, ad creators, content makers. People who've sat in pitch meetings, revised treatments, tracked feedback cycles.

**We sound like:**
- A trusted collaborator, not a product marketer
- Someone who understands creative workflow, not a tech bro
- Confident but not cocky
- Warm but not casual
- Grounded but not boring

**Voice characteristics:**
- **Direct:** "Your pitch is live" not "Congratulations! Your pitch has been successfully published!"
- **Human:** "Check your inbox" not "Please verify your email address to continue"
- **Confident:** "Delete this pitch" not "Are you absolutely sure you want to permanently delete this pitch? This action cannot be undone."
- **Respectful of time:** Short sentences. No fluff. Get to the point.

**Examples:**

| ❌ Generic SaaS | ✅ Pitchcraft Voice |
|----------------|-------------------|
| "Welcome back! Let's make today amazing!" | "Welcome back, [Name]" |
| "You have 0 pitches. Get started by creating your first pitch!" | "Your first pitch starts here" |
| "Oops! Something went wrong. Please try again later." | "Save failed. Try again" |
| "Your pitch was successfully saved!" | "Saved" |
| "Upgrade to Premium to unlock unlimited collaborators!" | "Need more collaborators? Upgrade" |

**Empty states:**
- Never: "No pitches yet! Create your first pitch to get started!"
- Always: "Your first pitch starts here" + button

**Errors:**
- Never: "Oops! An unexpected error occurred. Our team has been notified."
- Always: "Save failed. Try again" (specific, actionable)

**Confirmations:**
- Never: "Success! Your pitch has been published and is now live!"
- Always: "Pitch is live" (brief, clear)

**Tone adjustments by context:**
- **Onboarding:** Slightly warmer ("You're in, [Name]")
- **Dashboard:** Neutral, tool-like ("3 pitches", "Last edited 2 days ago")
- **Errors:** Direct, no apology ("Password must be 8+ characters")
- **Success:** Brief, no exclamation marks ("Saved", "Pitch deleted")

**Never:**
- Exclamation marks (except errors: "Password required!")
- Emoji
- Marketing speak ("game-changer", "revolutionary", "seamless")
- Unnecessary words ("simply", "just", "easily")
- Corporate jargon ("leverage", "utilize", "synergy")

---

## Final Design Principle

**Good design is invisible.**

If a user notices the design, we've failed. The tool should disappear. Only the creator's work should be visible.

Restrain. Clarify. Respect.
