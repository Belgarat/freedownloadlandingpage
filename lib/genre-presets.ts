import { GenrePreset, GenreType } from '@/types/genre-templates'

export const genrePresets: Record<GenreType, GenrePreset> = {
  fantasy: {
    genre: 'fantasy',
    name: 'Fantasy Realm',
    description: 'Magical worlds with epic adventures and mystical creatures',
    colorScheme: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#DAA520', // Goldenrod
      accent: '#FFD700', // Gold
      background: '#F5F5DC', // Beige
      text: '#2F2F2F' // Dark Gray
    },
    fonts: {
      heading: 'Cinzel, serif',
      body: 'Crimson Text, serif'
    },
    layout: 'epic',
    features: ['hasMap', 'hasCharacterProfiles', 'hasWorldBuilding']
  },
  
  romance: {
    genre: 'romance',
    name: 'Romantic Elegance',
    description: 'Passionate love stories with elegant design',
    colorScheme: {
      primary: '#FF69B4', // Hot Pink
      secondary: '#FFB6C1', // Light Pink
      accent: '#FF1493', // Deep Pink
      background: '#FFF0F5', // Lavender Blush
      text: '#4A4A4A' // Charcoal
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif'
    },
    layout: 'elegant',
    features: ['hasMoodBoard']
  },
  
  thriller: {
    genre: 'thriller',
    name: 'Dark Suspense',
    description: 'Gripping suspense with dark, mysterious atmosphere',
    colorScheme: {
      primary: '#2C2C2C', // Dark Gray
      secondary: '#DC143C', // Crimson
      accent: '#FF4500', // Orange Red
      background: '#1A1A1A', // Very Dark Gray
      text: '#FFFFFF' // White
    },
    fonts: {
      heading: 'Roboto Condensed, sans-serif',
      body: 'Open Sans, sans-serif'
    },
    layout: 'dark',
    features: ['hasTimeline']
  },
  
  scifi: {
    genre: 'scifi',
    name: 'Future Tech',
    description: 'Futuristic science fiction with high-tech aesthetics',
    colorScheme: {
      primary: '#00CED1', // Dark Turquoise
      secondary: '#4169E1', // Royal Blue
      accent: '#00FF7F', // Spring Green
      background: '#0A0A0A', // Black
      text: '#E0E0E0' // Light Gray
    },
    fonts: {
      heading: 'Orbitron, monospace',
      body: 'Exo 2, sans-serif'
    },
    layout: 'futuristic',
    features: ['hasWorldBuilding', 'hasTimeline']
  },
  
  mystery: {
    genre: 'mystery',
    name: 'Mystery Noir',
    description: 'Classic mystery with noir detective style',
    colorScheme: {
      primary: '#2F4F4F', // Dark Slate Gray
      secondary: '#696969', // Dim Gray
      accent: '#FFD700', // Gold
      background: '#F8F8FF', // Ghost White
      text: '#2F2F2F' // Dark Gray
    },
    fonts: {
      heading: 'Baskerville, serif',
      body: 'Georgia, serif'
    },
    layout: 'noir',
    features: ['hasTimeline']
  },
  
  historical: {
    genre: 'historical',
    name: 'Historical Elegance',
    description: 'Period-accurate historical fiction',
    colorScheme: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#CD853F', // Peru
      accent: '#DAA520', // Goldenrod
      background: '#FDF5E6', // Old Lace
      text: '#2F2F2F' // Dark Gray
    },
    fonts: {
      heading: 'Times New Roman, serif',
      body: 'Garamond, serif'
    },
    layout: 'period',
    features: ['hasTimeline', 'hasMap']
  },
  
  contemporary: {
    genre: 'contemporary',
    name: 'Modern Clean',
    description: 'Contemporary fiction with clean, modern design',
    colorScheme: {
      primary: '#4682B4', // Steel Blue
      secondary: '#87CEEB', // Sky Blue
      accent: '#FF6B6B', // Light Coral
      background: '#FFFFFF', // White
      text: '#333333' // Dark Gray
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Source Sans Pro, sans-serif'
    },
    layout: 'modern',
    features: []
  },
  
  'young-adult': {
    genre: 'young-adult',
    name: 'Youthful Energy',
    description: 'Vibrant design for young adult fiction',
    colorScheme: {
      primary: '#FF6B9D', // Pink
      secondary: '#4ECDC4', // Turquoise
      accent: '#45B7D1', // Blue
      background: '#F7F7F7', // Light Gray
      text: '#2C3E50' // Dark Blue Gray
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Nunito, sans-serif'
    },
    layout: 'youthful',
    features: ['hasCharacterProfiles']
  },
  
  'non-fiction': {
    genre: 'non-fiction',
    name: 'Professional Authority',
    description: 'Clean, professional design for non-fiction',
    colorScheme: {
      primary: '#34495E', // Dark Blue Gray
      secondary: '#7F8C8D', // Gray
      accent: '#E74C3C', // Red
      background: '#FFFFFF', // White
      text: '#2C3E50' // Dark Blue Gray
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Source Sans Pro, sans-serif'
    },
    layout: 'professional',
    features: ['hasTimeline']
  },
  
  biography: {
    genre: 'biography',
    name: 'Personal Story',
    description: 'Intimate design for biographical works',
    colorScheme: {
      primary: '#8E44AD', // Purple
      secondary: '#9B59B6', // Light Purple
      accent: '#F39C12', // Orange
      background: '#FEFEFE', // Off White
      text: '#2C3E50' // Dark Blue Gray
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif'
    },
    layout: 'personal',
    features: ['hasTimeline', 'hasCharacterProfiles']
  }
}

export function getGenrePreset(genre: GenreType): GenrePreset {
  return genrePresets[genre] || genrePresets.contemporary
}

export function getAllGenres(): GenreType[] {
  return Object.keys(genrePresets) as GenreType[]
}
