# DEBT.md — Technical Debt Ledger

## Purpose

This file tracks code that works today but will cause problems tomorrow. Technical debt is not broken code — it's design decisions that made sense at the time but accumulate interest as the codebase grows. Ignoring this file means surprises during the next major feature.

## Rules

1. **Be specific.** Reference exact files and line numbers.
2. **Categorize debt.** Not all debt is equal: some is strategic (intentional), some is accidental.
3. **Estimate interest.** What does this debt cost if ignored for 3 more months?
4. **No shame, just inventory.** Fast shipping creates debt. This file makes it visible.
5. **Revisit monthly.** Clear one item per sprint.

---

## Categories

- **Logic Debt** — duplicated business rules that will diverge
- **Structure Debt** — code organized in ways that resist change
- **Safety Debt** — missing guards that will eventually cause data loss or errors
- **Dependency Debt** — libraries or patterns that need replacing
- **Test Debt** — critical paths with no automated verification

---

## Active Debt

### D-01. Subscription Tier Check Is Duplicated in 5 Places
**Category:** Logic Debt
**Severity:** High
**Files:**
- `app/api/pitches/route.ts` (create)
- `app/api/pitches/[id]/duplicate/route.ts`
- `app/api/ai/text/route.ts`
- `app/api/ai/image/route.ts`
- `app/dashboard/page.tsx`
- `app/dashboard/pitches/[id]/edit/page.tsx`
**What:** The logic `subscription?.status === 'cancelled' && current_period_end < now → tier = 'free'` is copy-pasted verbatim across all these files. When the cancellation logic changes (e.g., handling `past_due`, adding grace periods), every copy must be updated. One will be missed.
**Fix:** Extract to `lib/subscriptions/getTier.ts`:
```ts
export async function getUserTier(userId: string, admin: SupabaseClient): Promise<'free' | 'pro' | 'studio'>
```
All routes call this helper. One place to change.
**Interest:** Each new tier check adds another copy. First time the cancellation logic needs updating, at least one will be missed.

---

### D-02. Profile Lookup (`auth_id → public.users`) Duplicated in 8+ API Routes
**Category:** Logic Debt
**Severity:** Medium
**Files:** `create/route.ts`, `duplicate/route.ts`, `delete/route.ts`, `media/[id]/route.ts`, `share/route.ts`, `verify/route.ts`, and others
**What:** Every protected API route does the same three steps:
1. `supabase.auth.getUser()`
2. `admin.from('users').select('id').eq('auth_id', user.id).single()`
3. Check `if (!profile) return 404`
This is ~10 lines of identical code in every route.
**Fix:** Extract to `lib/auth/getAuthProfile.ts`:
```ts
export async function getAuthProfile(request: NextRequest): Promise<{ user; profile } | NextResponse>
```
Return either the profile or an error response. Routes call this at the top instead of duplicating the 10-line block.
**Interest:** If the `users` table schema changes (e.g., renaming `auth_id`), every route needs updating. High surface area.

---

### D-03. `pitch_sections` Insert in Create Page Uses Client-Side Supabase
**Category:** Structure Debt
**Severity:** Medium
**File:** `app/dashboard/pitches/create/page.tsx` line 616
**What:** After the pitch is created via `POST /api/pitches`, optional sections are inserted directly from the browser using `supabase.from('pitch_sections').insert(...)`. The pitch creation is now server-side (correct), but section creation is still client-side. This means:
- Section creation bypasses any future tier checks on sections
- If the API route is expanded to handle sections, the client code becomes orphaned
- Two different code paths for the same "save pitch" operation
**Fix:** Extend `POST /api/pitches` to accept `sections[]` in the request body and handle insert server-side. Or create `POST /api/pitches/[id]/sections`.
**Interest:** If custom section limits are ever enforced server-side, this client path bypasses them.

---

