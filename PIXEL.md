# PIXEL.md — Design System Audit & Elevation Guide

## Purpose

This file has two jobs:

1. **Find loopholes** — places where the implementation deviates from DESIGN.md (wrong tokens, wrong patterns, broken rules).
2. **Raise the ceiling** — best practices and design decisions that would push Pitchcraft from "good dark UI" to something genuinely distinctive and craft-level.

PIXEL.md thinks like a design director doing a QA pass and a future-thinking design lead at the same time.

## Rules

1. **Reference exact files and line numbers.** Vague design notes are useless.
2. **Separate violations from aspirations.** Violations must be fixed. Aspirations are investment decisions.
3. **No design without rationale.** Every suggestion explains *why* it matters — to the creator, the brand, or the experience.
4. **Revisit after every new component or page.** Design debt compounds faster than technical debt.

---

## Part 1 — Design Loopholes (Violations of the System)

These are places where the code contradicts DESIGN.md. They create visual inconsistency and erode the design system's authority.

---

### PX-01. DESIGN.md and `globals.css` Define Different Pop Colors
**Severity:** High
**Files:** `DESIGN.md:75`, `app/globals.css:15`
**What:** DESIGN.md still documents the pop color as `#E8503A` (warm coral-red) in some sections, while `globals.css` has been updated to `#FF6300` (TE bright orange). These diverge. Any new developer reading DESIGN.md will implement the wrong color.
**Fix:** Audit DESIGN.md for every occurrence of `#E8503A` and update to `#FF6300`. The source of truth is `globals.css`.

---

### PX-02. `progress-shimmer` Uses a Raw Hex Color Not in the Token System
**Severity:** Medium
**File:** `app/globals.css:248`
**What:** The shimmer animation interpolates through `#F06B55` — a hex value that doesn't exist as a design token:
```css
background: linear-gradient(90deg, var(--color-pop) 0%, #F06B55 50%, var(--color-pop) 100%);
```
If the pop color changes, the shimmer midpoint stays coral-red while the ends shift.
**Fix:** Add `--color-pop-light: #FF8A3D` (a lighter pop variant) as a token. Use it in the shimmer gradient.

---

### PX-03. `led-breathe` and `micro-pulse` Are Constant Ambient Animations
**Severity:** High
**Files:** `app/globals.css:257-283`, `app/dashboard/page.tsx:92`
**What:** DESIGN.md is explicit: "No constant-running ambient animations." The `led-breathe` animation (4s infinite) and `micro-pulse` (8s infinite) run forever. They appear on the dashboard heading dot. The `prefers-reduced-motion` rule pauses them — correct — but they still run for everyone else, against the design principle.
**Fix:** Remove `led-breathe` from the dashboard heading dot. Use a static dot at 0.3 opacity instead. Reserve these animations for deliberate "system status" indicators only (e.g., a live/recording indicator). If the dot adds no semantic meaning, remove it entirely.

---

### PX-04. Card Hover Shadow Uses Raw `rgba()` Instead of Token
**Severity:** Low
**File:** `app/globals.css:220-222`
**What:**
```css
box-shadow: 0 4px 16px rgba(255, 255, 255, 0.02), 0 1px 4px rgba(255, 255, 255, 0.01);
```
Raw white with alpha. Not a token. If the surface color changes, this shadow won't adapt.
**Fix:** Document `--shadow-card-hover: 0 4px 16px rgba(255,255,255,0.02), 0 1px 4px rgba(255,255,255,0.01)` as a named token in globals.css. Or accept it as a raw value with a comment explaining it's intentionally white-glow on dark.

---

### PX-05. Icon Buttons Have No `aria-label` — Screen Readers Are Blind
**Severity:** High
**Files:** `components/ui/Card.tsx:66-80`, `components/ui/DuplicatePitchButton.tsx`, `components/ui/DeletePitchButton.tsx`
**What:** The copy-link button in PitchCard has `title="Copy share link"` but no `aria-label`. `title` is a tooltip, not a screen reader label — many screen readers ignore it. A blind user hears "button" with no context. Same issue on the duplicate and delete icon buttons.
**Fix:**
```tsx
<button aria-label="Copy share link" title="Copy share link" ...>
```
Every icon-only button must have `aria-label`. The `aria-hidden="true"` on the SVG is correct — the label lives on the button, not the icon.

