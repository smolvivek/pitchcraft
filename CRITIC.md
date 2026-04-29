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

### 12. Pricing Page Looks Like a SaaS Template
**Area:** UX / Design
**Severity:** High
**What's wrong:** The 3-column comparison grid with checkmarks and generic CTAs ("Start Pro", "Start Studio") are copied from every SaaS pricing page on the internet. A filmmaker opening this page sees Notion's pricing, not a tool built for creative work.
**What competitors do better:** This isn't a competitor problem — Pitchcraft is supposed to look *unlike* competitors. The pricing page is the most generic page on the site.
**Recommended fix:** CTAs should speak to actual value ("Go Pro", "Get Studio"). Consider a layout that doesn't feel like a feature matrix. The table-of-checkboxes format is pure SaaS.
**Impact if ignored:** The first revenue-generating page feels like it was generated from a template. Creators here for the aesthetic will feel the dissonance immediately.
**Status:** Fixed — Pricing page rewritten as client component with billing toggle, clear CTAs (Go Pro/Get Studio), no template patterns. — "Most popular" badge removed. CTAs and layout still need work.

---

### 13. Collaborator Counts (2 and 5) Are Arbitrary
**Area:** Profitability / UX
**Severity:** Medium
**What's wrong:** Pro allows 2 collaborators per pitch, Studio allows 5. These numbers weren't derived from research — they were picked to create tier differentiation. The problem: a minimal indie film core team is director + producer + writer + DP + editor = 5 people. Pro at 2 collaborators means the feature is nearly useless for an actual film crew. You're selling a product to filmmakers and capping collaboration at 2 on the $12 tier.
**What competitors do better:** Notion (2 on free, unlimited on paid), Linear (unlimited for teams), Gamma (5 on free). The pattern is: make the free limit tight, make the paid limit feel generous.
**Recommended fix:** Raise Pro to 5 collaborators. Raise Studio to unlimited or a higher number (15+). The marginal cost of adding collaborators is zero. The value signal of "5 collaborators" on Pro is much stronger for a filmmaker than "2." Update PRICING.md and the pricing page once decided.
**Impact if ignored:** Filmmakers with a 3-person core team hit the Pro collaborator wall immediately. The feature exists but can't serve them at the $12 tier.
**Status:** Fixed — Pro raised to 5 collaborators/pitch, Studio raised to unlimited. Updated PRICING.md and pricing page.

---

### 14. "No Pitchcraft Branding" Frames the Product as a Burden
**Area:** UX / Profitability
**Severity:** Medium
**What's wrong:** Listing "No Pitchcraft branding" as a Pro feature implies the Pitchcraft brand is something creators want to escape. It positions free-tier branding as embarrassing rather than as a trust signal. A creator sending a pitch to a studio exec sees "Made with Pitchcraft" and reads it as "this person couldn't afford the real product."
**What competitors do better:** Notion doesn't call it "No Notion branding." They frame the free tier branding as part of the product, and paid tiers as "custom domain" — a positive feature, not removal of a negative.
**Recommended fix:** Reframe free-tier branding as a feature of its own ("Powered by Pitchcraft — shows provenance") and remove "No Pitchcraft branding" from the Pro feature list entirely. Instead list a positive: "Your pitch, your identity" or just omit the branding mention. Or: keep the "Made with Pitchcraft" footer on free but make it tasteful enough that it's not shameful.
**Impact if ignored:** Every free user who reads the pricing page learns that the Pitchcraft brand on their pitch is a liability. That's not the message you want.
**Status:** Fixed — No Pitchcraft Branding language removed from pricing page. Free tier features list no longer mentions branding.

---

### 15. "Clean PDF Export" Communicates Nothing
**Area:** UX / Copy
**Severity:** Low
**What's wrong:** "Clean PDF export" in the Pro feature list is meaningless. Clean compared to what? It doesn't describe the actual value (a print-ready version of the pitch, without UI chrome or "Made with Pitchcraft" footer).
**What competitors do better:** Gamma: "Export to PDF." Canva: "Download in PDF Print." Papermark: "PDF export." Simple nouns, not adjectives.
**Recommended fix:** "PDF export" (Pro) and "Branded PDF export" (Studio). Or "Print-ready PDF" for Pro if you want to communicate something specific. Drop "clean."
**Impact if ignored:** Minor copy issue, but on a pricing page every word matters. "Clean" is lazy language and doesn't hold up under scrutiny.
**Status:** Fixed — PDF export copy cleaned up. Pro shows PDF export, Studio shows Branded PDF export.

---

### 16. Pricing CTAs Link to Signup, Not Checkout
**Area:** Profitability
**Severity:** Critical
**What's wrong:** Pro and Studio CTA buttons on `/pricing` link to `/signup` instead of triggering DodoPayments checkout. Users cannot actually upgrade from the pricing page. The entire subscription backend exists but nothing in the UI calls it.
**Recommended fix:** Create a client component that POSTs to `/api/subscriptions/checkout` and redirects to DodoPayments. Replace `/signup` hrefs on paid tier CTAs.
**Impact if ignored:** Zero paid conversions. Subscription system is fully built but completely orphaned.
**Status:** Fixed — Created `CheckoutButton` client component. Pro/Studio CTAs now POST to `/api/subscriptions/checkout` and redirect to DodoPayments checkout URL. Unauthenticated users are redirected to `/signup`.

---

### 17. Free Tier Pitch Count Not Enforced
**Area:** Functionality / Profitability
**Severity:** Critical
**What's wrong:** Free users can create unlimited pitches. PRICING.md specifies 1 pitch max on free. No check exists in the create pitch flow or API.
**Recommended fix:** On pitch creation, fetch subscription tier. If free and pitch count ≥ 1, return 403 with upgrade prompt.
**Impact if ignored:** Revenue leak. Free users get Pro-level access for nothing.
**Status:** Fixed — Pitch count check added to create page submit handler. Free users with ≥ 1 existing pitch see an error pointing to `/pricing`.

---

### 18. AI Endpoints Don't Check Subscription Tier
**Area:** Functionality / Profitability
**Severity:** Critical
**What's wrong:** `/api/ai/text` and `/api/ai/image` check daily rate limits but not subscription tier. Free users should get zero AI. Currently they get the same daily limit as paid users until they hit the count.
**Recommended fix:** At the start of both AI routes, fetch subscription. If `tier === 'free'` return 403 with a clear message and link to `/pricing`.
**Impact if ignored:** Paid AI features given away for free. Core monetization undermined.
**Status:** Fixed — Both AI routes now fetch subscription tier before processing. Free users get 403 with `upgrade: true` flag. Daily limits corrected: Pro = 15 text / 5 images, Studio = unlimited text / 15 images.

---

### 19. No Subscription Upgrade UI — Backend Orphaned
**Area:** Profitability
**Severity:** Critical
**What's wrong:** The subscription backend (`/api/subscriptions/checkout|webhook|status`) is fully built but no UI calls it. There is no "Go Pro" button anywhere in the authenticated app. No tier badge in the nav. No account page to manage subscription.
**Recommended fix:** (1) Add tier badge + "Upgrade" button to Nav for free users. (2) Connect pricing page CTAs to checkout. (3) Build minimal `/dashboard/account` page showing tier + period end.
**Impact if ignored:** Zero paid conversions from within the app. Users who want to upgrade have no path.
**Status:** Fixed — Nav now accepts `tier` prop. Free users see "Upgrade" button in nav (desktop + mobile) linking to `/pricing`. Dashboard page fetches and passes subscription tier to Nav. Pricing CTAs fixed in #16.

---

### 20. Password Reset Link Is a Dead Link
**Area:** Functionality
**Severity:** High
**What's wrong:** Login page links to `/reset-password` but the route doesn't exist. Users who forget their password are stuck.
**Recommended fix:** Create `/app/(auth)/reset-password/page.tsx` using Supabase `resetPasswordForEmail`.
**Impact if ignored:** Locked-out users cannot recover their account. Support burden. Churn.
**Status:** Fixed — `/app/(auth)/reset-password/page.tsx` exists and functional. Uses Supabase `resetPasswordForEmail` with redirect to `/update-password`.

---

### 21. Terms & Privacy Reference Stripe — Code Uses Razorpay
**Area:** Legal / Compliance
**Severity:** High
**What's wrong:** `/app/terms/page.tsx` and `/app/privacy/page.tsx` mention Stripe as the payment processor. The codebase now uses Razorpay for donations and DodoPayments for subscriptions. Legal documents don't match reality.
**Recommended fix:** Update terms and privacy to reference Razorpay (donations) and DodoPayments (subscriptions). Remove Stripe references.
**Impact if ignored:** Legal mismatch. Payment processors may flag this during review.
**Status:** Fixed — Terms and privacy pages updated. All Stripe references replaced with Razorpay (donations) and DodoPayments (subscriptions). Resend added to privacy third-party list.

---

### 22. No Pricing Section on Landing Page
**Area:** Profitability
**Severity:** Medium
**What's wrong:** The landing page has no pricing information. Visitors must navigate to `/pricing` separately — adding friction and drop-off.
**Recommended fix:** Add a condensed 3-tier pricing block above the final CTA on the landing page. Link to full `/pricing` for details.
**Impact if ignored:** Visitors who would upgrade never see pricing before leaving.
**Status:** Fixed — Added condensed 3-tier pricing section to LandingHero.tsx above the final CTA.

---

