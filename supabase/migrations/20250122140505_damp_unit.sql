/*
  # Add Additional Product Columns

  1. Changes
    - Add unit column for product measurement units
    - Add supplier column for product suppliers
    - Add carton_quantity column for bulk packaging info
*/

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS unit text,
ADD COLUMN IF NOT EXISTS supplier text,
ADD COLUMN IF NOT EXISTS carton_quantity integer;

-- Update existing products with default values
UPDATE products
SET 
  unit = 'قطعة',
  supplier = 'الغرافة',
  carton_quantity = 1
WHERE unit IS NULL;