# Brand Implementation Roadmap

## What Changed

Brand personality is now locked. All new code must follow [BRAND.md](./BRAND.md) and updated [DESIGN.md](./DESIGN.md).

---

## Immediate Tasks (Priority Order)

### 1. Update All Copy: "Pitch" → "Project"

**Files to update:**
- `/app/page.tsx` - Landing page hero/CTA
- `/app/dashboard/page.tsx` - Dashboard heading, empty state
- `/app/dashboard/pitches/create/page.tsx` - Page heading, button text
- `/app/dashboard/pitches/[id]/edit/page.tsx` - Page heading, delete modal
- `/components/ui/Card.tsx` - PitchCard component (keep internal name, update displayed copy)
- `/COPY.md` - Global find/replace "pitch" → "project" (except in file names/technical context)

**Terminology:**
- "Create Pitch" → "Create Project"
- "Your Pitches" → "Your Projects"
- "Edit Pitch" → "Edit Project"
- "Delete pitch?" → "Delete project?"
- "Pitch is live" → "Your work is ready. Now the hard part: sharing it."

**Database/code:** Keep `pitches` table name and internal references. Only user-facing copy changes.

---

### 2. Apply Ogilvy + British Dry Humor Voice

**Update these specific messages per BRAND.md:**

**Landing page (`/app/page.tsx`):**
- Current hero needs refinement (copy TBD - user to provide final version)
- Remove production metadata overlay (TC/fps/ISO) - it's pretentious without purpose

**Dashboard empty state (`/app/dashboard/page.tsx`):**
```tsx
// Current (generic)
"Your first pitch starts here"

// New (approved)
"Nothing here. Time to fix that."
// OR
"No projects yet. Rectify this."
```

**After save (`/app/dashboard/pitches/[id]/edit/page.tsx`):**
```tsx
// Current
"Saved successfully!"

// New
"Saved."
```

**Delete confirmation modal:**
```tsx
// Current
"Delete [name]? This action can't be undone."

// Keep (this is already correct)
```

**Character limit error:**
```tsx
// New
"Too long. Edit."
```

---

### 3. Fix Terracotta Usage (TE Strategy)

**Audit all pop colour usage and enforce rules from BRAND.md:**

**✅ KEEP pop colour for:**
1. Sidebar active section border (`/app/dashboard/pitches/create/page.tsx`)
2. Primary CTA buttons (ONE per page)
3. Progress indicators and completion checkmarks
4. Focus states on form inputs

