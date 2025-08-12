-- SEO configurations table
CREATE TABLE IF NOT EXISTS seo_configs (
  id SERIAL PRIMARY KEY,
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
  structured_data JSONB, -- JSON object
  
  -- Sitemap settings
  sitemap_enabled BOOLEAN DEFAULT true,
  sitemap_priority REAL DEFAULT 1.0,
  sitemap_changefreq TEXT DEFAULT 'weekly',
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_configs_active ON seo_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_configs_default ON seo_configs(is_default);

-- Trigger to update updated_at
CREATE TRIGGER update_seo_configs_updated_at BEFORE UPDATE ON seo_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
