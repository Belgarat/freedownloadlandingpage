export interface EmailTemplate {
  id: number
  name: string
  subject: string
  html_content: string
  text_content?: string
  description?: string
  is_default: boolean
  created_at: string
  updated_at: string
  placeholders?: TemplatePlaceholder[]
  categories?: TemplateCategory[]
}

export interface TemplatePlaceholder {
  id: number
  template_id: number
  placeholder_key: string
  placeholder_name: string
  description?: string
  default_value?: string
  is_required: boolean
  created_at: string
}

export interface TemplateCategory {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface EmailTemplateFormData {
  name: string
  subject: string
  html_content: string
  text_content?: string
  description?: string
  is_default?: boolean
  placeholders?: Omit<TemplatePlaceholder, 'id' | 'template_id' | 'created_at'>[]
  category_ids?: number[]
}

export interface TemplatePreviewData {
  [key: string]: string | number | boolean
}

export interface EmailTemplateStats {
  total_templates: number
  default_templates: number
  categories_count: number
  total_placeholders: number
}

// Editor toolbar options
export interface EditorToolbarOption {
  name: string
  icon: string
  action: string
  shortcut?: string
  description?: string
}

// Placeholder suggestion
export interface PlaceholderSuggestion {
  key: string
  name: string
  description: string
  example: string
  category: 'user' | 'book' | 'system' | 'custom'
}

// Template validation
export interface TemplateValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Email preview settings
export interface PreviewSettings {
  showHtml: boolean
  showText: boolean
  showPlaceholders: boolean
  theme: 'light' | 'dark'
  device: 'desktop' | 'tablet' | 'mobile'
}
