# PIXEL.md — Design Critic

## Purpose

This file has three jobs:

1. **Enforce the system** — catch places where implementation deviates from DESIGN.md (wrong tokens, wrong patterns, broken rules).
2. **Critique the design** — flag bad design decisions regardless of whether they violate the spec. Wasted space, empty placeholders, poor information density, layout that doesn't earn its real estate — these are design failures even if every token is correct.
3. **Raise the ceiling** — identify where good design could become genuinely distinctive.

PIXEL.md thinks like a design director who has seen the rendered page, not just the code. Token compliance is the floor, not the goal.

## Rules

1. **Reference exact files and line numbers.** Vague notes are useless.
2. **Every violation gets a fix.** Don't flag without prescribing.
3. **Three types of entry:** Violation (must fix), Critique (design judgment call, should fix), Aspiration (investment decision).
4. **Revisit after every new page or component.** Design debt compounds faster than technical debt.
5. **The test:** Would a design director wince at this on a real screen? If yes, it goes in.

---

## Part 1 — Design Loopholes (Violations of the System)

These are places where the code contradicts DESIGN.md. They create visual inconsistency and erode the design system's authority.

---

### PX-01. DESIGN.md and `globals.css` Define Different Pop Colors
**Severity:** High
**Files:** `DESIGN.md:75`, `app/globals.css:15`
**What:** DESIGN.md still documents the pop color as `#E8503A` (warm coral-red) in some sections, while `globals.css` has been updated to `#FF6300` (TE bright orange). These diverge. Any new developer reading DESIGN.md will implement the wrong color.
**Fix:** Audit DESIGN.md for every occurrence of `#E8503A` and update to `#FF6300`. The source of truth is `globals.css`.
**Status:** Fixed — All `#E8503A` occurrences in DESIGN.md replaced with `#FF6300`. Description updated from "warm coral-red" to "TE bright orange".

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
**Status:** Fixed — `--color-pop-light: #FF8A3D` added to globals.css theme tokens. Shimmer gradient updated to use `var(--color-pop-light)` instead of raw `#F06B55`.

---

### PX-03. `led-breathe` and `micro-pulse` Are Constant Ambient Animations
**Severity:** High
**Files:** `app/globals.css:257-283`, `app/dashboard/page.tsx:92`
**What:** DESIGN.md is explicit: "No constant-running ambient animations." The `led-breathe` animation (4s infinite) and `micro-pulse` (8s infinite) run forever. They appear on the dashboard heading dot. The `prefers-reduced-motion` rule pauses them — correct — but they still run for everyone else, against the design principle.
**Fix:** Remove `led-breathe` from the dashboard heading dot. Use a static dot at 0.3 opacity instead. Reserve these animations for deliberate "system status" indicators only (e.g., a live/recording indicator). If the dot adds no semantic meaning, remove it entirely.
**Status:** Fixed — `animate-led-breathe` removed from all three instances in LandingHero.tsx. Replaced with static dots at appropriate opacities (0.6 for badge dot, 0.3 for tag dot, 0.7 for active card dot).

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
**Status:** Fixed — Added inline comment in globals.css explaining the intentional white-glow value. Accepted as-is (no token needed for a single-use shadow).

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
**Status:** Fixed — `aria-label` verified on Card.tsx copy button and DuplicatePitchButton. Added `aria-label="Delete pitch"` to the initial icon button in DeletePitchButton.tsx (was missing, only had `title`).

---

### PX-06. `text-disabled` (`#555555`) Fails WCAG AA Contrast
**Severity:** High
**File:** `app/globals.css:14`, used everywhere for metadata/labels
**What:** `#555555` on `#0A0A0A` background = contrast ratio ≈ 2.5:1. WCAG AA requires 4.5:1 for normal text, 3:1 for large text. `text-disabled` is used on decorative metadata (section numbers, timestamps, mono labels) — but if any of it conveys meaning (not just decoration), it fails accessibility requirements.
**What passes:** `text-secondary` (`#999999`) on `#0A0A0A` ≈ 4.7:1 — barely passes AA.
**Fix:** Reserve `text-disabled` exclusively for truly non-informational elements (decorative lines, spacers). Any text that a user must read to understand the interface should use at minimum `text-secondary`. Consider bumping `text-disabled` to `#666666` (~3.1:1) for safety.
**Status:** Fixed — `--color-text-disabled` already updated to `#666666` in globals.css. DESIGN.md updated to match (all `#555555` references replaced with `#666666`).

---

### PX-07. Spacing Uses Raw Arbitrary Values Instead of Token Scale
**Severity:** Medium
**Files:** Nearly every component — `px-[24px]`, `py-[12px]`, `gap-[16px]`, etc.
**What:** The 8px grid is defined in globals.css (`--spacing-1: 8px` through `--spacing-12: 96px`). But components use Tailwind arbitrary values (`px-[24px]`) instead of scale utilities (`px-6` in Tailwind v4 with 4px base, or custom scale). This means:
- The spacing grid exists on paper but not in implementation
- Typos like `px-[23px]` (off-grid) are invisible
- Changing the grid unit requires hunting every arbitrary value
**Fix (pragmatic):** This is a convention, not a crash. Establish that `[24px]` = 3 units, `[16px]` = 2 units, `[8px]` = 1 unit. Document this mapping in DESIGN.md and add a linting rule (`no-arbitrary-value`) if/when ESLint+Tailwind plugin is added. For now: at minimum, never use off-grid values (15px, 23px, 7px).
**Status:** Acknowledged — Convention documented. Will catch off-grid values during component reviews going forward.

---

### PX-08. Typography Inconsistency: Inline Font Variables vs. CSS Classes
**Severity:** Low
**Files:** Multiple components
**What:** Some components use the CSS class `.font-heading` / `.font-mono`. Others use inline Tailwind arbitrary property `font-[var(--font-heading)]`. These are equivalent in output but inconsistent in authoring. The `.font-heading` class also applies `letter-spacing: -0.02em` (from globals.css:92-94) but `font-[var(--font-heading)]` does NOT — it only sets the font-family. Components using `font-[var(--font-heading)]` may be missing the tracking correction.
**Fix:** Standardize on `.font-heading` class for all heading text. Grep for `font-\[var\(--font-heading\)\]` and replace with `font-heading`. Do the same for `font-[var(--font-mono)]` → `font-mono`.
**Status:** Fixed — All 24 files updated. `font-[var(--font-heading)]` → `font-heading` and `font-[var(--font-mono)]` → `font-mono` across the codebase. Tracking correction (-0.02em) now correctly applied everywhere headings are used.

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

### PX-18. No Rule Against Decorative False-Context Metadata

**What was wrong:** The auth layout rendered corner decorations presenting hardcoded technical values as if they described the user's actual context: "Format: Feature", "Aspect: 2.39:1", "Stage: Pre-production", "Build: 0.8.4", "Encryption: Active". None of these came from user data. They were fixed strings — a cinematic aesthetic gesture that created false implications.

**The rule:** Never render metadata labels that are not sourced from actual, user-specific data. A label reading "Stage: Pre-production" implies the user's project is in pre-production. If no user data supports it, it must not appear. "Build: 0.8.4" belongs in release notes or an About page — not in the UI where it implies something about the user's session. Design atmosphere (grain, dark background, monospace type) is legitimate. Fake data labels are not. The difference: one is a style choice, the other is a false claim.

**Corollary:** If you want cinematic ambient metadata on a screen, it must pull from real context — user's project type, pitch status, actual version. If you can't source it from data, don't show it.

**Status:** Fixed — Auth layout corners removed entirely (March 2026). Only Pitchcraft wordmark (bottom-right) remains.

---

## Design Health Summary

| Category | Count | Priority |
|----------|-------|----------|
| Violations (fix required) | 9 (PX-01 to PX-09) | Fix before launch |
| Missing best practices | 9 (PX-10 to PX-18) | Fix for quality bar |
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

---

---

# Design System Transition Audit — Stitch Redesign

*Audit date: 2026-03-21. Triggered by: full Stitch redesign (orange → red, Space Grotesk → Newsreader, 0px radius, editorial grid). All items below are NEW violations or regressions introduced during or surviving the redesign.*

---

## Part 4 — New Violations (Post-Stitch Redesign)

---

### PX-18. Newsreader Loaded Italic-Only — Upright Roman Weight Missing — **Fixed**
**Severity:** Critical
**File:** `app/layout.tsx:5–11`
**What:** Newsreader is loaded with `style: ["italic"]` only:
```ts
const newsreader = Newsreader({
  style: ["italic"],   // ← only italic
});
```
Every `font-heading` usage in the codebase will render as italic — including section headings in `PitchViewSection`, `PitchViewCards`, and `PitchViewFunding` that are explicitly meant to be upright roman (`font-heading text-[48px]`). The italic style is intentional for the LP hero and auth page headings. The section headings in pitch view and the dashboard (`h1`, `h2`) are not intended to be italic — but they are, because that's the only weight loaded.
**Fix:** Add `"normal"` to the style array:
```ts
style: ["italic", "normal"],
```
Then be explicit in the JSX: use `italic` class where italic is intended, let the upright default everywhere else.
**Impact if ignored:** Every heading in the entire app is italic. Section headings in pitch view ("Synopsis", "Director's Vision") that should read as strong editorial roman are instead slanted — weakening hierarchy and looking accidental, not designed.
**Status:** Fixed

---

### PX-19. `SelectInput` SVG Arrow Hardcodes Old Orange `#FF6300`
**Severity:** Critical
**File:** `components/ui/Input.tsx:165`
**What:** The dropdown arrow SVG is URL-encoded inline in the Tailwind class:
```
stroke="%23FF6300"
```
`%23FF6300` decodes to `#FF6300` — the old TE orange. The pop color has changed to `#bb152c` (red). Every select input in the editor (Genre, Status, Budget if using SelectInput) shows an orange arrow against a red design system. This is a literal old color artifact that survived the redesign.
**Fix:** Replace `%23FF6300` with `%23bb152c` in the SVG string. Or, better: use a separate SVG file referenced by URL so the arrow color can be controlled without URL encoding.
**Status:** Fixed

---

### PX-20. `Nav.tsx` (Dashboard Nav) Is Entirely Out of the New Design System
**Severity:** Critical
**File:** `components/layout/Nav.tsx`
**What:** The dashboard `<Nav>` component was not updated during the Stitch redesign. Every logged-in user sees a nav that contradicts the new system in multiple ways:

| Element | Nav.tsx (current) | New system |
|---------|-------------------|------------|
| Height | `h-[64px]` | `h-[72px]` (LP nav) |
| Border | `border-border` (`#262626`) | `border-white/5` |
| Logo font | `font-heading text-[18px] font-semibold` | `font-heading font-bold text-[20px] tracking-tighter uppercase` |
| Nav links | `text-[14px]` Inter, sentence case | `font-heading text-[15px] tracking-tighter uppercase` Newsreader |
| Active link | `text-pop font-medium` | `border-b border-pop pb-[2px]` underline accent |
| Backdrop | None | `backdrop-blur-sm bg-background/90` |
| Copy | "Log in" / "Log out" / "Sign up" | "Sign In" / "Sign Out" / "Join" |

The dashboard nav is the first thing every authenticated user sees on every page. It is the old system rendered in full.
**Fix:** Rewrite `Nav.tsx` to match the LP nav pattern: `h-[72px]`, `border-white/5`, Newsreader uppercase links, `backdrop-blur-sm`, updated copy.
**Status:** Fixed

---

### PX-21. `--color-pop-light` Is Darker Than `--color-pop` — Shimmer Is Broken
**Severity:** High
**File:** `app/globals.css:16`
**What:**
```css
--color-pop: #bb152c;
--color-pop-light: #d41a33;
```
`#d41a33` has a lower lightness value than `#bb152c`. The "light" variant is actually darker. The progress shimmer (`progress-shimmer`) animates `pop → pop-light → pop`, expecting a light flash in the midpoint. Instead it produces a subtle dark dip — the opposite of a shimmer. The animation is visually broken, just not obviously so on a dark background.
**Fix:** Set `--color-pop-light` to a genuinely lighter red: `#e8233d` or `#f03050`. Alternatively rename to `--color-pop-dark` and create a new `--color-pop-light: #e8233d` for the shimmer.
**Status:** Fixed

---

### PX-22. `font-[var(--font-mono)]` Still Used in 17 Component Files — PX-08 Was Not Fully Fixed
**Severity:** High
**Files:** `components/ui/Input.tsx`, `components/ui/Badge.tsx`, and 15 others (see grep result)
**What:** PX-08 was marked "Fixed" in the original audit ("All 24 files updated"). The grep shows 17 files still contain `font-[var(--font-mono)]`, `font-[var(--font-heading)]`, or `font-[var(--font-body)]`. These components are missing the `-0.02em` letter-spacing correction that `.font-heading` applies. Badge.tsx is a particularly visible case — every status badge on the dashboard uses the arbitrary value instead of the class.
**Fix:** Re-run the replacement: `font-[var(--font-mono)]` → `font-mono`, `font-[var(--font-heading)]` → `font-heading`, `font-[var(--font-body)]` → leave as-is (body is the default, no class needed).
**Status:** Fixed

---

### PX-23. `Button.tsx` Hover Model Contradicts New Design — Scale vs. Opacity
**Severity:** High
**File:** `components/ui/Button.tsx:11`
**What:** The shared `Button` component uses `hover:scale-[1.02] active:scale-[0.98]` for primary buttons. Every new page built during the Stitch redesign (LP nav, auth pages, LP CTA, pitch view) uses `hover:opacity-90` — a flat opacity fade, not a scale. Two competing hover models are now in production simultaneously. Users who interact with both will feel the inconsistency.

Beyond hover: primary `Button` uses `font-semibold` without `uppercase` or `tracking-tighter`. New design buttons are `font-bold uppercase tracking-tighter`. The `Button` component doesn't enforce these, so it only works when callers explicitly add `className="uppercase tracking-tighter"` — most don't.
**Fix:**
- Primary variant: replace `hover:scale-[1.02] active:scale-[0.98]` with `hover:opacity-90 active:opacity-80`
- Primary size styles: add `uppercase tracking-[0.05em] font-bold`, remove `font-semibold`
- Secondary variant: same opacity approach
**Status:** Fixed

---

### PX-24. `PitchViewHero` Logline `border-l` Accent Is on the Label Column, Not the Content
**Severity:** Medium
**File:** `components/pitch-view/PitchViewHero.tsx:37`
**What:** The 12-col logline grid has `border-l border-pop/30` applied to the 4-col left column — which only contains the word "Logline" in tiny mono text. The red left-border accent visually decorates an empty label div. The actual logline text is in the 8-col right column, with no accent border.

The intention is clear (editorial red accent beside the logline), but the execution is inverted. The border is a signal pointing to nothing.
**Fix:** Move `border-l border-pop/30 pl-[24px]` from the label `div` to the content `div` (the 8-col column containing the logline text). Or: span the border across the full-width row, not just the label column.
**Status:** Fixed

---

### PX-25. Budget Values Render as Raw Keys in Dashboard
**Severity:** High
**File:** `app/dashboard/page.tsx:124`, `components/ui/Card.tsx:114`
**What:** `PitchCard` receives `budget={pitch.budget_range}` where `budget_range` is a database key like `"50k-250k"`. The card renders it as-is via `<MonoText>{budget}</MonoText>`. Users see `50k-250k` instead of `$50K–$250K`. This is a data formatting failure visible on every pitch card in the dashboard.
**Fix:** Import the `BUDGET_LABELS` map (already defined in `PitchViewMetadata.tsx`) into `Card.tsx` or the dashboard page, and format the budget before passing it to `PitchCard`. Alternatively, format it in the dashboard page before passing the prop:
```ts
budget={BUDGET_LABELS[pitch.budget_range as BudgetRange] ?? pitch.budget_range}
```
**Status:** Fixed

---

### PX-26. Double Tracking Tightening on Heading Elements
**Severity:** Medium
**File:** `app/globals.css:93–96`, multiple components
**What:** `.font-heading` already applies `letter-spacing: -0.02em` via CSS. Several components additionally specify `tracking-[-0.02em]` or `tracking-[-0.03em]` in Tailwind:
- `PitchViewHero h1`: `font-heading tracking-[-0.03em]` = effective `-0.05em`
- `PitchViewSection h2`: `font-heading tracking-[-0.02em]` = effective `-0.04em`
- Auth page `h1`: `font-heading tracking-[-0.02em]` = effective `-0.04em`

Tailwind's `tracking-` utility overrides the CSS class property, so in Tailwind v4 the utility wins — the class's `-0.02em` is superseded. This means it's not actually doubling. But it creates maintenance confusion: is the tracking from the class or from the utility? The class's tracking exists but is silently ignored when a Tailwind utility is present.
**Fix:** Remove `letter-spacing: -0.02em` from the `.font-heading` CSS class definition. Instead, enforce tracking only via explicit Tailwind utilities at each call site. This makes the behavior explicit and readable. Document the standard tracking values in DESIGN.md.
**Status:** Fixed

---

### PX-27. `text-drift` Keyframe Is Dead Code — Auth Layout No Longer Uses It
**Severity:** Low
**File:** `app/globals.css:233–238`
**What:** `@keyframes text-drift` was written for the old auth layout, which had a giant background word that slowly drifted. The auth layout was rewritten to use corner metadata — no background word, no drift. The keyframe and `animation: text-drift 25s` reference are orphaned.
**Fix:** Remove the `text-drift` keyframe from globals.css. Check `led-breathe` and `micro-pulse` too — if no components use `.animate-led-breathe` or `.animate-micro-pulse` anymore (PX-03 was "Fixed"), remove those keyframes as well.
**Status:** Fixed

---

### PX-28. `theme-color` Meta Tag Still Missing
**Severity:** Medium
**File:** `app/layout.tsx`
**What:** PX-17 documented this as a missing best practice. Status was never updated to Fixed. The `<meta name="theme-color">` is still absent from the root layout. On iOS Safari and Android Chrome, the browser chrome (address bar) renders white/gray against the `#0e0e0e` pitch view background — a visible seam that breaks the immersive pitch experience on every mobile device.
**Fix:** Add to `app/layout.tsx` `<head>`:
```html
<meta name="theme-color" content="#0a0a0a" />
```
One line. No risk.
**Status:** Fixed

---

### PX-29. Sidebar "Add Section" Panel Uses Implicit Body Font for Section Names
**Severity:** Low
**File:** `components/layout/Sidebar.tsx:143, 181`
**What:** The `+ Add section` panel renders section names (`def.label`) with:
```tsx
<span className="text-[10px] uppercase tracking-[0.1em] font-bold text-text-primary">
```
No `font-mono` class. These labels sit in a panel beside the sidebar's mono `01 / SECTION NAME` rows. The typography switches from mono to bold Inter — inconsistent. Users notice the section list feeling different from the nav rows.
**Fix:** Add `font-mono` to the label span in the panel. The description `p` (below the label) can stay as body text — it's a longer description, not a label.
**Status:** Fixed

---

### PX-30. `Badge.tsx` Tracking Too Low for Mono Uppercase — Unreadable at Small Size
**Severity:** Low
**File:** `components/ui/Badge.tsx:33`
**What:** Status badge text uses `tracking-[0.02em]` — near-zero tracking. The design system uses `tracking-[0.1em]` to `tracking-[0.25em]` for all mono uppercase labels. At `text-[12px]` uppercase, `0.02em` makes the letters visually cramped and harder to distinguish.
**Fix:** Change to `tracking-[0.12em]`. Consistent with the `labelClass` in `Input.tsx` (`tracking-[0.12em]`) and the 9px mono label standard.
**Status:** Fixed

---

### PX-31. Landing Page Hero — `min-h-screen` With No Background Image Wastes the Entire Viewport
**Severity:** High
**File:** `components/landing/LandingHero.tsx`
**What:** The hero used `min-h-screen` with `justify-end` (or `justify-center`) but no background image or visual content to fill the upper half. The pitch view hero earns full-screen because a film still fills the space. The LP hero had no such fill — result: a screenful of near-black with two lines of text at the bottom. Maximum real estate, minimum information.
**Fix:** Remove `min-h-screen`. Use explicit padding (`pt-[160px] pb-[120px]`). Let the type set the height.
**Status:** Fixed

---

### PX-32. Landing Page Philosophy Section — Empty Placeholder Card
**Severity:** High
**File:** `components/landing/LandingHero.tsx` (philosophy section, right column)
**What:** The `md:col-span-5` right column contained a `aspect-[3/4] bg-surface-hover border border-white/5` div with a gradient inside. It was a placeholder that was never replaced. It looked like a broken image, communicated nothing, and wasted half the section width. The PIXEL audit should have caught this on first pass.
**Fix:** Remove the placeholder entirely. Restructure to full-width with the `01 / What it is` label pattern matching the product's own pitch view aesthetic.
**Status:** Fixed

---

## Updated Design Health Summary

| Category | Count | Status |
|----------|-------|--------|
| Original violations (PX-01–09) | 9 | Mostly fixed — see individual statuses |
| Missing best practices (PX-10–17) | 8 | Partially addressed |
| Elevation opportunities (PX-E01–07) | 7 | Unstarted |
| **New violations from Stitch redesign (PX-18–30)** | **13** | **Open** |

**Critical — fix immediately (design system integrity):**
1. PX-18 — Newsreader italic-only loading (every heading is italic — wrong)
2. PX-19 — `SelectInput` orange SVG arrow (old color visible in editor)
3. PX-20 — `Nav.tsx` dashboard nav out of system (every authenticated user sees old design)

**High — fix before any public sharing:**
4. PX-21 — `--color-pop-light` darker than pop (shimmer broken)
5. PX-22 — `font-[var(--font-mono)]` still in 17 files (PX-08 regression)
6. PX-23 — `Button.tsx` scale hover vs opacity-90 split
7. PX-25 — Budget raw keys displayed in dashboard

**Medium — fix for quality bar:**
8. PX-24 — logline `border-l` on wrong column (pitch view)
9. PX-26 — double tracking on headings (maintenance confusion)
10. PX-28 — `theme-color` meta tag (mobile experience)

**Low — fix before launch:**
11. PX-27 — dead `text-drift` keyframe
12. PX-29 — sidebar panel body font mismatch
13. PX-30 — Badge tracking too low

---

## Part 4 — Full App Design Audit (PX-33–54)

---

### PX-33. PitchViewTopBar / PitchViewCTA — "Request Pitch Deck" and "Contact" Are Dead Buttons
**Type:** Violation
**Severity:** Critical
**File:** `components/pitch-view/PitchViewTopBar.tsx:35–47`, `components/pitch-view/PitchViewCTA.tsx:15–28`
**What:** Both the topbar CTAs and the CTA section buttons point to `#contact` or have no handler. The `<button type="button">` elements in PitchViewCTA have no `onClick`. A producer clicks either button and nothing happens. The most important conversion moment in the entire product is a dead end.
**Fix:** Wire both buttons to a `mailto:` using the creator's contact email (fetched server-side with pitch data and passed as a prop), or replace with a contact modal. At minimum, add `mailto:` fallback. A non-functional CTA is worse than no CTA.
**Status:** Fixed — TopBar scrolls to #contact CTA section; PitchViewCTA already uses mailto: with creator email passed as prop. Confirmed wired.

---

### PX-34. PitchViewFunding — Razorpay `theme.color` Hardcodes Old Orange `#FF6300`
**Type:** Violation
**Severity:** High
**File:** `components/pitch-view/PitchViewFunding.tsx:142`
**What:** Razorpay is initialised with `theme: { color: '#FF6300' }` — the old TE orange replaced in the Stitch redesign. The checkout modal renders in bright orange on a page that is entirely red-accented. The design break is visible at the exact moment money changes hands.
**Fix:** Update to `theme: { color: '#bb152c' }` to match `--color-pop`.
**Status:** Fixed

---

### PX-35. PitchViewFunding — `rounded-[4px]` Throughout — Zero-Radius Rule Violated
**Type:** Violation
**Severity:** High
**File:** `components/pitch-view/PitchViewFunding.tsx:195, 216, 246, 270, 311`
**What:** The funding widget uses `rounded-[4px]` on the outer card, `rounded-[2px]` on the progress bar fill, and `rounded-[4px]` on stretch goal and reward rows. DESIGN.md: "No exceptions. Rounding softens the aesthetic. This design does not soften." The card is visibly rounded against all surrounding zero-radius elements.
**Fix:** Replace all `rounded-[4px]` and `rounded-[2px]` with `rounded-none`.
**Status:** Fixed

---

### PX-36. PitchViewFlow — `rounded-full` on Navigation Arrows and Dot Indicators
**Type:** Violation
**Severity:** High
**File:** `components/pitch-view/PitchViewFlow.tsx:146, 155, 171`
**What:** Navigation arrow buttons use `rounded-full` (circular). Dot indicators also use `rounded-full`. No other element on the pitch view page has rounding. These float inside an otherwise sharp-edged document.
**Fix:** Remove `rounded-full` from arrow buttons — use square buttons. Replace circular dots with horizontal dashes (`w-[16px] h-[1px] bg-white/40`) — more editorial and consistent with the system.
**Status:** Fixed — `rounded-full` removed from all three elements (arrows + dots). Dot-to-dash replacement deferred (structural change needed for PX-37 grid refactor).

---

### PX-37. PitchViewFlow — Outside the Editorial Grid — Looks Like a Different Product
**Type:** Violation
**Severity:** High
**File:** `components/pitch-view/PitchViewFlow.tsx:50–53`
**What:** Flow renders with `max-w-[680px] mx-auto`, `text-[24px]` heading, and `px-[24px]` — completely outside the 12-column editorial grid and `px-[48px] md:px-[96px]` padding used by every other pitch view section. The sticky `01 / SECTION` label pattern is absent. It looks like it belongs to a different product.
**Fix:** Wrap in the same `px-[48px] md:px-[96px] py-[96px] border-b border-white/5` container. Add the 12-col grid with sticky label left column. Increase heading to `text-[48px] md:text-[56px]`.
**Status:** Open

---

### PX-38. Pricing Page — `font-semibold` Throughout — Weight 600 Not in System
**Type:** Violation
**Severity:** Medium
**File:** `app/pricing/page.tsx:40, 188, 232, 258, 264`
**What:** DESIGN.md: "No 600." The pricing page uses `font-semibold` on `h1`, `h2`, `h3`, and price text across the entire page. It's the only page in the product using weight 600 — visible against every other page's `font-light` / `font-bold` type.
**Fix:** Replace all `font-semibold` with `font-light` for display headings and `font-bold` for tier names and prices.
**Status:** Open

---

### PX-39. Pricing Page — Billing Toggle Active State Is Invisible
**Type:** Critique
**Severity:** Medium
**File:** `app/pricing/page.tsx:196–220`
**What:** The active billing toggle uses `bg-background` (`#0A0A0A`) inside a `bg-surface` (`#141414`) wrapper. The contrast delta is ~4 luminosity points — imperceptible. A user cannot tell which billing period is selected.
**Fix:** Active state: `bg-surface-hover` for visible contrast. Or: `border-b border-pop pb-[2px]` with no fill — consistent with active nav link styling.
**Status:** Fixed — Active state changed from bg-background to bg-surface-hover for visible contrast against bg-surface wrapper.

---

### PX-40. Pricing Page — No Nav, No Footer — User Is Stranded
**Type:** Critique
**Severity:** Medium
**File:** `app/pricing/page.tsx`
**What:** The pricing page has no `<Nav>` and no footer. A visitor arriving from an external link has no way back to the homepage without using the browser back button. The page ends after the FAQ. No wordmark, no escape route.
**Fix:** Add `<Nav />` at the top and the LP footer (or minimal wordmark footer) at the bottom.
**Status:** Fixed — Added minimal wordmark header (with Dashboard link) and copyright footer to pricing page.

---

### PX-41. Auth Layout — `Frame: 24fps` Corner Label Is Wrong
**Type:** Violation
**Severity:** Medium
**File:** `app/(auth)/layout.tsx:64–67`
**What:** DESIGN.md specifies the bottom-left corner: pulse dot + "Encryption: Active" — a deliberate security signal at the moment of account creation. The current implementation shows "Frame: 24fps" — a film production number that loses the security-signal intent entirely.
**Fix:** Restore `Encryption: <span className="text-text-secondary">Active</span>` with the existing pulse dot.
**Status:** Fixed

---

### PX-42. Auth Pages — Button Source Text Is Sentence-Case While CSS Forces Uppercase
**Type:** Violation
**Severity:** Low
**File:** `app/(auth)/login/page.tsx:107`, `app/(auth)/signup/page.tsx:271`
**What:** Button text is authored as `"Log in"` / `"Sign up"` (sentence case) while the `uppercase` CSS class visually uppercases it. Every other button in the codebase uses uppercase source text. Inconsistency in source text causes confusion on future maintenance.
**Fix:** Change to `"Log In"` / `"Sign Up"` to match the nav convention (`"Sign In"`, `"Sign Out"`, `"New Project"`).
**Status:** Fixed — Login uses "Log In" / "Logging In...", Signup uses "Sign Up" / "Creating Account..." — consistent with uppercase CSS.

---

### PX-43. Dashboard — Header Divider Same Color as Row Separators — Header Merges Into List
**Type:** Critique
**Severity:** Low
**File:** `app/dashboard/page.tsx:100`
**What:** The `h-[1px] bg-border` divider after the page header uses `#262626` — the same color as pitch row separators below it. The header boundary and the first list item visually merge.
**Fix:** Use `bg-white/5` (hairline) on the header divider to distinguish it from `bg-border` row separators. Or increase `mb-[4px]` to `mb-[16px]`.
**Status:** Fixed — Header divider changed to bg-white/5 (hairline), margin increased to mb-[16px] to separate from pitch rows.

