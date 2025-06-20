/*
  # Fix package ID type from UUID to TEXT

  1. Changes
    - Alter packages.id column from UUID to TEXT type
    - Update existing UUID values to simple text IDs
    - Maintain data integrity during migration

  2. Notes
    - PostgreSQL doesn't support LIMIT in UPDATE statements
    - Using subqueries to handle selective updates
*/

-- First, create a temporary column to store new text IDs
ALTER TABLE packages ADD COLUMN new_id TEXT;

-- Update the new_id column with simple text values based on existing data
-- Using subqueries instead of LIMIT to avoid syntax errors
UPDATE packages 
SET new_id = '1' 
WHERE id = (
  SELECT id FROM packages 
  WHERE title ILIKE '%beach%' OR title ILIKE '%tarkarli%'
  ORDER BY created_at ASC 
  LIMIT 1
);

UPDATE packages 
SET new_id = '2' 
WHERE id = (
  SELECT id FROM packages 
  WHERE title ILIKE '%fort%' OR title ILIKE '%sindhudurg%'
  ORDER BY created_at ASC 
  LIMIT 1
);

UPDATE packages 
SET new_id = '3' 
WHERE id = (
  SELECT id FROM packages 
  WHERE title ILIKE '%waterfall%' OR title ILIKE '%amboli%'
  ORDER BY created_at ASC 
  LIMIT 1
);

UPDATE packages 
SET new_id = '4' 
WHERE id = (
  SELECT id FROM packages 
  WHERE title ILIKE '%malvan%' AND new_id IS NULL
  ORDER BY created_at ASC 
  LIMIT 1
);

UPDATE packages 
SET new_id = '5' 
WHERE id = (
  SELECT id FROM packages 
  WHERE title ILIKE '%vengurla%' AND new_id IS NULL
  ORDER BY created_at ASC 
  LIMIT 1
);

-- For any remaining packages without new_id, assign sequential numbers
UPDATE packages 
SET new_id = (
  SELECT CAST(ROW_NUMBER() OVER (ORDER BY created_at) + 5 AS TEXT)
  FROM packages p2 
  WHERE p2.id = packages.id
)
WHERE new_id IS NULL;

-- Drop the old id column and rename new_id to id
ALTER TABLE packages DROP CONSTRAINT packages_pkey;
ALTER TABLE packages DROP COLUMN id;
ALTER TABLE packages RENAME COLUMN new_id TO id;

-- Add primary key constraint back
ALTER TABLE packages ADD PRIMARY KEY (id);

-- Ensure all packages have valid text IDs
UPDATE packages SET id = CAST(ROW_NUMBER() OVER (ORDER BY created_at) AS TEXT) WHERE id IS NULL;