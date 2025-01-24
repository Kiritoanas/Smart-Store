/*
  # Add sample products to the store

  1. Changes
    - Add sample products to the products table
    - Ensure policies exist for security
*/

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text,
  created_at timestamptz DEFAULT now(),
  category text NOT NULL
);

-- Enable RLS if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Products are viewable by everyone'
  ) THEN
    CREATE POLICY "Products are viewable by everyone"
      ON products
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Only admins can modify products'
  ) THEN
    CREATE POLICY "Only admins can modify products"
      ON products
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;

-- Insert sample products if the table is empty
INSERT INTO products (name, description, price, stock, image_url, category)
SELECT * FROM (VALUES
  ('قلم حبر فاخر', 'قلم حبر فاخر مع ريشة ذهبية وتصميم أنيق', 149.99, 10, 'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=800&q=80', 'الأقلام'),
  ('دفتر ملاحظات جلد', 'دفتر ملاحظات بغلاف جلدي فاخر مع 200 صفحة', 89.99, 15, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 'الدفاتر'),
  ('طقم أقلام ملونة', 'مجموعة من 24 قلم تلوين احترافي', 45.99, 20, 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80', 'الألوان'),
  ('حقيبة مدرسية', 'حقيبة ظهر مريحة وعملية مع جيوب متعددة', 199.99, 5, 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80', 'الحقائب المدرسية'),
  ('طقم هندسي', 'طقم أدوات هندسية احترافي مع حافظة', 35.99, 30, 'https://images.unsplash.com/photo-1598900785046-3b18f5ae9271?auto=format&fit=crop&w=800&q=80', 'المساطر والأدوات الهندسية'),
  ('ورق رسم A4', 'حزمة ورق رسم عالي الجودة 100 ورقة', 25.99, 0, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80', 'الأوراق')
) AS new_products
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);