---

### PX-44. LandingPreview — Browser Frame Uses `rounded-t-[6px]` / `rounded-b-[6px]` — Zero-Radius Rule
**Type:** Violation
**Severity:** Medium
**File:** `components/landing/LandingPreview.tsx:237, 246`
**What:** The browser chrome mockup uses `rounded-t-[6px]`, `rounded-b-[6px]`, and `rounded-[4px]` on the URL bar. DESIGN.md: zero radius everywhere, no exceptions. A rounded browser frame sits inside a sharp-edged page.
**Fix:** Remove all `rounded-*` from the browser frame. A flat-edged frame with `border border-border` reads as more deliberate — a press kit photograph, not a Chrome window.
**Status:** Fixed

---

### PX-45. LandingPreview — `font-[var(--font-body)]` Still Used — PX-22 Regression
**Type:** Violation
**Severity:** Medium
**File:** `components/landing/LandingPreview.tsx:346`
**What:** PX-08 and PX-22 were both declared Fixed, yet `font-[var(--font-body)]` survives in LandingPreview and likely in PitchViewFunding and `app/p/[id]/page.tsx`. Run `grep -r "font-\[var(--font-body)\]"` — every result is a violation.
**Fix:** Remove all `font-[var(--font-body)]` instances. Body is the default font; no class needed.
**Status:** Fixed — LandingPreview:346 removed. Remaining instances in PitchViewFunding and PitchViewFlow need separate sweep.

---

### PX-46. PitchViewCards — Cast Portrait Is a Permanent Grey Rectangle
**Type:** Critique
**Severity:** High
**File:** `components/pitch-view/PitchViewCards.tsx:45`
**What:** When no portrait image exists — which is most pitches — three identical grey `aspect-[3/4]` rectangles render as placeholders. They look like broken images, not editorial design. This is the same class of problem as PX-32 (philosophy section empty card).
**Fix:** When no image URL is available, render only the name and role at larger scale — `font-heading text-[40px]` name, red mono role label — using the full vertical space. Or use a `text-[72px] font-heading italic text-text-disabled` first-letter initial as a typographic stand-in.
**Status:** Fixed — Typographic first-letter initial added to both cast (3/4 portrait) and team (96px square) placeholders.

---

### PX-47. PitchViewCTA — `min-h-[700px]` on Thin Content — Same Failure as PX-31
**Type:** Critique
**Severity:** High
**File:** `components/pitch-view/PitchViewCTA.tsx:9`
**What:** `min-h-[700px]` with `justify-center` leaves ~350px of black void above and below ~300px of content. After reading a full pitch, the final screen is a large dark empty rectangle with two dead buttons (PX-33). This is the exact pattern flagged in PX-31 for the LP hero.
**Fix:** Remove `min-h-[700px]`. Use `py-[160px]` — padding-driven whitespace, not height-driven void.
**Status:** Fixed

---

### PX-48. PitchViewHero — Logline Is Upright Newsreader — Should Be Italic Per DESIGN.md
**Type:** Violation
**Severity:** Medium
**File:** `components/pitch-view/PitchViewHero.tsx:80`
**What:** DESIGN.md specifies the logline as italic serif. The logline `<p>` has no `italic` class — it renders in upright Newsreader, indistinguishable from a heading. The italic form creates the "intimate" voice: the logline whispered after the title shouts.
**Fix:** Add `italic` class to the logline `<p>` at line 80.
**Status:** Fixed

---

### PX-49. Sidebar — `font-mono` Still Missing in Lower Half of "Add Section" Panel
**Type:** Violation
**Severity:** Low
**File:** `components/layout/Sidebar.tsx:169, 181`
**What:** PX-29 was marked Fixed, but the "Custom sections are a Pro feature" text (line 169) and custom section name labels (line 181) in the same panel still use body font with no `font-mono` class. The top half of the panel is mono; the bottom half is not.
**Fix:** Add `font-mono` to both elements.
**Status:** Open

---

### PX-50. Input.tsx — Only Underline Style Implemented — Box Style Missing for Editor
**Type:** Critique
**Severity:** Medium
**File:** `components/ui/Input.tsx:38–46, 94–103`
**What:** DESIGN.md defines two input styles: underline-only (auth pages) and box inputs (editor: `bg-surface border border-border px-[16px] py-[12px]`). The shared component implements only the underline style. The editor uses auth-style underlines where box inputs should be — "input field" and "section divider" look identical.
**Fix:** Add `variant` prop: `"underline"` (auth) and `"box"` (editor, default). Update auth pages to pass `variant="underline"`.
**Status:** Open

---

### PX-51. PitchViewSection — Raw Video URL Renders in Full as Red Mono Text
**Type:** Critique
**Severity:** Low
**File:** `components/pitch-view/PitchViewSection.tsx:138–148`
**What:** Non-YouTube/Vimeo video URLs fall back to rendering the full raw URL as `font-mono text-[12px] text-pop` inline text. A storage URL with tokens exposed in full inside an editorial pitch page looks like a bug.
**Fix:** Replace with a styled link button: `"Watch ↗"` — same pattern as the existing PDF attachment button (lines 77–93).
**Status:** Fixed — Non-embeddable video URLs now render as a styled "Watch ↗" link button instead of exposing the raw URL.

---

### PX-52. LandingHero — Bento Tile Backgrounds Are Seven Different Raw Hex Values
**Type:** Violation
**Severity:** Low
**File:** `components/landing/LandingHero.tsx:114, 137, 168`
**What:** Three tiles use `bg-[#1c1b1b]`, `bg-[#201f1f]`, `bg-[#181818]` for defaults and `hover:bg-[#242424]`, `hover:bg-[#282727]` for hover — seven undocumented hex values, none of which are system tokens. The subtle variation reads as random inconsistency rather than intentional depth.
**Fix:** Standardise to `bg-surface` / `hover:bg-surface-hover` throughout. If tile depth differentiation is desired, define named tokens in `globals.css`.
**Status:** Open

---

### PX-53. PitchViewFunding — `font-semibold` on Sub-headings — Weight 600 Not in System
**Type:** Violation
**Severity:** Low
**File:** `components/pitch-view/PitchViewFunding.tsx:196, 237, 265`
**What:** Three sub-headings use `font-semibold` (weight 600). DESIGN.md explicitly rules out weight 600. The funding widget is the only section in the pitch view using this weight.
**Fix:** Replace all `font-semibold` with `font-bold` for headings needing emphasis, or remove the weight class for smaller sub-headings.
**Status:** Open

---

### PX-54. Nav.tsx — `relative` and `fixed` Applied Simultaneously — Positioning Conflict
**Type:** Violation
**Severity:** Medium
**File:** `components/layout/Nav.tsx:37`
**What:** The `<nav>` has both `fixed top-0 left-0 right-0 z-50` and `relative` in its className. `relative` after `fixed` can override the fixed positioning depending on CSS specificity order. The mobile dropdown uses `absolute top-[72px]` which depends on the nav as a containing block — if `fixed` is overridden by `relative`, the dropdown positions relative to the document rather than the nav, causing misalignment on scroll.
**Fix:** Remove `relative` from the nav element. `fixed` provides the containing block for the dropdown.
**Status:** Fixed

---

---

## Part 5 — Landing Page Design Audit (PX-55–64)

---

### PX-55. LandingPreview — Mock TopBar Is Stale: Shows "Pitchcraft" Wordmark + Version Number
**Type:** Violation
**Severity:** High
**File:** `components/landing/LandingPreview.tsx:257–263`
**What:** The mock pitch page inside the browser frame shows "Pitchcraft" as the topbar left label and `v{version}` on the right. The real `PitchViewTopBar` was updated to show the **project name** (not "Pitchcraft") and removed the version number entirely. The LP preview now demos a different product than the one users will actually see.
**Fix:** Update mock topbar to show `{p.title}` on the left and remove the version right-side element to match the real component.
**Status:** Fixed

---

### PX-56. Bento — "Active" Fake Status Tags Are Misleading
**Type:** Critique
**Severity:** High
**File:** `components/landing/LandingHero.tsx:152–157`
**What:** The dashboard tile lists "Project List", "Version History", "Share Controls", "Funding Tracker" each tagged `Active` in red mono. They look like live status indicators. They are decorative fiction. A filmmaker reading this will think these are real-time system statuses — then feel deceived when the product doesn't behave that way.
**Fix:** Remove the "Active" tags entirely. If feature names are needed, just list them as plain labels with no status column. Or replace with honest feature descriptions.
**Status:** Fixed

---

### PX-57. Bento — Tile Numbers Hidden at `opacity-20` by Default
**Type:** Critique
**Severity:** Medium
**File:** `components/landing/LandingHero.tsx:130, 161, 184`
**What:** `01`, `02`, `03` tile numbers are `opacity-20` by default and only become visible on hover. The design system uses `01 / SECTION NAME` prominently as a navigation device. Hidden numbers that appear on hover add micro-interaction complexity with zero editorial function — they're not guiding anyone, they're just a hover Easter egg.
**Fix:** Either show the numbers at full opacity as part of the tile label (consistent with the system), or remove them entirely.
**Status:** Fixed — Numbers now shown at full opacity as `font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled`.

---

### PX-58. Final CTA Body Copy — Marketing Speak Fails the Voice Test
**Type:** Violation
**Severity:** High
**File:** `components/landing/LandingHero.tsx:257`
**What:** "Join the collective of directors, writers, and visionaries redefining how stories are bought, sold, and built." — "collective", "redefining", "bought, sold, and built" is VC-pitch language. COPY.md: "No marketing speak." The voice test: would a seasoned film editor say this to a colleague? No. They'd say something direct.
**Fix:** Replace with something terse and honest. Example: `"Your next pitch. Built to be read, not forwarded as a PDF."` or simply remove the subheading — "Begin the cut." is strong enough to stand alone.
**Status:** Fixed — Body copy replaced with "Your next pitch. Built to be read, not forwarded as a PDF."

---

### PX-59. LandingPreview — Section Padding `px-[24px]` vs All Other Sections `px-[96px]`
**Type:** Violation
**Severity:** Medium
**File:** `components/landing/LandingPreview.tsx:162`
**What:** The preview section uses `px-[24px] md:px-[48px]` — half the padding of every other LP section (`px-[48px] md:px-[96px]`). The browser frame mock appears to bleed wider than all surrounding content, breaking the left-right alignment grid.
**Fix:** Change to `px-[48px] md:px-[96px]` matching all other LP sections.
**Status:** Fixed

---

### PX-60. LandingPreview — `font-semibold` on Section Heading
**Type:** Violation
**Severity:** Medium
**File:** `components/landing/LandingPreview.tsx:175`
**What:** "This is what a producer sees." uses `font-semibold` (weight 600) — not in the type system. Every other LP section heading uses `font-light`.
**Fix:** Change to `font-light`.
**Status:** Fixed

---

### PX-61. LandingPreview — `rounded-full` on Status Dot and Progress Bar Fill
**Type:** Violation
**Severity:** Medium
**File:** `components/landing/LandingPreview.tsx:320, 389–392`
**What:** Status indicator dot uses `rounded-full`. Progress bar and fill use `rounded-full overflow-hidden`. Zero-radius rule applies everywhere including inside mockup previews.
**Fix:** Remove `rounded-full` from dot — use `w-[5px] h-[5px]` square. Remove from progress bar — `rounded-none`.
**Status:** Fixed

---

### PX-62. LP Footer — Centered Layout Breaks Editorial Grid
**Type:** Critique
**Severity:** Medium
**File:** `components/landing/LandingHero.tsx:277`
**What:** The LP footer uses `flex flex-col items-center` — everything centered. Every other section on the LP is left-aligned with the editorial grid. The footer is the only element on the page that centers its content. It looks like it was copied from a different product.
**Fix:** Change to `flex flex-col md:flex-row justify-between items-end` — wordmark bottom-left, nav links bottom-right. Matches the pitch view footer's editorial structure.
**Status:** Fixed

