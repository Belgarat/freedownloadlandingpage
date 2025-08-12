-- Create anonymous_counters table for GDPR-compliant anonymous tracking (SQLite version)
CREATE TABLE IF NOT EXISTS anonymous_counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  total_visits INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_email_submissions INTEGER DEFAULT 0,
  total_goodreads_clicks INTEGER DEFAULT 0,
  total_substack_clicks INTEGER DEFAULT 0,
  total_publisher_clicks INTEGER DEFAULT 0,
  last_updated TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Insert initial counter record
INSERT OR IGNORE INTO anonymous_counters (key, total_visits, total_downloads, total_email_submissions, total_goodreads_clicks, total_substack_clicks, total_publisher_clicks)
VALUES ('anonymous_counters', 0, 0, 0, 0, 0, 0);
