-- Email configurations table
CREATE TABLE IF NOT EXISTS email_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Sender information
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  reply_to TEXT,
  
  -- Templates (JSON)
  templates TEXT, -- JSON object containing all templates
  
  -- Settings
  template_expiry_hours INTEGER DEFAULT 24,
  max_retries INTEGER DEFAULT 3,
  tracking BOOLEAN DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT 0,
  is_default BOOLEAN DEFAULT 0,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_configs_active ON email_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_email_configs_default ON email_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_email_configs_sender ON email_configs(sender_email);
