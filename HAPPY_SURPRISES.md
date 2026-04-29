# Happy Surprises

This file tracks product ideas, design improvements, and strategic features that Claude notices during development.

## Purpose

Claude understands the product deeply and may spot opportunities the creator hasn't considered:
- Features that solve creator pain points
- Design patterns that improve usability
- Revenue stream ideas
- UX improvements that remove friction
- Strategic product directions

## Rules

1. **Claude proposes, creator decides**
   - Claude adds ideas to this file with clear rationale
   - Each suggestion explains: what it does, why it matters, how it helps
   - Creator reviews and approves/rejects
   - Nothing ships without explicit approval

2. **Types of suggestions allowed:**
   - New features (within product constraints)
   - Design improvements (visual, interaction, flow)
   - Revenue opportunities (paid tiers, add-ons)
   - Strategic product direction
   - UX patterns that reduce friction

3. **Types of suggestions NOT allowed:**
   - Anything that violates CONSTRAINTS.md
   - AI-first features (AI assists, never replaces)
   - Social/marketplace/ranking features
   - Surveillance or behavioral tracking
   - Template galleries or content scoring

## Format

```markdown
### [Suggestion Title]
**Type:** Feature / Design / Revenue / Strategy
**Problem:** What creator pain point does this solve?
**Solution:** What's the idea?
**Impact:** How does this help creators? How does this help the product?
**Implementation:** High-level approach (not detailed specs)
**Status:** Proposed / Approved / Rejected / Shipped
```

---

## Suggestions

### Pitch Presentation Mode
**Type:** Feature
**Problem:** When creators share pitch links, the Nav/UI chrome breaks immersion. Investors see "dashboard UI" instead of "polished deck."
**Solution:** Add a `/pitch/[id]/present` route that shows pitch content fullscreen, no Nav, arrow keys to advance sections, ESC to exit.
**Impact:** Makes shared links feel more professional. Investors see a presentation, not a web app. Low effort, high perceived value.
**Implementation:** New route, same data, minimal layout, keyboard controls.
**Status:** Proposed

---

### Version History with Visual Diffs
**Type:** Feature + Revenue
**Problem:** Creators iterate on pitches based on feedback. Hard to track "what changed between the version I sent to Producer A vs. Producer B."
**Solution:** Auto-save pitch versions on edit. Show visual diffs (highlight changed text). Free tier = 3 versions, paid = unlimited.
**Impact:** Solves real creator pain (tracking feedback cycles). Natural paid tier upsell. Builds trust (we understand iteration workflow).
**Implementation:** Snapshot pitch data on save, diff algorithm for text comparison, UI to browse versions.
**Status:** Proposed

---

### Pitch Analytics (Views, Time-on-Page)
**Type:** Revenue
**Problem:** Creators share pitch links but have no idea if anyone actually read it. "Did the producer even open my deck?"
**Solution:** Track anonymous view count + time spent on pitch page. Free tier = "X views", paid tier = detailed analytics (when, how long, which sections).
**Impact:** Gives creators visibility into engagement. Natural paid tier feature (basic free, detailed paid). Respects privacy (no personal data, just aggregate metrics).
**Implementation:** Simple page view tracking (server-side), duration calculation, dashboard display.
**Status:** Shipped — view tracking restricted to private/password-protected pitches per CONSTRAINTS.md §4. Studio tier sees 14-day chart + unique visitors in edit page analytics panel.

---

### Collaborative Feedback Mode
**Type:** Feature + Revenue
**Problem:** Creators share pitches with trusted collaborators (co-writers, producers, mentors) for feedback. Right now they have to use email/Slack/Google Docs comments separately.
**Solution:** Allow pitch owner to invite specific people (via email) to leave inline comments on pitch sections. Comments are private, only visible to owner + invited collaborators. Free tier = 2 collaborators, paid = unlimited.
**Impact:** Keeps feedback workflow inside Pitchcraft. Reduces tool-switching. Natural paid upsell. Builds trust (we understand creative collaboration).
**Implementation:** Invite system, comment threads per pitch section, RLS policies for access control.
**Status:** Proposed

---

