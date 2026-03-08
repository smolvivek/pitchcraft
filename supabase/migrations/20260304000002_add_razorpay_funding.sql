-- Add Razorpay linked account ID to users (creator payout destination)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS razorpay_account_id TEXT;

-- Add Razorpay payment columns to donations
-- Stripe columns stay (historical). New donations use razorpay_ columns.
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

CREATE INDEX IF NOT EXISTS idx_donations_razorpay_order ON donations(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_payment ON donations(razorpay_payment_id);
