# FLOWS.md — End-to-End User Flow Audit

## Purpose

This file maps every critical user journey and audits each step for: dead ends, missing error states, confusing UX, incomplete feedback loops, and moments where the user is left without guidance.

FLOWS.md thinks like a first-time user. Where CRITIC.md finds bugs in code, FLOWS.md finds breaks in experience.

## Rules

1. **Map the full journey.** Start before the product. End after the action completes.
2. **Mark every gap.** Unknown error messages, missing redirects, ambiguous states — all logged.
3. **Rate each gap.** Critical (user cannot proceed) / High (user likely to abandon) / Medium (confusion, friction) / Low (minor polish).
4. **Reference exact files and routes.**
5. **Revisit after every new page or flow change.**

---

## Flow Map

### FL-01. Sign Up → First Dashboard

**Route:** `/signup` → email confirmation → `/login` → `/dashboard`

**Steps:**
1. User arrives at `/signup`
2. Fills name, email, password, confirm password, checks GDPR consent
3. Submits → Supabase `signUp()` called
4. If success: shows "Check your inbox" state
5. User clicks confirmation link in email → redirected to... **where?**
6. User navigates to `/login`
7. Enters credentials → Supabase `signInWithPassword()`
8. Redirected to `/dashboard`
9. `WelcomeOnboarding` modal fires (localStorage-gated)

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-01a | After email confirmation link is clicked, Supabase redirects to a URL. That URL is not configured in code — it depends on Supabase project settings. If not configured correctly, confirmation drops user on a blank page or error. | Critical | Supabase project settings + `/app/(auth)/login/page.tsx` |
| FL-01b | After signup success, the "Back to login" button leads to `/login`. If the user clicks confirmation link in a new tab, they have two tabs open. The UX doesn't account for this. | Low | `app/(auth)/signup/page.tsx:92` |
| FL-01c | A logged-in user who navigates to `/login` or `/signup` sees the login/signup form instead of being redirected to `/dashboard`. `middleware.ts` was deleted. | Medium | Deleted `middleware.ts` — D-09 in DEBT.md |
| FL-01d | `WelcomeOnboarding` only fires once (localStorage). If a user clears localStorage or switches devices, they see onboarding again. Not a bug but worth noting — onboarding state is not server-persisted. | Low | `components/ui/WelcomeOnboarding.tsx` |
| FL-01e | Password requirements (uppercase, number, 8+ chars) are only enforced client-side. Server (Supabase) may have different or no password policy. If a user bypasses the form, they could set a weak password. | Medium | `app/(auth)/signup/page.tsx:21-27` |

---

### FL-02. Create First Pitch

**Route:** `/dashboard` → `/dashboard/pitches/create`

**Steps:**
1. User sees empty state: "Nothing here yet. Let's change that."
2. Clicks "Create your first project"
3. Arrives at `/dashboard/pitches/create`
4. WelcomeOnboarding modal may be covering the page (if not dismissed)
5. Sidebar shows 8 required sections
6. User fills sections, navigates via sidebar
7. User clicks "Publish" (or equivalent final action)
8. `POST /api/pitches` called server-side
9. Response returns `{ id }`
10. Redirect to `/dashboard` or `/dashboard/pitches/[id]/edit`

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-02a | The create page is a client component with no route guard. If the user's Supabase session expires mid-create, the `POST /api/pitches` call returns 401. The create page has no handling for 401 — the error is generic. The half-filled form is lost. | High | `app/dashboard/pitches/create/page.tsx` |
| FL-02b | There is no auto-save on the create page. If the user navigates away (back button, accidental tab close), all content is lost. The edit page has auto-save; create does not. | High | `app/dashboard/pitches/create/page.tsx` |
| FL-02c | WelcomeOnboarding is a full-screen modal. It appears on top of the create page if the user navigates directly to `/dashboard/pitches/create` without dismissing it. The onboarding does not know the user is on the create page. | Medium | `components/ui/WelcomeOnboarding.tsx:27-38` |
| FL-02d | Free tier users who already have 1 pitch see a 403 when they try to create. The create page shows a generic upgrade message (from CRITIC fixes), but there is no CTA that links to pricing or triggers checkout. User is left at a dead end. | High | `app/dashboard/pitches/create/page.tsx` |
| FL-02e | After successful pitch creation, the redirect destination is not clearly defined in the code. Confirm: does the user land on `/dashboard` or the edit page? If `/dashboard`, they see their pitch in the list but may not know to share it. | Medium | `app/dashboard/pitches/create/page.tsx` (submit handler) |
| FL-02f | The sidebar on the create page shows 8 required sections. Optional sections are in a "More" panel. New users won't know optional sections exist unless they click "More." No indication during onboarding that optional sections are available. | Low | `components/layout/Sidebar.tsx:38-75` |