### Export to PDF (Branded)
**Type:** Feature + Revenue
**Problem:** Some investors/festivals still want PDFs. Creators currently have to copy-paste into Google Docs or InDesign.
**Solution:** One-click "Export to PDF" that generates a clean, print-ready PDF of the pitch. Free tier = basic layout, paid tier = custom branding (logo, colors, fonts).
**Impact:** Removes friction for traditional submission workflows. Shows we understand hybrid workflows (digital + print). Natural paid feature.
**Implementation:** Server-side PDF generation (Puppeteer or similar), template system for layout, branding options.
**Status:** Proposed

---

### Empty State Improvements
**Type:** Design
**Problem:** Current dashboard says "This is a placeholder dashboard. Feature 3 will add pitch management here." Feels unfinished.
**Solution:** Replace with warm, actionable empty state: "Your first pitch starts here" + subtle icon + "Create Pitch" button (even if non-functional yet). When pitches exist, show cards with thumbnails.
**Impact:** Makes the product feel alive, even when empty. Sets expectations without feeling incomplete.
**Implementation:** Design better empty state component, add to dashboard.
**Status:** Proposed

---

### Pitch Link Customization
**Type:** Feature + Revenue
**Problem:** Default pitch URLs are random UUIDs: `pitchcraft.com/pitch/a3f9c8d2-...`. Not memorable, not brandable.
**Solution:** Allow creators to set custom slugs: `pitchcraft.com/pitch/neon-ghost-film`. Free tier = random UUID, paid tier = custom slug.
**Impact:** More professional, easier to share verbally ("Check out pitchcraft.com/pitch/my-project"), natural paid feature.
**Implementation:** Slug validation, uniqueness check, routing update.
**Status:** Proposed

---

### Quick-Copy Share Link from Dashboard Card
**Type:** Design / UX
**Problem:** To share a pitch, a creator has to go Dashboard → open pitch editor → find the Share section → copy the link. That's 3 clicks minimum. Sharing is the primary action after creating a pitch — it should be instant.
**Solution:** Add a small "copy link" icon button to the `PitchCard` component. On click, copy the share link to clipboard and show a brief "Copied" confirmation. If no share link exists yet, open the edit page's share section.
**Impact:** The most frequent post-creation action becomes one click. Reduces friction at the moment creators want to send their pitch. Subtle but high-frequency.
**Implementation:** Add `shareSlug` prop to PitchCard. Icon button calls `navigator.clipboard.writeText()`. No new routes.
**Status:** Shipped — Dashboard fetches public share links for all pitches. PitchCard shows copy icon (clipboard → checkmark animation). Only visible when a public/password-protected share link exists.

---

### "Upgrade Successful" Dashboard Banner
**Type:** UX
**Problem:** After a DodoPayments checkout completes, the user returns to `/dashboard?upgraded=true`. The dashboard currently ignores this. They see no confirmation, the nav still shows "Upgrade", and they don't know if their subscription activated.
**Solution:** Read `?upgraded=true` from the URL. Show a dismissable banner: "You're on Pro — AI, unlimited pitches, and privacy controls are now active." Remove the "Upgrade" button from nav on same render. Remove the param from the URL after 5 seconds.
**Impact:** Closes the payment loop. Users who just paid need confirmation — silence is alarming. This prevents support tickets and chargeback disputes.
**Implementation:** useSearchParams in a client component on the dashboard. Banner with auto-dismiss.
**Status:** Shipped — `UpgradeBanner` client component reads `?upgraded=true`, shows success message, auto-dismisses after 7s, cleans URL. Rendered in dashboard inside Suspense boundary.

---

### "Powered by Pitchcraft" Footer = Organic Growth
**Type:** Strategy / Revenue
**Problem:** Every public pitch has a `PitchViewFooter` that says "Made with Pitchcraft". It's not a link. Nobody clicks non-link footer text. It's a marketing touchpoint doing zero work.
**Solution:** Make "Made with Pitchcraft" a link to the landing page for free-tier pitches. For Pro/Studio pitches, keep it as plain text (or remove it — removing the "badge" could be a Pro feature worth calling out). Every pitch viewed by a producer is a potential acquisition channel.
**Impact:** Turns every shared pitch into passive acquisition. A producer opens 10 pitches and sees "Made with Pitchcraft" 10 times. On click 3, they might click through. This is how Canva grew.
**Implementation:** Make the text a `<Link>` to the homepage. Consider passing `tier` prop to `PitchViewFooter` — free = linked, paid = unlinked (or "Powered by" removed entirely as a Pro perk).
**Status:** Shipped — "Made with Pitchcraft" is now a link to the homepage on all pitches. Tier-based distinction (free = linked, paid = plain) deferred to when version/tier info is passed to pitch view.

