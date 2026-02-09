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
**Status:** Proposed

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

## Archive (Rejected Ideas)

*Rejected ideas are moved here with rationale, so we don't revisit them.*

---

## Notes

- This file is a living document
- Claude adds ideas during development
- Creator reviews periodically
- Approved ideas move to BUILD_SEQUENCE.md
- Rejected ideas move to Archive with reasoning
