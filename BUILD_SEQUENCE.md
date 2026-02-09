# BUILD_SEQUENCE.md — Feature Chronology & Model Strategy

## Build Order (Strict Linear)

Each feature completes fully before the next begins. No skipping. No speculative scaffolding.

| # | Feature | Model | Strategy | Status |
|---|---------|-------|----------|--------|
| 0 | Intent file updates | Opus | Solo | Done |
| 1 | Design system | Opus | Solo (coherent, one mind) | Done |
| 2 | Auth (Supabase) | Sonnet | Solo — CRUD, standard patterns | Pending |
| 3 | Pitch creation (forms + API) | Opus + Sonnet | Opus for architecture, Sonnet for form CRUD | Pending |
| 4 | Media upload | Sonnet | Solo — Supabase Storage integration | Pending |
| 5 | Pitch view (shared link + SSR) | Opus | Solo — SSR architecture, OG tags, public rendering | Pending |
| 6 | Version history | Sonnet | Solo — CRUD, snapshot logic | Pending |
| 7 | Flow section | Opus | Solo — complex interaction, horizontal scroll, animations | Pending |
| 8 | Funding (Stripe) | Opus + Sonnet | Opus for Stripe architecture, Sonnet for UI | Pending |
| 9 | Landing page | Sonnet | Solo — static page, design system application | Pending |
| 10 | Polish + sound design | Opus | Solo — animation tuning, sound integration, a11y audit | Pending |

---

## Model Strategy (Token Conservation)

**Opus** — Architecture, security, complex interactions, design decisions
- Initial project setup and design system
- Pitch view page (SSR is architecturally complex)
- Flow section (complex interaction design)
- Stripe integration (payment security)
- Polish pass (animation precision, sound design)

**Sonnet** — Standard CRUD, forms, straightforward features
- Auth (Supabase has well-documented patterns)
- Pitch creation forms
- Media upload
- Version history
- Landing page

**Haiku** — Research, testing, linting, quick lookups
- Contrast ratio calculations
- Dependency research
- Test validation

---

## Process (Every Feature)

```
Plan → Approve → Build → Internal Test → User Review → Approve → Next Feature
```

1. **Plan** — Propose plan, acceptance criteria, files to touch
2. **Approve** — Creator explicitly approves
3. **Build** — Write code
4. **Internal Test** — Type check, lint, visual audit, a11y, functional
5. **User Review** — Present completed feature with test results
6. **Approve** — Creator says "ship it" (or gives feedback)
7. **Next Feature** — Only after explicit approval

---

## Security Checkpoints

Security is not a separate feature — it's built into every feature:

| Feature | Security Requirements |
|---------|----------------------|
| Auth | RLS policies, Supabase Auth, session management, CSRF protection |
| Pitch creation | Input validation (Zod), RLS on pitches table, XSS prevention |
| Media upload | File type validation, size limits, Supabase Storage RLS |
| Pitch view | Public/private/password access control, CSP headers |
| Version history | RLS on versions table, owner-only access to history |
| Funding | Stripe webhook verification, payment validation, PCI compliance |
| All features | HTTPS, CSP, HSTS headers, no secrets in client code |

---

## What's Out of Scope (Phase 1)

- Feedback/commenting system
- Collaboration features
- Writing tool integration
- Dark mode
- Analytics
- Creator discovery/search
- Social features
- Push notifications
- AI image generation (deferred — pay-as-you-go, needs billing)