### D-04. `PitchViewPasswordWrapper.tsx` Is Now Dead Code
**Category:** Structure Debt
**Severity:** Low
**File:** `components/pitch-view/PitchViewPasswordWrapper.tsx`
**What:** This file exports nothing (just a comment explaining it's retired). It's been emptied but not deleted. Dead files accumulate confusion.
**Fix:** Delete the file. Update any imports if they exist.
**Interest:** Low. Just noise.

---

### D-05. Edit Page Fetches Subscription Tier via `useEffect` + Fetch — Inconsistent Pattern
**Category:** Structure Debt
**Severity:** Low
**File:** `app/dashboard/pitches/[id]/edit/page.tsx`
**What:** The edit page is a client component that fetches its own subscription tier via `useEffect(() => fetch('/api/subscriptions/status'))`. The dashboard page (server component) fetches tier server-side. Two different patterns for the same data. The edit page has a race condition window where `tier` defaults to `'free'` before the fetch completes — during which custom sections show as locked even for Pro users.
**Fix:** Convert edit page to a server component that fetches tier server-side and passes it as a prop. Or use a shared context/hook for tier.
**Interest:** Race condition causes Pro users to briefly see the "upgrade" lock on custom sections before tier loads. UX flash.

---

### D-06. `media/[id]/route.ts` GET Still Generates 1-Hour Signed URLs
**Category:** Safety Debt
**Severity:** Medium
**File:** `app/api/media/[id]/route.ts` line 164
**What:** The pitch view page (`/p/[id]`) was fixed to use 7-day signed URLs. But the editor uses `GET /api/media/[id]` to fetch signed URLs for existing media. This route still uses `3600` expiry. Media loaded in the editor expires after 1 hour during long editing sessions.
**Fix:** Change expiry from `3600` to `604800` (7 days) in `media/[id]/route.ts`.
**Interest:** Creators in long editing sessions see broken images after 1 hour. Confusion, assumed data loss.

---

### D-07. No Database Transactions for Multi-Table Writes
**Category:** Safety Debt
**Severity:** Medium
**Files:** `app/api/pitches/route.ts`, `app/api/pitches/[id]/duplicate/route.ts`
**What:** Pitch creation inserts into `pitches`, then `pitch_sections`, then possibly `media` records — as separate sequential operations. If the process crashes between inserts, the database is left in a partial state (pitch exists, sections don't). Supabase supports Postgres transactions via RPC, but none are used.
**Fix:** Wrap multi-step inserts in a Supabase RPC (stored procedure) that runs in a transaction. Or add a cleanup step: if sections insert fails, delete the pitch row.
**Interest:** Rare today (network errors mid-insert). At scale, some percentage of creations will be partial. Orphaned pitch rows accumulate.

---

### D-08. `CUSTOM_SECTION_KEYS` Constant Is Defined in Two Places
**Category:** Logic Debt
**Severity:** Low
**Files:** `lib/sections.ts`, `app/dashboard/pitches/create/page.tsx` (imports from lib), `app/dashboard/pitches/[id]/edit/page.tsx` (imports from lib)
**What:** This is fine today — `CUSTOM_SECTION_KEYS` is exported from `lib/sections.ts`. But the tier-check logic for custom sections in `Sidebar.tsx` uses the prop `tier` to gate them, while the actual keys are a separate constant. If a new custom section key is added (e.g., `custom_4`), two things need updating: the constant AND the tier/limit logic in Sidebar. These are not co-located.
**Fix:** Co-locate tier limits with section definitions in `lib/sections.ts`:
```ts
export const SECTION_LIMITS = { free: 0, pro: 3, studio: 3 }
```
**Interest:** Low today. First time the custom section count changes, it'll take two edits instead of one.

---

### D-09. `app/(auth)` Routes Have No Middleware Protection
**Category:** Structure Debt
**Severity:** Low
**What:** `middleware.ts` was deleted. There is no redirect for authenticated users who visit `/login` or `/signup`. A logged-in user who navigates to `/login` sees the login form instead of being redirected to `/dashboard`. Minor UX issue but also indicates no auth middleware at all.
**Fix:** Restore a minimal `middleware.ts` that redirects authenticated users away from auth pages. Supabase SSR provides `createServerClient` for middleware.
**Interest:** Logged-in users can get confused navigating to auth pages. Also, the absence of any middleware means future auth rules require per-page implementation.

---

### D-10. Version History API Exists but Has No UI
**Category:** Structure Debt
**Severity:** Medium
**File:** `app/api/pitches/[id]/versions/route.ts`
**What:** The API exists, returns version list. No UI component reads it. The editor's auto-save presumably creates versions (or intends to), but there's no way for a creator to view or restore them. This is listed in BUILD_SEQUENCE.md presumably but is orphaned API code.
**Fix:** Build the version history UI: a sidebar or modal showing version list, with ability to preview and restore. Or document clearly that this API is aspirational and not yet wired up.
**Interest:** Version history is a Pro feature and a paid upgrade driver. Every day without the UI is revenue that could be captured from creators iterating on pitches.

---

### D-11. Donation Total in `PitchViewFunding` Is Optimistically Incremented Client-Side
**Category:** Safety Debt
**Severity:** Low
**File:** `components/pitch-view/PitchViewFunding.tsx` lines 162-169
**What:** After a successful donation, the component updates `funding.total_raised` and `donor_count` optimistically in local state — adding the donation client-side. If the user refreshes, the real total is fetched from DB. If two donors donate simultaneously, each sees a different number. This is fine for MVP but diverges from truth.
**Fix:** After successful verify, re-fetch the funding data from `/api/funding/public/${pitchId}` instead of manually incrementing state.
**Interest:** Low today. At any meaningful donation volume, the displayed total will briefly diverge.

---

## Cleared Debt

*Resolved debt items move here with the commit that resolved them.*

| ID | Description | Cleared in |
|----|-------------|------------|
| — | — | — |

---

## Debt Scoring

Each quarter, tally:
- `Active items` × `Severity weight` = Debt Score
- Critical = 4, High = 3, Medium = 2, Low = 1
- If score > 30: dedicate one sprint to debt clearing before next feature

**Current score:** D-01(3) + D-02(2) + D-03(2) + D-04(1) + D-05(1) + D-06(2) + D-07(2) + D-08(1) + D-09(1) + D-10(2) + D-11(1) = **18**
