/*
  # Update Product Policies

  This migration ensures proper policy setup for the products table by:
  1. Safely dropping existing policies
  2. Creating new policies with proper role checks
  3. Using both JWT claim locations for role verification
*/

-- Function to check if policies exist
CREATE OR REPLACE FUNCTION check_policy_exists(policy_name text, table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = policy_name 
    AND tablename = table_name
  );
END;
$$ LANGUAGE plpgsql;

-- Safely drop existing policies
DO $$ 
BEGIN
  IF check_policy_exists('Anyone can view products', 'products') THEN
    DROP POLICY "Anyone can view products" ON products;
  END IF;
  
  IF check_policy_exists('Admins can add products', 'products') THEN
    DROP POLICY "Admins can add products" ON products;
  END IF;
  
  IF check_policy_exists('Admins can update products', 'products') THEN
    DROP POLICY "Admins can update products" ON products;
  END IF;
  
  IF check_policy_exists('Admins can delete products', 'products') THEN
    DROP POLICY "Admins can delete products" ON products;
  END IF;
END $$;

-- Create new policies with proper role checks
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can add products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

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

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );