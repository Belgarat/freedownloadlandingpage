import { NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Get database adapter (automatically chooses provider based on ENV)
    const adapter = getDatabaseAdapter()
    
    // Check database connection
    try {
      await adapter.getABTests()
    } catch (dbError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      }, { status: 500 })
    }

    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      responseTime: `${responseTime}ms`,
      checks: {
        environment: 'ok',
        database: 'ok',
        api: 'ok'
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      responseTime: `${responseTime}ms`
    }, { status: 500 })
  }
}
