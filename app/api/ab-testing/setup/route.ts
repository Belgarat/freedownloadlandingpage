import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

export async function POST(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()
    
    // Check if tables already exist
    try {
      const healthResponse = await fetch(`${request.nextUrl.origin}/api/ab-testing/health`)
      const healthData = await healthResponse.json()
      
      if (healthData.tables?.ab_tests) {
        return NextResponse.json({ 
          success: true, 
          message: 'A/B testing tables already exist',
          database: process.env.DB_ENGINE || 'sqlite'
        })
      }
    } catch (healthError) {
      // If health check fails, proceed with initialization
    }
    
    // Initialize database tables
    await adapter.initDatabase()
    
    return NextResponse.json({ 
      success: true, 
      message: 'A/B testing tables initialized successfully',
      database: process.env.DB_ENGINE || 'sqlite'
    })

  } catch (error) {
    console.error('Error setting up A/B testing tables:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
