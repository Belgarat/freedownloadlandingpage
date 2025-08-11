import { getDatabaseAdapter } from './database-config'

export interface AnonymousCounters {
  totalVisits: number
  totalDownloads: number
  totalEmailSubmissions: number
  totalGoodreadsClicks: number
  totalSubstackClicks: number
  totalPublisherClicks: number
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
      console.log('🔍 [AnonymousCounters] Incrementing visits...')
      
      const adapter = getDatabaseAdapter()
      await adapter.incrementAnonymousCounter('visits')
      
      console.log('✅ [AnonymousCounters] Visits incremented successfully')
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error incrementing visits counter:', error)
    }
  }

  /**
   * Increment download counter (always allowed, no personal data)
   */
  static async incrementDownloads(): Promise<void> {
    try {
      console.log('🔍 [AnonymousCounters] Incrementing downloads...')
      
      const adapter = getDatabaseAdapter()
      await adapter.incrementAnonymousCounter('downloads')
      
      console.log('✅ [AnonymousCounters] Downloads incremented successfully')
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error incrementing downloads counter:', error)
    }
  }

  /**
   * Increment email submissions counter (always allowed, no personal data)
   */
  static async incrementEmailSubmissions(): Promise<void> {
    try {
      console.log('🔍 [AnonymousCounters] Incrementing email submissions...')
      
      const adapter = getDatabaseAdapter()
      await adapter.incrementAnonymousCounter('email_submissions')
      
      console.log('✅ [AnonymousCounters] Email submissions incremented successfully')
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error incrementing email submissions counter:', error)
    }
  }

  /**
   * Increment Goodreads clicks counter (always allowed, no personal data)
   */
  static async incrementGoodreadsClicks(): Promise<void> {
    try {
      console.log('🔍 [AnonymousCounters] Incrementing Goodreads clicks...')
      
      const adapter = getDatabaseAdapter()
      await adapter.incrementAnonymousCounter('goodreads_clicks')
      
      console.log('✅ [AnonymousCounters] Goodreads clicks incremented successfully')
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error incrementing Goodreads clicks counter:', error)
    }
  }

  /**
   * Increment Substack clicks counter (always allowed, no personal data)
   */
  static async incrementSubstackClicks(): Promise<void> {
    try {
      console.log('🔍 [AnonymousCounters] Incrementing Substack clicks...')
      
      const adapter = getDatabaseAdapter()
      await adapter.incrementAnonymousCounter('substack_clicks')
      
      console.log('✅ [AnonymousCounters] Substack clicks incremented successfully')
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error incrementing Substack clicks counter:', error)
    }
  }

  /**
   * Increment Publisher clicks counter (always allowed, no personal data)
   */
  static async incrementPublisherClicks(): Promise<void> {
    try {
      console.log('🔍 [AnonymousCounters] Incrementing Publisher clicks...')
      
      const adapter = getDatabaseAdapter()
      await adapter.incrementAnonymousCounter('publisher_clicks')
      
      console.log('✅ [AnonymousCounters] Publisher clicks incremented successfully')
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error incrementing Publisher clicks counter:', error)
    }
  }

  /**
   * Get current counters
   */
  static async getCounters(): Promise<AnonymousCounters> {
    try {
      console.log('🔍 [AnonymousCounters] Getting counters...')
      
      const adapter = getDatabaseAdapter()
      const data = await adapter.getAnonymousCounters()
      
      const counters: AnonymousCounters = {
        totalVisits: data?.total_visits || 0,
        totalDownloads: data?.total_downloads || 0,
        totalEmailSubmissions: data?.total_email_submissions || 0,
        totalGoodreadsClicks: data?.total_goodreads_clicks || 0,
        totalSubstackClicks: data?.total_substack_clicks || 0,
        totalPublisherClicks: data?.total_publisher_clicks || 0,
        lastUpdated: data?.last_updated || new Date().toISOString()
      }

      console.log('✅ [AnonymousCounters] Counters retrieved:', counters)
      return counters
    } catch (error) {
      console.error('❌ [AnonymousCounters] Error getting counters:', error)
      return {
        totalVisits: 0,
        totalDownloads: 0,
        totalEmailSubmissions: 0,
        totalGoodreadsClicks: 0,
        totalSubstackClicks: 0,
        totalPublisherClicks: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }
} 