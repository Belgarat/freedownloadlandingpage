export interface ABTest {
  id: string
  name: string
  description: string
  type: ABTestType
  status: ABTestStatus
  variants: ABVariant[]
  traffic_split: number
  start_date: string
  end_date?: string
  target_element: string
  target_selector: string
  conversion_goal: ConversionGoal
  statistical_significance: number
  total_visitors: number
  conversions: number
  conversion_rate: number
  created_at: string
  updated_at: string
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
  css_class?: string
  css_style?: string
  visitors: number
  conversions: number
  conversion_rate: number
  is_control: boolean
  is_winner: boolean
  confidence_level?: number
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
  defaultVariants: Omit<ABVariant, 'id' | 'visitors' | 'conversions' | 'conversion_rate' | 'is_winner' | 'confidence_level' | 'improvement'>[]
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
        is_control: true
      },
      {
        name: 'Variant A',
        description: 'More urgent text',
        value: 'Get Your Free Copy Now',
        is_control: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused text',
        value: 'Start Reading Today',
        is_control: false
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
        css_class: 'bg-[var(--color-primary)]',
        is_control: true
      },
      {
        name: 'Variant A (Accent)',
        description: 'Accent color',
        value: 'accent',
        css_class: 'bg-[var(--color-accent)]',
        is_control: false
      },
      {
        name: 'Variant B (Secondary)',
        description: 'Secondary color',
        value: 'secondary',
        css_class: 'bg-[var(--color-secondary)]',
        is_control: false
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
        is_control: true
      },
      {
        name: 'Variant A',
        description: 'More descriptive headline',
        value: 'Fish Cannot Carry Guns: Speculative Fiction Stories',
        is_control: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused headline',
        value: 'Discover the Future in Fish Cannot Carry Guns',
        is_control: false
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
        css_class: 'text-2xl sm:text-4xl md:text-5xl',
        is_control: true
      },
      {
        name: 'Variant A (Larger)',
        description: 'Larger headline',
        value: 'text-3xl sm:text-5xl md:text-6xl',
        css_class: 'text-3xl sm:text-5xl md:text-6xl',
        is_control: false
      },
      {
        name: 'Variant B (Smaller)',
        description: 'Smaller headline',
        value: 'text-xl sm:text-3xl md:text-4xl',
        css_class: 'text-xl sm:text-3xl md:text-4xl',
        is_control: false
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
        is_control: true
      },
      {
        name: 'Variant A',
        description: 'More urgent offer',
        value: 'Get Your Free Copy - Limited Time',
        is_control: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused offer',
        value: 'Start Reading Your Free Copy Today',
        is_control: false
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
        is_control: true
      },
      {
        name: 'Variant A',
        description: 'Enhanced social proof',
        value: 'enhanced',
        is_control: false
      },
      {
        name: 'Variant B',
        description: 'Minimal social proof',
        value: 'minimal',
        is_control: false
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
        is_control: true
      },
      {
        name: 'Variant A',
        description: 'More specific placeholder',
        value: 'your@email.com',
        is_control: false
      },
      {
        name: 'Variant B',
        description: 'Benefit-focused placeholder',
        value: 'Get your free ebook',
        is_control: false
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
        css_class: 'grid-cols-1 lg:grid-cols-2',
        is_control: true
      },
      {
        name: 'Variant A',
        description: 'Single column layout',
        value: 'single',
        css_class: 'grid-cols-1',
        is_control: false
      },
      {
        name: 'Variant B',
        description: 'Full width layout',
        value: 'full-width',
        css_class: 'max-w-7xl grid-cols-1',
        is_control: false
      }
    ]
  }
}
