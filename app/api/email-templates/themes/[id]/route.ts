import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseAdapter } from '@/lib/database-adapter'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid theme ID' },
        { status: 400 }
      )
    }

    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const theme = await adapter.getEmailTheme(id)
    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error fetching email theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid theme ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const theme = await adapter.updateEmailTheme(id, body)
    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error updating email theme:', error)
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid theme ID' },
        { status: 400 }
      )
    }

    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    await adapter.deleteEmailTheme(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email theme:', error)
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    )
  }
}
