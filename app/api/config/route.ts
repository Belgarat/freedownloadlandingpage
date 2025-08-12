import { NextRequest, NextResponse } from 'next/server'
import { ConfigService } from '@/lib/config-service'

// Helper function to transform database config to frontend format
function transformConfigForFrontend(config: any) {
  const { marketing, theme, content, book, seo, email } = config

  // Transform marketing config to match frontend expectations
  const transformedMarketing = marketing ? {
    ...marketing,
    // Map database fields to frontend expected fields
    offer: marketing.offer_config,
    cta: marketing.cta_config,
    modal: marketing.modal_config,
    socialProof: marketing.social_proof_config
  } : null

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
    marketing: transformedMarketing,
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
    
    // Transform frontend data to database format and update active configurations
    const results = []
    
    if (body.marketing) {
      // Get active marketing config and update it
      const activeMarketing = await configService.getActiveMarketingConfig()
      if (activeMarketing) {
        // Transform marketing config from frontend to database format
        const marketingData = {
          name: body.marketing.name || 'Marketing Config',
          description: body.marketing.description || 'Marketing configuration',
          ...body.marketing,
          // Map frontend fields to database fields
          cta_config: body.marketing.cta,
          modal_config: body.marketing.modal,
          offer_config: body.marketing.offer,
          social_proof_config: body.marketing.socialProof
        }
        delete marketingData.cta
        delete marketingData.modal
        delete marketingData.offer
        delete marketingData.socialProof
        
        const marketingResult = await configService.updateMarketingConfig(activeMarketing.id!, marketingData)
        results.push({ type: 'marketing', id: marketingResult.id, action: 'updated' })
      } else {
        // Create new if no active config exists
        const marketingData = {
          name: body.marketing.name || 'Marketing Config',
          description: body.marketing.description || 'Marketing configuration',
          ...body.marketing,
          cta_config: body.marketing.cta,
          modal_config: body.marketing.modal,
          offer_config: body.marketing.offer,
          social_proof_config: body.marketing.socialProof
        }
        delete marketingData.cta
        delete marketingData.modal
        delete marketingData.offer
        delete marketingData.socialProof
        
        const marketingResult = await configService.createMarketingConfig(marketingData)
        results.push({ type: 'marketing', id: marketingResult.id, action: 'created' })
      }
    }
    
    if (body.theme) {
      const activeTheme = await configService.getActiveThemeConfig()
      if (activeTheme) {
        const themeData = {
          name: body.theme.name || 'Theme Config',
          description: body.theme.description || 'Theme configuration',
          ...body.theme
        }
        const themeResult = await configService.updateThemeConfig(activeTheme.id!, themeData)
        results.push({ type: 'theme', id: themeResult.id, action: 'updated' })
      } else {
        const themeData = {
          name: body.theme.name || 'Theme Config',
          description: body.theme.description || 'Theme configuration',
          ...body.theme
        }
        const themeResult = await configService.createThemeConfig(themeData)
        results.push({ type: 'theme', id: themeResult.id, action: 'created' })
      }
    }
    
    if (body.content) {
      const activeContent = await configService.getActiveContentConfig()
      if (activeContent) {
        const contentData = {
          name: body.content.name || 'Content Config',
          description: body.content.description || 'Content configuration',
          ...body.content
        }
        const contentResult = await configService.updateContentConfig(activeContent.id!, contentData)
        results.push({ type: 'content', id: contentResult.id, action: 'updated' })
      } else {
        const contentData = {
          name: body.content.name || 'Content Config',
          description: body.content.description || 'Content configuration',
          ...body.content
        }
        const contentResult = await configService.createContentConfig(contentData)
        results.push({ type: 'content', id: contentResult.id, action: 'created' })
      }
    }
    
    if (body.book) {
      const activeBook = await configService.getActiveBookConfig()
      if (activeBook) {
        // Transform book config from frontend to database format
        const bookData = {
          name: body.book.name || `Book Config - ${body.book.title || 'Untitled'}`,
          description: body.book.description || 'Book configuration',
          ...body.book,
          // Map frontend fields to database fields
          description_content: body.book.description,
          author_bio: body.book.authorBio,
          publisher_url: body.book.publisherUrl,
          substack_name: body.book.substackName,
          cover_image: body.book.coverImage,
          review_count: body.book.reviewCount,
          publication_date: body.book.publicationDate,
          amazon_url: body.book.amazonUrl,
          goodreads_url: body.book.goodreadsUrl,
          substack_url: body.book.substackUrl,
          file_size: body.book.fileSize,
          page_count: body.book.pageCount,
          is_free: body.book.isFree
        }
        delete bookData.description
        delete bookData.authorBio
        delete bookData.publisherUrl
        delete bookData.substackName
        delete bookData.coverImage
        delete bookData.reviewCount
        delete bookData.publicationDate
        delete bookData.amazonUrl
        delete bookData.goodreadsUrl
        delete bookData.substackUrl
        delete bookData.fileSize
        delete bookData.pageCount
        delete bookData.isFree
        
        const bookResult = await configService.updateBookConfig(activeBook.id!, bookData)
        results.push({ type: 'book', id: bookResult.id, action: 'updated' })
      } else {
        // Create new if no active config exists
        const bookData = {
          name: body.book.name || `Book Config - ${body.book.title || 'Untitled'}`,
          description: body.book.description || 'Book configuration',
          ...body.book,
          description_content: body.book.description,
          author_bio: body.book.authorBio,
          publisher_url: body.book.publisherUrl,
          substack_name: body.book.substackName,
          cover_image: body.book.coverImage,
          review_count: body.book.reviewCount,
          publication_date: body.book.publicationDate,
          amazon_url: body.book.amazonUrl,
          goodreads_url: body.book.goodreadsUrl,
          substack_url: body.book.substackUrl,
          file_size: body.book.fileSize,
          page_count: body.book.pageCount,
          is_free: body.book.isFree
        }
        delete bookData.description
        delete bookData.authorBio
        delete bookData.publisherUrl
        delete bookData.substackName
        delete bookData.coverImage
        delete bookData.reviewCount
        delete bookData.publicationDate
        delete bookData.amazonUrl
        delete bookData.goodreadsUrl
        delete bookData.substackUrl
        delete bookData.fileSize
        delete bookData.pageCount
        delete bookData.isFree
        
        const bookResult = await configService.createBookConfig(bookData)
        results.push({ type: 'book', id: bookResult.id, action: 'created' })
      }
    }
    
    if (body.seo) {
      const activeSEO = await configService.getActiveSEOConfig()
      if (activeSEO) {
        // Transform SEO config from frontend to database format
        const seoData = {
          name: body.seo.name || 'SEO Config',
          description: body.seo.description || 'SEO configuration',
          ...body.seo,
          // Map frontend fields to database fields
          meta_title: body.seo.meta?.title,
          meta_description: body.seo.meta?.description,
          meta_keywords: body.seo.meta?.keywords,
          meta_author: body.seo.meta?.author,
          meta_robots: body.seo.meta?.robots,
          meta_canonical: body.seo.meta?.canonical,
          og_title: body.seo.openGraph?.title,
          og_description: body.seo.openGraph?.description,
          og_type: body.seo.openGraph?.type,
          og_url: body.seo.openGraph?.url,
          og_image: body.seo.openGraph?.image,
          og_site_name: body.seo.openGraph?.siteName,
          twitter_card: body.seo.twitter?.card,
          twitter_title: body.seo.twitter?.title,
          twitter_description: body.seo.twitter?.description,
          twitter_image: body.seo.twitter?.image,
          structured_data: body.seo.structuredData
        }
        delete seoData.meta
        delete seoData.openGraph
        delete seoData.twitter
        delete seoData.structuredData
        
        const seoResult = await configService.updateSEOConfig(activeSEO.id!, seoData)
        results.push({ type: 'seo', id: seoResult.id, action: 'updated' })
      } else {
        // Create new if no active config exists
        const seoData = {
          name: body.seo.name || 'SEO Config',
          description: body.seo.description || 'SEO configuration',
          ...body.seo,
          meta_title: body.seo.meta?.title,
          meta_description: body.seo.meta?.description,
          meta_keywords: body.seo.meta?.keywords,
          meta_author: body.seo.meta?.author,
          meta_robots: body.seo.meta?.robots,
          meta_canonical: body.seo.meta?.canonical,
          og_title: body.seo.openGraph?.title,
          og_description: body.seo.openGraph?.description,
          og_type: body.seo.openGraph?.type,
          og_url: body.seo.openGraph?.url,
          og_image: body.seo.openGraph?.image,
          og_site_name: body.seo.openGraph?.siteName,
          twitter_card: body.seo.twitter?.card,
          twitter_title: body.seo.twitter?.title,
          twitter_description: body.seo.twitter?.description,
          twitter_image: body.seo.twitter?.image,
          structured_data: body.seo.structuredData
        }
        delete seoData.meta
        delete seoData.openGraph
        delete seoData.twitter
        delete seoData.structuredData
        
        const seoResult = await configService.createSEOConfig(seoData)
        results.push({ type: 'seo', id: seoResult.id, action: 'created' })
      }
    }
    
    if (body.email) {
      const activeEmail = await configService.getActiveEmailConfig()
      if (activeEmail) {
        // Transform email config from frontend to database format
        const emailData = {
          name: body.email.name || 'Email Config',
          description: body.email.description || 'Email configuration',
          ...body.email,
          // Map frontend fields to database fields
          sender_name: body.email.sender?.name,
          sender_email: body.email.sender?.email,
          reply_to: body.email.sender?.replyTo,
          templates: body.email.templates,
          template_expiry_hours: body.email.settings?.templateExpiryHours,
          max_retries: body.email.settings?.maxRetries,
          tracking: body.email.settings?.tracking
        }
        delete emailData.sender
        delete emailData.settings
        
        const emailResult = await configService.updateEmailConfig(activeEmail.id!, emailData)
        results.push({ type: 'email', id: emailResult.id, action: 'updated' })
      } else {
        // Create new if no active config exists
        const emailData = {
          name: body.email.name || 'Email Config',
          description: body.email.description || 'Email configuration',
          ...body.email,
          sender_name: body.email.sender?.name,
          sender_email: body.email.sender?.email,
          reply_to: body.email.sender?.replyTo,
          templates: body.email.templates,
          template_expiry_hours: body.email.settings?.templateExpiryHours,
          max_retries: body.email.settings?.maxRetries,
          tracking: body.email.settings?.tracking
        }
        delete emailData.sender
        delete emailData.settings
        
        const emailResult = await configService.createEmailConfig(emailData)
        results.push({ type: 'email', id: emailResult.id, action: 'created' })
      }
    }

    console.log('Configuration saved to database:', results)
    
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
