/*
  # Fix Orders RLS Policies

  1. Changes
    - Update RLS policies to use proper role checking from user metadata
    - Add policies for customers to create orders and order items
    - Add policies for admins to manage orders and order items
  
  2. Security
    - Customers can only create orders
    - Admins have full access to orders and items
    - Proper role checking using user metadata
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view order items" ON order_items;
DROP POLICY IF EXISTS "Admins can update order items" ON order_items;

-- Create new policies for orders
CREATE POLICY "Customers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins have full access to orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Create new policies for order items
CREATE POLICY "Customers can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins have full access to order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );