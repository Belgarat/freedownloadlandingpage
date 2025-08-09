import { NextRequest, NextResponse } from 'next/server'
import configLoader from '@/lib/config-loader'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const config = await configLoader.loadConfig()
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error loading config in API:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load configuration'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the configuration structure
    if (!body.book || !body.marketing || !body.content || !body.theme || !body.seo || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration structure'
      }, { status: 400 })
    }

    // Save each configuration file
    const configPath = path.join(process.cwd(), 'config')
    
    // Save book.json
    fs.writeFileSync(
      path.join(configPath, 'book.json'),
      JSON.stringify(body.book, null, 2)
    )

    // Save marketing.json
    fs.writeFileSync(
      path.join(configPath, 'marketing.json'),
      JSON.stringify(body.marketing, null, 2)
    )

    // Save content.json
    fs.writeFileSync(
      path.join(configPath, 'content.json'),
      JSON.stringify(body.content, null, 2)
    )

    // Save theme.json
    fs.writeFileSync(
      path.join(configPath, 'theme.json'),
      JSON.stringify(body.theme, null, 2)
    )

    // Save seo.json
    fs.writeFileSync(
      path.join(configPath, 'seo.json'),
      JSON.stringify(body.seo, null, 2)
    )

    // Save email.json
    fs.writeFileSync(
      path.join(configPath, 'email.json'),
      JSON.stringify(body.email, null, 2)
    )

    console.log('✅ Configuration saved successfully')
    
    // Reload the config to return the updated data
    const updatedConfig = await configLoader.loadConfig()
    
    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
      data: updatedConfig
    })
  } catch (error) {
    console.error('❌ Error saving config in API:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save configuration'
    }, { status: 500 })
  }
}