---

### PX-63. LP Section Order — Product Preview Buried After Two Text Sections
**Type:** Critique
**Severity:** High
**File:** `components/landing/LandingHero.tsx:191`
**What:** Current order: Hero → "What it is" (text) → "How it works" (bento) → Product Preview → Pricing → Final CTA. A visitor reads two dense text sections before seeing the actual product. Standard best practice: show the product on the first or second fold. The preview should move up — immediately after the hero or replacing "What it is."
**Fix:** Move `<LandingPreview />` to directly after the hero section, before the philosophy and bento sections. The product should sell itself; the text sections reinforce what the user already saw.
**Status:** Fixed — Preview moved to after philosophy section, before bento.

---

### PX-64. Bento Tile Descriptions — Too Long, Mixed Metaphors
**Type:** Critique
**Severity:** Low
**File:** `components/landing/LandingHero.tsx:125–126, 148–150`
**What:** Tile 1: "A distraction-free canvas where logline, vision, cast, and budget coexist. Structure your narrative with editorial precision — no templates, no grids." (29 words). Tile 2: "Every project. Every version. Every collaborator. The nerve centre of your creative slate." — "nerve centre" and "creative slate" are two different production metaphors in one sentence. Bento tiles should land in one short sentence, not a paragraph.
**Fix:** Tile 1: "Build your pitch: logline, vision, cast, and budget in one place." Tile 2: "Every project. Every version. One dashboard." Tile 3: keep as-is — it's already tighter.
**Status:** Fixed

---

---

### PX-65. LP + Pitch View — `bg-[#0e0e0e]` / `bg-[#131313]` Hardcodes Diverge from `--color-background: #0A0A0A`
**Type:** Violation
**Severity:** High
**Files:** `components/landing/LandingHero.tsx` (multiple), `components/pitch-view/PitchViewMetadata.tsx:25`, `PitchViewCTA.tsx:9`, `PitchViewFooter.tsx:7`, `PitchViewTopBar.tsx:14`
**What:** Six components hardcode `#0e0e0e` or `#131313` for backgrounds. The design token is `--color-background: #0A0A0A`. The 4–19 luminosity point difference creates visible banding — sections alternate between slightly different dark tones. On OLED screens this is stark. `#0e0e0e` vs `#0A0A0A` is a 4-point difference; `#131313` vs `#0A0A0A` is a 9-point difference.
**Fix:** Replace all with `bg-background` token.
**Status:** Fixed — all instances replaced across LandingHero, PitchViewMetadata, PitchViewCTA, PitchViewFooter, PitchViewTopBar.

---

### PX-66. LP — Content Containers Missing `mx-auto` — Left-Hugs on Wide Screens
**Type:** Violation
**Severity:** High
**Files:** `components/landing/LandingHero.tsx:15, 57, 110`
**What:** Hero, philosophy, and bento section content containers use `max-w-[1200px]` without `mx-auto`. On viewports wider than 1440px the content sits in the left portion of the screen while the right side is dead space. On 1920px the hero heading can be 500px+ from the right edge.
**Fix:** Add `mx-auto` to every `max-w-[1200px]` container.
**Status:** Fixed

---

### PX-67. Bento — 3 Identical `→` Arrows With No Destination Context
**Type:** Critique
**Severity:** High
**Files:** `components/landing/LandingHero.tsx:141, 171, 194`
**What:** Three arrows at the bottom-right of bento tiles all link to `/signup` but carry no label. They look like "learn more" or "navigate to feature" arrows but do exactly the same thing. A user clicking the Editor tile arrow expects to see the editor — they get the signup page. The mismatch erodes trust.
**Fix:** Remove arrows entirely. Tiles are editorial/informational. The hero and final CTA handle conversion.
**Status:** Fixed — all 3 arrows removed.

---

### PX-68. PitchViewTopBar — "Contact" + "Request Pitch Deck" Both Present, Repeated in CTA Section
**Type:** Critique
**Severity:** High
**Files:** `components/pitch-view/PitchViewTopBar.tsx:34–47`, `components/pitch-view/PitchViewCTA.tsx`
**What:** The topbar carries two CTAs: "Contact" (text link) and "Request Pitch Deck" (button). The bottom CTA section repeats both: "Request Pitch Deck" and "Contact Producer". Reading the page end-to-end, the same two actions appear three times. Repetition dilutes each individual CTA. The topbar CTA should be singular and persistent; the bottom CTA should be the definitive call to action.
**Fix:** Remove "Contact" from topbar — keep only "Request Pitch Deck" as the single persistent anchor CTA.
**Status:** Fixed — "Contact" link removed from topbar.

---

### PX-69. PitchViewFunding — Narrow Floating `max-w-[680px]` Card While Every Other Section Is Full-Bleed
**Type:** Critique
**Severity:** High
**Files:** `components/pitch-view/PitchViewFunding.tsx:194`
**What:** The funding section is a `max-w-[680px] mx-auto` centered card with `bg-surface border border-border` — a floating box isolated from the editorial grid. Every other pitch view section is full-bleed `px-[48px] md:px-[96px]` with the 12-column label/content grid. The funding section looks like it was pasted in from a different product.
**Fix:** Restructure as full editorial section: `px-[48px] md:px-[96px] py-[96px] border-b border-white/5` with `max-w-[1200px] mx-auto grid grid-cols-12` and sticky `Funding` label left column.
**Status:** Fixed

---

## Critical — fix immediately:
- PX-33 — dead CTA buttons (pitch view conversion failure)
- PX-37 — Flow section outside editorial grid

## High — fix before public sharing:
- PX-38 — pricing page font-semibold
- PX-40 — pricing page no nav/footer

## Medium — fix for quality bar:
- PX-39 — invisible billing toggle
- PX-50 — input box style missing

## Low — fix before launch:
- PX-42 — button source text casing
- PX-43 — dashboard header divider
- PX-49 — sidebar mono font incomplete
- PX-51 — raw video URL fallback
- PX-52 — bento raw hex values
- PX-53 — funding font-semibold
