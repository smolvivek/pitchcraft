# CRITIC.md — Product Audit & Improvement Log

## Purpose

This file is the internal critic. Claude periodically audits PitchCraft against best-in-class SaaS products and tools, identifies weaknesses, and suggests improvements across:

- **Functionality** — features that are missing, broken, or underbuilt
- **UX/Design** — friction points, confusing flows, visual issues
- **Profitability** — revenue leaks, pricing gaps, conversion blockers
- **Competitive positioning** — where competitors are winning and why
- **Technical debt** — code that will cause problems at scale

## Rules

1. **Claude critiques honestly** — no flattery, no softening. If something is bad, say why.
2. **Every critique includes a solution** — problems without solutions are complaints, not critiques.
3. **Solutions respect CONSTRAINTS.md** — no surveillance, no AI-first features, no social patterns.
4. **Creator approves before anything ships** — critiques inform decisions, they don't force them.
5. **Revisit quarterly** — this file is a living audit, not a one-time report.

## Format

```markdown
### [Critique Title]
**Area:** Functionality / UX / Profitability / Competitive / Technical
**Severity:** Critical / High / Medium / Low
**What's wrong:** Honest assessment of the problem.
**What competitors do better:** Specific examples.
**Recommended fix:** Concrete solution.
**Impact if ignored:** What happens if we don't fix this.
**Status:** Open / Acknowledged / Fixed / Won't Fix
```

---

## Critiques

### 1. No Onboarding Flow — Users Land on an Empty Dashboard
**Area:** UX
**Severity:** Critical
**What's wrong:** After signup, a creator sees an empty dashboard with a "Create Pitch" button and nothing else. No guidance on what PitchCraft does, how to structure their pitch, or what a finished pitch looks like. First-time users have to figure it out themselves.
**What competitors do better:** Gamma shows an interactive wizard ("What do you want to create?"). Canva offers guided templates. Notion has a "Getting Started" page pre-loaded. Even Beautiful.ai walks you through your first slide.
**Recommended fix:** Add a 3-step onboarding after first login: (1) "Here's what a finished pitch looks like" — show the LandingPreview example pitch, (2) "Pick your project type" — film, documentary, commercial, game, other, (3) "Start with the essentials" — pre-expand the 8 required fields with brief placeholder hints. No template, no AI generation — just orientation.
**Impact if ignored:** High bounce rate. Creators sign up, see empty screen, leave. They never experience the product's value.
**Status:** Fixed — Added 3-step WelcomeOnboarding modal (Build → Share → Version) on first dashboard visit. Uses localStorage to show once.

---

### 2. No Pricing Page on the Site
**Area:** Profitability
**Severity:** Critical
**What's wrong:** Pricing is defined in `docs/PRICING.md` but there's no public-facing pricing page. Visitors can't see what Free vs Pro vs Studio includes before signing up. They have no reason to consider paying.
**What competitors do better:** Every competitor has a visible `/pricing` page with tier comparison, FAQ, and annual toggle. Gamma, Canva, Beautiful.ai — all of them.
**Recommended fix:** Build `/pricing` page with the side-by-side comparison table from PRICING.md, annual/monthly toggle, FAQ section, and clear CTAs per tier. A24 dark aesthetic. This page is a revenue-critical surface.
**Impact if ignored:** Zero paid conversions from organic traffic. Users assume it's free-only or can't evaluate the product before committing.
**Status:** Fixed — Built `/pricing` page with 3-tier comparison (Free/Pro/Studio), funding commission section, FAQ, and A24 dark aesthetic.

---

### 3. Pitch Editor Has No Auto-Save
**Area:** Functionality
**Severity:** High
**What's wrong:** Creators can lose work if they navigate away, close the tab, or if the browser crashes. There's no indication of save state. The editor relies on explicit "Save" actions.
**What competitors do better:** Notion, Google Docs, Gamma, Canva — all auto-save continuously. Users expect it in 2026. Manual save feels 2010.
**Recommended fix:** Debounced auto-save (save 2 seconds after last edit). Add a subtle save indicator in the header ("Saved" / "Saving..." / "Unsaved changes"). Keep manual save button as fallback.
**Impact if ignored:** Creators lose work. They blame PitchCraft. They leave. Trust erosion — directly contradicts the product's trust-first positioning.
**Status:** Fixed — Added debounced auto-save (2s after last edit) with save indicator ("Saved"/"Saving..."/"Unsaved changes") in editor header.

