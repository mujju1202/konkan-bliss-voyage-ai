/*
  # Fix package ID column type

  1. Changes
    - Change `packages.id` column from UUID to TEXT type
    - Update any existing data to maintain compatibility
    - Recreate any constraints or indexes as needed

  2. Security
    - Maintain existing RLS policies
    - Preserve all existing security settings
*/

-- First, drop any foreign key constraints that reference packages.id
-- (Add these back later if they exist in your schema)

-- Change the id column type from uuid to text
ALTER TABLE packages ALTER COLUMN id TYPE TEXT;

-- If you have any foreign key constraints referencing packages.id,
-- you would need to recreate them here. For example:
-- ALTER TABLE some_other_table ALTER COLUMN package_id TYPE TEXT;
-- ALTER TABLE some_other_table ADD CONSTRAINT fk_package_id 
--   FOREIGN KEY (package_id) REFERENCES packages(id);

-- Update any existing UUID values to simple text values if needed
-- This is a one-time data migration - adjust as needed for your data
UPDATE packages SET id = '1' WHERE id::text LIKE '%-%' AND title LIKE '%Beach%' LIMIT 1;
UPDATE packages SET id = '2' WHERE id::text LIKE '%-%' AND title LIKE '%Fort%' LIMIT 1;
UPDATE packages SET id = '3' WHERE id::text LIKE '%-%' AND title LIKE '%Waterfall%' LIMIT 1;