---

### FL-03. Share a Pitch

**Route:** Dashboard → Edit page → Share settings → Copy link

**Steps:**
1. User finishes pitch, returns to dashboard
2. Pitch appears in PitchCard with "Edit" link
3. User opens edit page
4. In edit page: configures share settings (public / private / password-protected)
5. Pitch link auto-generated: `pitchcraft.app/p/[id]`
6. User copies the link (copy button in dashboard card or edit page)
7. Sends link to recipient

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-03a | The share URL on the dashboard card (`shareLinkMap`) only populates if a `share_links` row exists with `visibility = 'public'` or `'password'`. A newly created pitch with no share link configured shows no URL on the card. The user has no visual cue to configure sharing. | High | `app/dashboard/page.tsx:59-73` |
| FL-03b | There is no "Share" or "Publish" button on the create page. The user creates a pitch and then has to go back to the edit page to configure visibility. This two-step process is not explained anywhere. | High | Create flow — no sharing step |
| FL-03c | On mobile, the dashboard card has a "Copy Link" button only when `shareUrl` exists. On desktop, it exists in the card action row. On mobile, the action row is not documented as existing. Verify mobile layout of PitchCard. | Medium | `components/ui/Card.tsx` |
| FL-03d | Password-protected link flow from the creator's side: creator sets password, sees the pitch URL, but there's no UI to tell them "share this URL + tell your recipient the password." The UI is silent on this. | Medium | Edit page share section |
| FL-03e | After the creator shares the link with a password, they may want to change the password. Changing the password does NOT invalidate existing viewer cookies (24h window). No warning to the creator about this. AUTH-02 in PENTEST.md. | High | `app/api/pitches/[id]/share/route.ts` |

---

### FL-04. Recipient Views a Pitch

**Route:** External link `/p/[id]` → pitch view

**Steps:**
1. Recipient clicks shared link
2. Server fetches share_links row — checks visibility
3. If private: 403/404 returned
4. If password-protected: server checks httpOnly cookie → if absent or invalid: renders password gate
5. Recipient sees `PitchViewPasswordGate` — enters password
6. On success: cookie set, `window.location.reload()` → server re-renders with full pitch
7. If public: pitch renders immediately

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-04a | If a pitch's share link is set to `private`, the recipient gets a 404 or 403. The error page they see is Next.js's default error page (or a custom 404 if configured). There's no "This pitch is private" message. Recipient doesn't know if the link is broken or intentionally locked. | High | `app/p/[id]/page.tsx` — private branch |
| FL-04b | The pitch view page has no loading state between sections. Large images or media loads without any skeleton UI — content jumps in. | Low | `app/p/[id]/page.tsx` |
| FL-04c | After password verification, `window.location.reload()` forces a full page reload. On slow connections, this is a blank screen for 1-3 seconds. No loading indicator during the reload. | Low | `components/pitch-view/PitchViewPasswordGate.tsx:78` |
| FL-04d | The 15-minute lockout after 5 wrong password attempts is client-side only (localStorage). An attacker can clear localStorage and try again. Server-side rate limiting is not implemented. PENTEST.md AUTH-01. | Medium | `components/pitch-view/PitchViewPasswordGate.tsx:7-28` |
| FL-04e | If the pitch has funding enabled, the `PitchViewFunding` component loads asynchronously. If it fails (network error on `/api/funding/public/[id]`), it silently returns null. No fallback for the creator who has a funding campaign but the component fails to load. | Medium | `components/pitch-view/PitchViewFunding.tsx:60-73` |