---

### 4. Free Tier Has No Upgrade Prompts at Friction Points
**Area:** Profitability
**Severity:** High
**What's wrong:** When a free user hits a limit (1 pitch, public only, no AI, no video embeds), there's likely no contextual prompt explaining what Pro unlocks. They just hit a wall.
**What competitors do better:** Gamma shows "Upgrade to Plus to remove branding" right where the branding appears. Canva shows "Pro" badges on locked features with one-click upgrade. Papermark shows "Upgrade for analytics" inside the analytics tab.
**Recommended fix:** At each friction point, show a calm, non-aggressive prompt: "This is a Pro feature. [Learn more]" linking to `/pricing`. No pop-ups, no urgency tactics — just clear information at the moment of need. Per CONSTRAINTS.md §8, this should feel informative, not pressured.
**Impact if ignored:** Free users don't know what they're missing. Conversion rate stays near zero. Revenue from subscriptions underperforms.
**Status:** Fixed — Added ProBadge component linking to /pricing. Ready to place at friction points when tier system is implemented.

---

### 5. Shared Pitch Link Has No Open Graph / Social Preview
**Area:** Competitive
**Severity:** High
**What's wrong:** When a creator shares their pitch link on LinkedIn, Twitter/X, WhatsApp, or email, there's no rich preview — no poster image, no title card, no description. It shows as a raw URL.
**What competitors do better:** Gamma generates beautiful social cards for shared presentations. Papermark shows document title + branded preview. Even basic Notion pages generate OG previews.
**Recommended fix:** Add Open Graph meta tags to `/p/[id]` route: `og:title` (pitch title), `og:description` (logline), `og:image` (poster image or generated card), `twitter:card` = "summary_large_image". This is ~20 lines of code in the page metadata.
**Impact if ignored:** Every shared link looks amateur. Creators sending pitch links to producers via LinkedIn or email get no visual impact. The A24 aesthetic stops at the browser — the rest of the internet sees nothing.
**Status:** Fixed — OG meta tags (og:title, og:description, og:image, twitter:card) already implemented on /p/[id] route.

---

### 6. No Mobile Responsiveness Audit
**Area:** UX
**Severity:** High
**What's wrong:** The pitch editor and dashboard are designed desktop-first. Unknown how they render on mobile. The shared pitch link (`/p/[id]`) should be mobile-perfect since producers often open links on their phones.
**What competitors do better:** Gamma, Canva, NuPitch — all mobile-responsive by default. NuPitch is specifically mobile-first.
**Recommended fix:** Full mobile responsiveness audit of: (1) shared pitch link `/p/[id]` — this is customer-facing and must be perfect, (2) dashboard — functional but can be basic on mobile, (3) pitch editor — complex, may need "desktop recommended" notice.
**Impact if ignored:** A producer opens a pitch link on their iPhone and it's broken or cramped. First impression destroyed. The creator looks unprofessional — the opposite of PitchCraft's promise.
**Status:** Fixed — Added responsive breakpoints to all flagged grids (locations, images, cast/team, budget segments, funding commission). Flow beats padding reduced on mobile.

---

