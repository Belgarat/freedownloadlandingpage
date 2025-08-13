import { getGenrePreset, GenreType } from '@/lib/genre-presets'
import { ThemeConfig, ContentConfig, MarketingConfig, BookConfig, SEOConfig, EmailConfig } from '@/types/config'

export interface GenreApplicationResult {
  theme: Partial<ThemeConfig>
  content: Partial<ContentConfig>
  marketing: Partial<MarketingConfig>
  book: Partial<BookConfig>
  seo: Partial<SEOConfig>
  email: Partial<EmailConfig>
}

export class GenreService {
  static applyGenrePreset(genre: GenreType, currentConfig?: any): GenreApplicationResult {
    const preset = getGenrePreset(genre)
    
    return {
      theme: this.generateThemeConfig(preset, currentConfig?.theme),
      content: this.generateContentConfig(preset, currentConfig?.content),
      marketing: this.generateMarketingConfig(preset, currentConfig?.marketing),
      book: this.generateBookConfig(preset, currentConfig?.book),
      seo: this.generateSEOConfig(preset, currentConfig?.seo),
      email: this.generateEmailConfig(preset, currentConfig?.email)
    }
  }

  private static generateThemeConfig(preset: any, currentTheme?: any): Partial<ThemeConfig> {
    return {
      colors: {
        primary: preset.colorScheme.primary,
        secondary: preset.colorScheme.secondary,
        accent: preset.colorScheme.accent,
        background: preset.colorScheme.background,
        text: preset.colorScheme.text,
        surface: this.adjustBrightness(preset.colorScheme.background, 0.05),
        border: this.adjustBrightness(preset.colorScheme.background, -0.1)
      },
      typography: {
        heading_font: preset.fonts.heading,
        body_font: preset.fonts.body,
        heading_size: currentTheme?.typography?.heading_size || 'xl',
        body_size: currentTheme?.typography?.body_size || 'base'
      },
      layout: {
        type: preset.layout === 'epic' ? 'full-width' : 'default',
        show_countdown: currentTheme?.layout?.show_countdown ?? true,
        show_social_proof: preset.features.includes('hasCharacterProfiles'),
        show_testimonials: preset.features.includes('hasMoodBoard')
      },
      spacing: currentTheme?.spacing || {
        container_padding: '1rem',
        section_spacing: '2rem',
        element_spacing: '1rem'
      }
    }
  }

  private static generateContentConfig(preset: any, currentContent?: any): Partial<ContentConfig> {
    const baseContent = {
      headline: currentContent?.headline || 'Your Book Title',
      subtitle: currentContent?.subtitle || 'A compelling subtitle that hooks readers',
      description: currentContent?.description || 'Engaging description of your book...',
      author_name: currentContent?.author_name || 'Author Name',
      author_bio: currentContent?.author_bio || 'Brief author biography...',
      cta_text: currentContent?.cta_text || 'Get Your Free Copy',
      social_proof: currentContent?.social_proof || []
    }

    // Add genre-specific content
    if (preset.features.includes('hasCharacterProfiles')) {
      baseContent.character_profiles = currentContent?.character_profiles || []
    }

    if (preset.features.includes('hasWorldBuilding')) {
      baseContent.world_building = currentContent?.world_building || {
        setting: '',
        magic_system: '',
        technology: ''
      }
    }

    if (preset.features.includes('hasMoodBoard')) {
      baseContent.mood_board = currentContent?.mood_board || {
        images: [],
        keywords: [],
        atmosphere: ''
      }
    }

    return baseContent
  }

  private static generateMarketingConfig(preset: any, currentMarketing?: any): Partial<MarketingConfig> {
    return {
      offer: {
        type: 'free_download',
        title: currentMarketing?.offer?.title || 'Free Download',
        description: currentMarketing?.offer?.description || 'Get your free copy today!',
        end_date: currentMarketing?.offer?.end_date || this.getDefaultEndDate(),
        urgency_text: this.getUrgencyText(preset.genre)
      },
      cta: {
        primary_text: currentMarketing?.cta?.primary_text || 'Download Now',
        secondary_text: currentMarketing?.cta?.secondary_text || 'Learn More',
        style: this.getCTAStyle(preset.genre)
      },
      social_proof: {
        testimonials: currentMarketing?.social_proof?.testimonials || [],
        reviews: currentMarketing?.social_proof?.reviews || [],
        stats: currentMarketing?.social_proof?.stats || []
      },
      modal: {
        enabled: currentMarketing?.modal?.enabled ?? true,
        title: currentMarketing?.modal?.title || 'Get Your Free Copy',
        content: currentMarketing?.modal?.content || 'Enter your email to download...'
      }
    }
  }

  private static generateBookConfig(preset: any, currentBook?: any): Partial<BookConfig> {
    return {
      title: currentBook?.title || 'Your Book Title',
      subtitle: currentBook?.subtitle || 'Book Subtitle',
      author: currentBook?.author || 'Author Name',
      genre: preset.genre,
      description: currentBook?.description || 'Book description...',
      cover_image: currentBook?.cover_image || '',
      page_count: currentBook?.page_count || 300,
      publication_date: currentBook?.publication_date || new Date().toISOString(),
      isbn: currentBook?.isbn || '',
      publisher: currentBook?.publisher || 'Self-Published',
      language: currentBook?.language || 'English',
      format: currentBook?.format || 'ebook',
      price: currentBook?.price || 0,
      currency: currentBook?.currency || 'USD'
    }
  }

