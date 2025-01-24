-- Check for existing functions and drop if necessary
DROP FUNCTION IF EXISTS check_user_role(text);

-- Create helper function for role checking
CREATE OR REPLACE FUNCTION check_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    current_setting('request.jwt.claims', true)::jsonb->>'role' = required_role OR
    (current_setting('request.jwt.claims', true)::jsonb->'user_metadata'->>'role')::text = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;