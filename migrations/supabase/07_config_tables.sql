-- Configuration Tables (Supabase/PostgreSQL)
-- Tables for storing dynamic configurations migrated from JSON files

-- Marketing configurations (A/B testing for CTA, offers, etc.)
CREATE TABLE IF NOT EXISTS marketing_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cta_config JSONB, -- JSON: primary, social, newsletter CTAs
  modal_config JSONB, -- JSON: success, error modals
  offer_config JSONB, -- JSON: end date, limited time offers
  social_proof_config JSONB, -- JSON: ratings, reviews, rankings
  is_active BOOLEAN DEFAULT FALSE, -- currently active config
  is_default BOOLEAN DEFAULT FALSE, -- default configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theme configurations (colors, fonts, layout, etc.)
CREATE TABLE IF NOT EXISTS theme_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  colors JSONB, -- JSON: primary, secondary, accent, background, text colors
  fonts JSONB, -- JSON: heading, body, mono fonts
  layout JSONB, -- JSON: type, showCountdown, showStories, etc.
  spacing JSONB, -- JSON: container, section, element spacing
  animations JSONB, -- JSON: enabled, duration, easing
  development JSONB, -- JSON: debug, hotReload settings
  surface JSONB, -- JSON: mode, bgColor, borderColor, etc.
  is_active BOOLEAN DEFAULT FALSE, -- currently active config
  is_default BOOLEAN DEFAULT FALSE, -- default configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content configurations (multi-language support)
CREATE TABLE IF NOT EXISTS content_configs (
  id SERIAL PRIMARY KEY,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  name VARCHAR(255) NOT NULL,
  about_book TEXT, -- HTML content
  author_bio TEXT, -- HTML content
  stories JSONB, -- JSON: array of story objects
  testimonials JSONB, -- JSON: array of testimonial objects
  footer JSONB, -- JSON: copyright, support text
  is_active BOOLEAN DEFAULT FALSE, -- currently active config
  is_default BOOLEAN DEFAULT FALSE, -- default configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuration A/B tests
CREATE TABLE IF NOT EXISTS config_ab_tests (
  id SERIAL PRIMARY KEY,
  test_name VARCHAR(255) NOT NULL,
  config_type VARCHAR(50) NOT NULL, -- 'marketing', 'theme', 'content'
  config_a_id INTEGER NOT NULL,
  config_b_id INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
  winner_config_id INTEGER,
  confidence_level DECIMAL(5,2),
  total_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (config_a_id) REFERENCES marketing_configs(id) ON DELETE CASCADE,
  FOREIGN KEY (config_b_id) REFERENCES marketing_configs(id) ON DELETE CASCADE,
  FOREIGN KEY (winner_config_id) REFERENCES marketing_configs(id) ON DELETE SET NULL
);

-- Configuration usage tracking
CREATE TABLE IF NOT EXISTS config_usage (
  id SERIAL PRIMARY KEY,
  config_type VARCHAR(50) NOT NULL, -- 'marketing', 'theme', 'content'
  config_id INTEGER NOT NULL,
  visitor_id VARCHAR(255) NOT NULL,
  page_view INTEGER DEFAULT 0,
  email_submission INTEGER DEFAULT 0,
  download_request INTEGER DEFAULT 0,
  download_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketing_configs_active ON marketing_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_marketing_configs_default ON marketing_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_theme_configs_active ON theme_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_theme_configs_default ON theme_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_content_configs_language ON content_configs(language);
CREATE INDEX IF NOT EXISTS idx_content_configs_active ON content_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_config_ab_tests_type ON config_ab_tests(config_type);
CREATE INDEX IF NOT EXISTS idx_config_ab_tests_status ON config_ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_config_usage_visitor ON config_usage(visitor_id);
CREATE INDEX IF NOT EXISTS idx_config_usage_config ON config_usage(config_type, config_id);

-- Insert default marketing config from current marketing.json
INSERT INTO marketing_configs (name, description, cta_config, modal_config, offer_config, social_proof_config, is_default, is_active) VALUES
('Default Marketing', 'Default marketing configuration', 
'{"primary": {"text": "Download Free Ebook", "subtext": "Get your free copy now", "loadingText": "Preparing download...", "successText": "Download started!", "errorText": "Something went wrong"}, "social": {"goodreads": {"text": "Add to Goodreads", "url": "https://www.goodreads.com/book/show/...", "icon": "goodreads", "tracking": "goodreads_click"}, "amazon": {"text": "View on Amazon", "url": "https://www.amazon.com/dp/B0DS55TQ8R", "icon": "amazon", "tracking": "amazon_click"}, "publisher": {"text": "Visit Publisher", "url": "https://37indielab.com", "icon": "publisher", "tracking": "publisher_click"}}, "newsletter": {"text": "Subscribe to Updates", "placeholder": "Enter your email", "url": "https://openbookstack.substack.com", "tracking": "newsletter_click"}}',
'{"success": {"title": "Download Started!", "message": "Check your email for the download link", "buttonText": "Close"}, "error": {"title": "Oops!", "message": "Something went wrong. Please try again.", "buttonText": "Try Again"}}',
'{"endDate": "2025-09-08T20:07", "isLimited": true, "limitedText": "Limited time offer"}',
'{"showRating": true, "showReviewCount": true, "showRankings": true, "showAwards": true}',
TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Insert default theme config from current theme.json
INSERT INTO theme_configs (name, description, colors, fonts, layout, spacing, animations, development, surface, is_default, is_active) VALUES
('Default Theme', 'Default theme configuration',
'{"primary": "#454d3a", "secondary": "#435e40", "accent": "#424029", "background": "#0b1220", "text": {"primary": "#e5e7eb", "secondary": "#cbd5e1", "muted": "#94a3b8"}, "success": "#10b981", "error": "#ef4444", "warning": "#f59e0b"}',
'{"heading": "serif", "body": "system-ui", "mono": "ui-monospace"}',
'{"type": "sidebar", "showCountdown": true, "showStories": false, "showTestimonials": false, "showAwards": false, "showRankings": false}',
'{"container": "max-w-7xl", "section": "py-20", "element": "mb-6"}',
'{"enabled": true, "duration": "300ms", "easing": "ease-in-out"}',
'{"debug": true, "hotReload": true}',
'{"mode": "auto"}',
TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Insert default content config from current content.json
INSERT INTO content_configs (language, name, about_book, author_bio, stories, testimonials, footer, is_default, is_active) VALUES
('en', 'Default Content', 
'<p>Test about</p>',
'<p>Test bio</p>',
'[{"title": "Test", "description": "Test", "content": "<p>Test</p>"}]',
'[{"text": "Test", "author": "Test", "rating": 5, "source": "Test"}]',
'{"copyright": "Test", "supportText": "Test"}',
TRUE, TRUE)
ON CONFLICT DO NOTHING;
