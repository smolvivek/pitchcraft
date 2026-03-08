# REVENUE.md — Conversion Audit

## Purpose

This file tracks every place where a paid conversion could happen — but doesn't. It maps upgrade friction points, missing CTAs, leaking value, and moments where a user is doing a paid-tier action without being invited to pay.

REVENUE.md thinks like a finance person: where is money being left on the table, and why?

## Rules

1. **Be specific.** Name the exact moment, screen, and user state.
2. **Distinguish gap types:** Missing CTA / Wrong CTA / Too much friction / Leaking value / Unmonetized feature.
3. **Prioritize by conversion probability.** A CTA at a tier gate is worth more than a CTA on the home page.
4. **Do not add dark patterns.** Every suggestion must feel fair to the creator.
5. **Revisit monthly.** Pricing changes, feature additions, and usage data all shift priorities.

---

## Revenue Streams

| Stream | Status | Monthly Potential |
|--------|--------|-------------------|
| Pro subscriptions ($12/mo) | Active (DodoPayments) | Primary |
| Studio subscriptions ($29/mo) | Active (DodoPayments) | Primary |
| Annual subscriptions (discounted) | Advertised, not purchasable | **Leaking** |
| Funding commissions (8%/5%/3%) | Active (Razorpay) | Secondary |
| AI credit packs (10 images/$1.50) | Advertised, not implemented | **Leaking** |
| Creator payout setup | Implemented but no CTA | Undermonetized |

---

## Conversion Gaps

### R-01. Annual Pricing Is Advertised But Not Purchasable
**Type:** Leaking value (false promise)
**Severity:** Critical
**File:** `app/pricing/page.tsx:54-57`, `app/api/subscriptions/checkout/route.ts`
**What:** The pricing page shows "or $9/mo billed annually" for Pro and "$22/mo billed annually" for Studio. Clicking "Go Pro" always creates a monthly DodoPayments session — there is no annual billing option. The annual price is displayed but there's no toggle, no button, no way to actually purchase it.
**Impact:** Users who want to pay annually (typically more committed, lower churn) cannot. Users who see the annual price and expect to pay it are misled.
**Fix:** Add a billing period toggle (monthly / annual) to the pricing page. Pass `billing_period: 'annual'` to the checkout route, use a different DodoPayments product ID for annual plans.

---

### R-02. AI Credit Packs Are Advertised in FAQ but Not Implemented
**Type:** Advertised, not purchasable
**Severity:** High
**File:** `app/pricing/page.tsx:182-183` (FAQ), no route exists
**What:** The FAQ says: "If you hit your daily AI limit, you can buy extra credits: 10 images for $1.50, or 50 images for $6. Available on Pro and Studio." There is no checkout flow for this. No `/api/subscriptions/credits` route. No DodoPayments product IDs for packs. Clicking nothing — because there's no button.
**Impact:** Pro users who hit daily limits (15 AI text, 5 images) have no way to buy more. They either downgrade their workflow or leave. Lost revenue on the most engaged users (those actively using AI).
**Fix:** Build `POST /api/credits/checkout` → DodoPayments one-time payment. Show "Buy more" CTA when user hits daily AI limit in the editor. Add pack products to DodoPayments dashboard.

---

### R-03. Free User Creates a Pitch → No Upgrade Pitch at Completion
**Type:** Missing CTA
**Severity:** High
**File:** `app/dashboard/pitches/create/page.tsx` (submit handler)
**What:** A free user successfully creates their first pitch. They land on the dashboard. There is no moment that says "Now share it. Want privacy controls? Go Pro." The completion moment — the highest emotional high after creation — is wasted. The dashboard just shows the pitch in the list.
**Impact:** Free users convert best immediately after first success. This is the prime conversion window and there's no upgrade touch.
**Fix:** After first pitch creation, redirect to `/dashboard?firstpitch=true`. Dashboard reads this param and shows a one-time overlay or banner: "Your pitch is live. Want password-protected links, AI, and unlimited pitches? [Go Pro →]" Dismiss once, store in localStorage or DB.

---

### R-04. Tier Gate on Create Page Has No Checkout CTA
**Type:** Missing CTA
**Severity:** High
**File:** `app/dashboard/pitches/create/page.tsx` (403 handler)
**What:** Free users with 1 existing pitch get a 403 when trying to create a second. The page shows an error message (from CRITIC fixes). But there's no button that says "Upgrade to Pro to unlock unlimited pitches." The user is told they can't proceed but not given a clear path to unlock it.
**Impact:** High-intent users (trying to create a second pitch) are stopped with no forward path. This is the highest-conversion moment possible — they've demonstrated need — and there's no CTA.
**Fix:** After 403 response on create page: show a focused upgrade card with the specific benefit ("Unlimited pitches"), the price ($12/mo), and a checkout button. Do not redirect — let them stay on the page with the upgrade path inline.

