# DESIGN.md — Design System & Aesthetic Direction

**For brand personality, voice, and pop colour usage strategy, see [BRAND.md](./BRAND.md)**

---

## Design Philosophy

Pitchcraft's design draws from two influences:

### 1. A24 — "Cinematic Confidence"
- Deep black backgrounds (`#0e0e0e`), content as the light source
- Type is the primary visual element — large, precise, unhurried
- Full-bleed imagery against darkness — photos and stills command presence
- Restrained luxury: no decoration, no gradients, no visual noise
- The pitch view page feels like opening a film's press kit in a dark screening room

### 2. Editorial Print — "Controlled Precision"
- Two-column editorial grids: 2-col sticky label / 10-col content
- Newsreader italic serif for headings — intelligent, cinematic, unhurried
- Inter for body, JetBrains Mono for metadata labels and corner annotations
- Zero border-radius everywhere — sharp, no softening
- Section numbering in `01 / SECTION NAME` format — structured, not decorative

**The result:** A product that feels like a premium screening room meets an editorial press kit. Deep black, cinematic, confident. The creator's work is the only thing that matters.

---

## Core Design Principles

### 1. Dark Canvas, Bright Content
- `#0e0e0e` deep black page backgrounds — content commands attention
- Creator content is the light source — UI chrome recedes completely
- Hairline borders at `border-white/5` — present but barely visible

### 2. Function Before Beauty
- Every visual choice solves a problem
- Decorative elements don't exist
- If it doesn't clarify, it doesn't ship

### 3. Consistency Over Novelty
- One pop color: white `#FFFFFF` on deep black — content is the light source
- Three fonts: Newsreader (headings/display), Inter (body), JetBrains Mono (metadata/labels)
- Same aesthetic on every page — LP, auth, dashboard, editor, pitch view

### 4. Respect Creator Time
- Minimal scrolling
- Clear information hierarchy
- Progressive disclosure (optional sections hidden until added)
- No friction in the critical path

### 5. Calm Interactions
- Animations clarify, they don't distract
- Transitions: 150–200ms standard, `ease-out`
- Hover states are subtle
- No constant-running ambient animations

---

## Visual System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#0a0a0a` | Page backgrounds |
| **Deep background** | `#0e0e0e` | Footers, sidebars, auth pages, surfaces that need maximum depth |
| **Surface** | `#141414` | Cards, elevated surfaces |
| **Surface hover** | `#1A1A1A` | Hover state for surfaces |
| **Border** | `#262626` | Subtle borders |
| **Hairline border** | `rgba(255,255,255,0.05)` | Section dividers, nav borders — `border-white/5` |
| **Text primary** | `#F5F5F5` | Body text and headings |
| **Text secondary** | `#999999` | Captions, metadata, help text |
| **Text disabled** | `#666666` | Non-interactive elements, corner annotations |
| **Pop** (`--color-pop`) | `#FFFFFF` | Active states, accent labels, section numbers, focus rings |
| **Pop hover** | `#E8E8E8` | Pop hover state |
| **Pop active** | `#AAAAAA` | Pop pressed state |
| **Link** (`--color-link`) | `#FFFFFF` | Text links |
| **Error** | `#FF6B6B` | Form validation errors |
| **Success** | `#66BB6A` | Confirmations |

**Dark mode only.** No `light:` variants. The design system is calibrated for near-black backgrounds.

---

### Pop Colour Usage Rules

Pop colour (`#FFFFFF`) is the editorial signal against deep black. It marks what is active, important, or numbered.

**Use pop colour for:**
1. Section label numbers (`01 / SYNOPSIS` — the number and label in pop mono)
2. Active sidebar item (left border + text)
3. Accent borders (`border-l border-pop/30` on logline blocks)
4. Focus rings
5. Status indicators and completion marks

**Use white (`#F5F5F5`) for:**
1. Primary action buttons — `bg-text-primary text-background`
2. Button text: `text-background` (near-black) on white fill

**NEVER use pop colour for:**
1. Primary button backgrounds
2. Decorative accents or flourishes
3. Non-interactive body copy

**The test:** If you remove all pop colour from the page, it must still work. Pop is the signal, not the structure.

---

### Typography

