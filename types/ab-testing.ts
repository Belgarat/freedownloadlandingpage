export interface ABTest {
  id: string
  name: string
  description: string
  type: ABTestType
  status: ABTestStatus
  variants: ABVariant[]
  trafficSplit: number
  startDate: string
  endDate?: string
  targetElement: string
  targetSelector: string
  conversionGoal: ConversionGoal
  statisticalSignificance: number
  totalVisitors: number
  conversions: number
  conversionRate: number
  createdAt: string
  updatedAt: string
}

export type ABTestType = 
  | 'cta_button_text'
  | 'cta_button_color'
  | 'headline_text'
  | 'headline_size'
  | 'offer_text'
  | 'social_proof'
  | 'form_placeholder'
  | 'page_layout'

export type ABTestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'stopped'

export interface ABVariant {
  id: string
  name: string
  description: string
  value: string
  cssClass?: string
  cssStyle?: string
  visitors: number
  conversions: number
  conversionRate: number
  isControl: boolean
  isWinner: boolean
  confidenceLevel?: number
  improvement?: number
}

export interface ConversionGoal {
  type: 'email_submit' | 'download_click' | 'social_click' | 'scroll_depth'
  value?: string
  threshold?: number
}

export interface ABTestResult {
  testId: string
  variantId: string
  visitorId: string
  timestamp: string
  conversion: boolean
  conversionValue?: number
}

// Predefined test templates based on landing page elements
export const AB_TEST_TEMPLATES: Record<ABTestType, {
  name: string
  description: string
  targetSelector: string
  defaultVariants: Omit<ABVariant, 'id' | 'visitors' | 'conversions' | 'conversionRate' | 'isWinner' | 'confidenceLevel' | 'improvement'>[]
}> = {
  cta_button_text: {
    name: 'CTA Button Text',
    description: 'Test different call-to-action button texts',
    targetSelector: 'button[type="submit"]',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original button text',
        value: 'Download Free Ebook',
        isControl: true
      },
      {
        name: 'Variant A',
        description: 'More urgent text',
        value: 'Get Your Free Copy Now',
        isControl: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused text',
        value: 'Start Reading Today',
        isControl: false
      }
    ]
  },
  cta_button_color: {
    name: 'CTA Button Color',
    description: 'Test different button colors',
    targetSelector: 'button[type="submit"]',
    defaultVariants: [
      {
        name: 'Control (Primary)',
        description: 'Original primary color',
        value: 'primary',
        cssClass: 'bg-[var(--color-primary)]',
        isControl: true
      },
      {
        name: 'Variant A (Accent)',
        description: 'Accent color',
        value: 'accent',
        cssClass: 'bg-[var(--color-accent)]',
        isControl: false
      },
      {
        name: 'Variant B (Secondary)',
        description: 'Secondary color',
        value: 'secondary',
        cssClass: 'bg-[var(--color-secondary)]',
        isControl: false
      }
    ]
  },
  headline_text: {
    name: 'Headline Text',
    description: 'Test different main headline texts',
    targetSelector: 'h1, .text-2xl.font-bold',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original headline',
        value: 'Fish Cannot Carry Guns',
        isControl: true
      },
      {
        name: 'Variant A',
        description: 'More descriptive headline',
        value: 'Fish Cannot Carry Guns: Speculative Fiction Stories',
        isControl: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused headline',
        value: 'Discover the Future in Fish Cannot Carry Guns',
        isControl: false
      }
    ]
  },
  headline_size: {
    name: 'Headline Size',
    description: 'Test different headline font sizes',
    targetSelector: 'h1, .text-2xl.font-bold',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original size',
        value: 'text-2xl sm:text-4xl md:text-5xl',
        cssClass: 'text-2xl sm:text-4xl md:text-5xl',
        isControl: true
      },
      {
        name: 'Variant A (Larger)',
        description: 'Larger headline',
        value: 'text-3xl sm:text-5xl md:text-6xl',
        cssClass: 'text-3xl sm:text-5xl md:text-6xl',
        isControl: false
      },
      {
        name: 'Variant B (Smaller)',
        description: 'Smaller headline',
        value: 'text-xl sm:text-3xl md:text-4xl',
        cssClass: 'text-xl sm:text-3xl md:text-4xl',
        isControl: false
      }
    ]
  },
  offer_text: {
    name: 'Offer Text',
    description: 'Test different offer messages',
    targetSelector: 'h2:contains("Download Your Free Copy")',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original offer text',
        value: 'Download Your Free Copy',
        isControl: true
      },
      {
        name: 'Variant A',
        description: 'More urgent offer',
        value: 'Get Your Free Copy - Limited Time',
        isControl: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused offer',
        value: 'Start Reading Your Free Copy Today',
        isControl: false
      }
    ]
  },
  social_proof: {
    name: 'Social Proof',
    description: 'Test different social proof elements',
    targetSelector: '.rating, .review-count',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original social proof',
        value: 'show',
        isControl: true
      },
      {
        name: 'Variant A',
        description: 'Enhanced social proof',
        value: 'enhanced',
        isControl: false
      },
      {
        name: 'Variant B',
        description: 'Minimal social proof',
        value: 'minimal',
        isControl: false
      }
    ]
  },
  form_placeholder: {
    name: 'Form Placeholder',
    description: 'Test different email form placeholders',
    targetSelector: 'input[type="email"]',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original placeholder',
        value: 'Enter your email address',
        isControl: true
      },
      {
        name: 'Variant A',
        description: 'More specific placeholder',
        value: 'your@email.com',
        isControl: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused placeholder',
        value: 'Get your free ebook',
        isControl: false
      }
    ]
  },
  page_layout: {
    name: 'Page Layout',
    description: 'Test different page layouts',
    targetSelector: '.container, .grid',
    defaultVariants: [
      {
        name: 'Control',
        description: 'Original layout',
        value: 'default',
        cssClass: 'grid-cols-1 lg:grid-cols-2',
        isControl: true
      },
      {
        name: 'Variant A',
        description: 'Single column layout',
        value: 'single',
        cssClass: 'grid-cols-1',
        isControl: false
      },
      {
        name: 'Variant B',
        description: 'Full width layout',
        value: 'full-width',
        cssClass: 'max-w-7xl grid-cols-1',
        isControl: false
      }
    ]
  }
}