---

### Pitch Duplicate Feature
**Type:** Feature
**Problem:** Creators often start new projects with the same team, similar budget, and same format. Currently they must create a new pitch from scratch and re-enter everything.
**Solution:** "Duplicate" button on the pitch card. Creates a copy of the pitch with all sections, named "Copy of [original name]", status reset to "Looking". No media is duplicated (too expensive) — just text fields.
**Impact:** Dramatically reduces friction for prolific creators (ad directors, TV writers) who run multiple projects with the same core team. Also increases pitch count per user → more engagement → more likely to upgrade.
**Implementation:** New API route `POST /api/pitches/[id]/duplicate`. Server-side copy of pitch row + sections. Redirect to edit page of the new pitch.
**Status:** Shipped — `POST /api/pitches/[id]/duplicate` copies pitch row + pitch_sections (text only, no media). `DuplicatePitchButton` component shown on each pitch card. Redirects to new pitch's edit page on success.

---

### Show Actual Commission Breakdown to Donors
**Type:** Design / Trust
**Problem:** The funding form has a vague "100% minus a small platform fee" message. The API already returns `creator_amount`, `commission_amount`, and `commission_rate`. This information exists but isn't surfaced.
**Solution:** Compute and display: "You donate $25 → $23 goes to the creator (8% platform fee)" dynamically as the user types their amount. Update in real-time. This is what Seed&Spark does.
**Impact:** Transparent fees build trust and increase conversion. Donors who understand exactly where their money goes are more likely to complete the donation. This also differentiates from platforms that hide fees.
**Implementation:** Client-side calculation in `PitchViewFunding`. No new API calls needed — compute from `commission_rate` returned by the donate endpoint (or approximate client-side using the visible 8%/5%/3% tiers).
**Status:** Shipped — After Razorpay order creation, stores `creator_amount` and `commission_rate` in state. Shows "You donate $X → creator receives $Y (Z% platform fee)" above the payment button. Dead `console.info` removed.

---

## Archive (Rejected Ideas)

*Rejected ideas are moved here with rationale, so we don't revisit them.*

---

---

### HS-NEW-1: India Pricing Tier

**What:** ₹499/month Pro (vs $12 ≈ ₹1,000). ₹1,199/month Studio (vs $29 ≈ ₹2,400). Show INR pricing when user locale is India.
**Why:** The biggest single conversion unlock for the Indian market. At current global pricing, Pro costs ₹1,000/month — double what a reasonable INR-native price would be. More impactful than doubling ad spend.
**How:** DodoPayments supports INR. Create INR-denominated price IDs. Detect locale (Accept-Language header or IP geolocation) on the pricing page. Show INR pricing to IN users, USD to everyone else.
**Revenue impact:** Estimated 3–5x conversion rate improvement in India at ₹499 vs ₹1,000.
**Status:** Proposed

---

### HS-NEW-2: Pitch Completion Indicator in Edit Header

**What:** "4 of 9 core sections complete" — a non-evaluative counter in the edit page header. Clicking scrolls to the first unfilled required section.
**Why:** Filmmakers working across multiple sessions lose track of what's missing. An unfilled synopsis or vision section can make a pitch look incomplete to investors — but the creator doesn't know until they view the public link. This orients them without judgment.
**How:** Count filled required sections from edit page state (check for non-empty content). Display in the header near the save indicator. Clicking the counter uses `scrollIntoView` to jump to the first unfilled section.
**Status:** Proposed

---

## Notes

- This file is a living document
- Claude adds ideas during development
- Creator reviews periodically
- Approved ideas move to BUILD_SEQUENCE.md
- Rejected ideas move to Archive with reasoning
