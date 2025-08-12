-- Email Template Analytics (Supabase/PostgreSQL)
-- Track usage, performance, and engagement metrics for email templates

-- Template usage tracking
CREATE TABLE IF NOT EXISTS email_template_usage (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
    opened_at TIMESTAMP WITH TIME ZONE NULL,
    clicked_at TIMESTAMP WITH TIME ZONE NULL,
    bounce_reason TEXT NULL,
    user_agent TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template performance metrics (aggregated)
CREATE TABLE IF NOT EXISTS email_template_metrics (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0.00,
    click_rate DECIMAL(5,2) DEFAULT 0.00,
    bounce_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, date)
);

-- Template A/B test results
CREATE TABLE IF NOT EXISTS email_template_ab_tests (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    template_a_id INTEGER NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    template_b_id INTEGER NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    winner_template_id INTEGER NULL REFERENCES email_templates(id) ON DELETE SET NULL,
    confidence_level DECIMAL(5,2) NULL,
    total_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_template_usage_template_id ON email_template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_sent_at ON email_template_usage(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_status ON email_template_usage(status);
CREATE INDEX IF NOT EXISTS idx_email_template_metrics_template_date ON email_template_metrics(template_id, date);
CREATE INDEX IF NOT EXISTS idx_email_template_ab_tests_status ON email_template_ab_tests(status);

-- Function to update metrics automatically
CREATE OR REPLACE FUNCTION update_template_metrics_on_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO email_template_metrics (
        template_id, 
        date, 
        total_sent,
        total_delivered,
        total_opened,
        total_clicked,
        total_bounced,
        total_failed,
        open_rate,
        click_rate,
        bounce_rate,
        updated_at
    )
    SELECT 
        NEW.template_id,
        DATE(NEW.sent_at),
        COUNT(*) as total_sent,
        SUM(CASE WHEN status IN ('delivered', 'opened', 'clicked') THEN 1 ELSE 0 END) as total_delivered,
        SUM(CASE WHEN status = 'opened' THEN 1 ELSE 0 END) as total_opened,
        SUM(CASE WHEN status = 'clicked' THEN 1 ELSE 0 END) as total_clicked,
        SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END) as total_bounced,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as total_failed,
        CASE 
            WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN status = 'opened' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)
            ELSE 0.00
        END as open_rate,
        CASE 
            WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN status = 'clicked' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)
            ELSE 0.00
        END as click_rate,
        CASE 
            WHEN COUNT(*) > 0 THEN ROUND(SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)
            ELSE 0.00
        END as bounce_rate,
        NOW()
    FROM email_template_usage
    WHERE template_id = NEW.template_id AND DATE(sent_at) = DATE(NEW.sent_at)
    ON CONFLICT (template_id, date) DO UPDATE SET
        total_sent = EXCLUDED.total_sent,
        total_delivered = EXCLUDED.total_delivered,
        total_opened = EXCLUDED.total_opened,
        total_clicked = EXCLUDED.total_clicked,
        total_bounced = EXCLUDED.total_bounced,
        total_failed = EXCLUDED.total_failed,
        open_rate = EXCLUDED.open_rate,
        click_rate = EXCLUDED.click_rate,
        bounce_rate = EXCLUDED.bounce_rate,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update metrics automatically
CREATE TRIGGER update_template_metrics_on_usage_trigger
    AFTER INSERT ON email_template_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_template_metrics_on_usage();
