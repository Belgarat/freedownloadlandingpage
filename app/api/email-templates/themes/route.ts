import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseAdapter } from '@/lib/database-adapter'
import type { ThemeFormData } from '@/types/email-themes'

export async function GET() {
  try {
    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const themes = await adapter.getEmailThemes()
    return NextResponse.json(themes)
  } catch (error) {
    console.error('Error fetching email themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const theme = await adapter.createEmailTheme(body)
    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error creating email theme:', error)
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    )
  }
}
