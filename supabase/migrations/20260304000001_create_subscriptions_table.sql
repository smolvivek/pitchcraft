-- Subscriptions table — tracks DodoPayments subscription state per user
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'studio')),
  dodo_subscription_id TEXT UNIQUE,
  dodo_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_dodo_id ON subscriptions(dodo_subscription_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- User can read their own subscription row
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Only service role can insert/update (webhook handler uses admin client)
-- No INSERT/UPDATE policies for authenticated users
