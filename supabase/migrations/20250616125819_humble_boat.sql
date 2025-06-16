/*
  # Fix profiles table RLS policy for signup

  1. Security Changes
    - Drop existing restrictive INSERT policy on profiles table
    - Create new INSERT policy that allows profile creation during signup
    - Ensure users can only create profiles for themselves
    - Keep existing SELECT and UPDATE policies intact

  2. Changes Made
    - Allow authenticated users to insert profiles where the profile ID matches their auth ID
    - This fixes the "new row violates row-level security policy" error during signup
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "profile_insert_own" ON profiles;

-- Create a new INSERT policy that allows profile creation during signup
CREATE POLICY "profiles_insert_own" 
  ON profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Ensure the SELECT policy exists and is properly named
DROP POLICY IF EXISTS "profile_select_own" ON profiles;
CREATE POLICY "profiles_select_own" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Ensure the UPDATE policy exists and is properly named  
DROP POLICY IF EXISTS "profile_update_own" ON profiles;
CREATE POLICY "profiles_update_own" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);