---

### PX-06. `text-disabled` (`#555555`) Fails WCAG AA Contrast
**Severity:** High
**File:** `app/globals.css:14`, used everywhere for metadata/labels
**What:** `#555555` on `#0A0A0A` background = contrast ratio ≈ 2.5:1. WCAG AA requires 4.5:1 for normal text, 3:1 for large text. `text-disabled` is used on decorative metadata (section numbers, timestamps, mono labels) — but if any of it conveys meaning (not just decoration), it fails accessibility requirements.
**What passes:** `text-secondary` (`#999999`) on `#0A0A0A` ≈ 4.7:1 — barely passes AA.
**Fix:** Reserve `text-disabled` exclusively for truly non-informational elements (decorative lines, spacers). Any text that a user must read to understand the interface should use at minimum `text-secondary`. Consider bumping `text-disabled` to `#666666` (~3.1:1) for safety.

---

### PX-07. Spacing Uses Raw Arbitrary Values Instead of Token Scale
**Severity:** Medium
**Files:** Nearly every component — `px-[24px]`, `py-[12px]`, `gap-[16px]`, etc.
**What:** The 8px grid is defined in globals.css (`--spacing-1: 8px` through `--spacing-12: 96px`). But components use Tailwind arbitrary values (`px-[24px]`) instead of scale utilities (`px-6` in Tailwind v4 with 4px base, or custom scale). This means:
- The spacing grid exists on paper but not in implementation
- Typos like `px-[23px]` (off-grid) are invisible
- Changing the grid unit requires hunting every arbitrary value
**Fix (pragmatic):** This is a convention, not a crash. Establish that `[24px]` = 3 units, `[16px]` = 2 units, `[8px]` = 1 unit. Document this mapping in DESIGN.md and add a linting rule (`no-arbitrary-value`) if/when ESLint+Tailwind plugin is added. For now: at minimum, never use off-grid values (15px, 23px, 7px).

---

### PX-08. Typography Inconsistency: Inline Font Variables vs. CSS Classes
**Severity:** Low
**Files:** Multiple components
**What:** Some components use the CSS class `.font-heading` / `.font-mono`. Others use inline Tailwind arbitrary property `font-[var(--font-heading)]`. These are equivalent in output but inconsistent in authoring. The `.font-heading` class also applies `letter-spacing: -0.02em` (from globals.css:92-94) but `font-[var(--font-heading)]` does NOT — it only sets the font-family. Components using `font-[var(--font-heading)]` may be missing the tracking correction.
**Fix:** Standardize on `.font-heading` class for all heading text. Grep for `font-\[var\(--font-heading\)\]` and replace with `font-heading`. Do the same for `font-[var(--font-mono)]` → `font-mono`.

---

### PX-09. The Grain Texture Has No High-DPI Adaptation
**Severity:** Low
**File:** `app/globals.css:70-80`
**What:** The grain is a 256×256 SVG tile. On Retina/HiDPI screens (2×, 3× pixel density), the 256px tile renders at 128 CSS pixels — meaning the tile pattern becomes visible as a repeating grid rather than a seamless texture. The grain effect breaks on the devices of the exact audience (Apple Silicon Macs, high-end phones) most likely to notice.
**Fix:** Use a larger tile (512×512 or 768×768) and adjust `baseFrequency` slightly to maintain the same visual noise density at larger size. Or use a `@media (-webkit-min-device-pixel-ratio: 2)` query to serve a denser grain.

---

## Part 2 — Best Practices We're Missing

These aren't violations. They're established craft standards that the product doesn't implement yet.

---

### PX-10. No Skeleton Loading States
**What's missing:** Every async component (pitch cards on dashboard, funding widget, media in pitch view) appears as nothing → fully rendered. There's no in-between state. The jump is jarring on slow connections.
**Best practice:** Skeleton screens (content-shaped gray placeholders, animated with a shimmer) dramatically reduce perceived load time. They communicate "something is here, wait for it" rather than "is the page broken?"
**Where needed:**
- Dashboard pitch card list (while pitches fetch)
- `PitchViewFunding` (while funding data fetches)
- Media thumbnails in pitch view (while signed URLs resolve)
**Implementation:** Tailwind `animate-pulse` on placeholder `div`s with the same dimensions as the real content. 3-4 components, 30 minutes of work. High visual impact.

---

### PX-11. No Focus Trap in Modals
**What's missing:** The `WelcomeOnboarding` modal and the `DeletePitchButton` confirmation are rendered in the DOM but don't trap keyboard focus. A keyboard user pressing Tab behind the modal will focus elements beneath it.
**Best practice:** Any modal/overlay must trap focus within itself while open. When closed, focus returns to the trigger element.
**Implementation:** Use `focus-trap-react` (npm package) or implement a simple focus trap with `useEffect` + `querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')`.

---

### PX-12. No `prefers-color-scheme` Fallback Behavior
**What's missing:** Pitchcraft is dark-only by design. But if a browser or OS forces light mode via `forced-colors` or `prefers-color-scheme: light`, no override is in place. The near-black backgrounds will be replaced by the browser's forced colors, making the UI unreadable.
**Best practice:**
```css
@media (forced-colors: active) {
  /* Define high-contrast overrides */
}
```
Or at minimum: document that Pitchcraft intentionally does not support forced light mode and add a meta viewport or CSS comment explaining the decision.
**Note:** The `forced-colors` media query is different from `prefers-color-scheme`. Forced colors is a Windows accessibility feature. If you override it, you may exclude users with visual impairments who rely on it.

---

### PX-13. No Loading State on Navigation Between Pages
**What's missing:** Navigating from `/dashboard` to `/dashboard/pitches/create` (or back) feels instantaneous when data is in cache — but on first load, Next.js RSC fetches happen server-side and the page appears blank until the shell renders. There's no global navigation loading indicator (the browser tab spinner is the only feedback).
**Best practice:** Add a `loading.tsx` file in each route folder (Next.js App Router convention). Even a minimal top-of-page progress bar (like what Linear or Vercel use) dramatically improves perceived performance.
**Implementation:** `app/dashboard/loading.tsx` with a top-bar progress shimmer using the `--color-pop` color.

---

### PX-14. Image Handling Has No Blur-Up or Lazy Loading Strategy
**What's missing:** Media in the pitch view (`<img>` tags from signed Supabase URLs) load with no placeholder. The content shifts when images pop in (layout shift). There's no blur-up, no dominant color placeholder, no `loading="lazy"`.
**Best practice:**
- Use Next.js `<Image>` component with `placeholder="blur"` and a `blurDataURL` (even a generic 1×1 pixel base64 blur in the design color `#141414`)
- Add `loading="lazy"` to below-fold images
- Add `width` and `height` props to prevent layout shift (CLS)
**Impact:** Core Web Vitals (CLS, LCP) directly affect SEO ranking for pitch pages. Every pitch page is a public URL that benefits from good CLS scores.

---

### PX-15. Form Inputs Have No Floating Label or Animation
**What's missing:** Input fields show a static label above the field. This is functional but visually flat. The label disappears from view when the field is filled — there's no persistent label.
**Best practice (optional, not required):** Floating labels animate from placeholder position (inside the input, gray) to label position (above the input, smaller) as the user types. This:
- Saves vertical space (label + placeholder become one)
- Keeps the label visible even when filled
- Feels premium
**Caution:** Floating labels have accessibility issues if implemented poorly (screen readers may not announce the label correctly). Only ship if implemented with correct `aria-label` or `<label>` association and tested with VoiceOver.

---

### PX-16. No Print Stylesheet
**What's missing:** Some users will print or "Print to PDF" a pitch from the browser. Without a print stylesheet, they get: dark background consuming ink, navigation sidebar visible, interactive elements printed, footer UI visible.
**Best practice:**
```css
@media print {
  body { background: white; color: black; }
  nav, .sidebar, .no-print { display: none; }
  .pitch-content { max-width: 100%; margin: 0; }
}
```
The pitch view page (`/p/[id]`) is the most important candidate. A clean printed pitch is a legitimate use case for film producers who need physical decks.

---

### PX-17. No `<meta name="theme-color">` for Mobile Browser Chrome
**What's missing:** On mobile browsers (especially iOS Safari and Android Chrome), the browser's top chrome (address bar) matches the page's theme color if `<meta name="theme-color">` is set. Without it, the browser chrome is white/gray against the near-black pitch view — a visible seam.
**Fix:**
```html
<meta name="theme-color" content="#0A0A0A" />
```
Add to `app/layout.tsx` in the `<head>`. One line. The browser chrome matches the background, creating a full-bleed immersive pitch view on mobile.

---

## Part 3 — Elevation Opportunities (Next-Level Design)

These are deliberate design investments. Each one moves Pitchcraft from "polished dark UI" toward something with a distinct visual identity that the audience (film and creative professionals) will recognize and remember.

---

### PX-E01. Typography Could Define the Brand, Not Just Label the Content
**Current state:** DM Serif + Inter + JetBrains Mono is a good stack. But headings are used at consistent sizes (28-48px) without exploiting the full scale.
**Opportunity:** A24's identity is driven by its typographic decisiveness — large, confident type that doesn't hedge. Pitchcraft's pitch titles could be displayed at 56-72px on the pitch view page, with the logline set in a contrasting weight (DM Serif italic, or Inter Light) at 18-20px. The type becomes cinematic — the project name takes up space the way a film title does on a poster.
**Specific location:** `PitchViewHero` — the project name. Right now it's likely set at 32-40px. Push it to 60-72px on desktop with tracking at -0.03em. The creator's title gets the respect it deserves.

---

