# COPY.md — Copy Critic & Voice Standard

## Purpose

This file has two jobs:

1. **Hold the standard** — the voice rules that all copy must pass through.
2. **Catch violations** — audit copy in the live codebase against those rules, with specific fixes.

COPY.md thinks like a copy director doing a QA pass: not looking for beautiful writing, looking for anything that betrays the voice, confuses the user, or uses the wrong register.

## Rules

1. **Reference exact files and line numbers.** Vague copy notes are useless.
2. **Every violation gets a fix.** Don't flag without prescribing.
3. **The standard is the voice, not the aesthetics.** Copy must sound like Pitchcraft, not look cinematic on screen.
4. **Revisit after every new page or flow.**

---

## The Voice Standard

**Three influences, in order:**

- **Dieter Rams:** Honest, functional, nothing extra. "Delete project" not "Are you absolutely sure you want to permanently delete this?"
- **A24:** Confident, filmmaker-specific, no hand-holding. "Moonlight" not "Your film journey starts here."
- **Teenage Engineering:** Terse, precise, monospace. "BPM 120" not "Set your tempo."

**Core rules:**
- Direct. No fluff.
- Filmmaker language, not SaaS speak — and not sci-fi/cyberpunk either.
- Confident but not cold.
- Short sentences. Get to the point.
- Labels are functional. Headings can be editorial. Never mix them up.

**Never:**
- Exclamation marks (except critical errors)
- Emoji
- Marketing speak ("game-changer", "seamless", "revolutionary")
- Apology language ("Oops!", "Sorry about that!")
- Corporate jargon ("leverage", "utilize", "synergy")
- Sci-fi / cyberpunk register ("Protocol", "Transmission", "Unregistered", "Access Key")
- Enterprise software register ("Suite", "Suite Access", "membership")
- Government / bureaucratic register ("User Identification", "Request Membership")

**The test:** Read the copy aloud. Does it sound like something a seasoned film editor would say to a colleague? If it sounds like a tech demo or a nightclub bouncer, it fails.

---

## Approved Voice Reference

These are the correct versions. Use them verbatim.

### Auth Pages

| Element | Approved Copy |
|---------|---------------|
| Login heading | `Welcome back` |
| Login email label | `Email` |
| Login password label | `Password` |
| Login button | `Log in` |
| Forgot password | `Reset password` |
| Login → signup link | `Don't have an account? Sign up` |
| Signup heading | `Start building` |
| Signup name label | `Name` |
| Signup email label | `Email` |
| Signup password label | `Password` |
| Signup button | `Sign up` |
| Signup → login link | `Already have an account? Log in` |
| Signup success heading | `Check your inbox` |
| Signup success body | `We sent a confirmation link to [email]. Click the link to log in automatically.` |

### Nav

| Element | Approved Copy |
|---------|---------------|
| Sign in | `Sign In` |
| Sign out | `Sign Out` |
| New project CTA | `New Project` |
| Join CTA | `Join` |

### Dashboard

| Element | Approved Copy |
|---------|---------------|
| Empty state heading | `Nothing here yet.` |
| Empty state CTA | `Create your first project` |
| Page label | `Projects` |
| With projects heading | `[Name]'s Work` or `Your Projects` |

### Pitch View (recipient view)

| Element | Approved Copy |
|---------|---------------|
| Topbar CTA | `Get in touch` |
| CTA section label | `Next Steps` |
| CTA section primary button | `Get in touch` |
| **Never use** | `Request Pitch Deck` — the page IS the pitch. Requesting a deck implies something better exists elsewhere. |
| **Never use** | `Contact Producer` — generic, cold. "Get in touch" is direct and human. |

### Editor

| Element | Approved Copy |
|---------|---------------|
| Save indicator | `Saving...` → `Saved` |
| Delete button | `Delete project` |
| Delete modal title | `Delete project?` |
| Delete modal body | `This action can't be undone.` |

---

## Copy Critiques

---

### CP-01. Auth Pages: "Enter the Suite" — Enterprise Software Register
**Severity:** Critical
**File:** `app/(auth)/login/page.tsx:58`, `app/(auth)/signup/page.tsx:181`
**What's wrong:** "Suite" is Adobe Creative Suite. Microsoft Office Suite. Oracle Business Suite. In every user's memory, "Suite" = a collection of enterprise tools sold as a bundle. Pitchcraft is a filmmaker tool. Telling a director to "Enter the Suite" positions the product in entirely the wrong company.
**Current copy:** `Enter the Suite`
**Approved fix:** `Log in` (login page) / `Sign up` (signup page). Or if you want something more editorial: `Begin` or `Enter` alone — the object does not need to be named. The word "Suite" must go.
**Status:** Fixed

---