**❌ REMOVE pop colour from:**
1. Hover states - replace with `bg-surface` (#D0D2C5)
2. Secondary/tertiary buttons - keep monochrome
3. Any decorative usage
4. Multiple buttons on same page (only primary gets pop colour)

**Files to audit:**
- `/components/ui/Button.tsx` - Check hover states
- `/components/ui/Input.tsx` - Focus states OK, check hovers
- `/components/ui/Badge.tsx` - Status badges stay as-is (red/amber/green)
- `/app/dashboard/pitches/create/page.tsx` - Sidebar active state OK
- `/app/page.tsx` - Landing page (check for over-use)

---

### 4. Update Status Terminology

**Find/replace across codebase:**
- "looking" → "development"
- "in-progress" → "production"
- "complete" → "completed"

**Files already updated:**
- ✅ `/lib/types/pitch.ts`
- ✅ `/components/ui/Badge.tsx`
- ✅ `/components/ui/StatusRadio.tsx`
- ✅ `/app/design/page.tsx`

**Still need to check:**
- `/app/dashboard/page.tsx` - Status display in pitch cards
- `/COPY.md` - Status labels and descriptions

---

### 5. Landing Page Refinement

**Issues to fix:**

1. **Remove production metadata overlay** (`TC 00:00:00:00 / 24fps / ISO 800`)
   - It's decoration without purpose
   - Delete from `/app/page.tsx`

2. **Simplify feature section** (too much literature)
   - Current: Three dense columns with paragraphs
   - New: TBD - user will provide simplified structure

3. **Improve marquee visual** (currently bland)
   - Current: Plain text scroll
   - Consider: Film leader aesthetic with frame markers `▌ Documentary ▌ Feature Film ▌`
   - Or typography variation (bold/regular alternation)
   - User feedback pending

4. **Hero copy refinement**
   - Current emphasizes "funding" too much
   - Should focus on presentation/sharing convenience
   - User to provide final approved copy

5. **Background animation decision**
   - User unsure if needed
   - Recommendation: Start without, add only if page feels static
   - If added: very subtle gradient drift (60s loop, color temperature shift)

---

### 6. Animation Quality Bar

**All animations must meet: Lando Norris / Wall-E / Ghibli quality**

**Current animations to review:**
- Landing page split-text reveal - **KEEP** (meets quality bar)
- Marquee scroll - **REFINE** (needs visual improvement)
- Button hovers - **AUDIT** (check if too generic)
- Form transitions - **TBD** (not yet implemented)

**New animations to implement (from COPY.md):**

**Tier 1 (ship now):**
1. Section completion checkmark draw (300ms SVG animation)
2. Progress bar spring overshoot (5% overshoot, settle back)
3. Budget segment selection (scale + pop colour slide-in)
4. Status radio dot scale (0 → 1.2x spring, settle to 1.0x)

**Tier 2 (polish later):**
5. Section transition title card (A24-style)
6. Character counter odometer roll
7. Empty state illustration draw-in
8. Create success checkmark + fade

**Implementation files:**
- `/components/ui/ProgressBar.tsx` - Add spring physics
- `/components/ui/BudgetSegments.tsx` - Add scale + slide animation
- `/components/ui/StatusRadio.tsx` - Add dot scale animation
- Create new `/components/animations/` directory for reusable animations

---

## Testing Checklist

After implementing changes:

- [ ] All user-facing copy says "project" not "pitch"
- [ ] Voice matches BRAND.md examples (Ogilvy + British dry humor)
- [ ] Terracotta only used per TE strategy (sparingly, structurally)
- [ ] Status terminology updated (development/production/completed)
- [ ] Production metadata overlay removed from landing page
- [ ] Empty states use approved copy
- [ ] Save confirmations use approved copy
- [ ] No condescending language anywhere ("wisely", "who matters")
- [ ] TypeScript builds without errors
- [ ] Landing page compiles and renders
- [ ] Dashboard functions correctly
- [ ] Create/edit pages work with new copy

---

## Files Modified Summary

**Created:**
- `/BRAND.md` (new brand personality document)
- `/ROADMAP_BRAND_IMPLEMENTATION.md` (this file)

**Updated:**
- `/DESIGN.md` (added pop colour rules, voice reference, motion quality bar)

**Need to update:**
- `/app/page.tsx` (remove metadata, await copy refinement)
- `/app/dashboard/page.tsx` (pitch→project, empty state copy)
- `/app/dashboard/pitches/create/page.tsx` (pitch→project)
- `/app/dashboard/pitches/[id]/edit/page.tsx` (pitch→project, save copy)
- `/components/ui/Button.tsx` (audit pop colour hovers)
- `/components/landing/*.tsx` (marquee refinement, feature section simplification)
- `/COPY.md` (global pitch→project, status terminology)

---

## Open Questions for User

1. **Landing page hero copy** - What should replace current "Fund your vision" focus?
2. **Feature section layout** - How to simplify the three-column literature dump?
3. **Marquee visual treatment** - Film leader aesthetic or typography variation?
4. **Background animation** - Add subtle gradient drift or keep static?

---

## Next Steps

1. User provides final landing page copy direction
2. Sonnet implements priority tasks 1-4 (copy updates, pop colour audit, status terminology)
3. User reviews and approves
4. Sonnet implements landing page refinements (task 5)
5. Sonnet implements Tier 1 animations (task 6)
6. Test and validate
7. Move forward with features (all new code follows BRAND.md)
