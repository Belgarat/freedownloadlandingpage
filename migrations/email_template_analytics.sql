-- Email Template Analytics
-- Track usage, performance, and engagement metrics for email templates

-- Template usage tracking
CREATE TABLE IF NOT EXISTS email_template_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    bounce_reason TEXT NULL,
    user_agent TEXT NULL,
    ip_address TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE
);

-- Template performance metrics (aggregated)
CREATE TABLE IF NOT EXISTS email_template_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE,
    UNIQUE(template_id, date)
);

-- Template A/B test results
CREATE TABLE IF NOT EXISTS email_template_ab_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL,
    template_a_id INTEGER NOT NULL,
    template_b_id INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    winner_template_id INTEGER NULL,
    confidence_level DECIMAL(5,2) NULL,
    total_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_a_id) REFERENCES email_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (template_b_id) REFERENCES email_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_template_id) REFERENCES email_templates(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_template_usage_template_id ON email_template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_sent_at ON email_template_usage(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_status ON email_template_usage(status);
CREATE INDEX IF NOT EXISTS idx_email_template_metrics_template_date ON email_template_metrics(template_id, date);
CREATE INDEX IF NOT EXISTS idx_email_template_ab_tests_status ON email_template_ab_tests(status);

-- Triggers to update metrics automatically
CREATE TRIGGER IF NOT EXISTS update_template_metrics_on_usage
AFTER INSERT ON email_template_usage
BEGIN
    INSERT OR REPLACE INTO email_template_metrics (
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
        CURRENT_TIMESTAMP
    FROM email_template_usage
    WHERE template_id = NEW.template_id AND DATE(sent_at) = DATE(NEW.sent_at);
END;
