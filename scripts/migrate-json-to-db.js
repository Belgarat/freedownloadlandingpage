const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Database path
const dbPath = '/tmp/development.db';

console.log('🔄 Migrating JSON data to database...');

// Read JSON files
function readJsonFile(filename) {
    const filePath = path.join(__dirname, '..', 'config', filename);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    }
    return null;
}

// Read all JSON configs
const marketingConfig = readJsonFile('marketing.json');
const themeConfig = readJsonFile('theme.json');
const contentConfig = readJsonFile('content.json');
const bookConfig = readJsonFile('book.json');
const seoConfig = readJsonFile('seo.json');
const emailConfig = readJsonFile('email.json');

console.log('📄 Loaded JSON files:');
console.log('   - Marketing:', marketingConfig ? '✅' : '❌');
console.log('   - Theme:', themeConfig ? '✅' : '❌');
console.log('   - Content:', contentConfig ? '✅' : '❌');
console.log('   - Book:', bookConfig ? '✅' : '❌');
console.log('   - SEO:', seoConfig ? '✅' : '❌');
console.log('   - Email:', emailConfig ? '✅' : '❌');

// Connect to database
const db = new Database(dbPath);
console.log('🗄️ Connected to database:', dbPath);

// Clear existing default configs
console.log('🧹 Clearing existing default configs...');
db.prepare('DELETE FROM marketing_configs WHERE is_default = 1').run();
db.prepare('DELETE FROM theme_configs WHERE is_default = 1').run();
db.prepare('DELETE FROM content_configs WHERE is_default = 1').run();
db.prepare('DELETE FROM book_configs WHERE is_default = 1').run();
db.prepare('DELETE FROM seo_configs WHERE is_default = 1').run();
db.prepare('DELETE FROM email_configs WHERE is_default = 1').run();

// Migrate marketing config
if (marketingConfig) {
    console.log('📝 Migrating marketing config...');
    db.prepare(`
        INSERT INTO marketing_configs (name, description, cta_config, modal_config, offer_config, social_proof_config, is_active, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
        'Migrated Marketing Config',
        'Migrated from JSON file',
        JSON.stringify(marketingConfig.cta || {}),
        JSON.stringify(marketingConfig.modal || {}),
        JSON.stringify(marketingConfig.offer || {}),
        JSON.stringify(marketingConfig.socialProof || {}),
        1, 1
    );
}

// Migrate theme config
if (themeConfig) {
    console.log('📝 Migrating theme config...');
    db.prepare(`
        INSERT INTO theme_configs (name, description, colors, fonts, layout, spacing, animations, development, surface, is_active, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
        'Migrated Theme Config',
        'Migrated from JSON file',
        JSON.stringify(themeConfig.colors || {}),
        JSON.stringify(themeConfig.fonts || {}),
        JSON.stringify(themeConfig.layout || {}),
        JSON.stringify(themeConfig.spacing || {}),
        JSON.stringify(themeConfig.animations || {}),
        JSON.stringify(themeConfig.development || {}),
        JSON.stringify(themeConfig.surface || {}),
        1, 1
    );
}

// Migrate content config
if (contentConfig) {
    console.log('📝 Migrating content config...');
    db.prepare(`
        INSERT INTO content_configs (language, name, about_book, author_bio, stories, testimonials, footer, is_active, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
        contentConfig.language || 'en',
        'Migrated Content Config',
        contentConfig.aboutBook || '',
        contentConfig.authorBio || '',
        JSON.stringify(contentConfig.stories || []),
        JSON.stringify(contentConfig.testimonials || []),
        JSON.stringify(contentConfig.footer || {}),
        1, 1
    );
}

// Migrate book config
if (bookConfig) {
    console.log('📝 Migrating book config...');
    db.prepare(`
        INSERT INTO book_configs (name, description, title, subtitle, author, author_bio, publisher, publisher_url, publisher_tagline, substack_name, description_content, cover_image, rating, review_count, publication_date, isbn, asin, amazon_url, goodreads_url, substack_url, file_size, page_count, language, format, is_active, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
        'Migrated Book Config',
        'Migrated from JSON file',
        bookConfig.title || '',
        bookConfig.subtitle || '',
        bookConfig.author || '',
        bookConfig.authorBio || '',
        bookConfig.publisher || '',
        bookConfig.publisherUrl || '',
        bookConfig.publisherTagline || '',
        bookConfig.substackName || '',
        bookConfig.description || '',
        bookConfig.coverImage || '',
        bookConfig.rating || 0,
        bookConfig.reviewCount || 0,
        bookConfig.publicationDate || new Date().toISOString(),
        bookConfig.isbn || '',
        bookConfig.asin || '',
        bookConfig.amazonUrl || '',
        bookConfig.goodreadsUrl || '',
        bookConfig.substackUrl || '',
        bookConfig.fileSize || '',
        bookConfig.pageCount || 0,
        bookConfig.language || 'English',
        bookConfig.format || 'ebook',
        1, 1
    );
}

// Migrate SEO config
if (seoConfig) {
    console.log('📝 Migrating SEO config...');
    db.prepare(`
        INSERT INTO seo_configs (name, description, meta_title, meta_description, meta_keywords, meta_author, og_image, twitter_card, meta_canonical, structured_data, is_active, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
        'Migrated SEO Config',
        'Migrated from JSON file',
        seoConfig.title || '',
        seoConfig.description || '',
        JSON.stringify(seoConfig.keywords || []),
        seoConfig.author || '',
        seoConfig.ogImage || '',
        seoConfig.twitterCard || 'summary_large_image',
        seoConfig.canonicalUrl || '',
        JSON.stringify(seoConfig.structuredData || {}),
        1, 1
    );
}

// Migrate email config
if (emailConfig) {
    console.log('📝 Migrating email config...');
    db.prepare(`
        INSERT INTO email_configs (name, description, sender_name, sender_email, reply_to, templates, is_active, is_default, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
        'Migrated Email Config',
        'Migrated from JSON file',
        emailConfig.senderName || '',
        emailConfig.senderEmail || '',
        emailConfig.replyTo || '',
        JSON.stringify({
            download: {
                subject: emailConfig.subject || 'Your free book is ready!',
                template: emailConfig.template || 'Thank you for downloading our book.'
            },
            follow_up: {
                subject: emailConfig.followUpSubject || 'How are you enjoying the book?',
                template: emailConfig.followUpTemplate || 'We hope you\'re enjoying the book!',
                delay_days: emailConfig.followUpDelay || 7
            }
        }),
        1, 1
    );
}

console.log('✅ Migration completed!');
console.log('📊 Database info:');
console.log('   - Marketing configs:', db.prepare('SELECT COUNT(*) as count FROM marketing_configs').get().count);
console.log('   - Theme configs:', db.prepare('SELECT COUNT(*) as count FROM theme_configs').get().count);
console.log('   - Content configs:', db.prepare('SELECT COUNT(*) as count FROM content_configs').get().count);
console.log('   - Book configs:', db.prepare('SELECT COUNT(*) as count FROM book_configs').get().count);
console.log('   - SEO configs:', db.prepare('SELECT COUNT(*) as count FROM seo_configs').get().count);
console.log('   - Email configs:', db.prepare('SELECT COUNT(*) as count FROM email_configs').get().count);

db.close();
