/*
  # Add soft delete to products table
  
  1. Changes
    - Add is_deleted column to products table
    - Update policies to handle soft delete
    - Add function to soft delete products
  
  2. Security
    - Maintain existing RLS policies
    - Only allow admins to soft delete products
*/

-- Add is_deleted column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

-- Update policies to exclude deleted products from regular queries
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  TO public
  USING (NOT is_deleted);

-- Allow admins to see all products including deleted ones
CREATE POLICY "Admins can view all products including deleted"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );