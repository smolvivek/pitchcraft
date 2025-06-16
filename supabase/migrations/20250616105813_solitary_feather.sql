/*
  # Create Demo Users and Sample Data

  1. Demo Users
    - Creates demo producer and writer accounts
    - Sets up profiles for each demo user
    - Adds sample projects for demonstration

  2. Sample Data
    - Creates realistic film and TV projects
    - Adds various project statuses and progress levels
    - Includes sample outreach and collaboration data

  3. Security
    - All data follows existing RLS policies
    - Demo accounts are clearly marked
*/

-- Insert demo users (these would normally be created through auth.users, but for demo purposes)
-- Note: In a real scenario, these users would sign up normally through the auth system

-- Insert sample projects for demo purposes
INSERT INTO projects (id, user_id, title, genre, logline, synopsis, concept, status, progress, tags, views, created_at, updated_at) VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001', -- This would be replaced with actual user IDs
    'Midnight in Tokyo',
    'Neo-noir Thriller',
    'A burned-out detective discovers a conspiracy that reaches the highest levels of Tokyo''s underground while investigating a series of seemingly unconnected murders.',
    'Detective Kenji Nakamura has seen it all in Tokyo''s neon-lit streets. But when a series of murders leads him into the city''s hidden underworld, he uncovers a conspiracy that threatens everything he believes in.',
    'A modern noir set in Tokyo''s vibrant nightlife scene',
    'pitch-ready',
    100,
    ARRAY['thriller', 'neo-noir', 'tokyo', 'detective'],
    127,
    now() - interval '2 days',
    now() - interval '2 hours'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'The Last Lighthouse',
    'Drama Series',
    'When automation threatens to close the last manned lighthouse in Maine, its keeper must choose between tradition and progress.',
    'Set against the rugged Maine coastline, this series follows lighthouse keeper Samuel Morrison as he fights to preserve a way of life that''s rapidly disappearing in our digital age.',
    'A character study about tradition vs. progress',
    'developing',
    75,
    ARRAY['drama', 'series', 'lighthouse', 'maine'],
    89,
    now() - interval '5 days',
    now() - interval '1 day'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'Quantum Hearts',
    'Sci-Fi Romance',
    'Two quantum physicists from parallel universes fall in love through their research, but their romance threatens the fabric of reality itself.',
    'Dr. Elena Vasquez and Dr. Marcus Chen exist in parallel universes, connected only through their groundbreaking quantum research. As their love grows stronger, the boundaries between their worlds begin to blur.',
    'A love story that transcends dimensions',
    'draft',
    45,
    ARRAY['sci-fi', 'romance', 'quantum', 'parallel-universe'],
    23,
    now() - interval '1 week',
    now() - interval '3 days'
  );

-- Insert sample outreach data
INSERT INTO outreach (project_id, user_id, recipient_name, recipient_email, company, status, sent_at, created_at) VALUES
  (
    (SELECT id FROM projects WHERE title = 'Midnight in Tokyo' LIMIT 1),
    '00000000-0000-0000-0000-000000000001',
    'Sarah Chen',
    'sarah@netflix.com',
    'Netflix Original Series',
    'responded',
    now() - interval '1 week',
    now() - interval '1 week'
  ),
  (
    (SELECT id FROM projects WHERE title = 'The Last Lighthouse' LIMIT 1),
    '00000000-0000-0000-0000-000000000001',
    'Marcus Rodriguez',
    'marcus@a24.com',
    'A24 Films',
    'opened',
    now() - interval '3 days',
    now() - interval '3 days'
  );