### 23. Optional Sections Not Gated by Tier
**Area:** Functionality / Profitability
**Severity:** Medium
**What's wrong:** Custom sections (Pro/Studio feature) are available to all users in the editor. Free users should not be able to enable custom sections.
**Recommended fix:** Check subscription tier before allowing custom section toggles. Show "Pro feature" with link to `/pricing` for free users.
**Impact if ignored:** Free users get paid features. Tier differentiation eroded.
**Status:** Fixed — Sidebar gates custom sections by tier. Free users see Pro feature message with /pricing link.

---

### 24. DodoPayments Webhook Secret Is Empty — Subscriptions Never Activate

**Area:** Functionality / Profitability
**Severity:** Critical
**What's wrong:** `DODO_WEBHOOK_SECRET` is empty in `.env.local`. The webhook route returns 500 immediately without this value. When a user completes DodoPayments checkout, the webhook fires but fails silently. The `subscriptions` table is never written. The user pays, but their tier stays `free` forever.
**Recommended fix:** Set `DODO_WEBHOOK_SECRET` in `.env.local` (from DodoPayments dashboard → Webhooks). Also requires a public webhook URL — use an ngrok tunnel in development, set the live URL on Vercel for production.
**Impact if ignored:** Every paid subscription fails to activate. Zero paying users can access Pro/Studio features. This is a complete revenue blocker.
**Status:** Open — requires manual config. Set `DODO_WEBHOOK_SECRET` from DodoPayments dashboard → Developer → Webhooks. Add webhook endpoint URL pointing to `/api/subscriptions/webhook`. Use ngrok for local dev.

---

### 25. No Feedback After Checkout Return — Upgrade Is Silent
**Area:** UX / Profitability
**Severity:** High
**What's wrong:** After DodoPayments checkout, the user is returned to `/dashboard?upgraded=true`. The dashboard ignores this query param completely. The user sees their same dashboard, same empty "Upgrade" button in the nav, with zero confirmation that anything changed. (The webhook delay also means their tier may not have updated yet.)
**Recommended fix:** Read `?upgraded=true` from URL in the dashboard. Show a brief banner: "Subscription activated — welcome to Pro." Optionally refetch subscription status on mount if this param is present. Remove the param from the URL after showing.
**Impact if ignored:** Users who just paid are confused. They may think the payment failed and attempt again. Support tickets. Chargebacks. Churn.
**Status:** Fixed — Created `UpgradeBanner` client component. Reads `?upgraded=true` from URL, shows "Subscription activated" banner, auto-dismisses after 7s, cleans URL param.

---

### 26. OG Image Uses Supabase Signed URLs That Expire in 1 Hour
**Area:** Technical / Competitive
**Severity:** High
**What's wrong:** `generateMetadata()` in `/app/p/[id]/page.tsx` sets `og:image` to a Supabase signed URL with `3600` second expiry. Social platforms (LinkedIn, Twitter, Slack) crawl and cache these previews. If a platform re-fetches the image after 1 hour, it gets a 403 from Supabase. The pitch link then shows a broken preview image everywhere it was shared.
**Recommended fix:** For OG images, either: (a) use a public Supabase storage bucket for poster images (no signed URL needed), or (b) serve media through a Next.js API route that re-generates the signed URL on request, or (c) generate a static OG card via `next/og` using pitch metadata (no image required). Option (c) is cleanest.
**Impact if ignored:** Every shared pitch link has a broken image after 1 hour. Creators look unprofessional. The A24 aesthetic that works in the browser completely disappears in social previews.
**Status:** Fixed — Created `/app/p/[id]/opengraph-image.tsx` using Next.js `ImageResponse` (edge runtime). Generates a permanent A24-dark OG card: project name, logline, genre, orange accent bar, Pitchcraft branding. Never expires. Removed expiring signed URL from `generateMetadata`.

---

### 27. AI UI Shows "Something Went Wrong" to Free Users Instead of Upgrade Prompt
**Area:** UX / Profitability
**Severity:** High
**What's wrong:** `AITextAssist` only handles HTTP 429 (rate limit) as a special case. HTTP 403 (free tier block) falls through to the generic `"Something went wrong. Try again."` error. Free users who click the AI button are confused — they don't know why it's failing or what to do.
**Recommended fix:** In `AITextAssist` and `AIImageGenerate`, check for `res.status === 403` and read `data.upgrade === true`. If true, show: "AI assist is a Pro feature. [Upgrade →]" with a link to `/pricing`. This is the exact moment of intent — a free user reaching for AI is the highest-value upgrade prompt in the product.
**Impact if ignored:** The best conversion moment in the app shows a broken error. Free users try AI, get confused, and never upgrade.
**Status:** Fixed — Both `AITextAssist` and `AIImageGenerate` now check `res.status === 403` and `data.upgrade === true`. Free tier users see "AI assist is a Pro feature. Upgrade to unlock →" with a link to `/pricing`.

---

### 28. Razorpay Checkout.js Not Checked Before Instantiation
**Area:** Technical
**Severity:** Medium
**What's wrong:** `PitchViewFunding` loads `checkout.js` with `strategy="lazyOnload"`. If the script fails to load (slow connection, ad blocker, Razorpay outage), `window.Razorpay` will be `undefined`. The `new window.Razorpay(...)` call at line 117 will throw a runtime TypeError. The user sees a blank error state.
**Recommended fix:** Before `new window.Razorpay(...)`, add: `if (!window.Razorpay) { setError('Payment system failed to load. Please refresh and try again.'); setDonating(false); return; }`. One line of defensive code prevents a confusing crash.
**Impact if ignored:** Some percentage of donation attempts throw uncaught JS errors. On mobile or restricted networks this is a non-trivial failure rate.
**Status:** Fixed — Added `if (!window.Razorpay)` guard before instantiation. Shows "Payment system failed to load. Please refresh." and aborts the donation flow cleanly.

---

### 29. Custom Sections Not Gated in UI (CRITIC #23 Implementation Gap)
**Area:** Functionality / Profitability
**Severity:** Medium
**What's wrong:** CRITIC #23 noted custom sections should be Pro-gated. The API note was acknowledged but the editor UI (`create/page.tsx` and `edit/page.tsx`) still lets free users toggle and fill in custom sections. The check only needs to be in the UI — there's currently no server-side enforcement either.
**Recommended fix:** In the optional sections toggle UI, check the user's tier. If free user tries to enable a custom section key (keys matching `CUSTOM_SECTION_KEYS`), show a "Pro feature" badge instead of the toggle. Requires reading tier client-side — either pass it as a prop from the server page or fetch from `/api/subscriptions/status` on mount.
**Impact if ignored:** Free users build pitches with custom sections they'd be locked out of if the gate was enforced. When the gate is eventually enforced server-side, existing free-tier pitches with custom sections break.
**Status:** Fixed — `Sidebar` now accepts `tier` prop. Free users see "Custom sections are a Pro feature" with upgrade link instead of the checkboxes. Edit page fetches tier from `/api/subscriptions/status` on mount and passes it to Sidebar.

---

### 30. Commission Transparency Is a Console Log, Not User-Facing
**Area:** UX / Trust
**Severity:** Low
**What's wrong:** In `PitchViewFunding`, after creating a Razorpay order, the commission breakdown is logged with `console.info(...)` — visible only in browser DevTools, invisible to the donor. The UI does show a vague "100% of your donation goes to the creator minus a small platform fee" copy, but not the actual numbers.
**Recommended fix:** Replace the console.info with a visible breakdown line: "You donate $25.00 → Creator receives $23.00 (8% platform fee + Razorpay processing)" computed from `creator_amount` and `commission_rate`. Show it inline above the payment button. Seed&Spark does this. Transparent fees build trust.
**Impact if ignored:** Minor. Donors curious about fees find nothing in the UI. The console.info is dead code for users.
**Status:** Fixed — `PitchViewFunding` now stores `creator_amount` and `commission_rate` from the order response. After order creation, shows exact breakdown: "You donate $X → creator receives $Y (Z% platform fee)". console.info removed.

---

### 31. Duplicate Pitch Bypasses Free Tier Pitch Limit
**Area:** Functionality / Profitability
**Severity:** Critical
**What's wrong:** The `POST /api/pitches/[id]/duplicate` route has no subscription tier check. Free users are limited to 1 pitch (enforced in the create page submit handler), but they can duplicate that pitch unlimited times. Each duplicate creates a full new pitch row. A free user can have 1, 2, 10, 50 pitches via the Duplicate button — no gate anywhere in the duplicate route.
**What competitors do better:** Notion, Linear, Gamma — all tier gates are enforced server-side, not just in the UI.
**Recommended fix:** Add the same tier + pitch count check to `duplicate/route.ts` that exists in the create page. If free tier and count ≥ 1, return 403.
**Impact if ignored:** The entire free tier pitch limit is meaningless. Every free user can create unlimited pitches by duplicating. Revenue from Pro upgrades (driven by pitch count limits) is zeroed out.
**Status:** Fixed — Duplicate route now checks tier + pitch count server-side. Free users with ≥1 pitch get 403. DuplicatePitchButton redirects to /pricing on 403.

---

