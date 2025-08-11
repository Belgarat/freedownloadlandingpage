export interface EmailThemeCategory {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface EmailTheme {
  id: number
  name: string
  description?: string
  category_id?: number
  is_default: boolean
  is_custom: boolean
  created_by?: number
  created_at: string
  updated_at: string
  category?: EmailThemeCategory
  properties?: EmailThemeProperty[]
}

export interface EmailThemeProperty {
  id: number
  theme_id: number
  property_key: string
  property_value: string
  property_type: 'css' | 'html' | 'json'
  created_at: string
}

export interface EmailTemplateTheme {
  id: number
  template_id: number
  theme_id: number
  created_at: string
  theme?: EmailTheme
}

export interface ThemeStyles {
  primary_color: string
  secondary_color: string
  background_color: string
  text_color: string
  font_family: string
  border_radius: string
  header_style: Record<string, any>
  footer_style: Record<string, any>
  button_style: Record<string, any>
}

export interface ThemeFormData {
  name: string
  description?: string
  category_id?: number
  is_custom: boolean
  properties: Partial<ThemeStyles>
}

export interface ThemePreviewData {
  theme: EmailTheme
  styles: ThemeStyles
  preview_html: string
}
