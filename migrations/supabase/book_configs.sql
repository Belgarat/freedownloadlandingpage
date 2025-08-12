-- Book configurations table
CREATE TABLE IF NOT EXISTS book_configs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Basic book info
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL,
  author_bio TEXT,
  publisher TEXT,
  publisher_url TEXT,
  publisher_tagline TEXT,
  substack_name TEXT,
  description_content TEXT,
  cover_image TEXT,
  
  -- Ratings and reviews
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Publication details
  publication_date TEXT,
  isbn TEXT,
  asin TEXT,
  amazon_url TEXT,
  goodreads_url TEXT,
  substack_url TEXT,
  
  -- File details
  file_size TEXT,
  page_count INTEGER,
  language TEXT DEFAULT 'English',
  format TEXT,
  is_free BOOLEAN DEFAULT true,
  price REAL,
  
  -- Arrays stored as JSON
  categories JSONB, -- JSON array
  stories JSONB, -- JSON array
  awards JSONB, -- JSON array
  rankings JSONB, -- JSON object
  ebook JSONB, -- JSON object
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_book_configs_active ON book_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_book_configs_default ON book_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_book_configs_author ON book_configs(author);
CREATE INDEX IF NOT EXISTS idx_book_configs_title ON book_configs(title);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_book_configs_updated_at BEFORE UPDATE ON book_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