---

### R-05. Duplicate Pitch 403 Redirects to `/pricing` — Indirect
**Type:** Wrong CTA (too many steps)
**Severity:** Medium
**File:** `components/ui/DuplicatePitchButton.tsx`
**What:** When a free user tries to duplicate a pitch and gets 403, the button redirects to `/pricing`. This is two clicks away from purchasing: redirect → pricing page → click "Go Pro" → checkout. The user's intent is clear at the moment of the 403 (they want to duplicate a pitch). Routing them to pricing adds friction.
**Fix:** On 403 from duplicate, show an inline modal (not a page redirect) with: "Duplicating pitches requires Pro. $12/mo. [Upgrade now →]" where "Upgrade now" calls the checkout API directly.

---

### R-06. AI Usage Limit Hit — No "Buy More" Path
**Type:** Missing CTA
**Severity:** High
**File:** `app/api/ai/text/route.ts`, `app/api/ai/image/route.ts`
**What:** When a Pro/Studio user exceeds their daily AI limit, the API returns a 429 with an error message. The editor shows the error. There's no "Buy more credits" link in that error state.
**Impact:** The user is blocked at exactly the moment they're most engaged and most likely to pay for more. No conversion path.
**Fix:** When AI route returns 429 with `{ limitReached: true }`, the editor component should show: "Daily limit reached. Buy 10 more image credits for $1.50 → [Buy credits]." This requires R-02 to be implemented first.

---

### R-07. Private/Password Links Used by Free Users → Blocked With No Context
**Type:** Missing CTA
**Severity:** Medium
**File:** Edit page share section
**What:** If a free user tries to set a pitch to "private" or "password-protected," the UI should gate this behind Pro. Currently: what happens? Is the toggle disabled? Is there an upgrade prompt? If the UI silently ignores the selection or shows only a disabled state with no explanation, the conversion opportunity is missed.
**Impact:** Free users who want to send a confidential pitch to a producer hit this gate. This is a high-intent moment. If there's no clear "upgrade to unlock this" message, they leave confused.
**Fix:** Verify the private/password toggle in the edit page shows: a lock icon, "Pro feature," and a link to upgrade. The CTA should be present in the control, not just in a generic settings message.

---

### R-08. Funding Commission Is Invisible to Creator Until After Setup
**Type:** Leaking value (trust + conversion)
**Severity:** Medium
**File:** Funding setup in edit page, `app/api/funding/[id]/donate/route.ts`
**What:** The commission rate (8% free, 5% pro, 3% studio) is a direct financial incentive to upgrade — every donation costs free-tier creators 3% more than Pro. But this is only visible on the pricing page and in the donor-facing commission note. The creator, while setting up funding in the edit page, has no reminder that upgrading to Pro saves them commission on every donation.
**Impact:** Creators who set up funding campaigns on free tier don't see the commission cost until they get their first donation. At that point, they're emotionally invested in the campaign. The conversion opportunity is before setup, not after.
**Fix:** In the funding setup section of the edit page, show: "You're on Free — 8% commission per donation. [Upgrade to Pro: 5%] [Upgrade to Studio: 3%]" as a persistent callout while editing the funding goal.

---

### R-09. Dashboard UpgradeBanner Fires for All Free Users — Too Broad
**Type:** Wrong CTA (low precision)
**Severity:** Low
**File:** `components/ui/UpgradeBanner.tsx`
**What:** The upgrade banner likely fires for all free users on the dashboard. A creator who just signed up and hasn't hit any tier gate yet sees the banner immediately. This is low-intent targeting — they don't know what they'd be upgrading for.
**Impact:** Banners shown before the user feels a constraint have low conversion rates and habituate users to ignoring them.
**Fix:** Show the upgrade banner only after a user has: (a) hit a tier gate, OR (b) had their free pitch for 7+ days. Trigger it based on behavior, not tier alone. This requires a small event tracking mechanism (e.g., a `upgrade_cta_triggered` flag in the `users` table).

---