---

### FL-05. Donation (Visitor → Donor)

**Route:** Pitch view → Funding section → Razorpay → Verify

**Steps:**
1. Visitor sees "Support This Project" section on pitch view
2. Clicks "Support this project" button → form expands
3. Enters: amount, name, email, optional message
4. Clicks "Continue to payment"
5. `POST /api/funding/[id]/donate` → Razorpay order created → `{ order_id, amount, key_id }` returned
6. Razorpay checkout modal opens (JavaScript SDK)
7. Visitor completes payment
8. Razorpay calls `handler` callback with `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`
9. Client sends these to `POST /api/funding/[id]/verify`
10. Backend verifies HMAC, fetches real amount, inserts donation row, sends emails
11. Success state shown: "Thank you for your support."

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-05a | Step 4: commission breakdown is shown only AFTER the donate API returns (breakdowns is set from `creator_amount` in the response). Before clicking "Continue to payment," the donor sees a vague message: "A small platform fee applies. Exact breakdown shown at checkout." This is the opposite of transparency — the breakdown is shown after the user already committed to paying. | High | `components/pitch-view/PitchViewFunding.tsx:354-362` |
| FL-05b | If the Razorpay SDK script fails to load (ad blocker, slow network), `window.Razorpay` is undefined. The error message is: "Payment system failed to load. Please refresh and try again." There is no fallback payment method. | Medium | `components/pitch-view/PitchViewFunding.tsx:123-127` |
| FL-05c | The Razorpay modal's `ondismiss` handler sets `setDonating(false)`. But if the user dismisses the modal and then tries to donate again, the form resets state correctly. However, `showForm` remains `true`, so the form is visible. This is correct. Just noting: verify the UX is clean after dismissal. | Low | `components/pitch-view/PitchViewFunding.tsx:139-141` |
| FL-05d | After successful donation: `setSuccess(true)` and `setShowForm(false)`. The funding total is optimistically incremented client-side. If the user refreshes, the real total from the DB is fetched. If two donors pay simultaneously, both see different totals briefly. D-11 in DEBT.md. | Low | `components/pitch-view/PitchViewFunding.tsx:160-169` |
| FL-05e | Donor confirmation email is sent from the verify route. If Resend fails (API error), the donation is still recorded but the donor gets no email. There's no retry mechanism. The error is logged server-side but the donor has no idea. | Medium | `app/api/funding/[id]/verify/route.ts` |
| FL-05f | There is no "currency" label next to the amount input. The label is "Amount (USD)" but the placeholder is `25` with no `$` symbol. Donors from non-USD countries may not realize the amount is in USD. | Low | `components/pitch-view/PitchViewFunding.tsx:326-330` |

---

### FL-06. Upgrade (Free → Pro)

**Route:** Upgrade trigger → `/pricing` → DodoPayments checkout → return to `/dashboard`

