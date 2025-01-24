/*
  # Update product table policies

  1. Security Updates
    - Refine policies for better access control
    - Add explicit policies for each operation type
    - Use role-based access control

  2. Changes
    - Add separate policies for each CRUD operation
    - Ensure proper admin role checking
    - Maintain public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Only admins can modify products" ON products;

-- Create refined policies
-- Allow public read access
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Allow admins to insert products
CREATE POLICY "Admins can add products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Allow admins to update products
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Allow admins to delete products
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );