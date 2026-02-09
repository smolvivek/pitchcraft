# SECURITY.md — GDPR Compliance & Security Requirements

(Working title product: TBD)

This document outlines all security and privacy requirements. GDPR compliance is a hard requirement from day 1.

---

## Principle: Privacy by Design

**Creator data is sacred.**

Every feature must be designed with privacy first:
- Collect only what's necessary
- Store only as long as needed
- Never sell or share data
- Be transparent about what we collect
- Let creators delete their data anytime

---

## GDPR Compliance (Hard Requirement)

### 1. Lawful Basis for Processing

**We process creator data under "Consent" lawful basis.**

**Required:**
- Explicit consent checkbox at signup ("I agree to the Terms of Service")
- Separate checkbox for marketing emails (optional, unchecked by default)
- Terms of Service must explain data processing
- Privacy Policy must explain data processing
- Consent must be recorded (date, IP, version of terms)

**Implementation:**
```
At signup:
[x] I agree to the Terms of Service and Privacy Policy
[ ] I want to receive occasional updates about new features

Both are required. Marketing is optional.
```

---

### 2. Data Minimization

**Collect only what's needed to operate.**

**Allowed to collect:**
- Email address (for login, notifications)
- Password (hashed by Supabase Auth — bcrypt internally)
- Pitch content (logline, synopsis, vision, etc.) — creator's own content
- Profile info (name, optional bio)
- Payment info (processed by Stripe, not stored by us)
- Usage data: which features used, when (NOT behavioral tracking)

**NOT allowed to collect:**
- Creator location (unless they add it)
- Device info / browser fingerprinting
- Detailed user behavior (clicks, scroll depth, engagement metrics)
- IP address (unless absolutely necessary for abuse prevention)
- Cookies for tracking (only for session management)

---

### 3. Data Retention & Deletion

**Delete data when it's no longer needed.**

**Retention Policy:**
- **Active account:** Keep all data while account is active
- **Deleted account:** Delete all data within 30 days
- **Inactive account (2+ years):** Send reminder email, delete if no response in 30 days
- **Backup data:** Delete from backups after 90 days
- **Logs:** Delete after 30 days (unless needed for security/legal)
- **Stripe payment info:** Never stored (Stripe handles it), delete records after 7 years (legal requirement)

