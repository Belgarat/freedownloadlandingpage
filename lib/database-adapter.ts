// Database Adapter Pattern
// Support for multiple database providers

export interface DatabaseAdapter {
  // A/B Testing
  createABTest(test: any): Promise<any>
  getABTests(): Promise<any[]>
  updateABTest(id: string, data: any): Promise<any>
  deleteABTest(id: string): Promise<void>
  
  // Variants
  createABVariant(variant: any): Promise<any>
  getABVariants(testId: string): Promise<any[]>
  updateABVariant(id: string, data: any): Promise<any>
  
  // Results
  trackABResult(result: any): Promise<any>
  getABResults(testId: string): Promise<any[]>
  
  // Assignments
  createAssignment(assignment: any): Promise<any>
  getAssignment(visitorId: string, testId: string): Promise<any>
  
  // Analytics
  trackVisit(data: any): Promise<any>
  trackDownload(data: any): Promise<any>
  getAnalytics(): Promise<any[]>
  
  // Download Tokens
  getDownloadTokens(): Promise<any[]>
  
  // Anonymous Counters
  getAnonymousCounters(): Promise<any>
  incrementAnonymousCounter(type: string): Promise<void>
  
  // Email Templates
  createEmailTemplate(template: any): Promise<any>
  getEmailTemplates(): Promise<any[]>
  getEmailTemplate(id: number): Promise<any>
  updateEmailTemplate(id: number, data: any): Promise<any>
  deleteEmailTemplate(id: number): Promise<void>
  
  // Template Placeholders
  createTemplatePlaceholder(placeholder: any): Promise<any>
  getTemplatePlaceholders(templateId: number): Promise<any[]>
  updateTemplatePlaceholder(id: number, data: any): Promise<any>
  deleteTemplatePlaceholder(id: number): Promise<void>
  
  // Template Categories
  getTemplateCategories(): Promise<any[]>
  createTemplateCategory(category: any): Promise<any>
  
  // Database Setup
  initDatabase(): Promise<void>
}

