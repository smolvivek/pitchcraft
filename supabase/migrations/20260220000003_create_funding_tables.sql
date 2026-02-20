-- Funding table (one per pitch, optional)
CREATE TABLE IF NOT EXISTS funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID UNIQUE NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
  funding_goal INT NOT NULL,
  description TEXT,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_funding_pitch_id ON funding(pitch_id);

ALTER TABLE funding ENABLE ROW LEVEL SECURITY;

-- Owner can manage funding for their own pitches
CREATE POLICY "funding_select_own"
  ON funding FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = funding.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "funding_insert_own"
  ON funding FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = funding.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "funding_update_own"
  ON funding FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = funding.pitch_id
        AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "funding_delete_own"
  ON funding FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pitches
      JOIN users ON users.id = pitches.user_id
      WHERE pitches.id = funding.pitch_id
        AND users.auth_id = auth.uid()
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

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_id UUID NOT NULL REFERENCES funding(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT,
  razorpay_payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_donations_funding_id ON donations(funding_id);
CREATE INDEX idx_donations_razorpay_payment ON donations(razorpay_payment_id);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Pitch owners can read donations to their own funding campaigns
CREATE POLICY "donations_select_own"
  ON donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM funding
      JOIN pitches ON pitches.id = funding.pitch_id
      JOIN users ON users.id = pitches.user_id
      WHERE funding.id = donations.funding_id
        AND users.auth_id = auth.uid()
    )
  );

-- Donation inserts go through the server (service role) after payment verification.
-- No client INSERT policy.