**Steps:**
1. User hits a tier gate (create 2nd pitch, use AI, set private link)
2. Gate shows upgrade message (or redirect to `/pricing`)
3. User lands on `/pricing` — sees Free / Pro / Studio cards
4. Clicks "Go Pro" → `CheckoutButton` fires
5. `POST /api/subscriptions/checkout` → DodoPayments session created → `{ url }` returned
6. Client redirects to DodoPayments checkout URL
7. User completes payment
8. DodoPayments webhook fires → `POST /api/subscriptions/webhook`
9. `subscriptions` table upserted with `tier = 'pro'`
10. Return URL: `/dashboard?upgraded=true`
11. Dashboard loads — `UpgradeBanner` checks `?upgraded=true` param

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-06a | The `UpgradeBanner` component reads the `?upgraded=true` URL parameter to show a success message. But the webhook fires asynchronously — there can be a 2-10 second delay between the return URL loading and the webhook updating the `subscriptions` table. If the user lands on `/dashboard?upgraded=true` before the webhook fires, their tier is still `free`. The banner says "upgraded" but all Pro features are still locked. | Critical | `app/dashboard/page.tsx` + `components/ui/UpgradeBanner.tsx` |
| FL-06b | If the user abandons DodoPayments checkout and returns to the app, they land on `/pricing` or back-navigate. There's no "continue checkout" mechanism. The session is orphaned. No cleanup needed, but the user may be confused about whether they were charged. | Medium | DodoPayments checkout flow |
| FL-06c | From a tier gate on the create page, the upgrade path is: see 403 error → navigate to `/pricing` manually. There's no direct "Upgrade now" CTA that links to `/pricing` or triggers checkout inline. The user has to know to go to pricing. | High | `app/dashboard/pitches/create/page.tsx` (403 handler) |
| FL-06d | The pricing page is accessible to unauthenticated users. Clicking "Go Pro" calls `POST /api/subscriptions/checkout` which returns 401. The `CheckoutButton` client component gets 401 and does... what? Is there an error state? Or does it silently fail? Unauthenticated users must sign up first. | High | `components/ui/CheckoutButton.tsx` |
| FL-06e | After upgrade, there is no UI to cancel a subscription. The account page shows the tier and billing period but says "to cancel, email support." This is a valid MVP approach but creates friction. Cancel rates by support email are harder to measure. | Medium | `app/dashboard/account/page.tsx` |
| FL-06f | Annual pricing ($9/mo, $22/mo) is displayed on the pricing page but there is no annual billing toggle. The checkout always creates a monthly subscription. Annual pricing is advertised but not actually purchasable. | Critical | `app/pricing/page.tsx:54-57` + `app/api/subscriptions/checkout/route.ts` |

---

### FL-07. Account Management

**Route:** Nav username → `/dashboard/account`

**Steps:**
1. User clicks their username in Nav (desktop or mobile)
2. Lands on `/dashboard/account`
3. Sees: name, email, tier badge, billing period end
4. If cancelled + still active: sees "Access until [date]" message
5. No actions available except to visit pricing

**Gaps:**

| ID | Gap | Severity | File |
|----|-----|----------|------|
| FL-07a | The account page shows `name` and `email` but offers no way to change either. Password change is also missing. For a paid product, users expect account editing. | Medium | `app/dashboard/account/page.tsx` |
| FL-07b | If the user's subscription is `past_due`, the account page doesn't handle it specially. The tier shows as whatever it is in the DB, but there's no "Payment failed — update your billing method" message. | High | `app/dashboard/account/page.tsx` |
| FL-07c | The account page is server-rendered so tier is always fresh. But the Nav shows tier (from the dashboard page's server render). If the user upgrades and returns to the dashboard without a full reload, the Nav tier badge may lag. | Low | `components/layout/Nav.tsx` — tier prop |

---

## Flow Health Summary

| Flow | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| FL-01 Sign Up | 1 | 0 | 2 | 2 |
| FL-02 Create Pitch | 0 | 3 | 1 | 2 |
| FL-03 Share | 0 | 3 | 2 | 0 |
| FL-04 View Pitch | 0 | 1 | 2 | 2 |
| FL-05 Donation | 0 | 1 | 3 | 3 |
| FL-06 Upgrade | 2 | 2 | 2 | 0 |
| FL-07 Account | 0 | 1 | 2 | 1 |
| **Total** | **3** | **11** | **14** | **10** |

**Priority order:**
1. FL-06f (annual pricing advertised but not purchasable — misleading)
2. FL-06a (post-upgrade webhook delay — user lands on dashboard still locked)
3. FL-01a (email confirmation redirect — may drop users on blank page)
4. FL-02b (no auto-save on create page — content loss)
5. FL-03a (no sharing cue after pitch creation)
6. FL-06c (no direct CTA from tier gate to checkout)

---

## Audit Schedule

- **Before any launch:** Walk through every Critical and High gap manually in staging
- **After any new flow or page:** Add the flow here before shipping
- **Monthly:** Re-read gaps, mark resolved, add new ones discovered in support