// Supabase Adapter
export class SupabaseAdapter implements DatabaseAdapter {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  async createABTest(test: any) {
    const { data, error } = await this.supabase
      .from('ab_tests')
      .insert(test)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getABTests() {
    const { data, error } = await this.supabase
      .from('ab_tests')
      .select(`
        *,
        variants:ab_variants(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async updateABTest(id: string, data: any) {
    const { data: result, error } = await this.supabase
      .from('ab_tests')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async deleteABTest(id: string) {
    const { error } = await this.supabase
      .from('ab_tests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async createABVariant(variant: any) {
    const { data, error } = await this.supabase
      .from('ab_variants')
      .insert(variant)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getABVariants(testId: string) {
    const { data, error } = await this.supabase
      .from('ab_variants')
      .select('*')
      .eq('test_id', testId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async updateABVariant(id: string, data: any) {
    const { data: result, error } = await this.supabase
      .from('ab_variants')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async trackABResult(result: any) {
    const { data, error } = await this.supabase
      .from('ab_test_results')
      .insert(result)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getABResults(testId: string) {
    const { data, error } = await this.supabase
      .from('ab_test_results')
      .select('*')
      .eq('test_id', testId)
    
    if (error) throw error
    return data || []
  }

  async createAssignment(assignment: any) {
    const { data, error } = await this.supabase
      .from('ab_visitor_assignments')
      .upsert(assignment, { onConflict: 'visitor_id,test_id' })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getAssignment(visitorId: string, testId: string) {
    const { data, error } = await this.supabase
      .from('ab_visitor_assignments')
      .select('*')
      .eq('visitor_id', visitorId)
      .eq('test_id', testId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async trackVisit(data: any) {
    const { data: result, error } = await this.supabase
      .from('analytics')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async trackDownload(data: any) {
    const { data: result, error } = await this.supabase
      .from('downloads')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async getAnalytics() {
    const { data, error } = await this.supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getDownloadTokens() {
    const { data, error } = await this.supabase
      .from('download_tokens')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getAnonymousCounters() {
    const { data, error } = await this.supabase
      .from('anonymous_counters')
      .select('*')
      .eq('key', 'anonymous_counters')
      .single()
    
    if (error) throw error
    return data || {
      total_visits: 0,
      total_downloads: 0,
      total_email_submissions: 0,
      total_goodreads_clicks: 0,
      total_substack_clicks: 0,
      total_publisher_clicks: 0,
      last_updated: new Date().toISOString()
    }
  }

  async incrementAnonymousCounter(type: string) {
    // Try RPC first, then fallback to manual update
    const rpcMap: Record<string, string> = {
      'visits': 'increment_visits',
      'downloads': 'increment_downloads',
      'email_submissions': 'increment_email_submissions',
      'goodreads_clicks': 'increment_goodreads_clicks',
      'substack_clicks': 'increment_substack_clicks',
      'publisher_clicks': 'increment_publisher_clicks'
    }

    const rpcName = rpcMap[type]
    if (rpcName) {
      const { error: rpcError } = await this.supabase.rpc(rpcName)
      if (!rpcError) return
    }

    // Fallback: manual increment
    const { data: existing, error: selectError } = await this.supabase
      .from('anonymous_counters')
      .select('*')
      .eq('key', 'anonymous_counters')
      .single()

    if (selectError) {
      // Create if doesn't exist
      await this.supabase
        .from('anonymous_counters')
        .insert({
          key: 'anonymous_counters',
          total_visits: type === 'visits' ? 1 : 0,
          total_downloads: type === 'downloads' ? 1 : 0,
          total_email_submissions: type === 'email_submissions' ? 1 : 0,
          total_goodreads_clicks: type === 'goodreads_clicks' ? 1 : 0,
          total_substack_clicks: type === 'substack_clicks' ? 1 : 0,
          total_publisher_clicks: type === 'publisher_clicks' ? 1 : 0,
          last_updated: new Date().toISOString()
        })
      return
    }

    const updateData: any = { last_updated: new Date().toISOString() }
    const fieldMap: Record<string, string> = {
      'visits': 'total_visits',
      'downloads': 'total_downloads',
      'email_submissions': 'total_email_submissions',
      'goodreads_clicks': 'total_goodreads_clicks',
      'substack_clicks': 'total_substack_clicks',
      'publisher_clicks': 'total_publisher_clicks'
    }

    const field = fieldMap[type]
    if (field) {
      updateData[field] = (existing?.[field] || 0) + 1
    }

    await this.supabase
      .from('anonymous_counters')
      .update(updateData)
      .eq('key', 'anonymous_counters')
  }

  // Email Templates
  async createEmailTemplate(template: any) {
    const { data, error } = await this.supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getEmailTemplates() {
    const { data, error } = await this.supabase
      .from('email_templates')
      .select(`
        *,
        placeholders:template_placeholders(*),
        categories:template_categories_assignments(
          category:template_categories(*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getEmailTemplate(id: number) {
    const { data, error } = await this.supabase
      .from('email_templates')
      .select(`
        *,
        placeholders:template_placeholders(*),
        categories:template_categories_assignments(
          category:template_categories(*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async updateEmailTemplate(id: number, data: any) {
    const { data: result, error } = await this.supabase
      .from('email_templates')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async deleteEmailTemplate(id: number) {
    const { error } = await this.supabase
      .from('email_templates')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Template Placeholders
  async createTemplatePlaceholder(placeholder: any) {
    const { data, error } = await this.supabase
      .from('template_placeholders')
      .insert(placeholder)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getTemplatePlaceholders(templateId: number) {
    const { data, error } = await this.supabase
      .from('template_placeholders')
      .select('*')
      .eq('template_id', templateId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async updateTemplatePlaceholder(id: number, data: any) {
    const { data: result, error } = await this.supabase
      .from('template_placeholders')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async deleteTemplatePlaceholder(id: number) {
    const { error } = await this.supabase
      .from('template_placeholders')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Template Categories
  async getTemplateCategories() {
    const { data, error } = await this.supabase
      .from('template_categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async createTemplateCategory(category: any) {
    const { data, error } = await this.supabase
      .from('template_categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Database Setup
  async initDatabase() {
    // For Supabase, tables are managed via migrations
    console.log('🗄️ Supabase database initialized (tables managed via migrations)')
  }
}

// SQLite Adapter (per staging/testing)
export class SQLiteAdapter implements DatabaseAdapter {
  private db: any
  private storage: any

  constructor(dbPath: string, storageClient?: any) {
    const Database = require('better-sqlite3')
    this.db = new Database(dbPath)
    this.storage = storageClient
    this.initDatabase()
  }

  async initDatabase() {
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ab_tests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        traffic_split INTEGER DEFAULT 50,
        start_date TEXT,
        end_date TEXT,
        target_element TEXT,
        target_selector TEXT,
        conversion_goal TEXT,
        statistical_significance REAL DEFAULT 0.95,
        total_visitors INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        conversion_rate REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ab_variants (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        name TEXT NOT NULL,
        content TEXT,
        css_class TEXT,
        css_style TEXT,
        is_control BOOLEAN DEFAULT FALSE,
        is_winner BOOLEAN DEFAULT FALSE,
        visitors INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        conversion_rate REAL DEFAULT 0,
        confidence_level REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_id) REFERENCES ab_tests (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ab_test_results (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        variant_id TEXT NOT NULL,
        visitor_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_id) REFERENCES ab_tests (id) ON DELETE CASCADE,
        FOREIGN KEY (variant_id) REFERENCES ab_variants (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ab_visitor_assignments (
        visitor_id TEXT NOT NULL,
        test_id TEXT NOT NULL,
        variant_id TEXT NOT NULL,
        assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (visitor_id, test_id),
        FOREIGN KEY (test_id) REFERENCES ab_tests (id) ON DELETE CASCADE,
        FOREIGN KEY (variant_id) REFERENCES ab_variants (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        visitor_id TEXT,
        page_url TEXT,
        user_agent TEXT,
        ip_address TEXT,
        referrer TEXT,
        email TEXT,
        action TEXT,
        timestamp TEXT,
        scroll_depth INTEGER,
        time_on_page INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        visitor_id TEXT,
        email TEXT,
        token TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS anonymous_counters (
        key TEXT PRIMARY KEY,
        total_visits INTEGER DEFAULT 0,
        total_downloads INTEGER DEFAULT 0,
        total_email_submissions INTEGER DEFAULT 0,
        total_goodreads_clicks INTEGER DEFAULT 0,
        total_substack_clicks INTEGER DEFAULT 0,
        total_publisher_clicks INTEGER DEFAULT 0,
        last_updated TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS email_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        html_content TEXT NOT NULL,
        text_content TEXT,
        description TEXT,
        is_default BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS template_placeholders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        placeholder_key TEXT NOT NULL,
        placeholder_name TEXT NOT NULL,
        description TEXT,
        default_value TEXT,
        is_required BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS template_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

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
         '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Download is Ready</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"><h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Download is Ready!</h1></div><div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;"><h2 style="color: #2c3e50; margin-top: 0;">Hi {{user_name}},</h2><p>Thank you for your interest in <strong>{{book_title}}</strong>! Your free ebook is now ready for download.</p><div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;"><h3 style="margin-top: 0; color: #2c3e50;">📖 About the Book</h3><p style="margin-bottom: 15px;">{{book_description}}</p><p><strong>Author:</strong> {{author_name}}</p><p><strong>Pages:</strong> {{page_count}}</p></div><div style="text-align: center; margin: 30px 0;"><a href="{{download_link}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">📥 Download Your Free Ebook</a></div><div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;"><h4 style="margin-top: 0; color: #2c3e50;">💡 What''s Next?</h4><ul style="margin: 10px 0; padding-left: 20px;"><li>Read the book and share your thoughts</li><li>Follow us on social media for updates</li><li>Check out our other free resources</li></ul></div><p>This download link will expire in <strong>{{expiry_hours}} hours</strong>, so make sure to download it soon!</p><p>If you have any questions or need help, feel free to reply to this email.</p><p>Happy reading!<br><strong>The {{site_name}} Team</strong></p><hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;"><div style="text-align: center; font-size: 12px; color: #666;"><p>You received this email because you requested a free download of {{book_title}}.</p><p><a href="{{unsubscribe_link}}" style="color: #667eea;">Unsubscribe</a> | <a href="{{preferences_link}}" style="color: #667eea;">Email Preferences</a></p></div></div></body></html>',
         'Hi {{user_name}},\n\nThank you for your interest in {{book_title}}! Your free ebook is now ready for download.\n\nAbout the Book:\n{{book_description}}\n\nAuthor: {{author_name}}\nPages: {{page_count}}\n\nDownload your free ebook here: {{download_link}}\n\nThis download link will expire in {{expiry_hours}} hours, so make sure to download it soon!\n\nHappy reading!\nThe {{site_name}} Team\n\n---\nYou received this email because you requested a free download of {{book_title}}.\nUnsubscribe: {{unsubscribe_link}}',
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
    `)
  }

  async createABTest(test: any) {
    const stmt = this.db.prepare(`
      INSERT INTO ab_tests (
        id, name, description, type, status, traffic_split, start_date, end_date,
        target_element, target_selector, conversion_goal, statistical_significance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      test.id, test.name, test.description, test.type, test.status,
      test.traffic_split, test.start_date, test.end_date, test.target_element,
      test.target_selector, test.conversion_goal, test.statistical_significance
    )
    
    return { id: test.id, ...test }
  }

  async getABTests() {
    const stmt = this.db.prepare(`
      SELECT * FROM ab_tests ORDER BY created_at DESC
    `)
    
    const tests = stmt.all()
    
    // Get variants for each test
    for (const test of tests) {
      const variantsStmt = this.db.prepare(`
        SELECT * FROM ab_variants WHERE test_id = ? ORDER BY created_at
      `)
      test.variants = variantsStmt.all(test.id)
    }
    
    return tests
  }

  async updateABTest(id: string, data: any) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = Object.values(data)
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE ab_tests SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
    
    stmt.run(...values)
    
    return this.getABTestById(id)
  }

  private getABTestById(id: string) {
    const stmt = this.db.prepare('SELECT * FROM ab_tests WHERE id = ?')
    return stmt.get(id)
  }

  async deleteABTest(id: string) {
    const stmt = this.db.prepare('DELETE FROM ab_tests WHERE id = ?')
    stmt.run(id)
  }

  async createABVariant(variant: any) {
    const stmt = this.db.prepare(`
      INSERT INTO ab_variants (
        id, test_id, name, content, css_class, css_style, is_control, is_winner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      variant.id, variant.test_id, variant.name, variant.content,
      variant.css_class, variant.css_style, 
      variant.is_control ? 1 : 0, 
      variant.is_winner ? 1 : 0
    )
    
    return { id: variant.id, ...variant }
  }

  async getABVariants(testId: string) {
    const stmt = this.db.prepare(`
      SELECT * FROM ab_variants WHERE test_id = ? ORDER BY created_at
    `)
    
    return stmt.all(testId)
  }

  async updateABVariant(id: string, data: any) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = Object.values(data).map(value => {
      // Convert boolean values to integers for SQLite
      if (typeof value === 'boolean') {
        return value ? 1 : 0
      }
      return value
    })
    values.push(id)
    
    const stmt = this.db.prepare(`
      UPDATE ab_variants SET ${fields} WHERE id = ?
    `)
    
    stmt.run(...values)
    
    const getStmt = this.db.prepare('SELECT * FROM ab_variants WHERE id = ?')
    return getStmt.get(id)
  }

  async trackABResult(result: any) {
    const stmt = this.db.prepare(`
      INSERT INTO ab_test_results (
        id, test_id, variant_id, visitor_id, event_type
      ) VALUES (?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      result.id, result.test_id, result.variant_id,
      result.visitor_id, result.event_type
    )
    
    // Update test and variant stats
    this.updateStats(result.test_id, result.variant_id)
    
    return { id: result.id, ...result }
  }

  private updateStats(testId: string, variantId: string) {
    // Update variant stats
    const variantStatsStmt = this.db.prepare(`
      UPDATE ab_variants SET
        visitors = (
          SELECT COUNT(DISTINCT visitor_id) 
          FROM ab_test_results 
          WHERE variant_id = ? AND event_type = 'visit'
        ),
        conversions = (
          SELECT COUNT(DISTINCT visitor_id) 
          FROM ab_test_results 
          WHERE variant_id = ? AND event_type = 'conversion'
        )
      WHERE id = ?
    `)
    
    variantStatsStmt.run(variantId, variantId, variantId)
    
    // Update conversion rate
    const updateRateStmt = this.db.prepare(`
      UPDATE ab_variants SET
        conversion_rate = CASE 
          WHEN visitors > 0 THEN (conversions * 100.0 / visitors)
          ELSE 0 
        END
      WHERE id = ?
    `)
    
    updateRateStmt.run(variantId)
    
    // Update test stats
    const testStatsStmt = this.db.prepare(`
      UPDATE ab_tests SET
        total_visitors = (
          SELECT COUNT(DISTINCT visitor_id) 
          FROM ab_test_results 
          WHERE test_id = ? AND event_type = 'visit'
        ),
        conversions = (
          SELECT COUNT(DISTINCT visitor_id) 
          FROM ab_test_results 
          WHERE test_id = ? AND event_type = 'conversion'
        )
      WHERE id = ?
    `)
    
    testStatsStmt.run(testId, testId, testId)
    
    // Update test conversion rate
    const updateTestRateStmt = this.db.prepare(`
      UPDATE ab_tests SET
        conversion_rate = CASE 
          WHEN total_visitors > 0 THEN (conversions * 100.0 / total_visitors)
          ELSE 0 
        END
      WHERE id = ?
    `)
    
    updateTestRateStmt.run(testId)
  }

  async getABResults(testId: string) {
    const stmt = this.db.prepare(`
      SELECT * FROM ab_test_results WHERE test_id = ?
    `)
    
    return stmt.all(testId)
  }

  async createAssignment(assignment: any) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO ab_visitor_assignments (
        visitor_id, test_id, variant_id
      ) VALUES (?, ?, ?)
    `)
    
    stmt.run(assignment.visitor_id, assignment.test_id, assignment.variant_id)
    
    return assignment
  }

  async getAssignment(visitorId: string, testId: string) {
    const stmt = this.db.prepare(`
      SELECT * FROM ab_visitor_assignments 
      WHERE visitor_id = ? AND test_id = ?
    `)
    
    return stmt.get(visitorId, testId)
  }

  async trackVisit(data: any) {
    const stmt = this.db.prepare(`
      INSERT INTO analytics (
        id, visitor_id, page_url, user_agent, ip_address, referrer,
        email, action, timestamp, scroll_depth, time_on_page
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      data.id, data.visitor_id, data.page_url,
      data.user_agent, data.ip_address, data.referrer,
      data.email, data.action, data.timestamp,
      data.scroll_depth, data.time_on_page
    )
    
    return { id: data.id, ...data }
  }

  async trackDownload(data: any) {
    const stmt = this.db.prepare(`
      INSERT INTO downloads (
        id, visitor_id, email, token, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      data.id, data.visitor_id, data.email,
      data.token, data.ip_address, data.user_agent
    )
    
    return { id: data.id, ...data }
  }

  async getAnalytics() {
    const stmt = this.db.prepare(`
      SELECT * FROM analytics ORDER BY created_at DESC
    `)
    
    return stmt.all()
  }

  async getDownloadTokens() {
    const stmt = this.db.prepare(`
      SELECT * FROM downloads ORDER BY created_at DESC
    `)
    
    return stmt.all()
  }

  async getAnonymousCounters() {
    const stmt = this.db.prepare(`
      SELECT * FROM anonymous_counters WHERE key = ?
    `)
    
    const result = stmt.get('anonymous_counters')
    
    return result || {
      total_visits: 0,
      total_downloads: 0,
      total_email_submissions: 0,
      total_goodreads_clicks: 0,
      total_substack_clicks: 0,
      total_publisher_clicks: 0,
      last_updated: new Date().toISOString()
    }
  }

  async incrementAnonymousCounter(type: string) {
    const fieldMap: Record<string, string> = {
      'visits': 'total_visits',
      'downloads': 'total_downloads',
      'email_submissions': 'total_email_submissions',
      'goodreads_clicks': 'total_goodreads_clicks',
      'substack_clicks': 'total_substack_clicks',
      'publisher_clicks': 'total_publisher_clicks'
    }

    const field = fieldMap[type]
    if (!field) return

    // Try to update existing record
    const updateStmt = this.db.prepare(`
      UPDATE anonymous_counters 
      SET ${field} = ${field} + 1, last_updated = CURRENT_TIMESTAMP
      WHERE key = ?
    `)
    
    const result = updateStmt.run('anonymous_counters')
    
    // If no rows were updated, create the record
    if (result.changes === 0) {
      const insertStmt = this.db.prepare(`
        INSERT INTO anonymous_counters (
          key, ${field}, last_updated
        ) VALUES (?, 1, CURRENT_TIMESTAMP)
      `)
      
      insertStmt.run('anonymous_counters')
    }
  }

  // Email Templates
  async createEmailTemplate(template: any) {
    const stmt = this.db.prepare(`
      INSERT INTO email_templates (
        name, subject, html_content, text_content, description, is_default
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      template.name,
      template.subject,
      template.html_content,
      template.text_content,
      template.description,
      template.is_default ? 1 : 0
    )
    
    return { id: result.lastInsertRowid, ...template }
  }

  async getEmailTemplates() {
    const stmt = this.db.prepare(`
      SELECT * FROM email_templates ORDER BY created_at DESC
    `)
    
    return stmt.all()
  }

  async getEmailTemplate(id: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM email_templates WHERE id = ?
    `)
    
    return stmt.get(id)
  }

  async updateEmailTemplate(id: number, data: any) {
    const stmt = this.db.prepare(`
      UPDATE email_templates SET
        name = ?, subject = ?, html_content = ?, text_content = ?,
        description = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    stmt.run(
      data.name,
      data.subject,
      data.html_content,
      data.text_content,
      data.description,
      data.is_default ? 1 : 0,
      id
    )
    
    return this.getEmailTemplate(id)
  }

  async deleteEmailTemplate(id: number) {
    const stmt = this.db.prepare(`
      DELETE FROM email_templates WHERE id = ?
    `)
    
    stmt.run(id)
  }

  // Template Placeholders
  async createTemplatePlaceholder(placeholder: any) {
    const stmt = this.db.prepare(`
      INSERT INTO template_placeholders (
        template_id, placeholder_key, placeholder_name, description, default_value, is_required
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      placeholder.template_id,
      placeholder.placeholder_key,
      placeholder.placeholder_name,
      placeholder.description,
      placeholder.default_value,
      placeholder.is_required ? 1 : 0
    )
    
    return { id: result.lastInsertRowid, ...placeholder }
  }

  async getTemplatePlaceholders(templateId: number) {
    const stmt = this.db.prepare(`
      SELECT * FROM template_placeholders WHERE template_id = ? ORDER BY created_at ASC
    `)
    
    return stmt.all(templateId)
  }

  async updateTemplatePlaceholder(id: number, data: any) {
    const stmt = this.db.prepare(`
      UPDATE template_placeholders SET
        placeholder_key = ?, placeholder_name = ?, description = ?,
        default_value = ?, is_required = ?
      WHERE id = ?
    `)
    
    stmt.run(
      data.placeholder_key,
      data.placeholder_name,
      data.description,
      data.default_value,
      data.is_required ? 1 : 0,
      id
    )
    
    return { id, ...data }
  }

  async deleteTemplatePlaceholder(id: number) {
    const stmt = this.db.prepare(`
      DELETE FROM template_placeholders WHERE id = ?
    `)
    
    stmt.run(id)
  }

  // Template Categories
  async getTemplateCategories() {
    const stmt = this.db.prepare(`
      SELECT * FROM template_categories ORDER BY name ASC
    `)
    
    return stmt.all()
  }

  async createTemplateCategory(category: any) {
    const stmt = this.db.prepare(`
      INSERT INTO template_categories (name, description) VALUES (?, ?)
    `)
    
    const result = stmt.run(category.name, category.description)
    
    return { id: result.lastInsertRowid, ...category }
  }
}

// Factory per creare l'adapter corretto
export function createDatabaseAdapter(provider: string, config: any): DatabaseAdapter {
  switch (provider) {
    case 'supabase':
      return new SupabaseAdapter(config.client)
    case 'sqlite':
      return new SQLiteAdapter(config.path)
    case 'railway':
      // Railway usa PostgreSQL, quindi possiamo riutilizzare SupabaseAdapter
      return new SupabaseAdapter(config.client)
    default:
      throw new Error(`Unsupported database provider: ${provider}`)
  }
}