| Use | Font | Style | Weight | Size |
|-----|------|-------|--------|------|
| **Display / hero headline** | Newsreader | Italic | 300–400 | `clamp(48px,8vw,112px)` |
| **Pitch view title** | Newsreader | Bold upright | 700 | `12vw` uppercase |
| **Section heading** | Newsreader | Upright | 400 | `48px`–`56px` |
| **Navbar / wordmark** | Newsreader | Bold upright | 700 | `20px` uppercase tracking-tighter |
| **Auth heading** | Newsreader | Italic | 400 | `48px` |
| **Body** | Inter | Regular | 400 | `15px`–`16px` / `24px–26px` line-height |
| **Small / caption** | Inter | Regular | 400 | `14px` / `20px` line-height |
| **Section labels** | JetBrains Mono | — | 700 | `9px`–`10px` uppercase tracking-[0.2em–0.25em] |
| **Corner annotations** | JetBrains Mono | — | 400 | `9px` uppercase tracking-[0.15em–0.2em] |
| **Metadata strip** | JetBrains Mono | — | 400 | `9px`–`11px` uppercase |

**Heading tracking:** `-0.02em` to `-0.03em` tightening on large display type.
**Uppercase:** Headings in nav, section labels, and buttons use `.uppercase`.
**No rounded font weights:** 400, 500 (Inter body), 700 (Mono labels). No 600.

---

### Border Radius

**Zero everywhere.** `border-radius: 0px` on all elements — buttons, inputs, cards, modals, badges.

No exceptions. Rounding softens the aesthetic. This design does not soften.

---

### Spacing & Grid

**8px base unit.** All spacing multiples of 8: 8, 16, 24, 32, 40, 48, 56, 64, 80, 96.

**Pitch view / editorial grid:**
- `grid-cols-12`, `gap-[48px]`
- 2 columns: sticky section label (pop mono)
- 10 columns: heading + content

**Horizontal padding:**
- Standard: `px-[48px]` desktop, `px-[24px]` mobile
- Wide sections: `px-[96px]` desktop

**Content max-width:** `max-w-[1200px]` editorial sections, `max-w-[960px]` dashboard.

---

### Button Design

**Primary Button** (Main action: "Enter the Suite", "New Project", "Save")
- Background: `bg-text-primary` (`#F5F5F5`)
- Text: `text-background` (near-black)
- Padding: `px-[24px] py-[10px]` nav / `py-[16px]` standalone CTA
- Border radius: 0px
- Font: Newsreader, `text-[14px]–text-[15px]` uppercase, tracking-tighter, font-bold
- Hover: `hover:opacity-90`
- Disabled: `disabled:opacity-50`
- Transition: 150ms

**Secondary Button** (Less important: "Cancel", "Preview")
- Background: Transparent
- Border: `border border-border`
- Text: `text-text-primary`

**Tertiary / ghost** (Nav links, sidebar links)
- Background: Transparent
- Text: `text-text-secondary hover:text-text-primary`
- Transition: 200ms

**Button copy:** UPPERCASE, action-oriented.

---

### Form Design

**Standard inputs (editor / create / edit forms):**
- Background: `bg-surface` (`#141414`)
- Border: `1px solid #262626`
- Border radius: 0px
- Padding: `12px 16px`
- Font: 14px Inter, `#F5F5F5`
- Focus: `border-white/60` or `border-pop`
- Error: `border-l-2 border-pop` with mono error text

**Auth page inputs (underline-only):**
- Background: `bg-transparent`
- Border: `border-b border-white/20` — bottom only
- Focus: `border-white/60` transition
- Padding: `py-[10px]`
- Font: 15px Inter body
- Labels: JetBrains Mono 9px uppercase tracking-[0.2em] `text-text-disabled`
- No visible box, no background fill — the underline is the only boundary

**Checkboxes (auth / consent):**
- `accent-pop` for checked color
- Inline label: 9px mono uppercase

**Form layout:** Labels above inputs. Error text in mono (`--color-error`) below field. Required fields not asterisked — keep copy sparse.

---

### Cards & Containers

**Pitch Card (dashboard listing):**
- No card box — rows separated by `border-b border-border`
- Number: `01 /` in mono `text-text-disabled`
- Title: Newsreader italic `text-[22px]` — `hover:text-pop` transition
- Logline: Inter `text-[14px] text-text-secondary`
- Metadata: mono `9px` uppercase — version, date, budget, genre

