-- Add type field to email_templates table
-- This migration adds a type field to distinguish between download and followup templates

-- Add type column to email_templates table
ALTER TABLE email_templates ADD COLUMN type TEXT DEFAULT 'download';

-- Update existing templates to have appropriate types
UPDATE email_templates SET type = 'download' WHERE name LIKE '%download%' OR name LIKE '%Download%';
UPDATE email_templates SET type = 'followup' WHERE name LIKE '%follow%' OR name LIKE '%Follow%' OR name LIKE '%reminder%' OR name LIKE '%Reminder%';

-- Create index on type for better performance
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
