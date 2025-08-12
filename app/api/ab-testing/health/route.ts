import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

export async function GET(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()
    const health = {
      database: 'unknown',
      tables: {
        ab_tests: false,
        ab_variants: false,
        ab_test_results: false,
        ab_visitor_assignments: false
      },
      timestamp: new Date().toISOString()
    }

    // Test database connection
    try {
      // Try to query ab_tests table
      const tests = await adapter.getABTests()
      health.database = 'connected'
      health.tables.ab_tests = true
    } catch (err: any) {
      if (err.message?.includes('no such table') || err.message?.includes('does not exist')) {
        health.database = 'connected'
        health.tables.ab_tests = false
      } else {
        health.database = 'error'
        console.error('Database error:', err)
      }
    }

    // Test other tables if ab_tests exists
    if (health.tables.ab_tests) {
      try {
        await adapter.getABVariants('test-id')
        health.tables.ab_variants = true
      } catch (err) {
        health.tables.ab_variants = false
      }

      try {
        // Test ab_test_results table
        const stmt = adapter.db.prepare('SELECT COUNT(*) FROM ab_test_results')
        stmt.get()
        health.tables.ab_test_results = true
      } catch (err) {
        health.tables.ab_test_results = false
      }

      try {
        // Test ab_visitor_assignments table
        const stmt = adapter.db.prepare('SELECT COUNT(*) FROM ab_visitor_assignments')
        stmt.get()
        health.tables.ab_visitor_assignments = true
      } catch (err) {
        health.tables.ab_visitor_assignments = false
      }
    }

    const allTablesExist = Object.values(health.tables).every(exists => exists)
    
    return NextResponse.json({
      ...health,
      ready: health.database === 'connected' && allTablesExist,
      setupRequired: health.database === 'connected' && !allTablesExist
    })

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        database: 'error',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