### PX-E02. The Pitch View Page Should Feel Like a Screening Room, Not a Document
**Current state:** Pitch view renders sections sequentially, full-width, in a single scroll. It reads like a well-formatted document.
**Opportunity:** The design philosophy says "the pitch view page should feel like opening a film's press kit in a dark screening room." Press kits have:
- A clear title page / opening moment
- Considered use of whitespace (sections breathe, they don't stack)
- Pull quotes or highlighted lines (the logline could be displayed at editorial scale)
- A deliberate reading pace
**Specific changes:**
1. Add generous padding between sections (96-128px) — force the eye to rest
2. The logline: display at 24px, DM Serif italic, centered, with a horizontal rule above and below — make it feel like a film's tag line, not a form field
3. Section labels (SYNOPSIS, DIRECTOR'S VISION) in JetBrains Mono, 10px, 0.15em tracking, uppercase — documentary-style field labels, not form labels
4. Fade each section in on scroll (intersection observer, 400ms ease-out) — the pitch unfolds, it doesn't dump

---

### PX-E03. The Empty State Could Be Iconic
**Current state:** Dashboard empty state shows "00" in large disabled type + a paragraph + a button. It's clean but forgettable.
**Opportunity:** The "00" idea is evocative — a roll counter, a slate number, an empty reel. Lean into it harder:
- Set "00" in DM Serif at 96px, tracking at 0.05em — enormous, architectural
- Add a single thin horizontal line below it (1px, #262626, full-width of the text)
- The subtitle: "Nothing yet." — three words, period, DM Serif italic, 18px. Confident, not apologetic.
- Remove "Let's change that." — it's product-speak. Replace with: "Your first pitch starts here."
**Result:** An empty state that feels like an empty stage — anticipatory, not sad.

---

### PX-E04. The Grain Texture Could Be More Deliberate
**Current state:** 4% grain overlay, fixed, covers everything equally.
**Opportunity:** Film grain is not uniform — it's heavier in shadows, lighter in highlights. On a dark interface, this means the grain should be slightly more visible in the background and nearly invisible on the lighter surfaces (`#141414` cards). Currently, grain covers both equally.
**Specific change:** Apply the grain texture only to `body::before` (background) at 4% opacity. On surface-colored elements (cards, sidebar), do not re-apply grain — they sit "above" the texture plane. This creates depth through material separation: the background has grain (film), the surfaces are clean (glass).
**Implementation:** The current `position: fixed; inset: -256px; z-index: 9999` puts the grain above everything. To apply it selectively, move it to `z-index: 0` and ensure content has `position: relative; z-index: 1`. Cards then appear "on top of" the grain layer.

---

### PX-E05. The Sidebar Navigation Has No Visual Identity
**Current state:** Sidebar is a list of sections with a left-border active indicator and section numbers. Functional. Invisibly functional.
**Opportunity:** The sidebar is a creator's progress instrument. It could feel like a film slate or a production schedule — a professional tool, not a menu.
**Changes:**
1. Section numbers: already monospace, already small — but they could be in `--color-pop` at 60% opacity for the active section, shifting to 30% for inactive. A subtle signal, not a flag.
2. Completion marks: when a section is complete, the number could animate a stroke (the `draw-check` animation already exists) — reinforcing that the pitch is being built, section by section.
3. The "More" panel trigger: instead of a text button, use a horizontal divider with a `+` in the center — cleaner, more deliberate.

---

### PX-E06. Focus Rings Could Be More On-Brand
**Current state:** Global `*:focus-visible` uses a 2px solid pop color ring (`#FF6300`). Correct, but generic.
**Opportunity:** The pop color ring is right. But the default `outline-offset: 2px` puts the ring tight to the element. For an A24/cinematic feel:
- Increase `outline-offset: 4px` — more breathing room, less technical, more considered
- For buttons specifically: use a rounded ring that matches the button's border-radius (`border-radius: 4px`)
- This is a one-line change in globals.css with noticeable impact on the feel of keyboard navigation

---

### PX-E07. The Pitch Status System Could Be More Evocative
**Current state:** Three statuses: "Looking" (red), "In Progress" (amber), "Complete" (green). These are correct functionally but generic — they could be any project management tool.
**Opportunity:** The status labels are a branding opportunity. Film production has specific language:
- "Looking" → "In Development" (industry term for seeking production)
- "In Progress" → "In Production"
- "Complete" → "Completed"
**Or more distinctively:**
- "Seeking" (actively looking for a buyer/producer)
- "In Production"
- "Completed"
**Impact:** Creators in the industry see familiar language. Producers reviewing pitches see vocabulary they use. The interface speaks the language of its audience.

---

## Design Health Summary

| Category | Count | Priority |
|----------|-------|----------|
| Violations (fix required) | 9 (PX-01 to PX-09) | Fix before launch |
| Missing best practices | 8 (PX-10 to PX-17) | Fix for quality bar |
| Elevation opportunities | 7 (PX-E01 to PX-E07) | Build for brand |

**Fix-before-launch priority:**
1. PX-05 — icon button `aria-label` (accessibility, not optional)
2. PX-06 — `text-disabled` contrast (accessibility)
3. PX-03 — stop the ambient `led-breathe` (violates stated design rule)
4. PX-08 — font-heading class inconsistency (tracking fix)
5. PX-01 — align DESIGN.md pop color with globals.css

**Highest return investments:**
1. PX-E02 — pitch view as screening room (brand defining)
2. PX-10 — skeleton loading (perceived performance, instant polish)
3. PX-17 — theme-color meta tag (one line, big mobile impact)
4. PX-13 — loading.tsx per route (perceived speed)
5. PX-E03 — empty state redesign (first impression)

---

## Audit Schedule

- **Before any public launch:** Clear all 9 violations
- **After any new component:** Add it to this file if it introduces new patterns
- **Quarterly:** Re-read elevation section. Choose one to ship.
- **After any design system token change:** Grep the codebase for the old value and update all instances
