import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseAdapter } from '@/lib/database-adapter'
import type { AnalyticsFilters } from '@/types/email-analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters from query parameters
    const filters: AnalyticsFilters = {
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      template_ids: searchParams.get('template_ids')?.split(',').map(Number) || undefined,
      status: searchParams.get('status')?.split(',') || undefined
    }

    // Create database adapter
    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    // Get analytics summary
    const analytics = await adapter.getAnalyticsSummary(filters)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching email template analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create database adapter
    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    // Track email usage
    const usage = await adapter.trackEmailUsage(body)

    return NextResponse.json(usage)
  } catch (error) {
    console.error('Error tracking email usage:', error)
    return NextResponse.json(
      { error: 'Failed to track email usage' },
      { status: 500 }
    )
  }
}
