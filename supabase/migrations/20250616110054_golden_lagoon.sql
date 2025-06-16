/*
  # Demo Data Migration

  1. Demo Data Setup
    - Creates sample profiles for demo users
    - Inserts sample projects with proper foreign key relationships
    - Adds sample outreach data
    - Ensures all foreign key constraints are satisfied

  2. Security
    - All data uses proper UUID references
    - Maintains referential integrity
*/

-- First, insert demo profiles (these represent users who have signed up)
-- Note: In production, these would be created through the auth system
INSERT INTO profiles (id, name, email, job_title, company, bio, created_at, updated_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Demo Creator',
    'demo@pitchcraft.com',
    'Screenwriter & Producer',
    'Independent',
    'Passionate storyteller with 10+ years experience in film and television. Specializes in character-driven narratives and genre-bending stories.',
    now() - interval '30 days',
    now() - interval '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Sarah Chen',
    'sarah@netflix.com',
    'Development Executive',
    'Netflix Original Series',
    'Development executive focused on international content and emerging voices in storytelling.',
    now() - interval '60 days',
    now() - interval '5 days'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Marcus Rodriguez',
    'marcus@a24.com',
    'Producer',
    'A24 Films',
    'Independent film producer with a passion for unique, character-driven stories.',
    now() - interval '45 days',
    now() - interval '10 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects for demo purposes
INSERT INTO projects (id, user_id, title, genre, logline, synopsis, concept, status, progress, tags, views, created_at, updated_at) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Midnight in Tokyo',
    'Neo-noir Thriller',
    'A burned-out detective discovers a conspiracy that reaches the highest levels of Tokyo''s underground while investigating a series of seemingly unconnected murders.',
    'Detective Kenji Nakamura has seen it all in Tokyo''s neon-lit streets. But when a series of murders leads him into the city''s hidden underworld, he uncovers a conspiracy that threatens everything he believes in. Set against the backdrop of Tokyo''s vibrant nightlife, this neo-noir thriller explores themes of corruption, redemption, and the price of truth in a city where nothing is as it seems.',
    'A modern noir set in Tokyo''s vibrant nightlife scene, exploring the intersection of traditional Japanese culture and modern urban decay.',
    'pitch-ready',
    100,
    ARRAY['thriller', 'neo-noir', 'tokyo', 'detective', 'conspiracy'],
    127,
    now() - interval '2 days',
    now() - interval '2 hours'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'The Last Lighthouse',
    'Drama Series',
    'When automation threatens to close the last manned lighthouse in Maine, its keeper must choose between tradition and progress.',
    'Set against the rugged Maine coastline, this series follows lighthouse keeper Samuel Morrison as he fights to preserve a way of life that''s rapidly disappearing in our digital age. Each episode explores the stories of the people whose lives have been touched by the lighthouse over the decades, weaving together past and present in a meditation on change, loss, and what we choose to preserve.',
    'A character study about tradition vs. progress, exploring themes of isolation, community, and the human need for purpose.',
    'developing',
    75,
    ARRAY['drama', 'series', 'lighthouse', 'maine', 'tradition'],
    89,
    now() - interval '5 days',
    now() - interval '1 day'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Quantum Hearts',
    'Sci-Fi Romance',
    'Two quantum physicists from parallel universes fall in love through their research, but their romance threatens the fabric of reality itself.',
    'Dr. Elena Vasquez and Dr. Marcus Chen exist in parallel universes, connected only through their groundbreaking quantum research. As their love grows stronger, the boundaries between their worlds begin to blur, forcing them to choose between their love and the stability of the multiverse. A mind-bending romance that explores the nature of reality, choice, and connection.',
    'A love story that transcends dimensions, combining hard science fiction with emotional depth.',
    'draft',
    45,
    ARRAY['sci-fi', 'romance', 'quantum', 'parallel-universe', 'physics'],
    23,
    now() - interval '1 week',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample outreach data
INSERT INTO outreach (id, project_id, user_id, recipient_name, recipient_email, company, status, sent_at, responded_at, created_at) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Sarah Chen',
    'sarah@netflix.com',
    'Netflix Original Series',
    'responded',
    now() - interval '1 week',
    now() - interval '5 days',
    now() - interval '1 week'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Marcus Rodriguez',
    'marcus@a24.com',
    'A24 Films',
    'opened',
    now() - interval '3 days',
    NULL,
    now() - interval '3 days'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Emily Watson',
    'emily@hbo.com',
    'HBO Max',
    'sent',
    now() - interval '1 day',
    NULL,
    now() - interval '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample collaborators data
INSERT INTO collaborators (id, project_id, user_id, role, permissions, created_at) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Development Executive',
    ARRAY['view', 'comment'],
    now() - interval '1 week'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Producer',
    ARRAY['view', 'edit', 'comment'],
    now() - interval '3 days'
  )
ON CONFLICT (id) DO NOTHING;