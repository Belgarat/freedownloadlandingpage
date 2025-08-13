// Configuration Types for Database Migration
// These types represent the new database schema for configurations

export interface MarketingConfig {
  id?: number
  name: string
  description?: string
  cta_config: {
    primary: {
      text: string
      subtext: string
      loadingText: string
      successText: string
      errorText: string
    }
    social: {
      goodreads: {
        text: string
        url: string
        icon: string
        tracking: string
      }
      amazon: {
        text: string
        url: string
        icon: string
        tracking: string
      }
      publisher: {
        text: string
        url: string
        icon: string
        tracking: string
      }
    }
    newsletter: {
      text: string
      placeholder: string
      url: string
      tracking: string
    }
  }
  modal_config: {
    success: {
      title: string
      message: string
      buttonText: string
    }
    error: {
      title: string
      message: string
      buttonText: string
    }
  }
  offer_config: {
    endDate: string
    isLimited: boolean
    limitedText: string
  }
  social_proof_config: {
    showRating: boolean
    showReviewCount: boolean
    showRankings: boolean
    showAwards: boolean
  }
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export interface ThemeConfig {
  id?: number
  name: string
  description?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: {
      primary: string
      secondary: string
      muted: string
    }
    success: string
    error: string
    warning: string
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  layout: {
    type: string
    showCountdown: boolean
    showStories: boolean
    showTestimonials: boolean
    showAwards: boolean
    showRankings: boolean
  }
  spacing: {
    container: string
    section: string
    element: string
  }
  animations: {
    enabled: boolean
    duration: string
    easing: string
  }
  development: {
    debug: boolean
    hotReload: boolean
  }
  surface: {
    mode: string
  }
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export interface ContentConfig {
  id?: number
  language: string
  name: string
  about_book: string
  author_bio: string
  show_genre_components?: boolean
  stories: Array<{
    title: string
    description: string
    content: string
  }>
  testimonials: Array<{
    text: string
    author: string
    rating: number
    source: string
  }>
  footer: {
    copyright: string
    supportText: string
  }
  // Genre-specific components
  world_map?: {
    title: string
    description: string
    imageUrl?: string
    locations: Array<{
      name: string
      description: string
      x: number
      y: number
    }>
  }
  timeline?: Array<{
    id: string
    title: string
    description: string
    date: string
    category?: string
    imageUrl?: string
  }>
  character_profiles?: Array<{
    id: string
    name: string
    role: string
    description: string
    imageUrl?: string
    traits: string[]
    background: string
  }>
  mood_board?: {
    atmosphere: string
    items: Array<{
      id: string
      type: 'image' | 'text' | 'color'
      content: string
      description?: string
    }>
  }
  world_building?: {
    sections: Array<{
      id: string
      title: string
      content: string
      type: 'setting' | 'magic' | 'technology' | 'culture' | 'history'
      icon?: string
    }>
  }
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export interface ConfigABTest {
  id?: number
  test_name: string
  config_type: 'marketing' | 'theme' | 'content'
  config_a_id: number
  config_b_id: number
  start_date: string
  end_date?: string
  status: 'active' | 'completed' | 'paused'
  winner_config_id?: number
  confidence_level?: number
  total_participants: number
  created_at?: string
}

export interface ConfigUsage {
  id?: number
  config_type: 'marketing' | 'theme' | 'content'
  config_id: number
  visitor_id: string
  page_view: number
  email_submission: number
  download_request: number
  download_completed: number
  created_at?: string
  updated_at?: string
}

// Form data types for admin interface
export interface MarketingConfigFormData {
  name: string
  description?: string
  cta_config: MarketingConfig['cta_config']
  modal_config: MarketingConfig['modal_config']
  offer_config: MarketingConfig['offer_config']
  social_proof_config: MarketingConfig['social_proof_config']
}

export interface ThemeConfigFormData {
  name: string
  description?: string
  colors: ThemeConfig['colors']
  fonts: ThemeConfig['fonts']
  layout: ThemeConfig['layout']
  spacing: ThemeConfig['spacing']
  animations: ThemeConfig['animations']
  development: ThemeConfig['development']
  surface: ThemeConfig['surface']
}

export interface ContentConfigFormData {
  language: string
  name: string
  about_book: string
  author_bio: string
  stories: ContentConfig['stories']
  testimonials: ContentConfig['testimonials']
  footer: ContentConfig['footer']
}

// API response types
export interface ConfigListResponse {
  success: boolean
  data: {
    marketing: MarketingConfig[]
    theme: ThemeConfig[]
    content: ContentConfig[]
  }
  error?: string
}

export interface ConfigResponse {
  success: boolean
  data: MarketingConfig | ThemeConfig | ContentConfig
  error?: string
}

export interface ConfigABTestResponse {
  success: boolean
  data: ConfigABTest[]
  error?: string
}

// Configuration assignment for visitors
export interface VisitorConfigAssignment {
  visitor_id: string
  marketing_config_id: number
  theme_config_id: number
  content_config_id: number
  assigned_at: string
}

// Configuration statistics
export interface ConfigStats {
  config_id: number
  config_type: 'marketing' | 'theme' | 'content'
  total_visitors: number
  total_conversions: number
  conversion_rate: number
  avg_time_on_page: number
  bounce_rate: number
}

// Configuration comparison for A/B testing
export interface ConfigComparison {
  config_a: {
    id: number
    name: string
    stats: ConfigStats
  }
  config_b: {
    id: number
    name: string
    stats: ConfigStats
  }
  improvement: number
  confidence_level: number
  is_significant: boolean
  recommended_winner?: number
}

// Book Configuration Types
export interface BookConfig {
  id?: number
  name: string
  description?: string
  title: string
  subtitle?: string
  author: string
  author_bio?: string
  genre?: string
  publisher?: string
  publisher_url?: string
  publisher_tagline?: string
  substack_name?: string
  description_content?: string
  cover_image?: string
  rating: number
  review_count: number
  publication_date?: string
  isbn?: string
  asin?: string
  amazon_url?: string
  goodreads_url?: string
  substack_url?: string
  file_size?: string
  page_count?: number
  language: string
  format?: string
  is_free: boolean
  price?: number
  categories: string[]
  stories: Array<{
    title: string
    description: string
  }>
  awards: Array<{
    title: string
    type: string
  }>
  rankings: {
    kindleStore?: string
    sciFiAnthologies?: string
    cyberpunkSciFi?: string
    cyberpunkBooks?: string
  }
  ebook?: {
    defaultFormat?: 'pdf' | 'epub'
    pdf?: {
      url: string
      filename: string
      size: string
      uploadedAt: string
    }
    epub?: {
      url: string
      filename: string
      size: string
      uploadedAt: string
    }
  }
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

// SEO Configuration Types
export interface SEOConfig {
  id?: number
  name: string
  description?: string
  meta: {
    title?: string
    description?: string
    keywords?: string
    author?: string
    robots?: string
    canonical?: string
  }
  openGraph: {
    title?: string
    description?: string
    type?: string
    url?: string
    image?: string
    siteName?: string
  }
  twitter: {
    card?: string
    title?: string
    description?: string
    image?: string
  }
  structured_data: {
    book?: any
    [key: string]: any
  }
  sitemap: {
    enabled: boolean
    priority: number
    changefreq: string
  }
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

// Email Configuration Types
export interface EmailConfig {
  id?: number
  name: string
  description?: string
  sender: {
    name: string
    email: string
    replyTo?: string
  }
  templates: {
    download?: {
      subject: string
      html: string
      text: string
      message?: string
    }
    followup?: {
      subject: string
      html: string
      text: string
    }
    [key: string]: any
  }
  settings: {
    templateExpiryHours: number
    maxRetries: number
    tracking: boolean
  }
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

// Form data types for new configurations
export interface BookConfigFormData {
  name: string
  description?: string
  title: string
  subtitle?: string
  author: string
  author_bio?: string
  publisher?: string
  publisher_url?: string
  publisher_tagline?: string
  substack_name?: string
  description_content?: string
  cover_image?: string
  rating: number
  review_count: number
  publication_date?: string
  isbn?: string
  asin?: string
  amazon_url?: string
  goodreads_url?: string
  substack_url?: string
  file_size?: string
  page_count?: number
  language: string
  format?: string
  is_free: boolean
  price?: number
  categories: string[]
  stories: BookConfig['stories']
  awards: BookConfig['awards']
  rankings: BookConfig['rankings']
  ebook?: BookConfig['ebook']
}

export interface SEOConfigFormData {
  name: string
  description?: string
  meta: SEOConfig['meta']
  openGraph: SEOConfig['openGraph']
  twitter: SEOConfig['twitter']
  structured_data: SEOConfig['structured_data']
  sitemap: SEOConfig['sitemap']
}

export interface EmailConfigFormData {
  name: string
  description?: string
  sender: EmailConfig['sender']
  templates: EmailConfig['templates']
  settings: EmailConfig['settings']
}
