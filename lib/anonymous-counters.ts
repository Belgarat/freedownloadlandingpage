import { supabaseAdmin } from '@/lib/supabase'

export interface AnonymousCounters {
  totalVisits: number
  totalDownloads: number
  totalEmailSubmissions: number
  lastUpdated: string
}

/**
 * GDPR-compliant anonymous counters
 * These counters track only aggregate numbers without any personal data
 * They are always active and don't require cookie consent
 */
export class AnonymousCounterService {
  private static COUNTERS_KEY = 'anonymous_counters'

  /**
   * Increment visit counter (always allowed, no personal data)
   */
  static async incrementVisits(): Promise<void> {
    try {
      // Get current counters
      const { data: existing } = await supabaseAdmin
        .from('anonymous_counters')
        .select('*')
        .eq('key', this.COUNTERS_KEY)
        .single()

      const currentVisits = existing?.total_visits || 0
      const newVisits = currentVisits + 1

      // Upsert counter
      await supabaseAdmin
        .from('anonymous_counters')
        .upsert({
          key: this.COUNTERS_KEY,
          total_visits: newVisits,
          total_downloads: existing?.total_downloads || 0,
          total_email_submissions: existing?.total_email_submissions || 0,
          last_updated: new Date().toISOString()
        })

    } catch (error) {
      console.error('Error incrementing visits counter:', error)
    }
  }

  /**
   * Increment download counter (always allowed, no personal data)
   */
  static async incrementDownloads(): Promise<void> {
    try {
      // Get current counters
      const { data: existing } = await supabaseAdmin
        .from('anonymous_counters')
        .select('*')
        .eq('key', this.COUNTERS_KEY)
        .single()

      const currentDownloads = existing?.total_downloads || 0
      const newDownloads = currentDownloads + 1

      // Upsert counter
      await supabaseAdmin
        .from('anonymous_counters')
        .upsert({
          key: this.COUNTERS_KEY,
          total_visits: existing?.total_visits || 0,
          total_downloads: newDownloads,
          total_email_submissions: existing?.total_email_submissions || 0,
          last_updated: new Date().toISOString()
        })

    } catch (error) {
      console.error('Error incrementing downloads counter:', error)
    }
  }

  /**
   * Increment email submissions counter (always allowed, no personal data)
   */
  static async incrementEmailSubmissions(): Promise<void> {
    try {
      // Get current counters
      const { data: existing } = await supabaseAdmin
        .from('anonymous_counters')
        .select('*')
        .eq('key', this.COUNTERS_KEY)
        .single()

      const currentEmails = existing?.total_email_submissions || 0
      const newEmails = currentEmails + 1

      // Upsert counter
      await supabaseAdmin
        .from('anonymous_counters')
        .upsert({
          key: this.COUNTERS_KEY,
          total_visits: existing?.total_visits || 0,
          total_downloads: existing?.total_downloads || 0,
          total_email_submissions: newEmails,
          last_updated: new Date().toISOString()
        })

    } catch (error) {
      console.error('Error incrementing email submissions counter:', error)
    }
  }

  /**
   * Get current counters
   */
  static async getCounters(): Promise<AnonymousCounters> {
    try {
      const { data: counters } = await supabaseAdmin
        .from('anonymous_counters')
        .select('*')
        .eq('key', this.COUNTERS_KEY)
        .single()

      return {
        totalVisits: counters?.total_visits || 0,
        totalDownloads: counters?.total_downloads || 0,
        totalEmailSubmissions: counters?.total_email_submissions || 0,
        lastUpdated: counters?.last_updated || new Date().toISOString()
      }
    } catch (error) {
      console.error('Error getting counters:', error)
      return {
        totalVisits: 0,
        totalDownloads: 0,
        totalEmailSubmissions: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }
} 