**Implementation:**
- Add "Delete Account" button in settings
- Creator confirms deletion (can't be undone)
- Immediately delete pitches, versions, media, supporter info
- Delete from backups within 90 days
- Send confirmation email

---

### 4. Data Subject Rights (Creator Rights)

**Creators have rights under GDPR.**

**Required features:**
- **Right to Access:** Creator can download all their data (JSON export)
- **Right to Rectification:** Creator can edit their data anytime
- **Right to Erasure:** Creator can delete their account + all data
- **Right to Data Portability:** Creator can export their pitches (JSON, PDF)
- **Right to Withdraw Consent:** Creator can opt-out of marketing emails

**Implementation:**
```
In Settings → Privacy:
- Download my data (button → sends JSON)
- Export my pitches (button → sends ZIP)
- Delete my account (button → confirmation → deleted in 30 days)
- Manage consent (checkboxes for marketing emails)
```

---

### 5. International Data Transfers

**Creators may be in EU (GDPR applies).**

**Requirements:**
- Server location: EU or US with appropriate privacy agreements
- Stripe: GDPR compliant (they handle payment data)
- Supabase: GDPR compliant (choose appropriate project region)
- Vercel: GDPR compliant (with Data Processing Agreement)
- NO third-party analytics that track behavior (Google Analytics NO)
- NO third-party chat tools that access creator data

**Decision:**
- Vercel: Select region closest to primary user base; Vercel has DPA available
- Supabase: Choose EU region for GDPR compliance (or US with DPA)
- Email: SendGrid or Mailgun (both GDPR compliant)

---

### 6. Privacy Policy & Terms

**Must be specific, not generic.**

**Privacy Policy must include:**
- What data we collect (email, pitch content, etc.)
- Why we collect it (account creation, product features)
- How long we keep it (retention policy above)
- Who we share it with (Stripe, Supabase, Vercel, email provider — that's it)
- Your rights (access, delete, port data)
- How to contact us (email address, form)
- Cookie policy (session cookies only, no tracking)
- International transfers (EU data in EU servers, etc.)

**Terms of Service must include:**
- What users can do (create pitches, share, fund)
- What users can't do (no harassment, no illegal content)
- Content ownership (creator owns their pitches)
- Our liability (limited, we're not responsible for their content)
- Payment terms (5% commission, how payments work)
- Cancellation (can delete account anytime)

**Implementation:**
- Use a lawyer to review (or use Termly/iubenda template)
- Post on website (easy to find)
- Require acceptance at signup
- Version them (track changes)

---

## Authentication & Access Control

### 1. Password Security

**Supabase Auth handles password hashing, storage, and validation.**

Pitchcraft does not implement custom password hashing. Supabase Auth uses bcrypt internally and manages the full password lifecycle: hashing, storage, verification, and reset.

**Requirements:**
- Minimum 8 characters (enforced client-side before signup)
- Must include uppercase, lowercase, number (no special char requirement)
- Never store plaintext passwords (Supabase handles this)
- Never log passwords (even in errors)

**Implementation:**
```typescript
// Client-side validation before calling Supabase Auth
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validatePassword(password: string): string | null {
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be 8+ chars with uppercase, lowercase, number';
  }
  return null;
}

// Signup — Supabase handles hashing and storage
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { email, password } = await request.json();

  const error = validatePassword(password);
  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return Response.json({ error: authError.message }, { status: 400 });
  }

  return Response.json({ user: data.user });
}
```

---

### 2. Session Management

**Supabase Auth manages sessions. No custom JWT signing needed.**

Supabase uses its own JWT tokens and session cookies via `@supabase/ssr`. The session lifecycle (creation, refresh, expiry) is handled by Supabase. Our responsibility is to configure the Supabase client correctly for server-side rendering in Next.js.

**How it works:**
- Supabase issues a JWT access token and a refresh token on login
- `@supabase/ssr` stores tokens in httpOnly cookies automatically
- Access token expires after a configurable period (default: 1 hour)
- Refresh token rotates and extends the session
- Cookies are set with `Secure`, `HttpOnly`, and `SameSite=Lax` flags

**Implementation:**
```typescript
// lib/supabase/server.ts — Server-side Supabase client for Next.js App Router
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

```typescript
// middleware.ts — Refresh session on every request
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — this keeps the user logged in
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

### 3. Password Reset

**Supabase Auth handles password reset flow.**

Supabase generates a secure, one-time reset token, sends the email, and handles the password update. Pitchcraft does not implement custom token generation or email sending for password resets.

**Requirements:**
- Creator requests reset via email
- Supabase sends email with magic link (configurable template)
- Link is valid for 1 hour (Supabase default)
- Link can only be used once
- New password must follow password policy (validated client-side)

**Implementation:**
```typescript
// Route handler: request password reset
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { email } = await request.json();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  // Always return success (don't reveal if email exists)
  return Response.json({ message: 'If that email exists, a reset link has been sent.' });
}
```

```typescript
// Route handler: update password after reset
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { password } = await request.json();

  const error = validatePassword(password);
  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 400 });
  }

  return Response.json({ message: 'Password updated successfully.' });
}
```

---

### 4. Account Lockout

**Prevent brute-force attacks.**

Supabase Auth includes built-in rate limiting on auth endpoints. For additional protection, use Next.js middleware and the `login_attempts` table.

**Requirements:**
- After 5 failed login attempts, lock account for 15 minutes
- Send email notification
- Creator can unlock via email (or wait 15 min)
- Log failed attempts (security audit)

**Implementation:**
```typescript
// Track failed attempts via Supabase query in route handler
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { email, password } = await request.json();

  // Check recent failed attempts
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .eq('success', false)
    .gte('created_at', fifteenMinutesAgo);

  if (count && count >= 5) {
    return Response.json(
      { error: 'Too many failed attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Log the attempt
  await supabase.from('login_attempts').insert({
    email,
    success: !error,
    ip_address: request.headers.get('x-forwarded-for'),
  });

  if (error) {
    return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  return Response.json({ user: data.user });
}
```

---

## API Security

### 1. HTTPS Only

**All communication encrypted.**

**Requirements:**
- HTTPS on all endpoints (not HTTP)
- SSL certificate (Vercel provides this automatically)
- HSTS header (force HTTPS)

**Implementation (Next.js):**
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### 2. Content Security Policy (CSP)

**Prevent XSS, clickjacking, and unauthorized resource loading.**

CSP headers tell the browser which sources of content are trusted. This is critical for preventing cross-site scripting attacks.

**Requirements:**
- Restrict script sources to same-origin only (no inline scripts where possible)
- Restrict frame ancestors (prevent clickjacking)
- Block mixed content (no HTTP resources on HTTPS pages)
- Allow Supabase, Stripe, and Vercel domains explicitly

**Implementation (Next.js):**
```typescript
// next.config.ts — CSP headers
const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://*.supabase.co",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co https://api.stripe.com",
              "frame-src https://js.stripe.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

**Note:** The `'unsafe-inline'` and `'unsafe-eval'` directives for `script-src` are required by Next.js in development. For production, consider using nonces or hashes to tighten the policy. Stripe's JS SDK requires `https://js.stripe.com` in both `script-src` and `frame-src`.

---

### 3. XSS Protection

**Prevent cross-site scripting attacks.**

React (used by Next.js) escapes all rendered content by default, which prevents most XSS vectors. However, explicit discipline is still required.

**Rules:**
- Never use `dangerouslySetInnerHTML` — if a use case arises, it must be reviewed and sanitized with a library like `DOMPurify`
- Always validate and sanitize user input server-side before storing in Supabase
- Use Zod schemas for all input validation (see Input Validation below)
- Never render raw HTML from user-submitted content
- Never construct HTML strings from user data

**Where XSS risk exists in Pitchcraft:**
- Pitch content fields (logline, synopsis, vision) — always rendered as text, never as HTML
- Custom section names — validate and escape
- Embedded video links — validate URL format, only allow YouTube/Vimeo domains

---

### 4. CORS (Cross-Origin Requests)

**Restrict who can access the API.**

Next.js App Router handles CORS through route handler headers. Supabase has its own CORS configuration in the Supabase dashboard.

**Requirements:**
- Only allow requests from your domain (no wildcard)
- Preflight requests validated
- Credentials sent in requests (cookies)

**Implementation:**
```typescript
// For any route handler that needs explicit CORS headers
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL!,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
```

**Note:** For most cases, Next.js route handlers on the same domain do not need explicit CORS headers. CORS is primarily relevant if the API is accessed from a different origin.

---

### 5. Rate Limiting

**Prevent API abuse.**

**Requirements:**
- Limit requests per IP: 100 requests per minute
- Limit requests per user: 1000 requests per hour
- Return 429 (Too Many Requests) when exceeded
- Include retry-after header

**Implementation (Next.js Middleware):**
```typescript
// middleware.ts — rate limiting logic (simplified)
// For production, use Vercel's built-in rate limiting (Edge Config)
// or a library like @upstash/ratelimit with Upstash Redis

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse, type NextRequest } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: false, // No tracking (CONSTRAINTS.md §4)
});

export async function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // ... continue with Supabase session refresh (see Session Management above)
}
```

**Alternative (Vercel built-in):** Vercel provides built-in DDoS protection and rate limiting on the Edge network. For MVP, Vercel's default protections may be sufficient before adding Upstash.

---

### 6. Input Validation

**Prevent injection attacks (SQL, XSS, etc.).**

**Requirements:**
- All inputs validated (type, length, format)
- No SQL queries built from user input (Supabase client uses parameterized queries)
- Output escaped (React handles this by default)
- File uploads validated (type, size)

**Implementation:**
```typescript
// Validate input with Zod in a route handler
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const pitchSchema = z.object({
  logline: z.string().min(10).max(200),
  synopsis: z.string().min(50).max(5000),
  budgetRange: z.enum(['under5k', '5k50k', '50k250k', '250k1m', '1m+']),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const result = pitchSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }

  // Supabase client uses parameterized queries internally
  const { data, error } = await supabase
    .from('pitches')
    .insert(result.data)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ pitch: data });
}
```

---

## Supabase Row Level Security (RLS)

**RLS is Pitchcraft's primary access control mechanism.**

Row Level Security is enforced at the database level in PostgreSQL. Even if application code has a bug, RLS ensures that creators can only access their own data. Every table that stores creator data must have RLS enabled with appropriate policies.

### Principles

- RLS is enabled on every table that contains creator data
- Policies are restrictive by default (deny all, then allow specific operations)
- The `auth.uid()` function identifies the current user from the Supabase JWT
- Public pitch viewing requires a separate policy tied to share link visibility
- Service role key (which bypasses RLS) is never exposed to the client

### Required Policies

**users table:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Creators can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

-- Creators can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);
```

**pitches table:**
```sql
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;

-- Creators can CRUD their own pitches
CREATE POLICY "Users can view own pitches"
  ON pitches FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own pitches"
  ON pitches FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own pitches"
  ON pitches FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own pitches"
  ON pitches FOR DELETE
  USING (auth.uid()::text = user_id);
```

**media table:**
```sql
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Creators can manage media for their own pitches
CREATE POLICY "Users can manage own media"
  ON media FOR ALL
  USING (
    pitch_id IN (
      SELECT id FROM pitches WHERE user_id = auth.uid()::text
    )
  );
```

**Public pitch viewing (via share links):**
```sql
-- Public pitches can be viewed by anyone (no auth required)
CREATE POLICY "Public pitches are viewable"
  ON pitches FOR SELECT
  USING (
    id IN (
      SELECT pitch_id FROM share_links
      WHERE visibility = 'public' AND deleted_at IS NULL
    )
  );
```

### Supabase Storage RLS

Supabase Storage also supports RLS-like policies via Storage Policies.

```sql
-- Creators can upload to their own folder
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pitch-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Creators can view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pitch-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public assets for public pitches (read-only)
CREATE POLICY "Public pitch assets are viewable"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pitch-assets-public'
  );
```

### RLS Checklist

- [ ] RLS enabled on `users` table
- [ ] RLS enabled on `pitches` table
- [ ] RLS enabled on `pitch_versions` table
- [ ] RLS enabled on `pitch_sections` table
- [ ] RLS enabled on `media` table
- [ ] RLS enabled on `share_links` table
- [ ] RLS enabled on `funding` table
- [ ] RLS enabled on `donations` table
- [ ] RLS enabled on `audit_log` table
- [ ] Storage policies configured for `pitch-assets` bucket
- [ ] Service role key is only used server-side (never in client bundle)
- [ ] Anon key is used for client-side Supabase calls (respects RLS)

---

## File Upload Security

### 1. File Type Validation

**Only allow safe file types.**

**Allowed:**
- Images: .jpg, .png, .webp (max 10MB)
- Videos: Links only (YouTube, Vimeo embeds, not uploaded)
- Documents: .pdf (max 50MB)

**NOT allowed:**
- .exe, .zip, .rar (executables)
- .html, .js (could contain malware)
- No file extensions (security risk)

**Implementation:**
```typescript
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES[file.type]) {
    return 'File type not allowed';
  }

  const maxSize = file.type === 'application/pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return 'File too large';
  }

  return null;
}
```

---

### 2. File Storage

**Store files safely in Supabase Storage.**

**Requirements:**
- Files stored in Supabase Storage (not local server)
- File names randomized (prevent path traversal)
- Access restricted by RLS policies (creator can only access their files)
- Files organized by user ID in storage bucket

**Implementation:**
```typescript
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  const validationError = validateFile(file);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  // Randomize file name to prevent path traversal
  const ext = ALLOWED_TYPES[file.type];
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${user.id}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('pitch-assets')
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ path: data.path });
}
```

---

## Monitoring & Logging

### 1. Error Logging

**Log errors securely (no sensitive data).**

**Requirements:**
- Use error monitoring (Sentry)
- Never log passwords, tokens, or credit cards
- Log enough context to debug (user ID, action, error message)
- Logs deleted after 30 days

**Implementation:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      userId: user.id, // OK (ID, not sensitive)
      action: 'create_pitch',
    },
    extra: {
      pitchId: pitchId, // OK (non-sensitive)
      // NOT: password, token, payment info
    },
  });
}
```

