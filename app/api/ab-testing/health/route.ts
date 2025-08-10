import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
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

    // Test connessione database
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('count')
        .limit(1)
      
      if (error) {
        if (error.message.includes('relation "ab_tests" does not exist')) {
          health.database = 'connected'
          health.tables.ab_tests = false
        } else {
          health.database = 'error'
          console.error('Database error:', error)
        }
      } else {
        health.database = 'connected'
        health.tables.ab_tests = true
      }
    } catch (err) {
      health.database = 'error'
      console.error('Database connection error:', err)
    }

    // Test altre tabelle se ab_tests esiste
    if (health.tables.ab_tests) {
      try {
        await supabase.from('ab_variants').select('count').limit(1)
        health.tables.ab_variants = true
      } catch (err) {
        health.tables.ab_variants = false
      }

      try {
        await supabase.from('ab_test_results').select('count').limit(1)
        health.tables.ab_test_results = true
      } catch (err) {
        health.tables.ab_test_results = false
      }

      try {
        await supabase.from('ab_visitor_assignments').select('count').limit(1)
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
