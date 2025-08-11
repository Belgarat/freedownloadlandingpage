import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseAdapter } from '@/lib/database-config'

export async function POST(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()
    
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
