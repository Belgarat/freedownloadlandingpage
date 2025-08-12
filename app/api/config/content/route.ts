import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/content - Get all content configs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    
    const configs = await configService.getContentConfigs()
    
    // Filter by language if specified
    const filteredConfigs = language 
      ? configs.filter(config => config.language === language)
      : configs
    
    return NextResponse.json({
      success: true,
      data: filteredConfigs
    })
  } catch (error) {
    console.error('❌ Error fetching content configs:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch content configurations'
    }, { status: 500 })
  }
}

// POST /api/config/content - Create new content config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.language || !body.name || !body.about_book || !body.author_bio || !body.stories || !body.testimonials || !body.footer) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: language, name, about_book, author_bio, stories, testimonials, footer'
      }, { status: 400 })
    }

    const config = await configService.createContentConfig({
      language: body.language,
      name: body.name,
      about_book: body.about_book,
      author_bio: body.author_bio,
      stories: body.stories,
      testimonials: body.testimonials,
      footer: body.footer
    })
    
    return NextResponse.json({
      success: true,
      data: config,
      message: 'Content configuration created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating content config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create content configuration'
    }, { status: 500 })
  }
}
