-- Email Templates Tables (SQLite)
-- This migration creates tables for managing email templates

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    description TEXT,
    is_default INTEGER DEFAULT 0, -- BOOLEAN as INTEGER in SQLite
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Template placeholders table
CREATE TABLE IF NOT EXISTS template_placeholders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    placeholder_key TEXT NOT NULL,
    placeholder_name TEXT NOT NULL,
    description TEXT,
    default_value TEXT,
    is_required INTEGER DEFAULT 0, -- BOOLEAN as INTEGER in SQLite
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE
);

-- Template categories table
CREATE TABLE IF NOT EXISTS template_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Template category assignments
CREATE TABLE IF NOT EXISTS template_categories_assignments (
    template_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (template_id, category_id),
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES template_categories(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT OR IGNORE INTO template_categories (name, description) VALUES
('Welcome', 'Welcome and onboarding emails'),
('Download', 'Download confirmation emails'),
('Marketing', 'Marketing and promotional emails'),
('Notification', 'System notification emails');

-- Insert default email template
INSERT OR IGNORE INTO email_templates (name, subject, html_content, text_content, description, is_default) VALUES
('Default Download Email', 
 'Your free ebook is ready! 📚', 
 '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Download is Ready</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Download is Ready!</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2c3e50; margin-top: 0;">Hi {{user_name}},</h2>
        
        <p>Thank you for your interest in <strong>{{book_title}}</strong>! Your free ebook is now ready for download.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #2c3e50;">📖 About the Book</h3>
            <p style="margin-bottom: 15px;">{{book_description}}</p>
            <p><strong>Author:</strong> {{author_name}}</p>
            <p><strong>Pages:</strong> {{page_count}}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{download_link}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
                📥 Download Your Free Ebook
            </a>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2c3e50;">💡 What''s Next?</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Read the book and share your thoughts</li>
                <li>Follow us on social media for updates</li>
                <li>Check out our other free resources</li>
            </ul>
        </div>
        
        <p>This download link will expire in <strong>{{expiry_hours}} hours</strong>, so make sure to download it soon!</p>
        
        <p>If you have any questions or need help, feel free to reply to this email.</p>
        
        <p>Happy reading!<br>
        <strong>The {{site_name}} Team</strong></p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div style="text-align: center; font-size: 12px; color: #666;">
            <p>You received this email because you requested a free download of {{book_title}}.</p>
            <p><a href="{{unsubscribe_link}}" style="color: #667eea;">Unsubscribe</a> | <a href="{{preferences_link}}" style="color: #667eea;">Email Preferences</a></p>
        </div>
    </div>
</body>
</html>',
 'Hi {{user_name}},

Thank you for your interest in {{book_title}}! Your free ebook is now ready for download.

About the Book:
{{book_description}}

Author: {{author_name}}
Pages: {{page_count}}

Download your free ebook here: {{download_link}}

This download link will expire in {{expiry_hours}} hours, so make sure to download it soon!

Happy reading!
The {{site_name}} Team

---
You received this email because you requested a free download of {{book_title}}.
Unsubscribe: {{unsubscribe_link}}',
 'Default template for download confirmation emails',
 1);

-- Insert default placeholders for the default template
INSERT OR IGNORE INTO template_placeholders (template_id, placeholder_key, placeholder_name, description, default_value, is_required) VALUES
(1, 'user_name', 'User Name', 'The recipient''s name', 'there', 0),
(1, 'book_title', 'Book Title', 'The title of the book being downloaded', 'Fish Cannot Carry Guns', 1),
(1, 'book_description', 'Book Description', 'A brief description of the book', 'A compelling story about...', 1),
(1, 'author_name', 'Author Name', 'The name of the book author', 'Marco Brunet', 1),
(1, 'page_count', 'Page Count', 'Number of pages in the book', '250', 0),
(1, 'download_link', 'Download Link', 'The secure download link for the ebook', '', 1),
(1, 'expiry_hours', 'Expiry Hours', 'Number of hours until the download link expires', '24', 0),
(1, 'site_name', 'Site Name', 'The name of your website', 'BookLanding', 0),
(1, 'unsubscribe_link', 'Unsubscribe Link', 'Link to unsubscribe from emails', '{{site_url}}/unsubscribe', 0),
(1, 'preferences_link', 'Preferences Link', 'Link to email preferences', '{{site_url}}/preferences', 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_is_default ON email_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_template_placeholders_template_id ON template_placeholders(template_id);
CREATE INDEX IF NOT EXISTS idx_template_placeholders_key ON template_placeholders(placeholder_key);