### R-10. Pricing Page Has No "Current Plan" State for Logged-In Users
**Type:** Missing context
**Severity:** Medium
**File:** `app/pricing/page.tsx`
**What:** The pricing page is a static page with no knowledge of whether the user is logged in, what tier they're on, or what they're upgrading from. A Pro user who visits `/pricing` sees the same page as an anonymous visitor. Their current plan is not highlighted. The "Go Pro" button appears on their own tier.
**Impact:** Confusion. A Pro user might wonder if clicking "Go Pro" charges them again. A Studio user has no way to downgrade from the pricing page.
**Fix:** Fetch the user's current tier server-side in `pricing/page.tsx`. Highlight the current tier card with "Your current plan" label. Change the CTA on lower tiers to "Downgrade" (or remove it). Change the CTA on higher tiers to "Upgrade." Unauthenticated users see the current pricing page unchanged.

---

### R-11. No Email When Free User Hits Tier Limit
**Type:** Missing conversion trigger
**Severity:** Medium
**File:** `app/api/pitches/route.ts` (403 branch), `app/api/ai/text/route.ts` (429 branch)
**What:** When a free user hits a tier gate (pitch count limit, AI block), they see the gate UI. There's no email sent. The conversion moment passes if they don't upgrade in that session.
**Impact:** Users who hit a gate but don't upgrade in-session forget. A follow-up email ("You tried to create a second pitch — here's what Pro unlocks") recaptures 10-20% of these.
**Fix:** On 403 (pitch limit hit): send a one-time email via Resend: "You hit the free limit. Here's Pro at $12/mo." Deduplicate: only send once per user (store `upgrade_nudge_sent_at` in `users` table). Requires Resend integration for this specific email template.

---

### R-12. Studio Tier Has No Distinct Pitch on the Pricing Page
**Type:** Undermonetized
**Severity:** Low
**File:** `app/pricing/page.tsx:144-165`
**What:** The Studio tier card says "Everything in Pro" + a few extras. The extras are: unlimited AI text, 15 AI images/day (same as Pro's 5 → 15 is an increase, actually), 5 collaborators, detailed analytics, branded PDF export, priority support, early access. But the Studio card doesn't communicate a distinct *identity* — it reads as "Pro but more." The emotional pitch for Studio ("for teams and serious productions") isn't carried through to the features list.
**Impact:** Users who would pay $29/mo are comparing line items against $12/mo. Studio doesn't feel qualitatively different enough to justify 2.4x the price. Conversion to Studio may be weaker than it could be.
**Fix:** Reframe Studio features around team workflow: "Collaborate with up to 5 people on a single pitch." "Know exactly who viewed your pitch and when." "Export branded decks that look like your production company's." These are team and professional workflow benefits, not just "more limits."

---

## Revenue Health Summary

| ID | Gap Type | Severity | Revenue Impact |
|----|----------|----------|----------------|
| R-01 | Annual pricing unavailable | Critical | High (reduces churn, increases LTV) |
| R-02 | AI credit packs not implemented | High | Medium (high-engagement users) |
| R-03 | No upgrade moment after first pitch | High | High (prime conversion window) |
| R-04 | No CTA at create-page gate | High | High (highest-intent moment) |
| R-05 | Duplicate gate redirects instead of inline modal | Medium | Medium |
| R-06 | AI limit hit has no "buy more" path | High | Medium (requires R-02) |
| R-07 | Private link gate unclear | Medium | Medium |
| R-08 | Commission cost invisible during funding setup | Medium | Medium (commission savings = upgrade driver) |
| R-09 | Upgrade banner shown too broadly | Low | Low (fix reduces noise, may increase click rate) |
| R-10 | Pricing page has no logged-in state | Medium | Medium (reduces confusion, increases trust) |
| R-11 | No email on tier gate hit | Medium | Medium (recapture out-of-session users) |
| R-12 | Studio tier underpositioned | Low | Low (Studio pitch clarity) |

**Priority order (by revenue × feasibility):**
1. R-01 — Annual pricing (one DodoPayments product per tier + toggle UI)
2. R-03 — First pitch completion moment (one banner, localStorage gate)
3. R-04 — Inline upgrade CTA at create gate (add checkout button to 403 state)
4. R-06 + R-02 — AI credit packs + AI limit CTA (build together)
5. R-10 — Pricing page current plan state
6. R-08 — Commission callout in funding setup

---

## Audit Schedule

- **Monthly:** Check which R-* items are still open. Prioritize by recent usage data.
- **After pricing change:** Re-read every tier display surface and confirm new prices appear.
- **After any new tier gate:** Add the gate here and confirm a CTA exists at that moment.
- **After new payment method:** Add to Revenue Streams table and confirm full checkout → webhook → tier update flow.
