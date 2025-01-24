/*
  # Fix products table RLS policies

  1. Changes
    - Drop existing RLS policies
    - Create new policies that properly check user metadata for admin role
    - Use proper syntax for checking user role in metadata

  2. Security
    - Public read access remains unchanged
    - Admin write access now properly checks user metadata
    - More secure role checking using raw_user_meta_data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Only admins can modify products" ON products;

-- Recreate the policies with proper role checking
CREATE POLICY "Products are viewable by everyone"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Only admins can modify products"
ON products
FOR ALL
TO authenticated
USING (
  coalesce(current_setting('request.jwt.claims', true)::jsonb->>'role', '') = 'admin' OR
  coalesce((current_setting('request.jwt.claims', true)::jsonb->>'user_metadata')::jsonb->>'role', '') = 'admin'
);