/*
  # Fix RLS policies for profiles table

  1. Security Changes
    - Drop existing restrictive INSERT policy for profiles
    - Create new INSERT policy that allows profile creation during signup
    - The policy allows INSERT when the user ID matches the authenticated user ID
    - This fixes the "new row violates row-level security policy" error during signup

  2. Policy Details
    - Keep existing SELECT and UPDATE policies (they work correctly)
    - Replace INSERT policy to handle the signup flow properly
    - Ensure users can only create profiles for themselves
*/

-- Drop the existing INSERT policy that's too restrictive
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;

-- Create a new INSERT policy that works during signup
-- This allows authenticated users to insert a profile where the id matches their auth.uid()
CREATE POLICY "profiles_insert_own" 
  ON profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Ensure the policy is properly applied by refreshing the table's RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;