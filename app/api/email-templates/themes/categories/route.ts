import { NextResponse } from 'next/server'
import { createDatabaseAdapter } from '@/lib/database-adapter'

export async function GET() {
  try {
    const dbEngine = process.env.DB_ENGINE || 'sqlite'
    const adapter = createDatabaseAdapter(dbEngine, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      sqlitePath: process.env.SQLITE_PATH || './data/landingfree.db'
    })

    const categories = await adapter.getEmailThemeCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching email theme categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
