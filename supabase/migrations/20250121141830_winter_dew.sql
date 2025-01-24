/*
  # Update admin permissions

  1. Changes
    - Update user metadata to set admin role for specific email
    - Uses raw_user_meta_data to store role information

  2. Security
    - Only updates role for specific email
    - Maintains existing RLS policies
*/

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'anasalya4@gmail.com';