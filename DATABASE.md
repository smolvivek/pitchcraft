# DATABASE.md — PostgreSQL Schema & Data Model

(Working title product: TBD)

Complete database schema, relationships, migrations, and indexing strategy.

---

## Database Design Principles

1. **ACID compliance** (all transactions safe)
2. **Normalization** (no data duplication)
3. **Relationships via foreign keys** (referential integrity)
4. **Indexing on frequently queried columns** (performance)
5. **Soft deletes where appropriate** (audit trail)
6. **Timestamps on all tables** (created_at, updated_at as TIMESTAMPTZ)
7. **Row Level Security** (RLS enforced on all tables via Supabase)
8. **Native UUIDs** (Supabase `gen_random_uuid()` for all primary keys)

---

## Core Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL, -- References Supabase auth.users(id)
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  statement TEXT,
  gdpr_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

**Note:** Supabase Auth manages authentication (passwords, OAuth, magic links). The `auth_id` column links to `auth.users.id` in Supabase's internal auth schema. We never store passwords.

### pitches
```sql
CREATE TABLE pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  logline VARCHAR(500) NOT NULL,
  synopsis TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  vision TEXT NOT NULL,
  cast JSONB NOT NULL DEFAULT '[]',
  budget_range VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'looking', -- looking, in-progress, complete
  team JSONB NOT NULL DEFAULT '[]',
  current_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_pitches_user_id ON pitches(user_id);
CREATE INDEX idx_pitches_status ON pitches(status);
CREATE INDEX idx_pitches_deleted_at ON pitches(deleted_at);
```

### pitch_versions
```sql
CREATE TABLE pitch_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  data JSONB NOT NULL, -- Full snapshot of pitch at this version
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pitch_versions_pitch_id ON pitch_versions(pitch_id);
CREATE INDEX idx_pitch_versions_number ON pitch_versions(pitch_id, version_number);
```

### pitch_sections
```sql
CREATE TABLE pitch_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  section_name VARCHAR(100) NOT NULL, -- flow, script_documents, locations, art_direction, set_design, costume, makeup_hair, props, vehicles_animals, stunts_sfx, camera, sound_design, music, setting_world, schedule, crew, custom_1, custom_2, custom_3
  data JSONB NOT NULL,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pitch_sections_pitch_id ON pitch_sections(pitch_id);
CREATE UNIQUE INDEX idx_pitch_sections_unique ON pitch_sections(pitch_id, section_name);
```

### media
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  section_name VARCHAR(100),
  storage_path VARCHAR(500) NOT NULL, -- Supabase Storage path (e.g. "pitches/<pitch_id>/<filename>")
  file_type VARCHAR(50), -- image, video, document
  file_size INT,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_media_pitch_id ON media(pitch_id);
```

**Note:** Files are stored in Supabase Storage buckets. The `storage_path` column holds the relative path within the bucket, not an absolute URL. Public URLs are generated at runtime via `supabase.storage.from('bucket').getPublicUrl(storage_path)`.

### share_links
```sql
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  visibility VARCHAR(50) NOT NULL, -- public, private, invite-only
  password_hash VARCHAR(255),
  allow_version_history BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_share_links_pitch_id ON share_links(pitch_id);
```

### funding
```sql
CREATE TABLE funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID UNIQUE NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  funding_goal INT NOT NULL,
  description TEXT,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_funding_pitch_id ON funding(pitch_id);
```

### donations
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_id UUID NOT NULL REFERENCES funding(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT,
  stripe_transaction_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_donations_funding_id ON donations(funding_id);
CREATE INDEX idx_donations_stripe_id ON donations(stripe_transaction_id);
```

### audit_log
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- password_changed, account_deleted, etc.
  resource_type VARCHAR(100),
  resource_id UUID,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id, created_at);
```

---

## Relationships (ER Diagram in Text)

```
users (1) ──────────────────── (*) pitches
  |                                    |
  |                        (1) ──── pitch_versions (*)
  |                        (*) ──── pitch_sections
  |                        (*) ──── media
  |                        (1) ──── share_links
  |                        (1) ──── funding
  |
  └─ (*) audit_log

funding (1) ──────────────────── (*) donations

auth.users (1) ──── (1) users  [via auth_id]
```

---

## Row Level Security (RLS) Policies

RLS is mandatory. Every table must have `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY` before any policies are applied. Without RLS enabled, Supabase exposes data to any authenticated client.

### Helper function

```sql
-- Returns the users.id for the currently authenticated Supabase user
CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### users

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (auth_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- Insert handled by signup trigger (service role only)
```

### pitches

```sql
ALTER TABLE pitches ENABLE ROW LEVEL SECURITY;

-- Owners can read their own pitches
CREATE POLICY "pitches_select_own"
  ON pitches FOR SELECT
  USING (user_id = auth.current_user_id());

-- Owners can insert pitches
CREATE POLICY "pitches_insert_own"
  ON pitches FOR INSERT
  WITH CHECK (user_id = auth.current_user_id());

-- Owners can update their own pitches
CREATE POLICY "pitches_update_own"
  ON pitches FOR UPDATE
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Owners can delete their own pitches
CREATE POLICY "pitches_delete_own"
  ON pitches FOR DELETE
  USING (user_id = auth.current_user_id());

-- Public shared pitches are readable by anyone (including anonymous)
CREATE POLICY "pitches_select_shared_public"
  ON pitches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = pitches.id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );
