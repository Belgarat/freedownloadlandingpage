-- Create anonymous_counters table for GDPR-compliant anonymous tracking
CREATE TABLE IF NOT EXISTS anonymous_counters (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  total_visits INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_email_submissions INTEGER DEFAULT 0,
  total_external_links INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial counter record
INSERT INTO anonymous_counters (key, total_visits, total_downloads, total_email_submissions, total_external_links)
VALUES ('anonymous_counters', 0, 0, 0, 0)
ON CONFLICT (key) DO NOTHING;

-- Add RLS policies for security
ALTER TABLE anonymous_counters ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access (no public access)
CREATE POLICY "Service role only" ON anonymous_counters
  FOR ALL USING (auth.role() = 'service_role'); 