-- Add stretch goals and rewards to funding table
ALTER TABLE funding ADD COLUMN IF NOT EXISTS stretch_goals JSONB DEFAULT '[]'::jsonb;
ALTER TABLE funding ADD COLUMN IF NOT EXISTS rewards JSONB DEFAULT '[]'::jsonb;

-- stretch_goals format: [{ "amount": 10000, "description": "Add original score" }]
-- rewards format: [{ "amount": 500, "title": "Supporter Credit", "description": "Your name in the credits" }]