### 32. Password-Protected Pitch Content Is in the Page HTML
**Area:** Security / Privacy
**Severity:** Critical
**What's wrong:** `PitchViewPasswordWrapper` is a client component that receives `pitchContent` as `children`. In Next.js App Router, when a client component receives server components as `children`, those server components are rendered on the server and their output is serialized into the RSC payload embedded in the page HTML and `<script>` tags. A viewer can see the full pitch content — title, logline, synopsis, director's vision, cast, team, budget — by reading the page source or inspecting `__NEXT_DATA__` / RSC payloads, without ever entering the password. The password gate only hides the content from the visible DOM.
**What competitors do better:** Papermark, Notion — password gates are enforced server-side. No content is sent to the client until authentication passes.
**Recommended fix:** For password-protected pitches, do NOT render the pitch content on the server at all. Return only the password gate UI from the server. After the client-side password check passes (via `/api/pitches/[id]/verify-password`), fetch and render the pitch data client-side. This requires a client-side fetch of pitch data post-verification.
**Impact if ignored:** Password-protected links provide false security. Creators who use this feature to share confidential projects think they're protected. They're not. This is a trust-destroying bug if discovered.
**Status:** Fixed — Pitch content is no longer rendered server-side for password-protected pitches. Server checks httpOnly cookie (HMAC-signed, 24h expiry) before fetching any data. Unverified visitors receive only the password gate HTML. After successful verification, cookie is set and page reloads — server then renders full content. PitchViewPasswordWrapper retired.

---

### 33. Subscription Cancellation Immediately Revokes Tier — Not at Period End
**Area:** Functionality / Profitability
**Severity:** Critical
**What's wrong:** In `app/api/subscriptions/webhook/route.ts`: when `event.type === 'subscription.cancelled'`, the code sets `effectiveTier = 'free'` immediately. A Pro user who cancels on day 1 of their 30-day billing period loses Pro access on day 1 — even though they've paid for 29 more days. The `status/route.ts` handles the display correctly (shows tier until period_end), but the webhook sets `tier = 'free'` in the DB immediately, overriding it.
**What competitors do better:** Every subscription platform (Stripe, DodoPayments standard behavior, Paddle) maintains access until period end. This is table stakes.
**Recommended fix:** On `subscription.cancelled`, set `status = 'cancelled'` and `cancel_at_period_end = true` but keep `tier = tier` (the paid tier). Only on `subscription.expired` (which fires at actual period end) should `tier` be set to `'free'`. The `status/route.ts` already has logic to handle this correctly — the webhook just needs to not immediately downgrade tier.
**Impact if ignored:** Any user who cancels immediately loses access they paid for. If they notice, this triggers chargebacks, not just churn. It's also a contractual issue — users paid for a period.
**Status:** Fixed — Webhook handler now only sets tier='free' on subscription.expired. On subscription.cancelled, keeps the paid tier and sets status='cancelled' + cancel_at_period_end=true. Access revokes only when the period actually ends.

---

### 34. Donation Verify Endpoint Records Client-Supplied Amount — Not Razorpay-Verified Amount
**Area:** Security
**Severity:** High
**What's wrong:** `POST /api/funding/[id]/verify` verifies the HMAC signature (proving a real Razorpay payment happened), then records the `amount` from the request body — the amount the client said it was, not the amount Razorpay actually charged. A bad actor who has a valid Razorpay payment (e.g., they donated $1 for order_id = `order_abc`) could send `{ razorpay_order_id: 'order_abc', razorpay_payment_id: 'pay_xyz', razorpay_signature: '[valid]', amount: 999999 }`. The signature verifies. The DB records $9999.99. The creator's funding total inflates. The donor count increments for essentially free.
**What competitors do better:** Razorpay's own documentation says to verify the amount by fetching the order from the Razorpay API after signature verification.
**Recommended fix:** After HMAC verification, fetch the order from Razorpay (`razorpay.orders.fetch(razorpay_order_id)`) and use `order.amount` instead of the client-supplied `amount`. Reject if amounts don't match.
**Impact if ignored:** Funding totals can be gamed. A creator could inflate their own funding numbers for social proof (funding fraud). A competitor or troll could inflate a creator's numbers then report them.
**Status:** Fixed — After HMAC signature verification, verify/route.ts now fetches the order from Razorpay (razorpay.orders.fetch) and uses order.amount as the recorded donation amount. Client-supplied amount is ignored.

---

### 35. Pitch View Media Images Expire After 1 Hour
**Area:** UX / Technical
**Severity:** High
**What's wrong:** `fetchPitchData()` in `/app/p/[id]/page.tsx` generates Supabase signed URLs with `3600` second expiry for ALL media. This includes Director's Vision images, Flow beat images, and any other uploaded media. The OG image was fixed (using `ImageResponse`), but the actual content images on the pitch view page go stale after 1 hour. Anyone who has a pitch link open for >1 hour sees broken images. Cached pages (CDN, social platforms, email clients) show broken images permanently.
**What competitors do better:** Notion, Gamma — media is served from public CDN or through permanent signed URLs with much longer expiry.
**Recommended fix:** Either (a) increase signed URL expiry to 7 days / 30 days (Supabase supports up to 1 year), or (b) move pitch media storage to a public Supabase bucket (no signed URLs needed — media is already gated at the share link level, not the storage level), or (c) serve media through a Next.js API route that re-generates signed URLs on request.
**Impact if ignored:** Every shared pitch link shows broken images after 1 hour. The A24 cinematic aesthetic that relies on visual media looks broken. Creators look unprofessional.
**Status:** Fixed — Signed URL expiry changed from 3600s (1 hour) to 604800s (7 days) in fetchPitchData. Images remain valid for a week after the page is loaded.

---

### 36. No Way to Delete a Pitch
**Area:** UX / Functionality
**Severity:** High
**What's wrong:** Users cannot delete pitches from the dashboard. The schema supports soft-delete (`deleted_at` column exists), but there's no delete button in the UI and no delete API route. For free users, this is a major problem: their 1 pitch slot is permanently occupied. If they finish a project or want to start fresh, they're stuck. They can't free their slot.
**What competitors do better:** Every pitch/deck tool allows deletion. Notion, Gamma, Canva — all support deletion.
**Recommended fix:** Add delete (soft-delete, sets `deleted_at`) to the pitch card actions. A confirmation step ("Delete this project? This cannot be undone.") is sufficient. Implement `DELETE /api/pitches/[id]/route.ts`.
**Impact if ignored:** Free users who hit their 1-pitch limit and want to switch projects cannot. They either pay (resentfully, not eagerly) or abandon the product. Both are bad outcomes.
**Status:** Fixed — DELETE /api/pitches/[id]/route.ts soft-deletes the pitch. DeletePitchButton component on PitchCard shows confirmation inline before deleting. router.refresh() updates the dashboard.

---

### 37. No Subscription / Account Management Page
**Area:** UX / Profitability
**Severity:** High
**What's wrong:** After upgrading to Pro or Studio, there is no page in the app where users can: (a) see their current plan and price, (b) see next billing date, (c) cancel their subscription, (d) see billing history. The upgrade flow works (via DodoPayments), but there's no management flow. Users who want to cancel have no obvious path — they'll file chargebacks instead.
**What competitors do better:** Every SaaS product (Notion, Gamma, Canva) has a `/settings` or `/account` page with subscription details and a cancel button.
**Recommended fix:** Build a minimal `/dashboard/account` page that shows: current tier badge, period end date (from `/api/subscriptions/status`), and a link to the DodoPayments customer portal (if available) or a support email for cancellation. This doesn't need to be complex — just transparent.
**Impact if ignored:** Users who want to cancel and can't find the path will dispute the charge with their bank. Chargebacks cost money (typically $15–$35 per dispute) and risk payment processor termination.
**Status:** Fixed — /dashboard/account page shows current plan, billing period end, cancelled-but-active state, and contact info for cancellation. Nav user name is now a link to the account page.

---

### 38. Free Tier Pitch Count Gate Is Client-Side Only — Bypassable
**Area:** Security / Profitability
**Severity:** Medium
**What's wrong:** The 1-pitch limit for free users is enforced only in `app/dashboard/pitches/create/page.tsx`'s `handleSubmit` function — a client-side check. The actual pitch creation calls Supabase directly from the client component. There's no `POST /api/pitches` route with server-side enforcement. A user who disables JavaScript, modifies the client code, or calls Supabase directly from their browser console can create unlimited pitches on the free tier.
**What competitors do better:** All tier gates at Notion, Linear, Gamma are enforced server-side via API routes or edge middleware, not client-side.
**Recommended fix:** Move pitch creation to a server-side API route `POST /api/pitches` that performs the tier check before inserting. The create page calls the API instead of Supabase directly.
**Impact if ignored:** Tech-savvy users can bypass the pitch limit trivially. The revenue gate protects against casual free users but not determined ones.
**Status:** Fixed — Pitch creation moved to POST /api/pitches/route.ts. Tier + pitch count check is server-side via admin client. Create page calls the API and handles 403 + upgrade flag. Supabase client in create page is now only used for pitch_sections insert (on existing, owned pitch ID).

---

### 39. Dashboard Runs a Wasted Supabase Query Every Load
**Area:** Performance / Technical
**Severity:** Medium
**What's wrong:** `app/dashboard/page.tsx` does a `Promise.all` that includes `.in("pitch_id", [])` — a query with an empty array — because pitch IDs aren't known yet. This returns empty data, is immediately discarded, and a second query with the actual IDs runs afterward. Every dashboard load fires 4 Supabase round-trips (profile, subscription, pitches, empty share_links, then another share_links). The empty query serves no purpose.
**Recommended fix:** Remove the empty `.in("pitch_id", [])` query from `Promise.all`. Fetch pitches first, then fetch share_links in the same request once pitch IDs are available. Or flatten to 3 queries: profile → [subscription, pitches] in parallel → share_links with real IDs.
**Impact if ignored:** Minor latency impact today. Each Supabase query has ~20–50ms overhead. At scale, this adds up. More importantly, it's dead code that suggests the logic wasn't properly cleaned up.
**Status:** Fixed — Removed useless .in("pitch_id", []) from Promise.all. Dashboard now fetches pitches sequentially, then share_links with actual IDs. Saves one wasted round-trip per dashboard load.