### CP-02. Auth Pages: "User Identification" and "Access Key" — Government / Sci-Fi Register
**Severity:** Critical
**File:** `app/(auth)/login/page.tsx:44,56`, `app/(auth)/signup/page.tsx:78,89`
**What's wrong:** "User Identification" reads like a passport control form. "Access Key" reads like an API credential. Neither is how a filmmaker — or any human — thinks about their email and password. Labels are functional. Their job is to remove confusion, not add atmosphere.
**Current copy:** `User Identification` / `Access Key`
**Approved fix:** `Email` / `Password`. End of discussion. If you want a trace of brand character, `Your email` / `Your password` is as far as it goes.
**Status:** Fixed

---

### CP-03. Auth Pages: "Unregistered? Request Membership"
**Severity:** High
**File:** `app/(auth)/login/page.tsx:67`
**What's wrong:** "Unregistered" is what happens to software that's past its license. "Request Membership" implies a review process — like applying to a private club where someone might say no. Both words create friction before the user has even started. The approved voice is warm but direct, not bureaucratic.
**Current copy:** `Unregistered? Request Membership`
**Approved fix:** `Don't have an account? Sign up`
**Status:** Fixed

---

### CP-04. Auth Pages: "Protocol Access" Heading — Network / VPN Register
**Severity:** High
**File:** `app/(auth)/login/page.tsx:28`
**What's wrong:** "Protocol" is a network term. "Access" is a Microsoft database product from 1992. Together they sound like configuring a VPN or logging into a server. The visual design of the auth page is cinematic and correct — corner metadata, deep black, underline inputs. The heading should match that register: filmmaker vocabulary, not network vocabulary.
**Current copy:** `Protocol / Access` (two-line heading)
**Approved fix:** `Welcome back` — terse, warm, human. The visual design carries the cinematic weight; the heading doesn't need to do that work too. Alternatively: `Sign in.` — a period, sentence case, nothing extra.
**Status:** Fixed

---

### CP-05. Auth Pages: "Director's Cut" Section Label — Misused Film Term
**Severity:** Medium
**File:** `app/(auth)/login/page.tsx:24`
**What's wrong:** "Director's Cut" is a specific film release term — the version of the film that reflects the director's original vision, restored after studio interference. Using it as a section label on a login page evacuates the meaning. It becomes decoration, not copy. When brand-specific language is used decoratively it stops meaning anything.
**Current copy:** `Director's Cut` (mono label above login form)
**Approved fix:** Remove it entirely — the login form needs no section label. Or if the auth page's cinematic visual language demands a label: `Sign In` in the same mono style. Labels label. They don't editorialize.
**Status:** Fixed

---

### CP-06. Auth Signup: "Request Membership" Section Label
**Severity:** Medium
**File:** `app/(auth)/signup/page.tsx:24`
**What's wrong:** Same register problem as CP-03. "Membership" implies dues, a committee, an application. Pitchcraft is not a club. It's a tool.
**Current copy:** `Request Membership`
**Approved fix:** Removed entirely — the signup form needs no section label.
**Status:** Fixed

---

### CP-07. Auth Signup: "Join the Cut" Heading
**Severity:** Medium
**File:** `app/(auth)/signup/page.tsx:30`
**What's wrong:** "The Cut" is a film editing term — the edit, the timeline, the final assembly. As a brand motif it has potential. But "Join the Cut" reads as joining something that already exists (a film, a team, a project). Signing up for Pitchcraft is starting your own work, not joining someone else's. The copy points in the wrong direction.
**Current copy:** `Join / the Cut` (two-line heading)
**Approved fix:** `Start building` — direct, action-oriented, tells you exactly what you're here to do. Or: `Your work / starts here.` — two lines, simple, no film jargon that can misfire.
**Status:** Fixed

---

### CP-08. Auth Signup: "Transmission Sent" Success Label
**Severity:** Medium
**File:** `app/(auth)/signup/page.tsx:90`
**What's wrong:** "Transmission" is radio, spacecraft, or military. Filmmakers do not send transmissions. They send emails. The approved copy is "Check your inbox" — which is what actually happened and tells the user what to do next.
**Current copy:** `Transmission Sent` (mono label on success state)
**Approved fix:** Remove the section label on the success state, or use `Confirmation sent` — accurate, simple.
**Status:** Fixed

---

### CP-09. Auth Signup: "Director Name" Field Label
**Severity:** Low
**File:** `app/(auth)/signup/page.tsx:71`
**What's wrong:** The field label "Director Name" assumes the user is a director. Writers, producers, and cinematographers also use Pitchcraft. "Name" is the correct label — it's clear, accurate, and doesn't gate the product behind one job title.
**Current copy:** `Director Name`
**Approved fix:** `Name`
**Status:** Fixed

---

### CP-10. Auth Signup: "Already a member? Enter the Suite"
**Severity:** High
**File:** `app/(auth)/signup/page.tsx:182`
**What's wrong:** Double violation — "member" (club language, CP-03 problem) and "Enter the Suite" (enterprise software language, CP-01 problem). The footer link repeats both mistakes.
**Current copy:** `Already a member? Enter the Suite`
**Approved fix:** `Already have an account? Log in`
**Status:** Fixed

---

### CP-11. Landing Page: Hero Copy Diverged from Voice — Now Abstract
**Severity:** Medium
**File:** `components/landing/LandingHero.tsx`
**What's wrong:** The approved hero copy was:
```
Present your work.
Fund your vision.
Own your story.
```
The current hero copy is:
```
The tool for those
who see the work.
```
The old copy was action-oriented and specific: three things Pitchcraft lets you do, in three tight lines. The new copy is a brand statement — poetic, correct in register, but abstract. It doesn't tell a first-time visitor what Pitchcraft does. "The tool for those who see the work" could describe a camera, a lighting kit, or a film school. It's not wrong — it's just less useful than what it replaced.
**The question:** Is the landing page a brand statement or a product explanation? If it's the entry point for cold traffic (people who don't know Pitchcraft), it needs to explain what it does. If it's for warm traffic (people referred by word of mouth), a brand statement works.
**Recommended fix:** New heading: "The pitch is / the first frame." Subtitle: "Pitchcraft builds editorial pitch pages for filmmakers. Logline, vision, cast, budget — one link, built to be read."
**Status:** Fixed

---

### CP-12. Landing Page: "Begin the cut." CTA — Excellent, Keep
**Severity:** N/A — Correct
**File:** `components/landing/LandingHero.tsx`
**Assessment:** "Begin the cut." works on every level. "Cut" is a film term (the edit, the action of cutting film). It's a command. The period gives it finality. It's three words. This is the approved voice applied perfectly. No change.
**Status:** Approved

---

## Copy Health Summary

| Category | Count | Status |
|----------|-------|--------|
| Critical violations | 2 (CP-01, CP-02) | Fixed |
| High violations | 3 (CP-03, CP-04, CP-10) | Fixed |
| Medium violations | 4 (CP-05, CP-06, CP-07, CP-08) | Fixed |
| Low violations | 1 (CP-09) | Fixed |
| Correct / approved | 1 (CP-12) | Keep |
| Editorial decision needed | 1 (CP-11) | LP hero — needs discussion |

**Fix-first priority:**
1. CP-01 — "Enter the Suite" → "Log in" / "Sign up"
2. CP-02 — "User Identification" → "Email", "Access Key" → "Password"
3. CP-10 — "Already a member? Enter the Suite" → "Already have an account? Log in"
4. CP-03 — "Unregistered? Request Membership" → "Don't have an account? Sign up"
5. CP-04 — "Protocol Access" → "Welcome back"

**The pattern:** Every violation is in the auth pages. Everything else — nav copy, dashboard, editor, error states — is on-voice. The auth redesign (Stitch visual treatment) carried in a new copy register that doesn't belong here. The visual design is right. The words need to come back to the standard.

---

### CP-12. Auth Corners: "Build: 0.8.4" and "Encryption: Active" — Developer + Sci-Fi Register
**Severity:** High (resolved)
**File:** `app/(auth)/layout.tsx` (removed March 2026)
**What's wrong:** "Build: 0.8.4" is a version number. It belongs in release notes, not a login screen. Showing it to a filmmaker logging in says nothing — or worse, says "this is a developer tool." "Encryption: Active" edges into the sci-fi/security register the voice standard explicitly prohibits. Both imply a technical dashboard the user hasn't asked for.
**Root cause:** The corner metadata was designed to create cinematic atmosphere. Atmosphere is legitimate. But these specific labels borrowed from a tech-ops register that conflicts with the filmmaker voice.
**Status:** Fixed — all corner metadata removed. Only Pitchcraft wordmark remains.

---

### CP-13. LP Hero Badge: "New" — Meaningless Decoration
**Severity:** Low
**File:** `components/landing/LandingPage.tsx:124`
**What's wrong:** The badge reads "New" with no referent. New product? New feature? New version? Every SaaS hero has a "New" badge by default. It reads as template boilerplate, not filmmaker-specific communication.
**Voice test:** A seasoned film editor would never use "New" as a standalone signal. They'd say "Now: 4-type pitch system" or nothing.
**Approved fix:** Remove the badge unless there's a specific, true announcement to make. If there is — state it exactly. "Now: Documentary support" or "Open Beta — build for free" are examples of copy that earns its space.
**Status:** Fixed — badge removed entirely (March 2026).

---

## Audit Schedule

- **After any new page or flow:** Add it to this file
- **After any copy change:** Verify it passes the voice test before shipping
- **Quarterly:** Re-read all open violations and clear them

---

## Final Principle

**Good copy is invisible.**

If the user notices the writing, we've failed. The words should guide, clarify, and get out of the way.

Restrain. Clarify. Respect.
