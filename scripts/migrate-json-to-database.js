#!/usr/bin/env node

/**
 * Migration script to move configuration data from JSON files to database
 * This script reads the existing JSON files and creates database records
 */

const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

// Database path
const DB_PATH = path.join(process.cwd(), 'data', 'landingfree.db')

// Config files path
const CONFIG_PATH = path.join(process.cwd(), 'config')

// Initialize database
const db = new Database(DB_PATH)

console.log('🔄 Starting JSON to Database migration...')

try {
  // Read JSON files
  const bookConfig = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'book.json'), 'utf8'))
  const seoConfig = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'seo.json'), 'utf8'))
  const emailConfig = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'email.json'), 'utf8'))

  console.log('📖 Read configuration files successfully')

  // Migrate Book Config
  console.log('📚 Migrating book configuration...')
  const bookStmt = db.prepare(`
    INSERT INTO book_configs (
      name, description, title, subtitle, author, author_bio, publisher, publisher_url,
      publisher_tagline, substack_name, description_content, cover_image, rating, review_count,
      publication_date, isbn, asin, amazon_url, goodreads_url, substack_url, file_size,
      page_count, language, format, is_free, price, categories, stories, awards, rankings, ebook,
      is_active, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const bookResult = bookStmt.run(
    'Default Book Configuration',
    'Default book configuration migrated from JSON',
    bookConfig.title,
    bookConfig.subtitle,
    bookConfig.author,
    bookConfig.authorBio,
    bookConfig.publisher,
    bookConfig.publisherUrl,
    bookConfig.publisherTagline,
    bookConfig.substackName,
    bookConfig.description,
    bookConfig.coverImage,
    bookConfig.rating,
    bookConfig.reviewCount,
    bookConfig.publicationDate,
    bookConfig.isbn,
    bookConfig.asin,
    bookConfig.amazonUrl,
    bookConfig.goodreadsUrl,
    bookConfig.substackUrl,
    bookConfig.fileSize,
    bookConfig.pageCount,
    bookConfig.language,
    bookConfig.format,
    bookConfig.isFree ? 1 : 0,
    bookConfig.price,
    JSON.stringify(bookConfig.categories),
    JSON.stringify(bookConfig.stories),
    JSON.stringify(bookConfig.awards),
    JSON.stringify(bookConfig.rankings),
    JSON.stringify(bookConfig.ebook),
    1, // is_active
    1  // is_default
  )

  console.log(`✅ Book config migrated with ID: ${bookResult.lastInsertRowid}`)

  // Migrate SEO Config
  console.log('🔍 Migrating SEO configuration...')
  const seoStmt = db.prepare(`
    INSERT INTO seo_configs (
      name, description, meta_title, meta_description, meta_keywords, meta_author,
      meta_robots, meta_canonical, og_title, og_description, og_type, og_url,
      og_image, og_site_name, twitter_card, twitter_title, twitter_description,
      twitter_image, structured_data, sitemap_enabled, sitemap_priority,
      sitemap_changefreq, is_active, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const seoResult = seoStmt.run(
    'Default SEO Configuration',
    'Default SEO configuration migrated from JSON',
    seoConfig.meta.title,
    seoConfig.meta.description,
    seoConfig.meta.keywords,
    seoConfig.meta.author,
    seoConfig.meta.robots,
    seoConfig.meta.canonical,
    seoConfig.openGraph.title,
    seoConfig.openGraph.description,
    seoConfig.openGraph.type,
    seoConfig.openGraph.url,
    seoConfig.openGraph.image,
    seoConfig.openGraph.siteName,
    seoConfig.twitter.card,
    seoConfig.twitter.title,
    seoConfig.twitter.description,
    seoConfig.twitter.image,
    JSON.stringify(seoConfig.structuredData),
    seoConfig.sitemap.enabled ? 1 : 0,
    seoConfig.sitemap.priority,
    seoConfig.sitemap.changefreq,
    1, // is_active
    1  // is_default
  )

  console.log(`✅ SEO config migrated with ID: ${seoResult.lastInsertRowid}`)

  // Migrate Email Config
  console.log('📧 Migrating email configuration...')
  const emailStmt = db.prepare(`
    INSERT INTO email_configs (
      name, description, sender_name, sender_email, reply_to, templates,
      template_expiry_hours, max_retries, tracking, is_active, is_default
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const emailResult = emailStmt.run(
    'Default Email Configuration',
    'Default email configuration migrated from JSON',
    emailConfig.sender.name,
    emailConfig.sender.email,
    emailConfig.sender.replyTo,
    JSON.stringify(emailConfig.templates),
    emailConfig.settings.templateExpiryHours,
    emailConfig.settings.maxRetries,
    emailConfig.settings.tracking ? 1 : 0,
    1, // is_active
    1  // is_default
  )

  console.log(`✅ Email config migrated with ID: ${emailResult.lastInsertRowid}`)

  console.log('🎉 Migration completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Book config: ID ${bookResult.lastInsertRowid}`)
  console.log(`   - SEO config: ID ${seoResult.lastInsertRowid}`)
  console.log(`   - Email config: ID ${emailResult.lastInsertRowid}`)

} catch (error) {
  console.error('❌ Migration failed:', error)
  process.exit(1)
} finally {
  db.close()
}