  private static generateSEOConfig(preset: any, currentSEO?: any): Partial<SEOConfig> {
    return {
      title: currentSEO?.title || 'Your Book Title - Free Download',
      description: currentSEO?.description || `Download ${preset.name} for free. ${preset.description}`,
      keywords: this.generateKeywords(preset.genre, currentSEO?.keywords),
      author: currentSEO?.author || 'Author Name',
      og_image: currentSEO?.og_image || '',
      twitter_card: currentSEO?.twitter_card || 'summary_large_image',
      canonical_url: currentSEO?.canonical_url || '',
      structured_data: currentSEO?.structured_data || this.generateStructuredData(preset.genre)
    }
  }

  private static generateEmailConfig(preset: any, currentEmail?: any): Partial<EmailConfig> {
    return {
      subject: currentEmail?.subject || `Your ${preset.name} download is ready!`,
      template: currentEmail?.template || this.generateEmailTemplate(preset.genre),
      sender_name: currentEmail?.sender_name || 'Author Name',
      sender_email: currentEmail?.sender_email || 'noreply@yourdomain.com',
      reply_to: currentEmail?.reply_to || 'author@yourdomain.com',
      follow_up_enabled: currentEmail?.follow_up_enabled ?? true,
      follow_up_delay: currentEmail?.follow_up_delay || 7,
      follow_up_subject: currentEmail?.follow_up_subject || `How are you enjoying ${preset.name}?`
    }
  }

  // Helper methods
  private static adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  private static getDefaultEndDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString()
  }

  private static getUrgencyText(genre: string): string {
    const urgencyTexts = {
      fantasy: 'Limited time offer - Join the adventure!',
      romance: 'Love is in the air - Get your copy now!',
      thriller: 'The clock is ticking - Don't miss out!',
      scifi: 'The future is now - Download today!',
      mystery: 'The mystery awaits - Claim your copy!',
      historical: 'Step back in time - Free for a limited time!',
      contemporary: 'Modern storytelling at its best - Get it free!',
      'young-adult': 'Your next favorite book - Download now!',
      'non-fiction': 'Knowledge is power - Get your free copy!',
      biography: 'An inspiring story - Yours for free!'
    }
    return urgencyTexts[genre as keyof typeof urgencyTexts] || 'Limited time offer!'
  }

  private static getCTAStyle(genre: string): string {
    const styles = {
      fantasy: 'epic',
      romance: 'elegant',
      thriller: 'dark',
      scifi: 'futuristic',
      mystery: 'noir',
      historical: 'period',
      contemporary: 'modern',
      'young-adult': 'youthful',
      'non-fiction': 'professional',
      biography: 'personal'
    }
    return styles[genre as keyof typeof styles] || 'modern'
  }

  private static generateKeywords(genre: string, existingKeywords?: string[]): string[] {
    const baseKeywords = existingKeywords || []
    const genreKeywords = {
      fantasy: ['fantasy', 'magic', 'adventure', 'epic', 'dragons', 'wizards'],
      romance: ['romance', 'love', 'passion', 'relationship', 'heartwarming'],
      thriller: ['thriller', 'suspense', 'mystery', 'crime', 'action'],
      scifi: ['science fiction', 'futuristic', 'technology', 'space', 'dystopian'],
      mystery: ['mystery', 'detective', 'crime', 'suspense', 'investigation'],
      historical: ['historical fiction', 'period drama', 'history', 'past'],
      contemporary: ['contemporary', 'modern', 'realistic', 'drama'],
      'young-adult': ['young adult', 'teen', 'coming of age', 'adolescence'],
      'non-fiction': ['non-fiction', 'educational', 'informative', 'knowledge'],
      biography: ['biography', 'memoir', 'autobiography', 'life story']
    }
    
    const genreSpecific = genreKeywords[genre as keyof typeof genreKeywords] || []
    return [...new Set([...baseKeywords, ...genreSpecific])]
  }

  private static generateStructuredData(genre: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      'genre': genre,
      'bookFormat': 'EBook',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      }
    }
  }

  private static generateEmailTemplate(genre: string): string {
    const templates = {
      fantasy: 'Welcome to the magical world of [BookTitle]! Your adventure begins now...',
      romance: 'Love is in the air! Your copy of [BookTitle] is ready to warm your heart...',
      thriller: 'The suspense is building! Your copy of [BookTitle] awaits...',
      scifi: 'The future is here! Download [BookTitle] and explore new worlds...',
      mystery: 'The mystery unfolds! Your copy of [BookTitle] is ready for investigation...',
      historical: 'Step back in time with [BookTitle]! Your journey through history begins...',
      contemporary: 'Modern storytelling at its finest! Enjoy [BookTitle]...',
      'young-adult': 'Your next favorite book is here! [BookTitle] awaits your discovery...',
      'non-fiction': 'Knowledge is power! Your copy of [BookTitle] is ready...',
      biography: 'An inspiring story awaits! Download [BookTitle] and be inspired...'
    }
    return templates[genre as keyof typeof templates] || 'Your copy of [BookTitle] is ready!'
  }
}
