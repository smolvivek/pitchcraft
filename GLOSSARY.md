# GLOSSARY.md — Standardized Terminology

(Working title product: TBD)

This document defines every key term used across the codebase and intent files. Claude must use these terms consistently.

---

## Core Product Terms

### Creator
**Definition:** A user who creates and owns pitches on the platform.
**Not:** "User" (too generic), "Filmmaker" (too specific), "Owner" (implies ownership of company)
**Usage:** "The creator can edit their pitch anytime."
**Related:** Creator Profile, Creator Account, Creator Settings

---

### Pitch
**Definition:** A complete, shareable presentation of a creative project (film, game, ad, etc.) containing required fields, optional sections, media, and metadata.
**Not:** "Deck" (implies slides), "Project" (too vague), "Submission" (implies applying to something)
**Structure:** Pitch = [8 Required Fields] + [Optional Sections] + [Media] + [Share Link] + [Versions]
**Related:** Pitch Version, Pitch Section, Pitch Draft

---

### Required Fields (8)
**Definition:** The mandatory fields every pitch must have.
1. Logline
2. Synopsis
3. Genre & Format
4. Director's Vision
5. Cast & Characters
6. Budget Range
7. Production Status & Timeline
8. Key Team

**Rule:** Cannot create a pitch without all 8. No exceptions.
**Related:** Field, Input, Form

---

### Logline
**Definition:** One-sentence pitch describing the core idea.
**Max length:** 500 characters
**Example:** "A filmmaker discovers a hidden truth that changes everything."
**Related:** Headline, Hook, Pitch Line

---

### Synopsis
**Definition:** 2–5 paragraph narrative summary of the project.
**Purpose:** Tells the full story/concept.
**For films:** Story arc, emotional journey, key turning points
**For games:** Core mechanic, player experience, why it matters
**For ads:** Campaign concept, target audience, emotional intent
**Related:** Summary, Description, Story

---

### Director's Vision
**Definition:** Creative director's statement explaining why they're making this project and how it will look/feel.
**Includes:**
- Why the creator believes in this project
- Tone, style, aesthetic direction
- Key themes and references
- Mood and visual inspiration
**Related:** Director's Statement, Creative Direction, Artistic Intent

---

### Budget Range
**Definition:** Pre-selected category indicating project cost (not exact amount).
**Options:**
- Under $5K
- $5K–$50K
- $50K–$250K
- $250K–$1M
- $1M+
**Rule:** Discrete categories, not continuous. No custom amounts in MVP.
**Related:** Budget Category, Cost Range, Funding Target

---

### Production Status
**Definition:** Current stage of the project, indicated by badge.
**Options:**
- 🔴 **Looking** — Seeking financing, crew, collaborators
- 🟡 **In Progress** — In development, pre-production, production, or post
- 🟢 **Complete** — Finished, ready for distribution/release
**Rule:** One status per pitch. Creator can change status as the project progresses.
**Related:** Status Badge, Project Stage, Workflow State

---

### Section (Optional)
**Definition:** An optional topical area a creator can add to their pitch. 18 optional sections + 3 custom = 21 available.
**List of sections (18):**
- 09 Flow (special: horizontal scroll experience)
- 10 Script & Documents
- 11 Locations
- 12 Art Direction
- 13 Set Design
- 14 Costume
- 15 Makeup & Hair
- 16 Props
- 17 Vehicles & Animals
- 18 Stunts & SFX
- 19 Camera
- 20 Sound Design
- 21 Music
- 22 Setting & World
- 23 Schedule
- 24 Crew
- 25–27 Custom (up to 3)

**Per-section capabilities:** Notes field, reference image uploads (with optional captions), video/link embeds.
**Rule:** Each section is independent. Creator chooses which to include via sidebar "More" panel.
**Related:** Field Group, Module, Component

---

### Flow (Section)
**Definition:** Special optional section: horizontal-scroll storytelling experience showing emotional/narrative/visual arc via images, captions, character arc labels, and optional audio.
**Structure:** Sequential beats (images) → captions (2–3 words) → character arc labels → optional audio track
**Image limit:** 5 per beat
**User experience:** Full-bleed images, minimal UI, swipe to scroll
**Purpose:** Immersive, not explanatory. Make viewers *feel* the project.
**Related:** Storyboard, Journey Map, Narrative Arc

---