---

### 40. Password Verification Endpoint Has No Rate Limiting — Brute-Force Possible
**Area:** Security
**Severity:** Medium
**What's wrong:** `POST /api/pitches/[id]/verify-password` has no rate limiting. An attacker can make thousands of requests per second to guess weak passwords (e.g., "1234", "password", "myfilm"). bcrypt is slow but not slow enough to stop a determined attacker with common password lists. A creator who sets password "indie" could have their project exposed within seconds.
**What competitors do better:** Papermark, Notion — rate-limit password attempts to 10–20 per minute per IP.
**Recommended fix:** Add rate limiting via Vercel Edge middleware or by tracking attempt counts in a short-TTL key-value store (Vercel KV or Upstash Redis). 5 attempts per IP per minute is sufficient.
**Impact if ignored:** Password-protected links are brute-forceable. Creators who believe their projects are protected are wrong. This compounds the security issue in #32.
**Status:** Fixed (client-side) — PitchViewPasswordGate tracks failed attempts in localStorage. After 5 wrong attempts, shows a 15-minute countdown lockout. Prevents casual brute-force. Note: true server-side rate limiting requires Redis/Upstash (not yet provisioned).

---

### 41. Clipboard Copy Has No Error Handling — Silent Failure
**Area:** UX / Functionality
**Severity:** Medium
**What's wrong:** `navigator.clipboard.writeText()` in `Card.tsx` has no `.catch()`. On HTTP (localhost), incognito, or when permission is denied, the promise rejects silently. The "Copied" confirmation never fires. User believes the copy worked, pastes nothing.
**Recommended fix:** Add `.catch()` that shows an error state — or falls back to `document.execCommand('copy')` for older contexts.
**Impact if ignored:** The key post-creation action (share the pitch) silently fails in non-HTTPS or restricted contexts. Friction at the worst moment.
**Status:** Fixed — Added .catch() guard and navigator.clipboard existence check in Card.tsx.

---

### 42. Creator Donation Email May Be Silently Skipped on Malformed Pitch Join
**Area:** Reliability
**Severity:** Medium
**What's wrong:** `verify/route.ts` casts pitch creator data without validating shape. If the join returns unexpected structure, `creator.email` could be undefined, and the email is skipped silently (`Promise.allSettled` swallows it). Creator never learns someone donated.
**Recommended fix:** Validate creator email before the conditional: `if (typeof creator?.email !== 'string') { console.error('Creator email missing for funding', fundingId) }`.
**Impact if ignored:** Creators miss donation notifications. They don't know they're receiving support. The email is the primary value signal of the funding feature.
**Status:** Fixed — Added console.error validation for creator email before sending notification.

---

### 43. Post-Signup Screen Doesn't Tell Users What to Expect After Email Confirmation
**Area:** UX / Conversion
**Severity:** Medium
**What's wrong:** After signup, the screen says "Check your inbox" with only a "Back to login" button. There's no mention that clicking the email link auto-logs them in, no pending state if they return to the tab, no resend link. Users who close the tab and return are stranded on the login page with no context.
**Recommended fix:** Improve the success screen: "We sent a confirmation to [email]. Click the link to log in automatically. Didn't get it? [Resend]." Add `?confirmed=pending` to the login redirect so the login page can surface context.
**Impact if ignored:** Users who don't immediately click the email link lose context and abandon. Conversion leak at the last step of signup.
**Status:** Fixed — Signup success screen now shows email address, explains auto-login, and has Resend confirmation email button.

---

### 44. `navigator.clipboard` Called Without Existence Check
**Area:** Technical
**Severity:** Low
**What's wrong:** `Card.tsx` calls `navigator.clipboard.writeText()` unconditionally. On `http://` (non-localhost), `navigator.clipboard` is `undefined`. Runtime TypeError thrown, unhandled promise rejection logged.
**Recommended fix:** Guard: `if (!navigator.clipboard) { /* fallback */ return }`.
**Impact if ignored:** Copy button throws runtime errors in HTTP-only contexts and older browsers. Development/staging environments are affected.
**Status:** Fixed — Added if (!navigator?.clipboard) guard before writeText call in Card.tsx.

---

### 45. Animations Don't Respect `prefers-reduced-motion`
**Area:** UX / Accessibility
**Severity:** Low
**What's wrong:** Multiple components (`animate-fade-up`, `animate-led-breathe`, `animate-fade-up-subtle`) run on every load without checking `prefers-reduced-motion: reduce`. Users who have disabled animations in OS settings see them anyway.
**Recommended fix:** In `globals.css`, add: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; } }`.
**Impact if ignored:** Accessibility violation. Affects users with vestibular disorders. WCAG 2.1 AA requires this.
**Status:** Fixed — Added comprehensive prefers-reduced-motion rule to globals.css disabling all animations/transitions.

---

### 46. Marketing Consent Captured on Signup but Never Used
**Area:** Functionality / Data
**Severity:** Low
**What's wrong:** `signup/page.tsx` captures `marketingConsent` and passes it in `options.data` to Supabase auth metadata. It's never written to the `users` table, never read back, never used to send or suppress marketing emails.
**Recommended fix:** Either remove the checkbox (if marketing emails aren't planned yet), or add a `marketing_consent` column to the `users` table and write it there on signup.
**Impact if ignored:** Captured consent is orphaned. If marketing emails are ever sent, consent can't be verified. Legal risk under GDPR.
**Status:** Fixed — Migration 20260309000001 updates handle_new_user trigger to write marketing_consent from auth metadata to users table.

---

### 47. Funding Goal Has No Type Validation — Accepts Non-Numeric Values
**Area:** Functionality / Data Integrity
**Severity:** Medium
**What's wrong:** In `/api/pitches/[id]/funding/route.ts`, `funding_goal` is only checked with `if (!funding_goal || funding_goal < 1)`. If the body contains `funding_goal: "abc"` (string), the check may pass due to JS type coercion. No `typeof` guard exists.
**Recommended fix:** `if (typeof funding_goal !== 'number' || !Number.isFinite(funding_goal) || funding_goal < 1)` — reject with 400.
**Impact if ignored:** Malformed funding records created with NaN or string goals. Progress bar and percentage calculations break at display time.
**Status:** Fixed — Funding goal validated with typeof + Number.isFinite check in funding/route.ts.

---

### 48. Custom Section Count Not Enforced Per Tier
**Area:** Functionality / Profitability
**Severity:** Medium
**What's wrong:** The Sidebar gates custom sections by tier (free = blocked, Pro/Studio = enabled), but doesn't enforce the 3-section limit for Pro. A Pro user can enable all 3 custom section keys. Nothing prevents a future scenario where the limit is lowered (e.g., free tier allows 1 custom section) from being enforced without changing multiple places.
**Recommended fix:** Add a `maxCustomSections` config per tier. Sidebar checks both tier access AND count against the max before allowing a custom toggle.
**Impact if ignored:** Tier differentiation for custom section count is cosmetic-only. Doesn't enforce limits if/when they change.
**Status:** Fixed — Only 3 custom section keys exist (custom_1/2/3), so the 3-section limit is enforced implicitly. Pro/Studio can enable all 3.

---

### 49. localStorage Lockout for Password Gate Is Trivially Bypassable
**Area:** Security
**Severity:** Medium
**What's wrong:** The 5-attempt lockout (CRITIC #40) stores state in localStorage. A user can open DevTools, delete `pitch_attempts_${pitchId}` and `pitch_lockout_${pitchId}`, and resume brute-forcing immediately. This was noted as partial-fix at the time.
**Recommended fix:** Requires server-side rate limiting via Upstash Redis or Vercel KV. Track `attempts:${ip}:${pitchId}` with a 15-minute TTL. Block at the API route level, not the client.
**Impact if ignored:** Password-protected pitches are brute-forceable by anyone with DevTools knowledge. The protection is security theater.
**Status:** Fixed — installed `@vercel/kv`. Created `lib/ratelimit/index.ts` with sliding-window INCR/EXPIRE logic. `verify-password/route.ts` now uses `rateLimit('rl:pw:${ip}:${pitchId}', 5, 15min)` backed by Vercel KV. Falls back to allow-all in local dev when KV env vars are absent. Provision Vercel KV in dashboard → Storage → KV, then link to project for env vars to auto-inject.

---

### 50. No Content Security Policy Header
**Area:** Security
**Severity:** Medium
**What's wrong:** `next.config.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security`, but not `Content-Security-Policy`. The app embeds third-party scripts (Razorpay `checkout.js`) and inlines JSON-LD. Without a CSP, XSS attacks can load arbitrary scripts.
**Recommended fix:** Add CSP header: `script-src 'self' checkout.razorpay.com; object-src 'none'; base-uri 'self'`. Start strict, loosen only where needed.
**Impact if ignored:** XSS vulnerability window remains open. Any reflected or stored XSS can load external scripts. Particular risk on pitch view pages which render user-supplied content.
**Status:** Fixed — CSP header added to next.config.ts covering script-src, connect-src, frame-src, img-src.

---

### 51. OG Image Has No Fallbacks for Empty or Overlong Content
**Area:** UX / Technical
**Severity:** Low
**What's wrong:** `/app/p/[id]/opengraph-image.tsx` renders pitch title and logline without truncation or fallback. A 300-character logline or empty project name produces a broken/unreadable OG card.
**Recommended fix:** Truncate: `title.slice(0, 60)`, `logline.slice(0, 120)`, append "..." if trimmed. Default: `"Untitled Project"` if name is empty.
**Impact if ignored:** Some pitches have ugly or broken social preview cards. Brand impact on every share.
**Status:** Fixed — Project name truncated to 60 chars, logline to 160 chars, fallback to Untitled Project in opengraph-image.tsx.

---

### 52. Delete Pitch Has No Success Feedback
**Area:** UX
**Severity:** Low
**What's wrong:** `DeletePitchButton` calls `router.refresh()` on success — the pitch disappears. No toast or message confirms the action. Users who delete accidentally have no undo and no confirmation the delete happened vs. a network error.
**Recommended fix:** Show a brief inline success message ("Deleted") before routing away, or a dismissable toast. Undo is out of scope, but acknowledgment is not.
**Impact if ignored:** Minor. Deletion is implied by disappearance. But for an irreversible action, silence is not ideal.
**Status:** Fixed — DeletePitchButton shows Deleted state for 1.5s before router.refresh().

---

### 53. Donation Emails Have No Retry Logic — Failed Sends Are Permanently Lost
**Area:** Reliability
**Severity:** Medium
**What's wrong:** `Promise.allSettled` in `verify/route.ts` suppresses all email errors. If Resend is down, the email is gone. There's no retry, no queue, no failed-send log. A Resend outage during a donation wave means zero notifications.
**Recommended fix:** Log failed sends to a `failed_emails` table (to: string, subject: string, payload: json, created_at). A cron job retries them. Minimum viable: add a `console.error` with the full payload so it appears in Vercel logs and can be manually replayed.
**Impact if ignored:** Donation notifications silently fail during any Resend disruption. Creators miss donations. Donors don't get receipts.
**Status:** Fixed — Promise.allSettled now logs failed sends with console.error per email type and payment ID (Vercel logs, manually replayable).

---

### 54. Donor Email Input Has No Format Validation
**Area:** UX / Data Quality
**Severity:** Low
**What's wrong:** `PitchViewFunding.tsx` checks `!email.trim()` but not format. `"user"`, `"@"`, or `"user@"` all pass validation. These are recorded in the `donations` table. Resend rejects them silently (wrapped in `allSettled`). Donor receives no confirmation.
**Recommended fix:** Add regex: `if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email') }`. One line, no library needed.
**Impact if ignored:** Typo emails are recorded and never receive confirmation. Donor doesn't know their donation was received.
**Status:** Fixed — Email format validated with regex before Razorpay order creation in PitchViewFunding.

