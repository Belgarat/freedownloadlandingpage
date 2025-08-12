-- SEO configurations table
CREATE TABLE IF NOT EXISTS seo_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Meta tags
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  meta_author TEXT,
  meta_robots TEXT DEFAULT 'index, follow',
  meta_canonical TEXT,
  
  -- Open Graph
  og_title TEXT,
  og_description TEXT,
  og_type TEXT DEFAULT 'website',
  og_url TEXT,
  og_image TEXT,
  og_site_name TEXT,
  
  -- Twitter Cards
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  
  -- Structured data (JSON)
  structured_data TEXT, -- JSON object
  
  -- Sitemap settings
  sitemap_enabled BOOLEAN DEFAULT 1,
  sitemap_priority REAL DEFAULT 1.0,
  sitemap_changefreq TEXT DEFAULT 'weekly',
  
  -- Status
  is_active BOOLEAN DEFAULT 0,
  is_default BOOLEAN DEFAULT 0,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_configs_active ON seo_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_configs_default ON seo_configs(is_default);
