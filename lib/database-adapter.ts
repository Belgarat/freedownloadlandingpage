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
  getAnalytics(): Promise<any>
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

  private initDatabase() {
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
      variant.css_class, variant.css_style, variant.is_control, variant.is_winner
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
    const values = Object.values(data)
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
        id, visitor_id, page_url, user_agent, ip_address, referrer
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      data.id, data.visitor_id, data.page_url,
      data.user_agent, data.ip_address, data.referrer
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
