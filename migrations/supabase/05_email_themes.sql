-- Email Themes (Supabase/PostgreSQL)
-- Predefined and customizable themes for email templates

-- Theme categories
CREATE TABLE IF NOT EXISTS email_theme_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email themes
CREATE TABLE IF NOT EXISTS email_themes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES email_theme_categories(id) ON DELETE SET NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_custom BOOLEAN DEFAULT FALSE,
    created_by INTEGER NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theme styles and properties
CREATE TABLE IF NOT EXISTS email_theme_properties (
    id SERIAL PRIMARY KEY,
    theme_id INTEGER NOT NULL REFERENCES email_themes(id) ON DELETE CASCADE,
    property_key VARCHAR(255) NOT NULL,
    property_value TEXT NOT NULL,
    property_type VARCHAR(10) DEFAULT 'css' CHECK (property_type IN ('css', 'html', 'json')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(theme_id, property_key)
);

-- Template theme assignments
CREATE TABLE IF NOT EXISTS email_template_themes (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    theme_id INTEGER NOT NULL REFERENCES email_themes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id)
);

-- Insert default theme categories
INSERT INTO email_theme_categories (id, name, description) VALUES
(1, 'Business', 'Professional business themes'),
(2, 'Marketing', 'Marketing and promotional themes'),
(3, 'Newsletter', 'Newsletter and content themes'),
(4, 'Transactional', 'Transactional and notification themes'),
(5, 'Custom', 'User-defined custom themes')
ON CONFLICT (id) DO NOTHING;

