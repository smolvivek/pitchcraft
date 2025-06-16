/*
  # Complete Fix for All UUID and Authentication Errors

  1. Database Schema
    - Drop ALL existing constraints and tables
    - Recreate everything with proper UUID types
    - Remove all demo account references
    - Fix foreign key relationships

  2. Security
    - Enable RLS on all tables
    - Create proper policies for authenticated users
    - Ensure proper user ID handling

  3. Data Cleanup
    - Remove any invalid demo data
    - Ensure clean slate for real users
*/

-- Drop everything and start fresh
DROP TABLE IF EXISTS outreach CASCADE;
DROP TABLE IF EXISTS collaborators CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the update function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table (NO foreign key to auth.users to avoid conflicts)
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

-- Add foreign key constraints (projects reference auth.users, others reference projects)
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

-- Create RLS policies
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read collaborated projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collaborators
      WHERE collaborators.project_id = projects.id
      AND collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collaborators
      WHERE collaborators.project_id = projects.id
      AND collaborators.user_id = auth.uid()
      AND 'edit' = ANY(collaborators.permissions)
    )
  );

CREATE POLICY "Project owners can manage collaborators"
  ON collaborators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read project collaborators"
  ON collaborators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborators.project_id
      AND (projects.user_id = auth.uid() OR collaborators.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own outreach"
  ON outreach FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own outreach"
  ON outreach FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own outreach"
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