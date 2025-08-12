import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

// Helper function to transform database config to frontend format
function transformConfigForFrontend(config: any) {
  const { marketing, theme, content, book, seo, email } = config

  // Transform book config to match frontend expectations
  const transformedBook = book ? {
    ...book,
    // Map database fields to frontend expected fields
    description: book.description_content,
    authorBio: book.author_bio,
    publisherUrl: book.publisher_url,
    substackName: book.substack_name,
    coverImage: book.cover_image,
    reviewCount: book.review_count,
    publicationDate: book.publication_date,
    amazonUrl: book.amazon_url,
    goodreadsUrl: book.goodreads_url,
    substackUrl: book.substack_url,
    fileSize: book.file_size,
    pageCount: book.page_count,
    isFree: book.is_free
  } : null

  // Transform SEO config to match frontend expectations
  const transformedSEO = seo ? {
    ...seo,
    // Map database fields to frontend expected fields
    meta: {
      title: seo.meta?.title,
      description: seo.meta?.description,
      keywords: seo.meta?.keywords,
      author: seo.meta?.author,
      robots: seo.meta?.robots,
      canonical: seo.meta?.canonical
    },
    openGraph: {
      title: seo.openGraph?.title,
      description: seo.openGraph?.description,
      type: seo.openGraph?.type,
      url: seo.openGraph?.url,
      image: seo.openGraph?.image,
      siteName: seo.openGraph?.siteName
    },
    twitter: {
      card: seo.twitter?.card,
      title: seo.twitter?.title,
      description: seo.twitter?.description,
      image: seo.twitter?.image
    },
    structuredData: seo.structured_data
  } : null

  // Transform email config to match frontend expectations
  const transformedEmail = email ? {
    ...email,
    // Map database fields to frontend expected fields
    sender: {
      name: email.sender?.name,
      email: email.sender?.email,
      replyTo: email.sender?.replyTo
    },
    templates: email.templates,
    settings: {
      templateExpiryHours: email.settings?.templateExpiryHours,
      maxRetries: email.settings?.maxRetries,
      tracking: email.settings?.tracking
    }
  } : null

  return {
    marketing,
    theme,
    content,
    book: transformedBook,
    seo: transformedSEO,
    email: transformedEmail
  }
}

export async function GET(request: NextRequest) {
  try {
    const configService = new ConfigService()
    
    // Get active configurations from database
    const [marketingConfig, themeConfig, contentConfig, bookConfig, seoConfig, emailConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig(),
      configService.getActiveBookConfig(),
      configService.getActiveSEOConfig(),
      configService.getActiveEmailConfig()
    ])

    const config = transformConfigForFrontend({
      marketing: marketingConfig,
      theme: themeConfig,
      content: contentConfig,
      book: bookConfig,
      seo: seoConfig,
      email: emailConfig
    })
    
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
    const configService = new ConfigService()
    
    // Save configurations to database
    const results = []
    
    if (body.marketing) {
      const marketingResult = await configService.createMarketingConfig(body.marketing)
      results.push({ type: 'marketing', id: marketingResult.id })
    }
    
    if (body.theme) {
      const themeResult = await configService.createThemeConfig(body.theme)
      results.push({ type: 'theme', id: themeResult.id })
    }
    
    if (body.content) {
      const contentResult = await configService.createContentConfig(body.content)
      results.push({ type: 'content', id: contentResult.id })
    }
    
    if (body.book) {
      const bookResult = await configService.createBookConfig(body.book)
      results.push({ type: 'book', id: bookResult.id })
    }
    
    if (body.seo) {
      const seoResult = await configService.createSEOConfig(body.seo)
      results.push({ type: 'seo', id: seoResult.id })
    }
    
    if (body.email) {
      const emailResult = await configService.createEmailConfig(body.email)
      results.push({ type: 'email', id: emailResult.id })
    }

    console.log('✅ Configuration saved to database:', results)
    
    // Return the updated config
    const [marketingConfig, themeConfig, contentConfig, bookConfig, seoConfig, emailConfig] = await Promise.all([
      configService.getActiveMarketingConfig(),
      configService.getActiveThemeConfig(),
      configService.getActiveContentConfig(),
      configService.getActiveBookConfig(),
      configService.getActiveSEOConfig(),
      configService.getActiveEmailConfig()
    ])

    const config = transformConfigForFrontend({
      marketing: marketingConfig,
      theme: themeConfig,
      content: contentConfig,
      book: bookConfig,
      seo: seoConfig,
      email: emailConfig
    })
    
    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
      data: config
    })
  } catch (error) {
    console.error('❌ Error saving config in API:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save configuration'
    }, { status: 500 })
  }
}