**Section containers (editor):**
- Background: `bg-surface` (`#141414`)
- Border: `1px solid #262626`
- Border radius: 0px
- Padding: `24px`

---

### Navigation

**Landing page nav:**
- Height: `h-[72px]`, `px-[48px]`
- Background: `bg-background/90 backdrop-blur-sm`
- Border: `border-b border-white/5`
- Wordmark: Newsreader bold `text-[20px]` uppercase tracking-tighter
- Links: Newsreader `text-[15px]` uppercase tracking-tighter font-light `text-text-secondary`
- CTA: White primary button (`bg-text-primary text-background`)

**Pitch view top bar:**
- Fixed, `backdrop-blur-sm bg-[#131313]/90`
- Project name: Newsreader italic `text-[18px]` bold tracking-tighter
- Version: mono `9px` uppercase tracking-[0.2em] `text-text-disabled`
- Border: `border-b border-white/5`

**Auth page corners:**
- Bottom-right only: `Pitchcraft` italic serif wordmark, `text-text-disabled`
- Nothing else. No decorative metadata, no fake technical values. See PX-18.

---

### Sidebar (Edit only)

- Width: `w-64` (256px)
- Background: `bg-[#0e0e0e]`
- Border: `border-r border-white/5`
- Section rows: `01 / SECTION NAME` — `font-mono font-bold uppercase tracking-[0.15em] text-[10px]`
- Active row: `border-l-2 border-pop text-pop bg-white/5`
- Inactive row: `border-l-2 border-transparent text-text-disabled hover:text-text-primary hover:bg-white/[0.03]`
- No completion indicator dots — rows are active or not
- Optional sections: Added via explicit `+ Add section` panel (no checkboxes)

**"Add section" pattern:**
- Button label: `+ Add section` (not "More")
- Collapsible panel lists available optional sections
- Each row: section name + description + `+ Add` button
- Once added: row appears in sidebar nav, button shows `Added ✓`
- Remove: `×` on hover in sidebar nav row
- No checkbox metaphor

---

### Section Labels

All section labels follow the `01 / SECTION NAME` format:

```
font-mono text-[9px] uppercase tracking-[0.25em] text-pop font-bold
```

In the pitch view, this label is sticky on the left column (`md:sticky md:top-[88px]`).

In the sidebar, it is the full row label.

---

### Landing Page Layout

**Hero:**
- Full `min-h-screen`, centered vertically
- Pop mono label: `DIRECTOR'S CUT` or `FOR FILMMAKERS`
- Display headline: Newsreader `clamp(48px,8vw,112px)` font-light with italic emphasis word
- CTA: white primary button + ghost secondary link

**Philosophy section:**
- `grid-cols-12`: 4-col label / 8-col content
- Numbered features: `01`, `02`, `03` in pop mono
- Feature text: Newsreader `text-[28px]`

**Bento Grid:**
- 3-tile grid: `grid-cols-1 md:grid-cols-3`
- Dark surface tiles with mono category label + heading
- No images — typography as the visual

**CTA section:**
- Full-width `bg-[#0e0e0e]`
- Large italic Newsreader heading: "Begin the cut."
- White primary CTA

**Footer:**
- Centered: Pitchcraft bold serif + tagline
- Hairline top border

---

### Auth Page Layout

Full-screen `bg-[#0e0e0e]` with cinematic corner metadata (see Navigation above).

Centered form column `max-w-[400px]`:
- Pop mono section label
- Large Newsreader heading with italic second line
- Underline-only inputs
- White full-width CTA button
- Mono footer link (`Already a member? Enter the Suite`)

---

### Pitch View Page

A24 press kit in a dark screening room:

**Hero (`PitchViewHero`):**
- Full `min-h-screen`
- Poster: `grayscale opacity-50`, absolute fill behind content
- Title: Newsreader bold `12vw` uppercase `tracking-[-0.03em]`
- Logline: `border-l border-pop/30 pl-[24px]`, italic `text-[22px]–text-[28px]`

**Top bar (`PitchViewTopBar`):** Fixed, project name italic serif left, version mono right.

