import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getDatabaseAdapter } from '@/lib/database-config'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const adapter = getDatabaseAdapter()
    
    // Check if we're using SQLite
    if (adapter.constructor.name !== 'SQLiteAdapter') {
      return NextResponse.json({
        error: 'Backup only available for SQLite databases'
      }, { status: 400 })
    }

    // Get database path from adapter
    const dbPath = process.env.SQLITE_DB_PATH || '/tmp/staging.db'
    
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({
        error: 'Database file not found'
      }, { status: 404 })
    }

    // Read database file
    const dbBuffer = fs.readFileSync(dbPath)
    
    // Upload to Vercel Blob
    const filename = `backup-${new Date().toISOString().split('T')[0]}.db`
    const blob = await put(filename, dbBuffer, {
      access: 'public',
      addRandomSuffix: false
    })

    return NextResponse.json({
      success: true,
      backupUrl: blob.url,
      filename,
      size: dbBuffer.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Backup error:', error)
    return NextResponse.json({
      error: 'Failed to create backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const adapter = getDatabaseAdapter()
    
    // Check if we're using SQLite
    if (adapter.constructor.name !== 'SQLiteAdapter') {
      return NextResponse.json({
        error: 'Restore only available for SQLite databases'
      }, { status: 400 })
    }

    // For now, just return info about the database
    const dbPath = process.env.SQLITE_DB_PATH || '/tmp/staging.db'
    const exists = fs.existsSync(dbPath)
    
    let stats = null
    if (exists) {
      stats = fs.statSync(dbPath)
    }

    return NextResponse.json({
      databasePath: dbPath,
      exists,
      size: stats?.size || 0,
      lastModified: stats?.mtime || null,
      environment: process.env.NODE_ENV
    })

  } catch (error) {
    console.error('Database info error:', error)
    return NextResponse.json({
      error: 'Failed to get database info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
