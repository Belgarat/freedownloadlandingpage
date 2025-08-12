-- Book configurations table
CREATE TABLE IF NOT EXISTS book_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  is_free BOOLEAN DEFAULT 1,
  price REAL,
  
  -- Arrays stored as JSON
  categories TEXT, -- JSON array
  stories TEXT, -- JSON array
  awards TEXT, -- JSON array
  rankings TEXT, -- JSON object
  ebook TEXT, -- JSON object
  
  -- Status
  is_active BOOLEAN DEFAULT 0,
  is_default BOOLEAN DEFAULT 0,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_book_configs_active ON book_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_book_configs_default ON book_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_book_configs_author ON book_configs(author);
CREATE INDEX IF NOT EXISTS idx_book_configs_title ON book_configs(title);
