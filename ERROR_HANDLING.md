# ERROR_HANDLING.md — Error Strategy & Recovery

(Working title product: TBD)

This document defines how errors are handled, what users see, and how developers fix them.

---

## Error Principle

**Users should never see raw errors. Developers should see all errors.**

---

## Error Categories

### 1. Validation Errors (400)
**What:** User input is invalid (empty field, wrong format, etc.)
**User sees:** "Logline required" or "Invalid email format"
**Dev sees:** Full validation error in logs
**Example:**
```javascript
// Frontend validation
if (!logline || logline.length === 0) {
  throw new ValidationError('Logline required');
}

// User sees: "Logline required" (friendly)
// Dev sees: ValidationError with full stack trace (Sentry)
```

### 2. Authentication Errors (401)
**What:** User not logged in, token expired, wrong password
**User sees:** "Please login" or "Your session expired"
**Dev sees:** Auth error in logs
**Auto-action:** Redirect to login

### 3. Permission Errors (403)
**What:** User doesn't own the pitch, can't delete, etc.
**User sees:** "You don't have permission"
**Dev sees:** Permission denied in logs

### 4. Not Found Errors (404)
**What:** Pitch doesn't exist, share link broken
**User sees:** "Pitch not found"
**Dev sees:** 404 with resource ID in logs

### 5. Server Errors (500)
**What:** Database crash, Stripe fails, S3 unreachable
**User sees:** "Something went wrong, try again"
**Dev sees:** Full error + stack trace in Sentry

---

## Error Handling by Layer

### Frontend (User-Facing)

**Good error messages:**
- Clear and actionable
- Non-technical language
- Suggest next steps

**Examples:**
```
❌ Bad: "Form validation error: field logline missing"
✅ Good: "Please enter a one-sentence pitch"

❌ Bad: "CORS error: cross-origin request blocked"
✅ Good: "We're having connection issues. Please refresh and try again"

❌ Bad: "TypeError: Cannot read property 'id' of undefined"
✅ Good: "Something went wrong. Please refresh the page"
```

**How to show errors:**
```javascript
// Show error message
<div className="error-message" role="alert">
  Logline required
</div>

// Or in form field
<input
  onChange={handleChange}
  onBlur={validate}
  aria-invalid={hasError}
  aria-describedby={hasError ? 'error' : undefined}
/>
{hasError && <span id="error">Logline required</span>}
```

### Backend (Internal)

**All errors logged to Sentry with context:**
```javascript
try {
  await createPitch(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      userId: user.id,
      action: 'create_pitch'
    },
    extra: {
      pitchData: data
    }
  });
  
  // User sees friendly message
  throw new APIError('Could not create pitch', 500);
}
```

### Database (Errors to Avoid)

**Never:** Let database errors bubble to user
**Instead:** Catch and wrap

```javascript
// Don't do this:
const pitch = await db.query('SELECT * FROM pitches WHERE id = $1', [id]);
// Error: Error: column "id" does not exist

// Do this:
try {
  const pitch = await db.query('SELECT * FROM pitches WHERE id = $1', [id]);
  return pitch;
} catch (error) {
  if (error.code === '42703') {
    // Column doesn't exist - database error, not user fault
    logger.error('Database schema error', error);
    throw new ServerError('Database error - contact support');
  }
  throw error;
}
```

---

## Error Messages Template

| Scenario | User Message | HTTP Status | Log Level |
|----------|--------------|------------|-----------|
| Empty required field | "Logline required" | 400 | INFO |
| Wrong password | "Password incorrect" | 401 | INFO |
| Not logged in | "Please login first" | 401 | INFO |
| Don't own pitch | "You can't edit this pitch" | 403 | INFO |
| Pitch not found | "Pitch not found" | 404 | INFO |
| Database error | "Something went wrong" | 500 | ERROR |
| Stripe payment failed | "Payment failed, try again" | 400 | WARN |
| Storage upload failed | "Upload failed, try again" | 500 | ERROR |
| Email sending failed | "Confirmation email failed" | 500 | ERROR |

---

## Logging Standards

### Levels

**DEBUG:** Development only
```javascript
logger.debug('Query took 145ms', { query, duration });
```

**INFO:** Important app events
```javascript
logger.info('User created pitch', { userId, pitchId });
```

**WARN:** Something unexpected but recoverable
```javascript
logger.warn('Stripe rate limit hit', { retryAfter });
```

**ERROR:** Something broke, user was impacted
```javascript
logger.error('Payment processing failed', { error, donationId });
```

### What to Log

```javascript
// Good: Structured context
logger.error('Database query failed', {
  query: 'SELECT * FROM pitches',
  userId: 'user_123',
  error: error.message,
  duration: 5000
});

// Bad: Unclear
logger.error('Error: something bad happened');

// Never log
logger.error('password:', user.password); // NEVER
logger.error('token:', jwt.token);        // NEVER
```

---

## Common Errors & Fixes

| Error | User Should See | Developer Should Fix |
|-------|-----------------|-------------------|
| Network timeout | "Connection lost, refresh" | Check API response time |
| Database down | "Service unavailable" | Restart database, check backups |
| Invalid JWT token | "Please login again" | Token generation logic |
| Storage bucket not found | "Upload failed, try again" | Check Supabase Storage bucket config |
| Rate limit exceeded | "Slow down, try in 1 minute" | Increase rate limit or cache |
| Stripe invalid key | "Payment failed" | Check STRIPE_SECRET_KEY in .env |

---

## Recovery Strategies

### Transient Errors (Temporary)
**What:** Network timeout, rate limit, temporary outage
**Strategy:** Retry automatically

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries > 0 && isTransient(error)) {
      await sleep(1000); // Wait 1 second
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

### Permanent Errors (Won't Recover)
**What:** Invalid input, resource not found, permission denied
**Strategy:** Fail immediately, show user message

```javascript
if (!logline) {
  throw new ValidationError('Logline required');
  // Don't retry, user must fix input
}
```

### Partial Failures (Some worked, some didn't)
**What:** Upload 3 images, 1 fails
**Strategy:** Succeed partially, warn about what failed

```javascript
const results = await Promise.allSettled([
  uploadImage(image1),
  uploadImage(image2),
  uploadImage(image3)
]);

const failed = results.filter(r => r.status === 'rejected');
if (failed.length > 0) {
  notify.warn(`${failed.length} images failed to upload`);
}
```

---

## Monitoring & Alerts

### Sentry Dashboard
```
Watch for:
- Error rate spike (more errors than usual)
- New error types (first time seeing this error)
- Critical errors (500s, database errors)
```

### Alert Thresholds
**Error rate > 5%:** Immediate Slack alert
**Error rate > 10%:** Page (phone call)

### Error Response Time
Check logs:
```bash
# See latest errors (Vercel)
vercel logs --follow | grep ERROR

# Or check Sentry dashboard for structured error reports
```

---

## Implementation Rules

**Frontend (React components, client-side):**
- Catch all API errors and show friendly inline messages
- Validate before sending to backend
- Don't log user data or secrets

**Backend (Next.js API routes, server actions):**
- Log all errors to Sentry with context
- Never return raw database errors to user
- Implement retry logic for external APIs (Stripe, Supabase Storage)

**Always:**
- No secrets in error messages
- No stack traces in user-facing errors
- Test error cases (not just happy path)
- Inline feedback at point of contact (no floating toasts)

---

**Good error handling = happy users + quick debugging.**