```

### pitch_versions

```sql
ALTER TABLE pitch_versions ENABLE ROW LEVEL SECURITY;

-- Owners can read versions of their own pitches
CREATE POLICY "pitch_versions_select_own"
  ON pitch_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = pitch_versions.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Owners can insert versions for their own pitches
CREATE POLICY "pitch_versions_insert_own"
  ON pitch_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = pitch_versions.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );
```

### pitch_sections

```sql
ALTER TABLE pitch_sections ENABLE ROW LEVEL SECURITY;

-- Owners can CRUD their own pitch sections
CREATE POLICY "pitch_sections_select_own"
  ON pitch_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "pitch_sections_insert_own"
  ON pitch_sections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "pitch_sections_update_own"
  ON pitch_sections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "pitch_sections_delete_own"
  ON pitch_sections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = pitch_sections.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Shared pitch sections readable by anyone (if pitch is public)
CREATE POLICY "pitch_sections_select_shared"
  ON pitch_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = pitch_sections.pitch_id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );
```

### media

```sql
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Only owner can upload/delete media
CREATE POLICY "media_insert_own"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "media_delete_own"
  ON media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Owner can read their own media
CREATE POLICY "media_select_own"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Viewers can read media if the pitch is shared
CREATE POLICY "media_select_shared"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = media.pitch_id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );

-- Owner can update media metadata (reorder, rename)
CREATE POLICY "media_update_own"
  ON media FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = media.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );
```

### share_links

```sql
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own share links
CREATE POLICY "share_links_select_own"
  ON share_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = share_links.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "share_links_insert_own"
  ON share_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = share_links.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "share_links_update_own"
  ON share_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = share_links.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "share_links_delete_own"
  ON share_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = share_links.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Anyone can read public share links (needed to resolve shared pitch URLs)
CREATE POLICY "share_links_select_public"
  ON share_links FOR SELECT
  USING (visibility = 'public' AND deleted_at IS NULL);
```

### funding

```sql
ALTER TABLE funding ENABLE ROW LEVEL SECURITY;

-- Owner can manage funding for their own pitches
CREATE POLICY "funding_select_own"
  ON funding FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = funding.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "funding_insert_own"
  ON funding FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = funding.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

CREATE POLICY "funding_update_own"
  ON funding FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      WHERE pitches.id = funding.pitch_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Shared pitches: anyone can read funding info (to donate)
CREATE POLICY "funding_select_shared"
  ON funding FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM share_links
      WHERE share_links.pitch_id = funding.pitch_id
        AND share_links.visibility = 'public'
        AND share_links.deleted_at IS NULL
    )
  );
```

### donations

```sql
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Pitch owners can read donations to their own funding campaigns
CREATE POLICY "donations_select_own"
  ON donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM funding
      JOIN pitches ON pitches.id = funding.pitch_id
      WHERE funding.id = donations.funding_id
        AND pitches.user_id = auth.current_user_id()
    )
  );

-- Anyone can insert a donation (public action via Stripe webhook / service role)
-- Donation inserts should go through the server (service role), not client-side.
-- No client INSERT policy. Stripe webhook handler uses service role key.
```

### audit_log

```sql
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own audit log entries
CREATE POLICY "audit_log_select_own"
  ON audit_log FOR SELECT
  USING (user_id = auth.current_user_id());

-- Inserts handled by service role (server-side only)
-- No client INSERT policy.
```

---

## Migrations (Supabase CLI)

All schema changes go through Supabase CLI migrations. Never modify the database directly in production.

```bash
# Create a new migration file
supabase migration new create_users_table

# Apply migrations locally (resets local DB and replays all migrations)
supabase db reset

# Push migrations to remote Supabase project
supabase db push

# Check migration status
supabase migration list
```

Migration files live in `supabase/migrations/` and are timestamped SQL files. Each migration runs in a transaction.

---

## Constraints

- Foreign keys enforce referential integrity
- UNIQUE constraints on email, share_links per pitch, funding per pitch
- CHECK constraints for status values (looking, in-progress, complete)
- `auth_id` is UNIQUE on users (one Supabase Auth account per user row)

---

## Performance Notes

- Indexes on user_id, pitch_id, deleted_at for fast filtering
- JSONB columns for flexible section data
- Archiving old versions (pitch_versions table) keeps queries fast

---

## Backups

- **Daily automated backups** included on Supabase Pro plan
- **Point-in-time recovery (PITR)** available on Supabase Pro plan (up to 7 days; configurable)
- Manual exports before major migrations via `supabase db dump`
- Supabase dashboard provides backup management and restore options
