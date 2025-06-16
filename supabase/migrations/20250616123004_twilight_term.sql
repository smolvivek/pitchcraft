/*
  # Ultimate Fix for All Database Errors
  
  This migration completely resets the database schema and fixes all UUID and policy conflicts.
  
  1. Drops all existing tables and policies
  2. Recreates everything with proper UUID handling
  3. Sets up correct RLS policies
  4. No demo account references anywhere
*/

-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
DROP POLICY IF EXISTS "Users can read collaborated projects" ON projects;
DROP POLICY IF EXISTS "Collaborators can update projects" ON projects;
DROP POLICY IF EXISTS "Project owners can manage collaborators" ON collaborators;
DROP POLICY IF EXISTS "Users can read project collaborators" ON collaborators;
DROP POLICY IF EXISTS "Users can insert own outreach" ON outreach;
DROP POLICY IF EXISTS "Users can read own outreach" ON outreach;
DROP POLICY IF EXISTS "Users can update own outreach" ON outreach;

-- Drop all tables to start completely fresh
DROP TABLE IF EXISTS outreach CASCADE;
DROP TABLE IF EXISTS collaborators CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop and recreate the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table (simple, no foreign keys to avoid conflicts)
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  job_title text,
  company text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  genre text NOT NULL,
  logline text,
  synopsis text,
  concept text,
  status text DEFAULT 'draft',
  progress integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT projects_status_check CHECK (status IN ('draft', 'developing', 'pitch-ready', 'submitted')),
  CONSTRAINT projects_progress_check CHECK (progress >= 0 AND progress <= 100)
);

-- Create collaborators table
CREATE TABLE collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL,
  permissions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create outreach table
CREATE TABLE outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  company text,
  status text DEFAULT 'sent',
  sent_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT outreach_status_check CHECK (status IN ('sent', 'opened', 'responded', 'rejected'))
);

-- Add foreign key constraints
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;

-- Create fresh RLS policies
CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "projects_insert_policy"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_select_policy"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "projects_update_policy"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_policy"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "collaborators_all_policy"
  ON collaborators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "outreach_insert_policy"
  ON outreach FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "outreach_select_policy"
  ON outreach FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "outreach_update_policy"
  ON outreach FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX idx_outreach_project_id ON outreach(project_id);
CREATE INDEX idx_outreach_user_id ON outreach(user_id);

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();