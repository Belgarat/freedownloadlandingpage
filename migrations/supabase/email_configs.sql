-- Email configurations table
CREATE TABLE IF NOT EXISTS email_configs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Sender information
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  reply_to TEXT,
  
  -- Templates (JSON)
  templates JSONB, -- JSON object containing all templates
  
  -- Settings
  template_expiry_hours INTEGER DEFAULT 24,
  max_retries INTEGER DEFAULT 3,
  tracking BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_configs_active ON email_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_email_configs_default ON email_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_email_configs_sender ON email_configs(sender_email);

-- Trigger to update updated_at
CREATE TRIGGER update_email_configs_updated_at BEFORE UPDATE ON email_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