### Media
**Definition:** Images, videos, or documents attached to pitch sections.
**Types:**
- **Images:** JPG, PNG, WebP (max 10MB each, 5 per section)
- **Videos:** Links only (YouTube, Vimeo embeds, not uploaded)
- **Documents:** 1 PDF per pitch (max 50MB, for scripts/design docs)
**Storage:** Supabase Storage
**Related:** Asset, Attachment, File

---

### Pitch Version
**Definition:** Immutable snapshot of a pitch at a point in time.
**Numbering:** v1, v2, v3, etc. Auto-incremented on save.
**Immutability rule:** Once created, a version never changes.
**Viewer access:** Latest version shown by default. Older versions accessible if creator enables transparency.
**Related:** Snapshot, Revision, Iteration

---

### Share Link
**Definition:** Unique URL that allows others to view a pitch.
**Format:** `app.com/share/[shareId]`
**Visibility options:**
- **Public:** Anyone with link can view
- **Private:** Password required
- **Invite-only:** Email invite required (Phase 2)
**Immutability:** Creator can disable sharing, but can't edit a published share link.
**Related:** Sharing URL, Public Link, Shared Pitch

---

### Transparency
**Definition:** Creator's choice to show/hide version history to viewers.
**If enabled:** Viewers see badge ("Version 3 • Updated 2 days ago") + can switch between versions.
**If disabled:** Viewers only see latest version, no version history visible.
**Default:** Disabled (privacy-first).
**Related:** Version Visibility, History Disclosure

---

### Script & Documents (formerly Companion Document)
**Definition:** Optional section for PDF/document uploads (script, treatment, lookbook, design bible).
**Purpose:** Provide detailed supplementary material without creating multiple links.
**Format:** Any PDF (scripts, design docs, lookbooks, bibles)
**Related:** Attachment, Supplementary Material, Supporting Document

---

### Support This Project (Funding)
**Definition:** Optional feature allowing creators to accept donations/support from viewers.
**Components:**
- Funding goal (required if enabled)
- Description (required)
- Stretch goals (optional)
- End date (optional)
- Donate button (one button, no tiers)
**Commission:** Pitchcraft takes 5%, creator receives 95% (after Stripe fees)
**Related:** Fundraising, Donations, Supporter Platform

---

### Donation
**Definition:** One-time financial support from a viewer/supporter.
**Amount:** Creator chooses (viewer enters custom amount)
**Supporter info:** Name, email, optional message
**Payment:** Via Stripe
**Confirmation:** Supporter gets email receipt, creator notified
**Related:** Support, Contribution, Financial Support

---

### Supporter
**Definition:** A person who donated to a pitch via Support this Project.
**Data:** Name, email, donation amount, message, date
**Visibility:** Supporters list visible to creator only (private)
**Related:** Donor, Backer, Contributor

---

## User & Account Terms

### User Account
**Definition:** Creator's login account (email + password + settings).
**Requirements:** Email, password (8+ chars, uppercase, lowercase, number)
**Session:** JWT token, 30-day expiry, refresh token 90 days
**Related:** Account, Profile, Credentials

---

### Creator Profile
**Definition:** Public-facing information about a creator (name, statement, profile pic).
**Visibility:** Shown on shared pitches (others see it)
**Creator statement:** Optional 2–3 sentence bio ("I'm obsessed with sci-fi documentaries")
**Related:** Profile, Bio, About

---

### Login Attempt
**Definition:** Record of a login try (success or failure).
**Lock-out rule:** 5 failed attempts → 15-min lockout
**Tracking:** Email, IP, timestamp, success/failure
**Related:** Authentication Event, Access Log

---

### Audit Log
**Definition:** Record of important security/account events (password change, account deletion, etc.).
**Events logged:**
- Password changed
- Account deleted
- Email changed
- Consent updated
- Login from new IP
**Visibility:** User can request export (GDPR right)
**Related:** Security Log, Event Log, Activity Log

---

## Data & Technical Terms

### Database
**Definition:** Supabase (hosted PostgreSQL) database storing all data.
**Not:** SQLite (local), MongoDB (no ACID), Firebase (vendor lock-in)
**Related:** Data Store, Schema, Tables

---

### Schema
**Definition:** The structure of the database (tables, columns, relationships).
**Update process:** Supabase migrations (reversible, tracked)
**Related:** Data Model, Table Structure, Entity Relationship Diagram

---

### API Endpoint
**Definition:** A URL path that accepts requests and returns responses.
**Format:** `/api/v1/[resource]/[action]`
**Examples:** `POST /api/v1/pitches` (create), `GET /api/v1/pitches/:id` (read)
**Related:** Route, Method, Service

---

