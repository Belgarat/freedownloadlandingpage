import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

// GET /api/config/content/[id] - Get specific content config
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const config = await configService.getContentConfig(id)
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('❌ Error fetching content config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch content configuration'
    }, { status: 500 })
  }
}

// PUT /api/config/content/[id] - Update content config
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    const body = await request.json()
    
    const config = await configService.updateContentConfig(id, {
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
      message: 'Content configuration updated successfully'
    })
  } catch (error) {
    console.error('❌ Error updating content config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update content configuration'
    }, { status: 500 })
  }
}

// DELETE /api/config/content/[id] - Delete content config
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid configuration ID'
      }, { status: 400 })
    }

    await configService.deleteContentConfig(id)
    
    return NextResponse.json({
      success: true,
      message: 'Content configuration deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting content config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete content configuration'
    }, { status: 500 })
  }
}
