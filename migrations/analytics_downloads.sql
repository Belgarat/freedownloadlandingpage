-- Analytics and Downloads Tables
-- This migration creates tables for tracking analytics and downloads

-- Analytics table for tracking user interactions
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  visitor_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  email TEXT,
  action TEXT,
  timestamp TEXT DEFAULT (datetime('now')),
  scroll_depth INTEGER,
  time_on_page INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Downloads table for tracking ebook downloads
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  visitor_id TEXT,
  email TEXT,
  token TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_action ON analytics(action);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_downloads_email ON downloads(email);
CREATE INDEX IF NOT EXISTS idx_downloads_token ON downloads(token);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at);