**Metadata strip (`PitchViewMetadata`):** `bg-[#0e0e0e]`, mono labels, status in `text-pop`.

**Content sections (`PitchViewSection`):**
- `px-[48px] md:px-[96px] py-[96px]`
- 12-col grid: 2-col sticky pop label / 10-col content
- Section heading: Newsreader `text-[48px]–text-[56px]` tracking-[-0.02em]
- Body: Inter `text-[16px]–text-[17px]` leading-[28px–30px] `text-text-secondary`
- Images: `grayscale hover:grayscale-0` transition-all 500ms

**Cast cards (`PitchViewCards`):**
- Variant `cast`: 3-col portrait grid, `aspect-[3/4]` placeholder, role in pop mono, name in Newsreader `text-[28px]`
- Variant `team`: Horizontal list, `w-[96px] h-[96px]` square placeholder, role in pop mono, name in Newsreader `text-[32px]`

**Footer (`PitchViewFooter`):**
- `bg-[#0e0e0e]`, project name italic serif left, "Presented with Pitchcraft" mono right

---

### Animations & Interactions

**Quality bar: A24 trailers, editorial print, Lando Norris website.**

All animations are triggered by page entry or user interaction — they settle to rest. No constant ambient motion.

**Landing page entrance:** Framer Motion `animate-fade-up` staggered per section. Hero headline lines staggered 200ms.

**Pitch view sections:** `animate-fade-up` / `animate-fade-up-subtle`, staggered `80ms` per section on load.

**Auth page:** Single opacity + translateY fade-in on mount (600ms cubic-bezier).

#### Timing

- Short (state changes): 150–200ms `ease-out`
- Medium (section transitions): 250–300ms
- Long (major changes): 400–500ms
- Cinematic (hero, section reveals): 600ms–1s `cubic-bezier(0.16, 1, 0.3, 1)`

#### Micro-Interactions

**Button hover:** `hover:opacity-90` — immediate, no scale.

**Input focus (underline inputs):** `border-white/60`, 150ms ease-out.

**Input focus (standard):** Border shifts toward `border-pop`, 200ms.

**Sidebar active change:** Border color + text color shift, 150ms.

**Save indicator:** Text swaps to "Saved" inline, reverts after 1.2s. No toast.

**Image reveal (pitch view):** `grayscale` → `hover:grayscale-0`, 500ms.

**Section entrance (pitch view):** `animate-fade-up-subtle` with 80ms staggered delays.

**No confetti, no spring overshoot, no slide transitions, no floating toasts, no glow effects, no ambient floating shapes.**

---

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Desktop: 768px+

**Mobile:**
- Single-column layout
- `px-[24px]` margins
- Sidebar collapses (overlay or bottom drawer)
- Pitch view sections: 12-col grid collapses to single column (label above content)
- Touch targets: minimum 44×44px

**Desktop:**
- Editorial 12-col grid for pitch view sections
- `px-[48px]–px-[96px]` margins
- `max-w-[1200px]` content width

---

### Accessibility

**Color Contrast:**
- Text primary (`#F5F5F5`) on background (`#0a0a0a`): 18.3:1 — exceeds AAA
- Metadata labels may be at lower contrast (`text-text-disabled`) — decorative only, not load-bearing
- Status indicators always include text label alongside color

**Keyboard Navigation:**
- All interactive elements focusable via Tab
- Focus state: `border-pop` or `outline-pop` ring
- Logical tab order

**Screen Readers:**
- All images have alt text
- Form labels associated with inputs
- Semantic HTML headings (`<h1>`, `<h2>`, etc.)
- Corner metadata in auth layout: `aria-hidden="true"` (decorative)

---

## Creation Experience

**Sidebar = editorial step sequencer. Main area = clean writing surface.**

- Left: 256px sidebar, `#0e0e0e`, numbered `01 / SECTION` rows
- Right: editor with dark `#141414` surface sections
- Active section highlighted with pop-colored left border
- Optional sections added explicitly via `+ Add section` — not via checkbox

---

## Final Design Principle

**The interface disappears. Only the creator's work remains.**

Deep black. Sharp edges. Newsreader in the dark. No radius, no hue drift, no softening.

The screening room is dark. The creator's work is the only light.

Restrain. Clarify. Respect.