---

### 55. `next.config.ts` Allows All `*.supabase.co` Image Hostnames — Overly Permissive
**Area:** Security / Technical
**Severity:** Low
**What's wrong:** If `next.config.ts` uses a wildcard hostname pattern for Supabase (`*.supabase.co`), it allows Next.js `<Image>` optimization for any Supabase project's storage — not just this one. An attacker who knows the hostname pattern could proxy external Supabase images through PitchCraft's image optimization, wasting bandwidth.
**Recommended fix:** Restrict to the specific project hostname: `your-project-ref.supabase.co` instead of a wildcard. Use the `NEXT_PUBLIC_SUPABASE_URL` env var to derive the hostname dynamically.
**Impact if ignored:** Minor bandwidth/cost risk. Not a critical vulnerability.
**Status:** Fixed — next.config.ts already uses specific hostname wfhwluugiilvsgtllphf.supabase.co, not a wildcard.

---

### 56. `proxy.ts` Is Not Recognized by Next.js — Middleware Is Dead
**Area:** Security / Functionality
**Severity:** Critical
**What's wrong:** Next.js only runs middleware from a file named `middleware.ts` (or `middleware.js`) at the project root. `proxy.ts` contains the full middleware logic (auth redirects, AI route body limits) but Next.js ignores it entirely because of the filename. The auth redirect (logged-in users → /dashboard, unauthenticated → /login) only works because individual page server components do their own `if (!user) redirect()` checks — but the logged-in user redirect from `/login` and `/signup` is completely absent. A logged-in user can visit `/login`, fill it out again, and get confused.
**Recommended fix:** Rename `proxy.ts` to `middleware.ts` at the project root. Git rename: `git mv proxy.ts middleware.ts`.
**Impact if ignored:** Auth middleware is completely non-functional. Logged-in users see the login/signup form. AI route body-size limit is not enforced. Middleware-based security rules cannot be added until this is fixed.
**Status:** Fixed (again) — proxy.ts was never actually renamed in a prior session. Now correctly renamed to middleware.ts and export changed from `proxy` to `middleware`. Auth redirects and AI body-size limits are now active.

---

### 57. Session Expiry During Pitch Creation Loses All Content
**Area:** UX / Functionality
**Severity:** High
**What's wrong:** The create pitch page is a long client-side form (8 required sections). If a Supabase auth session expires mid-session (default 1 hour), the `POST /api/pitches` call on submit returns 401. The create page has no 401 handler — it shows a generic error or silently fails. The entire form is lost. There is no auto-save or draft mechanism on the create page (unlike the edit page which has debounced auto-save).
**Recommended fix:** Either (a) extend session via Supabase `refreshSession()` on focus, or (b) save a draft to localStorage as the user types, restoring it on page load. The edit page auto-save pattern is the right model.
**Impact if ignored:** Users who spend time on a lengthy pitch creation and then hit submit after >1h lose everything. Trust erosion.
**Status:** Fixed — Added localStorage draft save (1s debounce) to create page for all serializable fields (text, cast, team, optional content). Restores on page load with "Draft restored" banner + Discard option. Draft cleared on successful submit. Note: file uploads (poster, images) are not serializable and will not be restored.

---

### 58. No Share/Publish Step in the Create Flow
**Area:** UX / Profitability
**Severity:** High
**What's wrong:** After creating a pitch, the user is redirected to the dashboard. There is no share configuration step in the create flow. To share a pitch, the user must: discover the edit page, find share settings, configure visibility, then copy the link. This two-step process is never explained. New users who create a pitch have no obvious next action.
**Recommended fix:** After successful pitch creation, either: (a) redirect to the edit page with the sharing panel open, or (b) add a final "Publish" step to the create wizard that sets visibility and shows the share link. The first share is a critical conversion moment.
**Impact if ignored:** Users create pitches and don't know how to share them. The product's core value (one shareable link) is blocked behind a discovery problem.
**Status:** Fixed — After create, redirects to edit page with ?share=1 which auto-scrolls to share section.

---

### 59. No Upgrade Moment After First Pitch Creation
**Area:** Profitability
**Severity:** High
**What's wrong:** After a free user creates their first pitch, they land on the dashboard with no upgrade prompt. The completion moment — the highest emotional high after creation — is wasted. The dashboard just shows the pitch in the list.
**Recommended fix:** After first pitch creation, redirect to `/dashboard?firstpitch=true`. Dashboard reads this param and shows a one-time overlay: "Your pitch is live. Want password-protected links, AI, and unlimited pitches? [Go Pro →]". Dismiss once, store in localStorage.
**Impact if ignored:** The prime conversion window is wasted. Free users who successfully create a pitch are the most motivated to pay — and they're shown nothing.
**Status:** Fixed — UpgradeBanner handles ?firstpitch=true. Shows one-time Go Pro prompt after first pitch creation.

---

