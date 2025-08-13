export type GenreType = 
  | 'fantasy'
  | 'romance'
  | 'thriller'
  | 'scifi'
  | 'mystery'
  | 'historical'
  | 'contemporary'
  | 'young-adult'
  | 'non-fiction'
  | 'biography'

export interface GenreTemplate {
  id: string
  name: string
  genre: GenreType
  description: string
  previewImage: string
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  layout: {
    type: 'default' | 'minimal' | 'full-width' | 'genre-specific'
    showCountdown: boolean
    showSocialProof: boolean
    showTestimonials: boolean
  }
  components: {
    header: 'default' | 'genre-specific'
    cover: 'default' | 'genre-specific'
    details: 'default' | 'genre-specific'
    footer: 'default' | 'genre-specific'
  }
  features: {
    hasMap?: boolean
    hasTimeline?: boolean
    hasCharacterProfiles?: boolean
    hasWorldBuilding?: boolean
    hasMoodBoard?: boolean
  }
  config: {
    theme: any
    content: any
    marketing: any
    book: any
    seo: any
    email: any
  }
}

export interface GenrePreset {
  genre: GenreType
  name: string
  description: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: string
  features: string[]
}
