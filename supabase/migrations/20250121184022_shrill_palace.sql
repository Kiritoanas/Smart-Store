-- Drop type if exists (will cascade to dependent objects)
DROP TYPE IF EXISTS order_status CASCADE;

-- Create type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'order_status'
  ) THEN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
  END IF;
END $$;

-- Recreate tables that depend on the type
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  buyer_name text NOT NULL,
  buyer_phone text NOT NULL,
  buyer_address text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Customers can create orders" ON orders;
  DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
  DROP POLICY IF EXISTS "Admins can update orders" ON orders;
  
  -- Create new policies
  CREATE POLICY "Customers can create orders"
    ON orders
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can view their own orders"
    ON orders
    FOR SELECT
    TO authenticated
    USING (
      auth.uid() = user_id OR
      (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );

  CREATE POLICY "Admins can update orders"
    ON orders
    FOR UPDATE
    TO authenticated
    USING (
      (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
    );
END $$;