# TECH_STACK.md — Technology Decisions

## Core Stack

- **Framework:** Next.js 16 (App Router)
- **Backend:** Supabase (hosted PostgreSQL + Auth + Storage)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payments:** Stripe
- **Hosting:** Vercel (MVP), DigitalOcean App Platform (at scale)
- **Error Monitoring:** Sentry
- **CI/CD:** GitHub Actions
- **Version Control:** GitHub (private)

---

## Key Decisions

### 1. Next.js (Not React + Vite)

The previous codebase used React 18 + Vite (client-side SPA). This doesn't work for Pitchcraft.

**Why:** Pitchcraft's core feature is a shareable pitch link. When a creator shares their link on Twitter, LinkedIn, or WhatsApp, the page must render server-side for:
- Open Graph meta tags (title, description, image preview)
- Fast first load for non-authenticated viewers (producers, funders)
- SEO indexing for public pitches

A React SPA renders an empty `<div>` on the server. Social crawlers see nothing. No preview, no title, no image. For a product built around one shareable link, this is a fundamental limitation.

Next.js provides server-side rendering, static generation, and API routes in one codebase. Same language (TypeScript), same React components, but with the server rendering that Pitchcraft requires.

**Tradeoff:** The existing React + Vite components cannot be reused directly. Framework change requires restructuring all pages and routing.

---

### 2. Supabase (Not Self-Hosted PostgreSQL + Prisma)

Supabase IS PostgreSQL — managed, with auth, storage, and row-level security built in.

Self-hosting (PostgreSQL + Prisma + NextAuth.js + AWS S3) adds significant DevOps burden for a solo founder building MVP:
- Database hosting, backups, monitoring
- Auth system setup and session management
- S3 bucket configuration, IAM policies, CloudFront CDN
- Multiple services to coordinate and debug

Supabase handles all of this on the free tier (500MB database, 1GB storage, 50K monthly active users). More than sufficient for MVP.

| Aspect | Supabase | Self-Hosted (Prisma + S3 + NextAuth) |
|--------|----------|--------------------------------------|
| Database | PostgreSQL (managed) | PostgreSQL (self-managed) |
| Auth | Built-in, GDPR-ready | NextAuth.js (more setup) |
| Storage | Built-in, RLS-protected | AWS S3 (separate service) |
| DevOps burden | Minimal | Significant |
| Free tier | 500MB DB, 1GB storage, 50K MAU | None (all self-provisioned) |
| Time to MVP | Fast | Slow (weeks of infra setup) |
| ACID transactions | Yes (it's PostgreSQL) | Yes |
| RLS | Built-in | Manual |
| Migration path | Export SQL dump anytime | Already self-hosted |

**Tradeoff:** Vendor dependency. Mitigated: Supabase is open-source. Database can be exported as a standard SQL dump and self-hosted anytime.

**GDPR:** Supabase is GDPR-compliant. Data stored in chosen region. Full control over deletion and export.

---

### 3. Tailwind CSS (Keep)

Already in the codebase. Works with Next.js. Design system (DESIGN.md) maps directly to Tailwind utilities. No reason to change.

---

### 4. Stripe (Payments)

Non-negotiable for funding integration. Handles PCI compliance. GDPR-safe. ACID transactions for payments. Creator receives funds minus Pitchcraft commission.

---

### 5. Vercel (Hosting — MVP)

Vercel is built for Next.js (same team created both). Free tier includes automatic deployments from GitHub, SSL, CDN, and serverless functions. Zero configuration.

At scale (1000+ users), evaluate DigitalOcean App Platform for predictable pricing.

**Why not DigitalOcean from day 1:** More setup, no advantage at MVP scale, can migrate when needed.

---

### 6. Sentry (Error Monitoring)

Free tier (100K errors/month). Works with Next.js. No session replay — we don't track user behavior (CONSTRAINTS.md §4).

---

### 7. SendGrid (Email — When Needed)

For transactional emails (password reset, funding received, pitch viewed). Free tier: 100 emails/day. Not needed in Week 1.

---

## What Carries Forward from Old Codebase

| Carries Forward | Doesn't Carry Forward |
|----------------|----------------------|
| Supabase project + credentials | React Router (Next.js uses file-based routing) |
| Supabase auth logic (concepts) | Vite configuration |
| Tailwind CSS classes | SPA page components |
| Business logic concepts | Client-side-only rendering patterns |
| Design thinking | Old component structure |

---

## Dependencies (Actual Installed)

**Core (installed):**
```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "typescript": "^5",
  "@supabase/supabase-js": "^2.95.3",
  "@supabase/ssr": "^0.8.0",
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4"
}
```

**To install (when features require them):**
```json
{
  "stripe": "latest",
  "@stripe/stripe-js": "latest",
  "zod": "latest",
  "@sentry/nextjs": "latest"
}
```

---

## Adding New Technology

Before adding anything:
1. Does it solve a real problem?
2. Can a solo founder use it?
3. Is it GDPR-compliant?
4. Does it lock us in?
5. Is there a free tier?
6. Can we switch away if needed?

Don't change the stack mid-build. Each switch costs weeks.
