-- A/B Testing Tables (SQLite)
-- Creazione tabella ab_tests per SQLite
CREATE TABLE IF NOT EXISTS ab_tests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  traffic_split INTEGER DEFAULT 50,
  start_date TEXT,
  end_date TEXT,
  target_element TEXT,
  target_selector TEXT,
  conversion_goal TEXT, -- JSON stored as TEXT in SQLite
  statistical_significance REAL DEFAULT 0,
  total_visitors INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Creazione tabella ab_variants per SQLite
CREATE TABLE IF NOT EXISTS ab_variants (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  test_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  value TEXT NOT NULL,
  css_class TEXT,
  css_style TEXT,
  visitors INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate REAL DEFAULT 0,
  is_control INTEGER DEFAULT 0, -- BOOLEAN as INTEGER in SQLite
  is_winner INTEGER DEFAULT 0, -- BOOLEAN as INTEGER in SQLite
  confidence_level REAL,
  improvement REAL,
  traffic_split REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE
);

-- Creazione tabella ab_test_results per SQLite
CREATE TABLE IF NOT EXISTS ab_test_results (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  test_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  timestamp TEXT DEFAULT (datetime('now')),
  conversion INTEGER DEFAULT 0, -- BOOLEAN as INTEGER in SQLite
  conversion_value REAL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES ab_variants(id) ON DELETE CASCADE
);

-- Creazione tabella ab_visitor_assignments per SQLite
CREATE TABLE IF NOT EXISTS ab_visitor_assignments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  visitor_id TEXT NOT NULL,
  test_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  assigned_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES ab_variants(id) ON DELETE CASCADE,
  UNIQUE(visitor_id, test_id)
);

-- Creazione indici per performance
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_visitor_id ON ab_test_results(visitor_id);
CREATE INDEX IF NOT EXISTS idx_ab_variants_test_id ON ab_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_visitor_assignments_visitor_id ON ab_visitor_assignments(visitor_id);
CREATE INDEX IF NOT EXISTS idx_ab_visitor_assignments_test_id ON ab_visitor_assignments(test_id);

-- Inserimento di alcuni dati di test
INSERT OR IGNORE INTO ab_tests (id, name, description, type, status, target_element, target_selector, conversion_goal) VALUES
('test-1', 'CTA Button Color Test', 'Testing different button colors', 'cta_button_color', 'running', 'Download Button', 'button[type="submit"]', '{"type": "email_submit"}'),
('test-2', 'Headline Text Test', 'Testing different headline texts', 'headline_text', 'draft', 'Main Headline', 'h1', '{"type": "email_submit"}');

INSERT OR IGNORE INTO ab_variants (id, test_id, name, description, value, css_class, is_control, traffic_split) VALUES
('variant-1', 'test-1', 'Control (Blue)', 'Original blue button', 'blue', 'bg-blue-600', 1, 50),
('variant-2', 'test-1', 'Variant A (Green)', 'Green button variant', 'green', 'bg-green-600', 0, 50),
('variant-3', 'test-2', 'Control', 'Original headline', 'Fish Cannot Carry Guns', '', 1, 50),
('variant-4', 'test-2', 'Variant A', 'More descriptive headline', 'Fish Cannot Carry Guns: Speculative Fiction Stories', '', 0, 50);
