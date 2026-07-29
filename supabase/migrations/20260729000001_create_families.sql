-- Create families table and family code generation function

CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  family_code TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generate a unique family code in the format "EDDY-XXXX" (4 alphanumeric chars)
CREATE OR REPLACE FUNCTION generate_family_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT;
  suffix TEXT;
  i INT;
BEGIN
  LOOP
    suffix := '';
    FOR i IN 1..4 LOOP
      suffix := suffix || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
    END LOOP;
    code := 'EDDY-' || suffix;

    EXIT WHEN NOT EXISTS (SELECT 1 FROM families WHERE family_code = code);
  END LOOP;

  RETURN code;
END;
$$;
