-- Add missing columns to projects table
-- Run this in Supabase SQL Editor

-- Add url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'url'
    ) THEN
        ALTER TABLE projects ADD COLUMN url text;
    END IF;
END $$;

-- Add github_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'github_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN github_url text;
    END IF;
END $$;

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN image_url text;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;
