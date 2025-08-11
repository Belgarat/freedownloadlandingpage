export interface EmailTemplateUsage {
  id: number
  template_id: number
  sent_at: string
  recipient_email: string
  subject: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  opened_at?: string
  clicked_at?: string
  bounce_reason?: string
  user_agent?: string
  ip_address?: string
  created_at: string
}

export interface EmailTemplateMetrics {
  id: number
  template_id: number
  date: string
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_bounced: number
  total_failed: number
  open_rate: number
  click_rate: number
  bounce_rate: number
  created_at: string
  updated_at: string
}

export interface EmailTemplateABTest {
  id: number
  test_name: string
  template_a_id: number
  template_b_id: number
  start_date: string
  end_date?: string
  status: 'active' | 'completed' | 'paused'
  winner_template_id?: number
  confidence_level?: number
  total_participants: number
  created_at: string
}

export interface TemplateAnalyticsSummary {
  template_id: number
  template_name: string
  total_sent: number
  total_opened: number
  total_clicked: number
  open_rate: number
  click_rate: number
  last_sent?: string
  performance_score: number
}

export interface AnalyticsFilters {
  date_from?: string
  date_to?: string
  template_ids?: number[]
  status?: string[]
}

export interface AnalyticsChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}
