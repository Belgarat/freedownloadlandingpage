import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseAdapter } from '@/lib/database-adapter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template_id, theme_id } = body

    if (!template_id || !theme_id) {
      return NextResponse.json(
        { error: 'Template ID and Theme ID are required' },
        { status: 400 }
      )
    }

    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const assignment = await adapter.assignThemeToTemplate(template_id, theme_id)
    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error assigning theme to template:', error)
    return NextResponse.json(
      { error: 'Failed to assign theme to template' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const template_id = searchParams.get('template_id')

    if (!template_id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const theme = await adapter.getTemplateTheme(parseInt(template_id))
    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error getting template theme:', error)
    return NextResponse.json(
      { error: 'Failed to get template theme' },
      { status: 500 }
    )
  }
}