-- Insert default themes
INSERT INTO email_themes (id, name, description, category_id, is_default, is_custom) VALUES
(1, 'Classic Business', 'Clean and professional business theme', 1, TRUE, FALSE),
(2, 'Modern Marketing', 'Contemporary marketing theme with vibrant colors', 2, TRUE, FALSE),
(3, 'Newsletter Pro', 'Professional newsletter layout', 3, TRUE, FALSE),
(4, 'Simple Transactional', 'Minimal transactional email theme', 4, TRUE, FALSE),
(5, 'Dark Mode', 'Dark theme for modern applications', 1, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Insert theme properties for Classic Business
INSERT INTO email_theme_properties (theme_id, property_key, property_value, property_type) VALUES
(1, 'primary_color', '#2563eb', 'css'),
(1, 'secondary_color', '#64748b', 'css'),
(1, 'background_color', '#ffffff', 'css'),
(1, 'text_color', '#1f2937', 'css'),
(1, 'font_family', 'Arial, sans-serif', 'css'),
(1, 'border_radius', '8px', 'css'),
(1, 'header_style', '{"background": "#2563eb", "color": "#ffffff", "padding": "20px", "text-align": "center"}', 'json'),
(1, 'footer_style', '{"background": "#f8fafc", "color": "#64748b", "padding": "15px", "text-align": "center", "font-size": "12px"}', 'json'),
(1, 'button_style', '{"background": "#2563eb", "color": "#ffffff", "padding": "12px 24px", "border-radius": "6px", "text-decoration": "none", "display": "inline-block"}', 'json')
ON CONFLICT (theme_id, property_key) DO NOTHING;

-- Insert theme properties for Modern Marketing
INSERT INTO email_theme_properties (theme_id, property_key, property_value, property_type) VALUES
(2, 'primary_color', '#ec4899', 'css'),
(2, 'secondary_color', '#8b5cf6', 'css'),
(2, 'background_color', '#ffffff', 'css'),
(2, 'text_color', '#1f2937', 'css'),
(2, 'font_family', 'Helvetica, Arial, sans-serif', 'css'),
(2, 'border_radius', '12px', 'css'),
(2, 'header_style', '{"background": "linear-gradient(135deg, #ec4899, #8b5cf6)", "color": "#ffffff", "padding": "30px", "text-align": "center", "border-radius": "12px 12px 0 0"}', 'json'),
(2, 'footer_style', '{"background": "#f1f5f9", "color": "#64748b", "padding": "20px", "text-align": "center", "font-size": "14px", "border-radius": "0 0 12px 12px"}', 'json'),
(2, 'button_style', '{"background": "linear-gradient(135deg, #ec4899, #8b5cf6)", "color": "#ffffff", "padding": "15px 30px", "border-radius": "25px", "text-decoration": "none", "display": "inline-block", "font-weight": "bold"}', 'json')
ON CONFLICT (theme_id, property_key) DO NOTHING;

-- Insert theme properties for Newsletter Pro
INSERT INTO email_theme_properties (theme_id, property_key, property_value, property_type) VALUES
(3, 'primary_color', '#059669', 'css'),
(3, 'secondary_color', '#6b7280', 'css'),
(3, 'background_color', '#ffffff', 'css'),
(3, 'text_color', '#374151', 'css'),
(3, 'font_family', 'Georgia, serif', 'css'),
(3, 'border_radius', '6px', 'css'),
(3, 'header_style', '{"background": "#059669", "color": "#ffffff", "padding": "25px", "text-align": "center", "border-bottom": "3px solid #047857"}', 'json'),
(3, 'footer_style', '{"background": "#f9fafb", "color": "#6b7280", "padding": "20px", "text-align": "center", "font-size": "13px", "border-top": "1px solid #e5e7eb"}', 'json'),
(3, 'button_style', '{"background": "#059669", "color": "#ffffff", "padding": "12px 20px", "border-radius": "4px", "text-decoration": "none", "display": "inline-block", "border": "1px solid #047857"}', 'json')
ON CONFLICT (theme_id, property_key) DO NOTHING;

-- Insert theme properties for Simple Transactional
INSERT INTO email_theme_properties (theme_id, property_key, property_value, property_type) VALUES
(4, 'primary_color', '#374151', 'css'),
(4, 'secondary_color', '#9ca3af', 'css'),
(4, 'background_color', '#ffffff', 'css'),
(4, 'text_color', '#111827', 'css'),
(4, 'font_family', 'system-ui, -apple-system, sans-serif', 'css'),
(4, 'border_radius', '4px', 'css'),
(4, 'header_style', '{"background": "#374151", "color": "#ffffff", "padding": "20px", "text-align": "left"}', 'json'),
(4, 'footer_style', '{"background": "#f3f4f6", "color": "#6b7280", "padding": "15px", "text-align": "center", "font-size": "12px"}', 'json'),
(4, 'button_style', '{"background": "#374151", "color": "#ffffff", "padding": "10px 16px", "border-radius": "4px", "text-decoration": "none", "display": "inline-block"}', 'json')
ON CONFLICT (theme_id, property_key) DO NOTHING;

-- Insert theme properties for Dark Mode
INSERT INTO email_theme_properties (theme_id, property_key, property_value, property_type) VALUES
(5, 'primary_color', '#3b82f6', 'css'),
(5, 'secondary_color', '#64748b', 'css'),
(5, 'background_color', '#1f2937', 'css'),
(5, 'text_color', '#f9fafb', 'css'),
(5, 'font_family', 'Inter, system-ui, sans-serif', 'css'),
(5, 'border_radius', '8px', 'css'),
(5, 'header_style', '{"background": "#111827", "color": "#f9fafb", "padding": "25px", "text-align": "center", "border-bottom": "1px solid #374151"}', 'json'),
(5, 'footer_style', '{"background": "#111827", "color": "#9ca3af", "padding": "20px", "text-align": "center", "font-size": "13px", "border-top": "1px solid #374151"}', 'json'),
(5, 'button_style', '{"background": "#3b82f6", "color": "#ffffff", "padding": "12px 24px", "border-radius": "6px", "text-decoration": "none", "display": "inline-block", "font-weight": "500"}', 'json')
ON CONFLICT (theme_id, property_key) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_themes_category ON email_themes(category_id);
CREATE INDEX IF NOT EXISTS idx_email_themes_default ON email_themes(is_default);
CREATE INDEX IF NOT EXISTS idx_email_theme_properties_theme ON email_theme_properties(theme_id);
CREATE INDEX IF NOT EXISTS idx_email_template_themes_template ON email_template_themes(template_id);
CREATE INDEX IF NOT EXISTS idx_email_template_themes_theme ON email_template_themes(theme_id);