### Migration
**Definition:** A reversible database schema change (tracked in version control).
**Tool:** Supabase CLI migrations
**Related:** Database Update, Schema Evolution

---

### JWT Token
**Definition:** Stateless authentication token (JSON Web Token).
**Storage:** httpOnly cookie (can't be accessed from JavaScript)
**Expiry:** Access token 30 days, refresh token 90 days
**Related:** Bearer Token, Authentication Token, Session Token

---

### GDPR Compliance
**Definition:** Following EU General Data Protection Regulation requirements.
**Key rules:**
- Collect only necessary data
- Allow data export/deletion
- Transparent consent
- Report breaches within 72 hours
- Data Processing Agreement with vendors
**Related:** Privacy, Data Protection, Consent

---

## Process & Workflow Terms

### Auto-Save
**Definition:** Automatic saving of pitch data every 10 seconds while creator is typing.
**Behavior:** Silent (no notification), non-blocking (doesn't freeze form)
**Related:** Auto-Sync, Background Save, Continuous Save

---

### Versioning
**Definition:** Creating immutable snapshots of pitch state automatically on save.
**Trigger:** Every save triggers new version
**Display:** Creators see all versions in sidebar (v1, v2, v3...)
**Related:** Version History, Snapshots, Iterations

---

### Acceptance Criteria
**Definition:** Clear definition of done for a feature.
**Format:** Specific, testable, measurable (not vague)
**Example (Good):** "User can create pitch with 8 required fields, form validates empty fields, error messages display clearly"
**Example (Bad):** "User can create a pitch"
**Related:** Definition of Done, Requirements, Success Criteria

---

### Testing
**Definition:** Verifying that code works as intended.
**Types:**
- **Unit test:** Single function/component
- **Integration test:** Multiple components together
- **E2E test:** Full user flow end-to-end
**Related:** QA, Validation, Verification

---

### Deployment
**Definition:** Moving code from dev/staging to production.
**Process:** Git push → GitHub Actions → Vercel → Live
**Related:** Release, Launch, Ship

---

### Environment
**Definition:** A running version of the app (separate from others).
**Types:**
- **Development:** Local machine, for coding
- **Staging:** Vercel, mirrors production, for testing
- **Production:** Vercel, public, for real users
**Related:** Instance, Server, Infrastructure

---

## Communication Terms

### Claude
**Definition:** A single Claude instance acting as a disciplined engineering collaborator. Works on one feature at a time, following the authority hierarchy defined in CLAUDE.md.
**Ownership:** Claude owns the current task, responsible for quality.
**Related:** Engineering Collaborator, Development Partner

---

### Blocker
**Definition:** Something preventing progress (dependency not met, unclear requirement, etc.).
**When to report:** Immediately (don't wait for daily check-in)
**Resolution:** Synchronous discussion, decision, unblock
**Related:** Obstacle, Dependency, Impediment

---

## Summary Table

| Term | Definition | Key Context |
|------|-----------|------------|
| **Creator** | User who creates pitches | Owner of all their pitch data |
| **Pitch** | Complete shareable project presentation | 8 required fields + optional sections + media + versions |
| **Required Fields** | Logline, Synopsis, Genre & Format, Director's Vision, Cast & Characters, Budget Range, Production Status & Timeline, Key Team | All 8 mandatory, no exceptions |
| **Section** | Optional topical area (e.g., Locations, Cast) | Creator chooses which to include |
| **Flow** | Immersive horizontal-scroll storytelling | 5 images max per beat, with audio |
| **Version** | Immutable snapshot of pitch state | Auto-created on save, v1, v2, v3... |
| **Share Link** | URL allowing others to view pitch | Public/Private visibility options |
| **Transparency** | Creator's choice to show version history | Default: hidden (privacy-first) |
| **Support This Project** | Optional donation feature | 5% commission to Pitchcraft |
| **GDPR** | EU data protection rules | Consent, deletion, export rights |
| **Claude** | Single Claude instance as engineering collaborator | One feature at a time, follows CLAUDE.md |
| **Blocker** | Something preventing progress | Report immediately, resolve synchronously |

---

## Usage Rules

1. **Use "project" in UI-facing copy** (buttons, labels, headings). Use "pitch" in code, database, and technical discussions.
2. **When in doubt, consult this file.** Don't invent terminology.
3. **New terms get defined here.** If you introduce a term, add it to GLOSSARY.md.
4. **Claude reads this first.** Before starting work, Claude reads GLOSSARY.md to understand vocabulary.

---

This is your shared language. Speak it clearly.