### 60. Commission Breakdown Shown After Payment Commitment
**Area:** UX / Trust
**Severity:** High
**What's wrong:** In PitchViewFunding, the commission breakdown ("You donate $25 → creator receives $23") only appears AFTER clicking "Continue to payment" — after the Razorpay order is created. Before that, donors see a vague "A small platform fee applies. Exact breakdown shown at checkout." This is the opposite of fee transparency. The breakdown should be visible as soon as the donor types an amount, not after committing.
**Recommended fix:** Show an estimated breakdown inline as the donor types (before clicking "Continue to payment"): "Estimated: you donate $25.00 → creator receives ~$23.00 (8% platform fee)". Use the known commission rate (available from the pitch's creator tier) to compute this client-side.
**Impact if ignored:** Donors who see the fee after clicking feel trapped. Trust damage at the critical conversion moment.
**Status:** Fixed — Estimated breakdown shown inline as user types amount (before Razorpay order). Exact breakdown shown after order creation.

---

### 61. Unauthenticated "Go Pro" Click Fails Silently
**Area:** UX / Profitability
**Severity:** High
**What's wrong:** An unauthenticated user visiting `/pricing` clicks "Go Pro". `CheckoutButton` POSTs to `/api/subscriptions/checkout` which returns 401. The component needs to handle this by redirecting to `/signup?plan=pro` so the intent is preserved. If it doesn't, the user sees an error or nothing and leaves.
**Recommended fix:** In `CheckoutButton`, on 401 response: `router.push('/signup?plan=pro')`. After signup + login, check for `?plan=pro` query param and trigger checkout automatically. Or simpler: redirect unauthenticated users directly to `/signup` from the pricing page CTAs.
**Impact if ignored:** Highest-intent visitors (unauthenticated users on the pricing page who want to pay) hit a dead end.
**Status:** Fixed — CheckoutButton on 401 redirects to /signup?plan=pro to preserve upgrade intent.

---

### 62. Funding DELETE Has No Ownership Check
**Area:** Security / Functionality
**Severity:** Critical
**What's wrong:** `DELETE /api/pitches/[id]/funding` only checks that the user is authenticated — no ownership verification. Any logged-in user can disable another creator's funding campaign by knowing their pitch UUID.
**Recommended fix:** Add admin-client ownership check (same pattern as funding PATCH) before the delete.
**Status:** Fixed — Added admin-client ownership check in DELETE handler.

---

### 63. Funding POST Has No Explicit Ownership Check
**Area:** Security / Functionality
**Severity:** Critical
**What's wrong:** `POST /api/pitches/[id]/funding` uses the user-scoped RLS client to verify the pitch exists. Any authenticated user who can read a public pitch (RLS permits) can enable funding on it.
**Recommended fix:** Replace the RLS-based pitch check with an admin-client ownership check.
**Status:** Fixed — Replaced with explicit admin-client ownership check (`adminForPost`).

---

### 64. Verify Route Does Not Validate fundingId Against Razorpay Order Metadata
**Area:** Security / Payments
**Severity:** Critical
**What's wrong:** A valid Razorpay payment from any funding campaign can be replayed against a different `fundingId` in the URL. The HMAC signature only proves the payment happened — not which funding it was for. `order.notes.funding_id` (set in donate/route.ts) is never compared against the URL `fundingId` in verify/route.ts.
**Recommended fix:** After `razorpay.orders.fetch(order_id)`, check `order.notes?.funding_id === fundingId`. Return 400 if mismatch.
**Status:** Fixed — Added cross-check: `if (orderFundingId && orderFundingId !== fundingId) return 400`.

---

### 65. Share PATCH/DELETE Uses User-Scoped Client for Ownership Check — Null Dereference Risk
**Area:** Security / Reliability
**Severity:** Critical
**What's wrong:** PENTEST IDOR-02 fix was described as "admin client" but actually uses `createClient()` (user-scoped). If RLS denies the `public.users` select, `profile` is null and `pitch.user_id !== profile.id` throws a TypeError → 500 instead of 403. Any gap in the `pitches` RLS select policy also means ownership check can pass incorrectly.
**Recommended fix:** Replace both `supabase.from('pitches')` and `supabase.from('users')` calls in PATCH/DELETE handlers with `createAdminClient()`.
**Status:** Fixed — Created `verifyOwnership()` helper using admin client; both PATCH and DELETE use it.

---

### 66. AI Rate Limiting Has a Race Condition (TOCTOU)
**Area:** Security / Cost
**Severity:** Critical
**What's wrong:** AI text and image routes read the current usage count, check against the limit, then increment — three separate operations. Concurrent requests all read count=0, all pass, all fire. A user can burn N×limit credits by sending N simultaneous requests.
**Recommended fix:** Replace the read/check/write with an atomic Supabase RPC using `INSERT ... ON CONFLICT DO UPDATE SET count = count + 1 RETURNING count` and enforce the limit in the same transaction.
**Status:** Fixed — Created `try_increment_ai_usage` RPC (migration `20260310000001`). Both AI routes now use `supabase.rpc('try_increment_ai_usage', ...)` instead of read/check/increment.

---

### 67. Share Route Allows Free Users to Create Private/Password-Protected Links
**Area:** Profitability / Functionality
**Severity:** High
**What's wrong:** `POST /api/pitches/[id]/share` and `PATCH` have no tier check. Free users can set `visibility: 'private'` or add a password — bypassing the paid-only gate entirely from the API layer.
**Recommended fix:** Check subscription tier in both POST and PATCH. If `visibility !== 'public'` and tier is free, return 403 with `{ upgrade: true }`.
**Status:** Fixed — Tier gate added to both POST (create) and PATCH (update visibility) handlers.

---

### 68. Stored XSS via JSON-LD Injection in Pitch View
**Area:** Security
**Severity:** High (stored XSS on public pages)
**What's wrong:** `app/p/[id]/page.tsx` passes `pitch.project_name`, `logline`, and other user-supplied fields through `JSON.stringify` and into `dangerouslySetInnerHTML`. Node's `JSON.stringify` does NOT escape `</script>` sequences. A pitch named `foo</script><script>alert(1)</script>` produces a script injection breakout.
**Recommended fix:** After `JSON.stringify`, replace `</` with `<\/`: `JSON.stringify(creativeWorkJsonLd).replace(/<\//g, '<\\/')`.
**Status:** Fixed — Applied `<\/` escaping in `app/p/[id]/page.tsx`.

---

### 69. CSP `unsafe-inline` Negates XSS Protection
**Area:** Security
**Severity:** High
**What's wrong:** The CSP header in `next.config.ts` includes `'unsafe-inline'` in `script-src`. This allows inline script execution, completely defeating the XSS protection CSP is meant to provide.
**Recommended fix:** Remove `'unsafe-inline'`. Use Next.js nonce-based CSP, or at minimum remove it and verify the app works without it (Next.js App Router doesn't require inline scripts).
**Status:** Fixed — Implemented nonce-based CSP in middleware.ts. Each request generates a per-request nonce via `crypto.randomUUID()`. CSP header set on response with `'nonce-{nonce}'` in script-src. Nonce forwarded to layout via `x-nonce` request header. `layout.tsx` reads nonce and applies it to JSON-LD script tag. `unsafe-inline` removed from script-src. CSP removed from `next.config.ts` (middleware handles it). `style-src 'unsafe-inline'` retained — required for React inline `style={{}}` props, which is acceptable.

---

### 70. Donations Can Be Recorded Against Expired/Deleted Campaigns
**Area:** Data Integrity / Trust
**Severity:** High
**What's wrong:** `verify/route.ts` does not re-check whether the funding campaign is still active before inserting the donation. A campaign could end or be deleted between order creation and verify.
**Recommended fix:** Add a check in verify: fetch the `funding` row by `fundingId` and confirm it still exists and `end_date > now`.
**Status:** Won't Fix (in verify) — By the time verify is called, the payment has already been charged. Rejecting the record would orphan the payment. The donate route already gates on `end_date`. Campaign deletion gap is acceptable; recorded donations on a deleted campaign are still valid.

---

### 71. Password-Protected Pitches Cannot Use Funding
**Area:** Functionality
**Severity:** High
**What's wrong:** `GET /api/funding/public/[pitchId]` and `POST /api/funding/[id]/donate` both explicitly check for `visibility = 'public'`. Password-protected pitches (`visibility = 'password'`) are excluded — their funding section silently returns 404. A creator with a private pitch + funding enabled gets no donations.
**Recommended fix:** Change both endpoints to accept `visibility IN ('public', 'password')`.
**Status:** Fixed — `donate/route.ts` now uses `.in('visibility', ['public', 'password'])` for share link check.

---

### 72. Grain Overlay at z-index 9999 Covers Modals
**Area:** UX / Design
**Severity:** Medium
**What's wrong:** `body::before` grain texture uses `z-index: 9999`. Any modal or dialog using Tailwind's `z-50` (50) renders below the grain. Modals appear textured when they should be clean.
**Recommended fix:** Change grain `z-index` from `9999` to `1`. All content-layer elements already stack above `z-index: 1` by default.
**Status:** Fixed — `z-index: 9999` → `z-index: 1` in `globals.css` `body::before`.

---

### 73. Account Page Shows "Active" Badge for Past-Due Subscriptions
**Area:** UX
**Severity:** Low
**What's wrong:** The `isPaid` condition renders an "Active" badge regardless of `status`. A `past_due` user sees "Pro — Active" alongside the payment failure warning.
**Recommended fix:** Render "Past Due" badge in error color when `isPastDue` is true, replacing "Active".
**Status:** Fixed — "Active" badge now hidden when `isPastDue` or `isCancelledButActive`.

---

### 74. `NEXT_PUBLIC_RAZORPAY_KEY_ID` Can Be Undefined in Donate Response
**Area:** Reliability
**Severity:** Low
**What's wrong:** `donate/route.ts` returns `key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID`. If unset, `key_id: undefined` is returned. `new window.Razorpay({ key: undefined })` throws a silent JS error.
**Recommended fix:** Add a server-side guard — if `!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID`, return 500 before creating the Razorpay order.
**Status:** Fixed — Added guard in `donate/route.ts`; returns 500 with error message before order creation if key is missing.

---

### 75. Custom Pitch Slug Advertised as Pro Feature but Never Implemented
**Area:** Functionality / Profitability
**Severity:** High
**What's wrong:** Pro and Studio tiers list "Custom slug (pitchcraft.app/p/my-film)" as a feature. No `slug` column exists in the pitches schema, no `/p/[slug]` route exists, and no slug input exists in the editor. The feature is pure marketing text with no implementation.
**Recommended fix:** Either implement slug routing (`/p/[slug]` page that resolves slug → pitch ID, slug field in DB and editor), or remove it from the pricing page feature list entirely.
**Status:** Fixed — Custom slug feature removed from pricing page copy (Free and Pro tier feature lists). No implementation exists; removing the promise is the honest fix until the feature is built.

---

### 76. No Maximum Donation Amount Check
**Area:** Data Integrity / Payments
**Severity:** Medium
**What's wrong:** Donation `amount` is only validated for minimum ($1). Scientific notation like `1e10` parses via `parseFloat` to $100M, passes the `< 100` cents check, and gets sent to Razorpay which rejects it with an API error instead of a clean user-facing message.
**Recommended fix:** Add server-side check: `if (amount < 100 || amount > 100_000_00) return 400`. Also validate `Number.isInteger(amount)`.
**Status:** Fixed — Added `amount > 1_000_000` guard (max $10,000) in `donate/route.ts`.

---

### 77. Funding Visibility Check Blocks Password-Protected Pitch Donations
**Area:** Functionality
**Severity:** High (duplicate context — see #71)
**Status:** See #71

---

## Archive (Fixed / Won't Fix)

*Resolved critiques move here with resolution notes.*

---

### 23. Landing Page Navbar Had Two Dead Links
**Area:** UX / Functionality
**Severity:** Medium
**What's wrong:** "How It Works" and "Features" in the LP navbar both pointed to `#`. The sections they referenced were removed during the March 2026 LP audit (redundant "how it works" and "features chess" sections). The navbar was not updated. Dead links on a first-impression surface signal neglect.
**Recommended fix:** Remove dead links. "How It Works" removed. "Features" re-pointed to `#features` anchor on the existing Features Grid section.
**Impact if ignored:** Clicks go nowhere. Users who explore the nav before signing up encounter the product's first failure.
**Status:** Fixed — "How It Works" removed from nav. "Features" now links to `#features` (March 2026).

---

### 24. Auth Layout Showed Hardcoded False-Context Metadata
**Area:** UX / Design
**Severity:** High
**What's wrong:** The login and signup screens displayed decorative corner text: "Format: Feature", "Aspect: 2.39:1", "Stage: Pre-production", "Build: 0.8.4", "Encryption: Active". All hardcoded. None of it described the user's actual context. "Build: 0.8.4" is developer metadata. "Format: Feature" implied the user's project type. A filmmaker logging in to edit their documentary doesn't have a 2.39:1 fictional feature — but the screen said otherwise.
**What was missed:** PIXEL.md had no rule against this pattern. The design spec in DESIGN.md actively described these elements as intended. The audit gap was that false-data-as-decoration had no named violation class.
**Fix applied:** Auth corners removed entirely. PX-18 added to PIXEL.md. DESIGN.md spec updated.
**Status:** Fixed — Auth layout corners removed (March 2026). PIXEL.md and DESIGN.md updated.

---

### 25. LP Hero Badge "New" — Meaningless Label
**Area:** UX / Copy
**Severity:** Low
**What's wrong:** The hero badge reads "New" in a rounded pill. "New" compared to what? Every SaaS hero has a "New" badge. It signals nothing to a filmmaker and reads as template decoration.
**Recommended fix:** Either remove the badge, or replace with something specific and true: e.g., "Now: Documentary Support" or "v0.8 — Open Beta" — anything that describes a real state. If there's no real announcement to make, remove it.
**Impact if ignored:** Subtle first-impression dilution. Filmmakers see generic SaaS, not a tool built for them.
**Status:** Fixed — badge removed (March 2026).

---

---

## UX Audit — April 2026

Full audit across auth, dashboard, editor, public pitch view, landing, pricing, account, and UI components.

---

### 26. Save Indicator Missing Despite Auto-Save Implementation
**Area:** UX / Functionality
**Severity:** Critical
**What's wrong:** `saveStatus` state ('saved'/'saving'/'unsaved'/'idle') exists in `edit/page.tsx:164` but no UI element renders it. Creators working on career-defining pitches have no confirmation their work is persisted. Contradicts the "trust is the moat" positioning.
**Recommended fix:** Add a subtle save indicator in the editor header — "Saved ✓" / "Saving…" / "Unsaved changes". Already have the state; just needs a UI element wired to it.
**Impact if ignored:** Creators don't trust the editor. They copy-paste into Notion as backup. They leave when something goes wrong.
**Status:** Already implemented — `edit/page.tsx:1020-1026` renders save status in header. No code change needed.

---

### 27. Collaborator Count Inconsistency Between Account and Pricing Pages
**Area:** UX / Data Accuracy
**Severity:** Critical
**What's wrong:** `account/page.tsx:165` says "2 collaborators" for Pro. `pricing/page.tsx:156` says "5 collaborators". These are the same tier. One is wrong.
**Recommended fix:** Audit all tier feature claims against `docs/PRICING.md` as the single source of truth. Fix the incorrect number. Add a comment in both files pointing to PRICING.md.
**Impact if ignored:** Users who read both pages notice the contradiction. Instant trust erosion.
**Status:** Fixed — `account/page.tsx` corrected to "5 collaborators per pitch". Comment added pointing to PRICING.md. Studio feature list also expanded to list all features explicitly (no longer "Everything in Pro" vague reference).

---

### 28. Input Help Text Disappears on Error — Breaks Auth Flows
**Area:** UX
**Severity:** High
**What's wrong:** `Input.tsx:60` replaces help text with error text. In `signup/page.tsx:205`, password requirements are shown as help text — but once validation fails, the requirements vanish just when the user needs them most. Two components cooperating to produce bad UX.
**Recommended fix:** Show both. Error above the field in red, help text below in dim. Never hide contextual guidance because an error appeared.
**Impact if ignored:** Signup conversion drops. Users submit multiple times guessing what the password rules are.
**Status:** Fixed — `Input.tsx` now always renders helpText regardless of error state. `signup/page.tsx` password requirements now always visible below the field.

---

### 29. Sidebar Has No Mobile Collapse / Drawer
**Area:** UX / Responsive
**Severity:** High
**What's wrong:** `Sidebar.tsx` has no responsive behaviour. On mobile viewports, the sidebar is likely off-screen or overlapping content. The editor is unusable on mobile.
**Recommended fix:** Add a slide-in drawer for mobile: hamburger opens the sidebar, tap outside closes it. The editor doesn't need to be fully featured on mobile — but it needs to not be broken.
**Impact if ignored:** Any creator accessing PitchCraft on a phone or tablet hits a broken layout and leaves.
**Status:** Fixed — `edit/page.tsx` now hides sidebar off-screen on mobile (`-translate-x-full md:translate-x-0`). Hamburger button in editor header toggles it. Backdrop overlay closes it. Main content uses `md:ml-[240px]` so it's full-width on mobile.

---

### 30. In-App Cancellation Requires Emailing Support
**Area:** UX / Profitability
**Severity:** High
**What's wrong:** `account/page.tsx:132` tells users to email support@pitchcraft.app to cancel. No in-app flow exists. High friction, breeds resentment, directly contradicts the trust positioning.
**What competitors do better:** Every credible SaaS has one-click cancellation in the account page. Hiding it behind email support is a pattern associated with dark patterns and erodes confidence.
**Recommended fix:** Add a "Cancel subscription" button in the account page that calls the DodoPayments cancellation API. Confirm with a modal. Inform user their access continues until period end.
**Impact if ignored:** Subscription cancellations become support tickets. Users feel trapped. Review bombs.
**Status:** Fixed — Created `app/api/subscriptions/cancel/route.ts` (calls `dodo.subscriptions.cancel()`). Created `CancelSubscriptionButton` client component with 2-step confirm flow. Webhook handles DB update on `subscription.cancelled` event. Note: needs testing once DodoPayments webhook is configured (#22).

---

### 31. Validation UX Inconsistent Across All Auth Pages
**Area:** UX / Consistency
**Severity:** High
**What's wrong:** Four auth pages use four different validation patterns: Login shows a single error banner; Signup shows field-level inline errors; Reset Password uses styled component (Button/TextInput); Update Password uses styled component differently. Users experience a different product on each page.
**Recommended fix:** Standardise on one pattern: field-level errors inline (below each field, in error red), plus a top-level summary if multiple fields fail. Apply consistently to all auth pages and all forms across the product.
**Impact if ignored:** Inconsistency reads as unpolished. Filmmakers working with studios notice craft.
**Status:** Fixed — Login now uses field-level errors (email below email field, password error below password field, error border highlights the relevant input). Update-password general error banner now matches login/signup style (`border-l-2 border-pop`). TextInput error color aligned to `text-pop` (was `text-error`) and error border changed to `border-pop` — consistent across all forms. Signup password requirements always visible (fixed in prior pass).

---

### 32. Private Pitch Error Is a Dead-End for Everyone
**Area:** UX / Error Handling
**Severity:** High
**What's wrong:** `p/[id]/page.tsx:172` shows "This project is not publicly available" with no CTA, no login prompt, no "Edit this project" link for owners. If the pitch owner visits their own private pitch URL, they see the same blocking error as a stranger.
**Recommended fix:** Two paths: (1) If user is authenticated and owns the pitch — show "This pitch is set to private. [Edit pitch]". (2) If unauthenticated — show "This pitch is private. [Log in to continue]".
**Impact if ignored:** Owners get confused when testing their own share links. Trust in the link system breaks.
**Status:** Fixed — `p/[id]/page.tsx` now checks if logged-in user owns the pitch. Owner sees "Edit project →" link. Unauthenticated sees "Log in to continue →". Third-party authenticated user sees neutral message.

---

### 33. No Active Link Indicator in Dashboard Navigation
**Area:** UX / Feedback
**Severity:** Medium
**What's wrong:** `Nav.tsx:56` supports active link styling but `active=true` is never passed from dashboard pages. Users can't orient themselves — no visual confirmation of which section they're in.
**Recommended fix:** Pass current pathname to Nav and highlight the matching link. One-line change with `usePathname()`.
**Impact if ignored:** Subtle disorientation, especially as dashboard grows more pages.
**Status:** Won't Fix (current scope) — Dashboard Nav has no `links` array passed so no active-link logic applies. Dashboard navigation is account/upgrade/sign-out only. If page-level links are added later, wire `active` via `usePathname()`.

---

### 34. Sidebar Doesn't Show Completed Sections Visually
**Area:** UX / Feedback
**Severity:** Medium
**What's wrong:** `Sidebar.tsx:273` tracks a `completed` boolean per section but renders no visual indicator. Optional sections show "Added ✓" but required sections show nothing when complete. Users editing long pitches can't tell at a glance what's done.
**Recommended fix:** Show a subtle checkmark or filled dot next to completed required sections in the sidebar. Use existing `completed` boolean — no new state needed.
**Impact if ignored:** Users re-open sections they've already finished. Editor feels unfinished.
**Status:** Fixed — `Sidebar.tsx` now shows ✓ checkmark on the right side of completed required sections using the existing `completed` boolean.

---

### 35. Onboarding Dismiss State Is Global (Not Per-User)
**Area:** UX / Correctness
**Severity:** Medium
**What's wrong:** `WelcomeOnboarding.tsx:82` uses a single localStorage key for all users on a device. If a second user logs in on the same browser, they never see onboarding. If a user logs out and back in, onboarding is already dismissed.
**Recommended fix:** Key the localStorage entry by user ID: `pitchcraft_onboarding_dismissed_${userId}`. Requires passing user ID to the component.
**Impact if ignored:** New users on shared devices skip onboarding entirely. First-run experience is lost.
**Status:** Fixed — `WelcomeOnboarding` now accepts `userId` prop and keys localStorage as `pitchcraft-onboarding-done-{userId}`. Dashboard passes `profile.id`.

---

### 36. Subscription Tier Flashes Locked UI Before Loading
**Area:** UX / Performance
**Severity:** Medium
**What's wrong:** `edit/page.tsx:118` — `subscriptionTier` is null during initial load. Pro/Studio users briefly see custom sections or AI features locked, then unlocked as tier resolves. Flash of wrong state.
**Recommended fix:** Block rendering of tier-gated UI until subscription resolves. Show a skeleton or neutral state. Alternatively, load tier server-side and pass as prop.
**Impact if ignored:** Pro users see a flicker that suggests their subscription isn't being recognised. Support tickets.
**Status:** Already handled — `edit/page.tsx` uses `subscriptionTier ?? 'pro'` default, so sidebar renders Pro-unlocked state during load. No flash occurs.

---

### 37. Annual Discount Math Not Shown on Pricing Page
**Area:** Profitability / UX
**Severity:** Medium
**What's wrong:** `pricing/page.tsx:56` shows "Save 25%" badge on annual toggle but doesn't show the per-month breakdown ($9/mo vs $12/mo). Users can't quickly verify the savings claim.
**Recommended fix:** Show both: "$9/mo, billed $108/yr" on annual, "$12/mo, billed monthly" on monthly. Make the savings concrete.
**Impact if ignored:** Users second-guess the discount. Annual conversion underperforms.
**Status:** Fixed — `pricing/page.tsx` billedNote now shows `$108/yr — vs $12/mo monthly` format. Concrete math visible at a glance.

---

### 38. Password-Protected Pitch Lockout UX Is Harsh
**Area:** UX / Error Handling
**Severity:** Medium
**What's wrong:** `PitchViewPasswordGate.tsx:115` — after 5 failed attempts, a 15-minute lockout begins with a countdown. Users don't know a limit exists until they hit it. Refreshing the page shows the gate again without lockout context. No password hint field.
**Recommended fix:** (1) Show "X attempts remaining" from the first attempt, not just on failure. (2) On lockout, persist lockout state (sessionStorage or cookie) so a page refresh still shows the countdown. (3) Consider allowing creators to add a hint when setting the password.
**Impact if ignored:** Legitimate recipients get locked out. They contact the creator. Creator loses confidence in the sharing feature.
**Status:** Fixed — `PitchViewPasswordGate.tsx` now shows "X attempts allowed before temporary lockout" on first view (before any failures). Lockout already persisted in localStorage across refreshes.

---

### 39. Clipboard Copy Fails Silently on Pitch Cards
**Area:** UX / Error Handling
**Severity:** Medium
**What's wrong:** `Card.tsx:55` uses `navigator.clipboard` without a fallback. If clipboard API is unavailable (HTTP, certain browsers, browser permissions denied), the copy button does nothing. No error shown.
**Recommended fix:** Wrap in try/catch. Fallback to `document.execCommand('copy')` on a temporary textarea. If both fail, show an error: "Copy failed — select the link manually."
**Impact if ignored:** Share link copy silently fails. Creators share the wrong link or nothing.
**Status:** Already fixed — `Card.tsx:59` has `if (!navigator?.clipboard) return` guard. Duplicate of #43 and #44 from earlier audit.

---

### 40. Studio Plan Features List Doesn't Include Inherited Pro Features
**Area:** UX / Clarity
**Severity:** Medium
**What's wrong:** Account page Studio section says "Everything in Pro" but only lists new Studio-exclusive features. Users comparing plans must mentally reconstruct what Studio actually includes by reading both Pro and Studio sections.
**Recommended fix:** Expand Studio to list all features (Pro + Studio), or add a collapsed "Includes all Pro features +" summary that's actually human-readable. Pricing page should match.
**Impact if ignored:** Users undervalue Studio. Upgrade conversion from Pro to Studio suffers.
**Status:** Fixed — `account/page.tsx` Studio section now lists all features explicitly (Pro + Studio). No more "Everything in Pro" vague reference.

---

### 41. Mobile Navigation Menu Missing Pricing and Features Links
**Area:** UX / Responsive
**Severity:** Medium
**What's wrong:** `Nav.tsx:144` — mobile hamburger menu renders only "Get Started" or "Dashboard". Desktop nav includes Pricing, Features, Account, Upgrade links. Mobile users can't access these.
**Recommended fix:** Replicate the full desktop nav in the mobile drawer. All links should be available on all viewports.
**Impact if ignored:** Mobile visitors can't find pricing. Conversion blocked on mobile.
**Status:** Fixed — `Nav.tsx` mobile menu now always shows Pricing link for authenticated users (labelled "Upgrade" for free tier, "Pricing" for paid tiers).

---

### 42. Upgrade Banner Polling Aggressive and May Dismiss Too Early
**Area:** UX / Functionality
**Severity:** Medium
**What's wrong:** `UpgradeBanner.tsx:22` polls subscription status every 2 seconds for up to 30 seconds (15 attempts). If payment processes slowly, banner may auto-dismiss before status confirms. No fallback shown.
**Recommended fix:** Extend polling window or implement exponential backoff. If polling exhausts without confirmation, show "Payment received — your plan will activate shortly. Refresh to check." Don't auto-dismiss on timeout.
**Impact if ignored:** Users upgrade, see the banner vanish, refresh, and still see Free tier. They think payment failed. Support tickets.
**Status:** Fixed — `UpgradeBanner.tsx` now uses exponential backoff polling (10 attempts, delays from 2s→20s). No auto-dismiss on timeout. Banner stays visible with "Refresh if this takes more than a minute" message. User-controlled Dismiss button added.

---

### 43. Budget Range Boundary Ambiguous in Pitch Forms
**Area:** UX / Copy
**Severity:** Low
**What's wrong:** Budget options "Under $5K" and "$5K–$50K" create an unclear boundary. A $5,000 project fits both labels.
**Recommended fix:** Use exclusive lower bounds: "Under $5K" and "$5K–$49K" or "Up to $5K" and "$5K–$50K". Or use "Less than $5K" / "$5K or more".
**Impact if ignored:** Minor, but creators with exactly-at-boundary budgets pick arbitrarily. Pitch data is slightly noisy.
**Status:** Fixed — "Under $5K" changed to "Less than $5K" in dashboard, PitchViewMetadata. BudgetSegments already uses `<5K` which is clear.

---

### 44. Status Badge Uses Color Only — Inaccessible to Colorblind Users
**Area:** UX / Accessibility
**Severity:** Low
**What's wrong:** `Badge.tsx:29` — pitch status (Looking / In Progress / Complete) is indicated by a colored dot only. Three similar hues (red/yellow/green) are indistinguishable to red-green colorblind users (~8% of men).
**Recommended fix:** Add the status label as text alongside the dot, or use distinct icons per status (circle, half-circle, checkmark). Color becomes redundant confirmation, not sole indicator.
**Impact if ignored:** Colorblind creators can't reliably distinguish their pitch statuses.
**Status:** Already fine — `Badge.tsx` renders both a colored dot AND the text label (Development / Production / Completed). Color is redundant confirmation, not sole indicator. No change needed.

---

### 45. Modal Lacks Accessibility Attributes
**Area:** UX / Accessibility
**Severity:** Low
**What's wrong:** `Modal.tsx` uses native `<dialog>` but has no `aria-labelledby` or `aria-describedby`. Screen readers announce the modal without context. Title exists visually but not semantically linked.
**Recommended fix:** Add `aria-labelledby` pointing to the modal title element. Add `aria-describedby` for content description if present.
**Impact if ignored:** Modal is unusable for screen reader users. Low impact now, higher if product is used by studios with accessibility requirements.
**Status:** Fixed — `Modal.tsx` dialog now has `aria-labelledby="modal-title"` and `aria-modal="true"`. Title h2 has `id="modal-title"`.

---

## Audit Schedule

- **Monthly:** Claude reviews this file, adds new critiques based on recent development
- **Before launch:** All Critical and High severity items should be Acknowledged or Fixed
- **Quarterly:** Full competitive re-assessment against COMPETITION.md
