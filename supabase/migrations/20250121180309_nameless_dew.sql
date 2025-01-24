/*
  # Fix Orders RLS Policies

  1. Changes
    - Add policy for authenticated users to create orders
    - Add policy for authenticated users to create order items
    - Modify admin policies to use proper role checking
  
  2. Security
    - Customers can only create orders
    - Admins retain full access to orders and items
    - Proper role checking using user metadata
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can do everything with orders" ON orders;
DROP POLICY IF EXISTS "Admins can do everything with order items" ON order_items;

-- Create new policies for orders
CREATE POLICY "Authenticated users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'user_metadata')::jsonb->>'role', '') = 'admin'
  );

CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'user_metadata')::jsonb->>'role', '') = 'admin'
  )
  WITH CHECK (
    coalesce((auth.jwt() ->> 'user_metadata')::jsonb->>'role', '') = 'admin'
  );

-- Create new policies for order items
CREATE POLICY "Authenticated users can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'user_metadata')::jsonb->>'role', '') = 'admin'
  );

CREATE POLICY "Admins can update order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'user_metadata')::jsonb->>'role', '') = 'admin'
  )
  WITH CHECK (
    coalesce((auth.jwt() ->> 'user_metadata')::jsonb->>'role', '') = 'admin'
  );