---

### 2. Audit Logging

**Track important actions (security audit).**

**Log these actions:**
- Login (success + failure)
- Password change
- Account deletion
- Payment received
- Supporter added
- Data exported
- Email bounced (prevents spam)

**NOT logged:**
- Every pitch edit (too noisy)
- Every view
- Every keystroke

**Implementation:**
```typescript
import { createClient } from '@/lib/supabase/server';

async function logAuditEvent(
  userId: string,
  action: string,
  ipAddress: string | null
) {
  const supabase = await createClient();

  await supabase.from('audit_log').insert({
    user_id: userId,
    action,
    ip_address: ipAddress,
  });
}
```

---

### 3. Uptime Monitoring

**Know if the service goes down.**

**Requirements:**
- Monitor endpoint every 5 minutes
- Alert if down for > 5 minutes
- Track uptime percentage

**Implementation:**
- Use UptimeRobot or Pingdom (free tier)
- Monitor: `GET /api/health` endpoint
- Alert to your email
- Vercel also provides deployment status and function monitoring in its dashboard

---

## Third-Party Services

### Allowed (GDPR-compliant):
- **Supabase:** Database, auth, file storage (GDPR compliant, DPA available, EU region available)
- **Vercel:** Hosting, edge network, serverless functions (GDPR compliant, DPA available)
- **Stripe:** Payments (they have Data Processing Agreement)
- **SendGrid / Mailgun:** Email (GDPR compliant)
- **Sentry:** Error monitoring (GDPR compliant, no session replay enabled)
- **GitHub:** Code repository (GDPR compliant)
- **Upstash:** Redis for rate limiting, if needed (GDPR compliant, optional)

### NOT Allowed (GDPR violations):
- **Google Analytics:** Tracks user behavior, uses cookies
- **Segment:** Sends data to multiple trackers
- **Facebook Pixel:** Behavioral tracking
- **Intercom / Drift:** Chat tools that access creator data
- **Custom CDN without agreement:** Could violate GDPR
- **Any tool that enables behavioral tracking** (CONSTRAINTS.md §4)

---

## Data Processing Agreement (DPA)

**If you hire contractors or share data with tools, you need a DPA.**

**Required DPA with:**
- Any tool that processes creator data (Supabase, Stripe, Sentry, email provider)
- Any contractor (freelancer, designer, etc.)
- Any server/hosting provider (Vercel, Supabase)

**What's in a DPA:**
- Data processor can only use data for your purposes
- Data processor must protect data
- Data processor can't sell/share data
- Data processor must allow audits
- Data processor must notify you of breaches

**Action:**
- Stripe: They provide DPA automatically
- Supabase: DPA available on request (and in enterprise plans)
- Vercel: DPA available through their legal page
- Sentry, SendGrid, etc.: Request DPA (most reputable tools have one)

---

## Incident Response

**If data is breached:**

**Immediate (within 24h):**
1. Investigate what happened
2. Determine scope (how many creators affected)
3. Stop the breach (fix the vulnerability)

**Within 72 hours:**
4. Notify affected creators (email + in-app notice)
5. Notify authorities if required (depends on severity)
6. Post-mortem (prevent it happening again)

**Public:**
7. Update security page (be transparent)
8. Document what happened
9. Communicate fix

---

## Security Checklist (Before Launch)

- [ ] HTTPS enabled (Vercel provides SSL automatically)
- [ ] Supabase Auth configured (email/password provider enabled)
- [ ] RLS policies enabled on all tables
- [ ] RLS policies tested (verify creator isolation)
- [ ] Supabase Storage policies configured
- [ ] Service role key restricted to server-side only
- [ ] Anon key used for client-side (respects RLS)
- [ ] Rate limiting enabled (middleware or Vercel built-in)
- [ ] Input validation on all route handlers (Zod)
- [ ] File upload validation (type + size)
- [ ] Supabase Storage configured with correct bucket policies
- [ ] CORS restricted (only your domain)
- [ ] CSP headers configured in next.config.ts
- [ ] X-Frame-Options set to DENY
- [ ] GDPR consent collected at signup
- [ ] Privacy Policy + Terms posted
- [ ] Delete account feature works
- [ ] Data export feature works (JSON, PDF)
- [ ] Error logging (Sentry) set up — no session replay
- [ ] Audit logging working
- [ ] Uptime monitoring active
- [ ] DPA with all third parties (Supabase, Vercel, Stripe, Sentry)
- [ ] Security tested (manual + automated)
- [ ] No hardcoded secrets (use .env.local)
- [ ] Environment variables in Vercel dashboard (not committed to repo)
- [ ] `dangerouslySetInnerHTML` not used anywhere
- [ ] No `eval()` or dynamic code execution from user input

---

## Ongoing Security Tasks

**Weekly:**
- Monitor error logs (Sentry)
- Check uptime alerts

**Monthly:**
- Review audit logs (suspicious activity?)
- Update dependencies (security patches)
- Backup database integrity check (Supabase handles automated backups)

**Quarterly:**
- Security audit (penetration testing)
- Review third-party security (do they still comply?)
- Privacy compliance check (GDPR still compliant?)
- Review RLS policies (still correct after schema changes?)

**Yearly:**
- Full security review
- Penetration test (hire professional)
- Compliance audit (GDPR, etc.)

---

## Notes

- **This is not legal advice.** Consult a lawyer on GDPR and Privacy Policy.
- **Security is ongoing.** Never stop thinking about threats.
- **Transparency builds trust.** Be honest if something goes wrong.
- **Defaults matter.** Make privacy the default, not an opt-in.