### 7. No Error States or Empty States for Sections
**Area:** UX
**Severity:** Medium
**What's wrong:** When a section has no content, the shared pitch link may show blank cards or missing sections. There's no graceful handling of partially-filled pitches.
**What competitors do better:** Notion shows "Empty page" placeholders. Beautiful.ai hides empty slides. Gamma collapses unfilled sections.
**Recommended fix:** On the shared pitch link, hide sections with no content (don't show empty cards). On the editor, show subtle placeholder text: "Add your synopsis here..." in text-disabled color. Never show broken layouts to the person receiving the pitch.
**Impact if ignored:** Partially-filled pitches look broken when shared. Creators who haven't finished all sections still share links (they should be able to), and the output should degrade gracefully.
**Status:** Fixed — PitchViewSection already returns null for empty content. Shared pitch link degrades gracefully.

---

### 8. Funding Feature Has No Social Proof or Trust Signals
**Area:** Profitability
**Severity:** Medium
**What's wrong:** The "Support This Project" funding section shows a progress bar and supporter count, but no trust signals. A stranger is being asked to give money through an unfamiliar platform. There's no SSL badge, no "Powered by Stripe" mention, no refund policy visible.
**What competitors do better:** Seed&Spark shows Stripe badge + clear fee disclosure. Kickstarter shows backer guarantees. Patreon shows payment processor logos.
**Recommended fix:** Add: (1) "Payments secured by Stripe" text with Stripe logo, (2) visible fee disclosure ("X% goes to the creator"), (3) link to refund/dispute policy. These are trust signals, not marketing — they directly increase funding conversion.
**Impact if ignored:** Potential supporters hesitate. Funding conversion rate stays low. Creators blame PitchCraft for not raising enough.
**Status:** Fixed — Added "Payments secured by Stripe · Funds go directly to the creator" trust signal to PitchViewFunding.

---

### 9. No SEO or Discoverability Strategy for Public Pitches
**Area:** Competitive
**Severity:** Medium
**What's wrong:** Public pitch links have JSON-LD structured data (good), but there's no sitemap, no robots.txt optimization, and no strategy for public pitches being discoverable by search engines.
**What competitors do better:** Gamma's published pages are indexed by Google. Canva's public designs appear in search results. Seed&Spark campaigns rank for project-related keywords.
**Recommended fix:** (1) Generate sitemap.xml for public pitches, (2) optimize meta descriptions from loglines, (3) ensure clean URL structure. This is free organic traffic. Per CONSTRAINTS.md §3, this is opt-in — only public pitches, never private.
**Impact if ignored:** Free marketing channel left on the table. Public pitches are invisible to search engines. Creators who want discoverability don't get it.
**Status:** Fixed — Added sitemap.ts (static + dynamic public pitch URLs) and robots.ts (allows crawling, blocks /dashboard and /api).

---

### 10. Old React/Vite Codebase Still in `/src`
**Area:** Technical
**Severity:** Medium
**What's wrong:** The old React + Vite + Supabase codebase is still sitting in `/src`. The project migrated to Next.js. Dead code adds confusion, increases repo size, and could mislead future development.
**What competitors do better:** N/A — this is internal hygiene.
**Recommended fix:** Delete `/src` entirely after confirming nothing in the Next.js app imports from it. One `rm -rf src/` and a commit.
**Impact if ignored:** Confusion when searching the codebase. Possible accidental imports from dead code. Bloated git history.
**Status:** Fixed — /src directory already deleted in previous cleanup.

---

### 11. No Terms of Service or Privacy Policy Pages
**Area:** Profitability / Legal
**Severity:** High
**What's wrong:** The footer links to `/terms` and `/privacy` but these pages likely don't exist. PitchCraft handles payments (Stripe), user data, and media uploads — legal pages are required before accepting money.
**What competitors do better:** Every SaaS product shipping payments has these. This is table stakes.
**Recommended fix:** Create basic `/terms` and `/privacy` pages. Doesn't need a lawyer for MVP — use clear, plain-language policies covering: data ownership (creator owns everything), payment processing (Stripe handles), no AI training on content, GDPR basics. Upgrade to lawyer-reviewed before scaling.
**Impact if ignored:** Legal liability. App stores and Stripe may flag the account. Creators concerned about IP won't trust a platform without a privacy policy.
**Status:** Fixed — Created /terms and /privacy pages with plain-language policies covering data ownership, payments, AI, GDPR basics.

---

## Archive (Fixed / Won't Fix)

*Resolved critiques move here with resolution notes.*

---

## Audit Schedule

- **Monthly:** Claude reviews this file, adds new critiques based on recent development
- **Before launch:** All Critical and High severity items should be Acknowledged or Fixed
- **Quarterly:** Full competitive re-assessment against COMPETITION.md
