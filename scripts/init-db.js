const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Database path
const dbPath = './data/landingfree.db';

console.log('🗄️ Initializing SQLite database...');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️ Removed existing database');
}

// Create new database
const db = new Database(dbPath);
console.log('✅ Created new database at:', dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Migration files in order
const migrations = [
    '01_analytics_downloads.sql',
    '02_anonymous_counters.sql',
    '03_ab_testing_tables.sql',
    '04_email_templates.sql',
    '05_email_themes.sql',
    '06_email_template_analytics.sql',
    '07_config_tables.sql',
    '08_add_template_type.sql',
    'book_configs.sql',
    'seo_configs.sql',
    'email_configs.sql'
];

// Apply migrations
for (const migration of migrations) {
    const migrationPath = path.join(__dirname, '..', 'migrations', 'sqlite', migration);
    
    if (fs.existsSync(migrationPath)) {
        console.log(`📄 Applying migration: ${migration}`);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        try {
            db.exec(sql);
            console.log(`✅ Applied migration: ${migration}`);
        } catch (error) {
            console.error(`❌ Error applying migration ${migration}:`, error.message);
            throw error;
        }
    } else {
        console.log(`⚠️ Migration file not found: ${migration}`);
    }
}

// Insert default data
console.log('📝 Inserting default data...');

// Insert default marketing config
db.prepare(`
    INSERT INTO marketing_configs (name, description, cta_config, modal_config, offer_config, social_proof_config, is_active, is_default, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(
    'Default Marketing',
    'Default marketing configuration',
    JSON.stringify({
        primary: { text: 'Get Your Free Copy', subtext: 'Download now', loadingText: 'Processing...', successText: 'Success!', errorText: 'Error occurred' },
        social: {
            goodreads: { text: 'View on Goodreads', url: 'https://goodreads.com', icon: '📚', tracking: 'goodreads_click' },
            amazon: { text: 'Buy on Amazon', url: 'https://amazon.com', icon: '📦', tracking: 'amazon_click' },
            publisher: { text: 'Publisher Site', url: 'https://publisher.com', icon: '🏢', tracking: 'publisher_click' }
        },
        newsletter: { text: 'Subscribe', placeholder: 'Enter your email', url: '/api/newsletter', tracking: 'newsletter_signup' }
    }),
    JSON.stringify({
        success: { title: 'Success!', message: 'Your download is ready.', buttonText: 'Download' },
        error: { title: 'Error', message: 'Something went wrong.', buttonText: 'Try Again' }
    }),
    JSON.stringify({
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isLimited: true,
        limitedText: 'Limited time offer!'
    }),
    JSON.stringify({
        showRating: true,
        showReviewCount: true,
        showRankings: true,
        showAwards: true
    }),
    1, 1
);

// Insert default theme config
db.prepare(`
    INSERT INTO theme_configs (name, description, colors, fonts, layout, spacing, animations, development, surface, is_active, is_default, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(
    'Default Theme',
    'Default theme configuration',
    JSON.stringify({
        primary: '#0f766e',
        secondary: '#0891b2',
        accent: '#f59e0b',
        background: '#ffffff',
        text: { primary: '#1f2937', secondary: '#6b7280', muted: '#9ca3af' },
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    }),
    JSON.stringify({
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        mono: 'JetBrains Mono, monospace'
    }),
    JSON.stringify({
        type: 'default',
        showCountdown: true,
        showStories: true,
        showTestimonials: true,
        showAwards: true,
        showRankings: true
    }),
    JSON.stringify({
        container: '1rem',
        section: '2rem',
        element: '1rem'
    }),
    JSON.stringify({
        enabled: true,
        duration: '300ms',
        easing: 'ease-in-out'
    }),
    JSON.stringify({
        debug: false,
        hotReload: true
    }),
    JSON.stringify({
        mode: 'light'
    }),
    1, 1
);

// Insert default content config
db.prepare(`
    INSERT INTO content_configs (language, name, about_book, author_bio, stories, testimonials, footer, is_active, is_default, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(
    'en',
    'Default Content',
    'This is a compelling book description that hooks readers and makes them want to download your book.',
    'Author bio goes here. Tell readers about yourself and your writing journey.',
    JSON.stringify([
        {
            title: 'Sample Story',
            description: 'A brief description of this story',
            content: 'This is the content of the sample story...'
        }
    ]),
    JSON.stringify([
        {
            text: 'Amazing book! Highly recommended.',
            author: 'John Doe',
            rating: 5,
            source: 'Amazon'
        }
    ]),
    JSON.stringify({
        copyright: '© 2024 All rights reserved',
        supportText: 'Need help? Contact us at support@example.com'
    }),
    1, 1
);

// Insert default book config
db.prepare(`
    INSERT INTO book_configs (name, description, title, subtitle, author, author_bio, publisher, publisher_url, publisher_tagline, substack_name, description_content, cover_image, rating, review_count, publication_date, isbn, asin, amazon_url, goodreads_url, substack_url, file_size, page_count, language, format, is_active, is_default, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(
    'Default Book',
    'Default book configuration',
    'Your Book Title',
    'A compelling subtitle',
    'Author Name',
    'Author bio goes here',
    'Self-Published',
    'https://publisher.com',
    'Publishing tagline',
    'Newsletter Name',
    'Detailed book description...',
    '/cover.jpg',
    4.5,
    100,
    new Date().toISOString(),
    '1234567890',
    'B123456789',
    'https://amazon.com/book',
    'https://goodreads.com/book',
    'https://substack.com/newsletter',
    '2.5 MB',
    300,
    'English',
    'ebook',
    1, 1
);

// Insert default SEO config
db.prepare(`
    INSERT INTO seo_configs (name, description, meta_title, meta_description, meta_keywords, meta_author, og_image, twitter_card, meta_canonical, structured_data, is_active, is_default, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(
    'Default SEO',
    'Default SEO configuration',
    'Your Book Title - Free Download',
    'Download your free copy of this amazing book. Get it now!',
    JSON.stringify(['book', 'free', 'download', 'ebook']),
    'Author Name',
    '/og-image.jpg',
    'summary_large_image',
    'https://yoursite.com',
    JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Book',
        'name': 'Your Book Title',
        'author': { '@type': 'Person', 'name': 'Author Name' }
    }),
    1, 1
);

// Insert default email config
db.prepare(`
    INSERT INTO email_configs (name, description, sender_name, sender_email, reply_to, templates, is_active, is_default, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`).run(
    'Default Email',
    'Default email configuration',
    'Author Name',
    'noreply@yoursite.com',
    'author@yoursite.com',
    JSON.stringify({
        download: {
            subject: 'Your free book is ready!',
            template: 'Thank you for downloading our book. Here is your download link: [DOWNLOAD_LINK]'
        },
        follow_up: {
            subject: 'How are you enjoying the book?',
            template: 'We hope you\'re enjoying the book! Let us know what you think.',
            delay_days: 7
        }
    }),
    1, 1
);

console.log('✅ Database initialization completed!');
console.log('📊 Database info:');
console.log('   - Tables created:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().length);
console.log('   - Marketing configs:', db.prepare('SELECT COUNT(*) as count FROM marketing_configs').get().count);
console.log('   - Theme configs:', db.prepare('SELECT COUNT(*) as count FROM theme_configs').get().count);
console.log('   - Content configs:', db.prepare('SELECT COUNT(*) as count FROM content_configs').get().count);
console.log('   - Book configs:', db.prepare('SELECT COUNT(*) as count FROM book_configs').get().count);
console.log('   - SEO configs:', db.prepare('SELECT COUNT(*) as count FROM seo_configs').get().count);
console.log('   - Email configs:', db.prepare('SELECT COUNT(*) as count FROM email_configs').get().count);

db.close();
