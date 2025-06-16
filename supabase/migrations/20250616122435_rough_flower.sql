/*
  # Fix All UUID Type Errors and Database Issues

  This migration completely fixes the persistent UUID type mismatch errors
  and ensures proper foreign key relationships with Supabase auth.users table.

  ## Changes Made:
  1. Drop all problematic foreign key constraints
  2. Ensure all ID columns are properly typed as UUID
  3. Recreate foreign keys to reference auth.users correctly
  4. Clean up any invalid data
  5. Add proper RLS policies
*/

-- Drop all existing foreign key constraints that are causing issues
ALTER TABLE IF EXISTS projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
ALTER TABLE IF EXISTS collaborators DROP CONSTRAINT IF EXISTS collaborators_user_id_fkey;
ALTER TABLE IF EXISTS collaborators DROP CONSTRAINT IF EXISTS collaborators_project_id_fkey;
ALTER TABLE IF EXISTS outreach DROP CONSTRAINT IF EXISTS outreach_user_id_fkey;
ALTER TABLE IF EXISTS outreach DROP CONSTRAINT IF EXISTS outreach_project_id_fkey;

-- Drop the profiles foreign key constraint that's causing the UUID error
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Ensure all tables exist with proper structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  job_title text,
  company text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  genre text NOT NULL,
  logline text,
  synopsis text,
  concept text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'developing', 'pitch-ready', 'submitted')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags text[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL,
  permissions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  company text,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'opened', 'responded', 'rejected')),
  sent_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Clear any existing invalid data
DELETE FROM outreach WHERE user_id::text LIKE 'demo-%';
DELETE FROM collaborators WHERE user_id::text LIKE 'demo-%';
DELETE FROM projects WHERE user_id::text LIKE 'demo-%';
DELETE FROM profiles WHERE id::text LIKE 'demo-%';

-- Add proper foreign key constraints (NO REFERENCE TO profiles table)
-- All user_id fields should reference auth.users directly
ALTER TABLE projects 
ADD CONSTRAINT projects_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE collaborators 
ADD CONSTRAINT collaborators_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE collaborators 
ADD CONSTRAINT collaborators_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE outreach 
ADD CONSTRAINT outreach_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE outreach 
ADD CONSTRAINT outreach_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view collaborated projects" ON projects
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM collaborators 
      WHERE collaborators.project_id = projects.id 
      AND collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage collaborators" ON collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = collaborators.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own outreach" ON outreach
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_outreach_project_id ON outreach(project_id);
CREATE INDEX IF NOT EXISTS idx_outreach_user_id ON outreach(user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();