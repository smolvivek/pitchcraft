/*
  # Complete Database Reset and Fix

  This migration completely resets the database to fix all policy conflicts and UUID errors.
  
  1. Drops all existing tables and policies
  2. Creates fresh schema with proper UUID handling
  3. Sets up working RLS policies
  4. Enables real user authentication
  5. Includes FilmFreeway festival database
*/

-- Drop everything completely
DROP TABLE IF EXISTS outreach CASCADE;
DROP TABLE IF EXISTS collaborators CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table (no foreign key to auth.users to avoid conflicts)
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

-- Create festivals table for FilmFreeway integration
CREATE TABLE festivals (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  deadline date NOT NULL,
  early_deadline date,
  fee text NOT NULL,
  early_fee text,
  prestige text NOT NULL CHECK (prestige IN ('A-List', 'Major', 'Regional', 'Genre', 'Student')),
  genres text[] NOT NULL,
  description text NOT NULL,
  website text,
  submission_platform text DEFAULT 'FilmFreeway',
  acceptance_rate text,
  average_entries text,
  benefits text[],
  requirements text[],
  created_at timestamptz DEFAULT now()
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
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with unique names
CREATE POLICY "profile_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profile_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profile_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "project_insert_own"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_select_own"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "project_update_own"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "project_delete_own"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "collaborator_manage_own_projects"
  ON collaborators FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborators.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "outreach_insert_own"
  ON outreach FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "outreach_select_own"
  ON outreach FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "outreach_update_own"
  ON outreach FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "festivals_select_all"
  ON festivals FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX idx_outreach_project_id ON outreach(project_id);
CREATE INDEX idx_outreach_user_id ON outreach(user_id);
CREATE INDEX idx_festivals_genres ON festivals USING gin(genres);
CREATE INDEX idx_festivals_deadline ON festivals(deadline);

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert festival data for FilmFreeway integration
INSERT INTO festivals (id, name, location, deadline, early_deadline, fee, early_fee, prestige, genres, description, website, acceptance_rate, average_entries, benefits, requirements) VALUES
('sundance-2024', 'Sundance Film Festival', 'Park City, Utah', '2024-09-15', '2024-08-15', '$75', '$65', 'A-List', 
 ARRAY['Drama', 'Documentary', 'Indie'], 
 'Premier independent film festival showcasing innovative storytelling', 
 'https://sundance.org', '2%', '15,000+',
 ARRAY['Industry networking', 'Distribution opportunities', 'Press coverage'],
 ARRAY['US premiere required', 'Max 120 minutes', 'English or subtitled']),

('sxsw-2024', 'SXSW Film Festival', 'Austin, Texas', '2024-08-25', '2024-07-25', '$50', '$40', 'Major',
 ARRAY['Comedy', 'Horror', 'Sci-Fi', 'Music'],
 'Innovative festival celebrating film, music, and interactive media',
 'https://sxsw.com', '5%', '8,000+',
 ARRAY['Tech industry connections', 'Music crossover', 'Emerging talent focus'],
 ARRAY['US or Texas premiere preferred', 'Max 180 minutes', 'Recent production']),

('tribeca-2024', 'Tribeca Film Festival', 'New York City', '2024-01-15', '2024-12-15', '$65', '$55', 'Major',
 ARRAY['Drama', 'Documentary', 'Short Film'],
 'Prestigious NYC festival supporting independent filmmakers',
 'https://tribecafilm.com', '4%', '6,000+',
 ARRAY['NYC industry access', 'Emerging filmmaker support', 'Distribution connections'],
 ARRAY['US premiere preferred', 'Completed after 2023', 'Professional production']),

('fantastic-fest-2024', 'Fantastic Fest', 'Austin, Texas', '2024-06-01', '2024-05-01', '$35', '$25', 'Genre',
 ARRAY['Horror', 'Sci-Fi', 'Fantasy', 'Thriller'],
 'Premier genre film festival for horror, sci-fi, and fantasy',
 'https://fantasticfest.com', '8%', '3,000+',
 ARRAY['Genre film networking', 'Cult following', 'Industry genre connections'],
 ARRAY['Genre films only', 'US premiere preferred', 'Recent completion']),

('cannes-2024', 'Cannes Film Festival', 'Cannes, France', '2024-03-01', '2024-02-01', '€0', '€0', 'A-List',
 ARRAY['Drama', 'Art House', 'International'],
 'World''s most prestigious film festival',
 'https://festival-cannes.com', '0.1%', '5,000+',
 ARRAY['Global recognition', 'Sales opportunities', 'Awards prestige'],
 ARRAY['World premiere required', 'Professional production', 'Invitation only']),

('tiff-2024', 'Toronto International Film Festival', 'Toronto, Canada', '2024-07-15', '2024-06-15', '$100 CAD', '$85 CAD', 'A-List',
 ARRAY['Drama', 'Documentary', 'International'],
 'Major festival known for launching Oscar contenders',
 'https://tiff.net', '3%', '7,000+',
 ARRAY['Industry screenings', 'Awards season launch', 'International sales'],
 ARRAY['North American premiere preferred', 'Professional quality', 'Recent completion']);