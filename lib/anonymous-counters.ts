import { supabaseAdmin } from '@/lib/supabase'

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
      
      // Use SQL increment instead of upsert
      const { error: updateError } = await supabaseAdmin
        .rpc('increment_visits')

      if (updateError) {
        console.error('❌ [AnonymousCounters] Error incrementing visits:', updateError)
        
        // Fallback: manual increment
        const { data: existing, error: selectError } = await supabaseAdmin
          .from('anonymous_counters')
          .select('*')
          .eq('key', this.COUNTERS_KEY)
          .single()

        if (selectError) {
          console.error('❌ [AnonymousCounters] Error selecting visits:', selectError)
          return
        }

        const currentVisits = existing?.total_visits || 0
        const newVisits = currentVisits + 1
        
        console.log(`📊 [AnonymousCounters] Current visits: ${currentVisits}, New visits: ${newVisits}`)

        const { error: manualError } = await supabaseAdmin
          .from('anonymous_counters')
          .update({ 
            total_visits: newVisits,
            total_downloads: existing?.total_downloads || 0,
            total_email_submissions: existing?.total_email_submissions || 0,
            total_external_links: existing?.total_external_links || 0,
            last_updated: new Date().toISOString()
          })
          .eq('key', this.COUNTERS_KEY)

        if (manualError) {
          console.error('❌ [AnonymousCounters] Error manual update visits:', manualError)
        } else {
          console.log('✅ [AnonymousCounters] Visits incremented successfully (manual)')
        }
      } else {
        console.log('✅ [AnonymousCounters] Visits incremented successfully (RPC)')
      }

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
      
      // Use SQL increment instead of upsert
      const { error: updateError } = await supabaseAdmin
        .rpc('increment_downloads')

      if (updateError) {
        console.error('❌ [AnonymousCounters] Error incrementing downloads:', updateError)
        
        // Fallback: manual increment
        const { data: existing, error: selectError } = await supabaseAdmin
          .from('anonymous_counters')
          .select('*')
          .eq('key', this.COUNTERS_KEY)
          .single()

        if (selectError) {
          console.error('❌ [AnonymousCounters] Error selecting downloads:', selectError)
          return
        }

        const currentDownloads = existing?.total_downloads || 0
        const newDownloads = currentDownloads + 1
        
        console.log(`📊 [AnonymousCounters] Current downloads: ${currentDownloads}, New downloads: ${newDownloads}`)

        const { error: manualError } = await supabaseAdmin
          .from('anonymous_counters')
          .update({ 
            total_visits: existing?.total_visits || 0,
            total_downloads: newDownloads,
            total_email_submissions: existing?.total_email_submissions || 0,
            total_external_links: existing?.total_external_links || 0,
            last_updated: new Date().toISOString()
          })
          .eq('key', this.COUNTERS_KEY)

        if (manualError) {
          console.error('❌ [AnonymousCounters] Error manual update downloads:', manualError)
        } else {
          console.log('✅ [AnonymousCounters] Downloads incremented successfully (manual)')
        }
      } else {
        console.log('✅ [AnonymousCounters] Downloads incremented successfully (RPC)')
      }

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
      
      // Use SQL increment instead of upsert
      const { error: updateError } = await supabaseAdmin
        .rpc('increment_email_submissions')

      if (updateError) {
        console.error('❌ [AnonymousCounters] Error incrementing email submissions:', updateError)
        
        // Fallback: manual increment
        const { data: existing, error: selectError } = await supabaseAdmin
          .from('anonymous_counters')
          .select('*')
          .eq('key', this.COUNTERS_KEY)
          .single()

        if (selectError) {
          console.error('❌ [AnonymousCounters] Error selecting email submissions:', selectError)
          return
        }

        const currentEmails = existing?.total_email_submissions || 0
        const newEmails = currentEmails + 1
        
        console.log(`📊 [AnonymousCounters] Current emails: ${currentEmails}, New emails: ${newEmails}`)

        const { error: manualError } = await supabaseAdmin
          .from('anonymous_counters')
          .update({ 
            total_visits: existing?.total_visits || 0,
            total_downloads: existing?.total_downloads || 0,
            total_email_submissions: newEmails,
            total_external_links: existing?.total_external_links || 0,
            last_updated: new Date().toISOString()
          })
          .eq('key', this.COUNTERS_KEY)

        if (manualError) {
          console.error('❌ [AnonymousCounters] Error manual update email submissions:', manualError)
        } else {
          console.log('✅ [AnonymousCounters] Email submissions incremented successfully (manual)')
        }
      } else {
        console.log('✅ [AnonymousCounters] Email submissions incremented successfully (RPC)')
      }

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
      
      // Use SQL increment instead of upsert
      const { error: updateError } = await supabaseAdmin
        .rpc('increment_goodreads_clicks')

      if (updateError) {
        console.error('❌ [AnonymousCounters] Error incrementing Goodreads clicks:', updateError)
        
        // Fallback: manual increment
        const { data: existing, error: selectError } = await supabaseAdmin
          .from('anonymous_counters')
          .select('*')
          .eq('key', this.COUNTERS_KEY)
          .single()

        if (selectError) {
          console.error('❌ [AnonymousCounters] Error selecting Goodreads clicks:', selectError)
          return
        }

        const currentClicks = existing?.total_goodreads_clicks || 0
        const newClicks = currentClicks + 1
        
        console.log(`📊 [AnonymousCounters] Current Goodreads clicks: ${currentClicks}, New Goodreads clicks: ${newClicks}`)

        const { error: manualError } = await supabaseAdmin
          .from('anonymous_counters')
          .update({ 
            total_visits: existing?.total_visits || 0,
            total_downloads: existing?.total_downloads || 0,
            total_email_submissions: existing?.total_email_submissions || 0,
            total_goodreads_clicks: newClicks,
            total_substack_clicks: existing?.total_substack_clicks || 0,
            total_publisher_clicks: existing?.total_publisher_clicks || 0,
            last_updated: new Date().toISOString()
          })
          .eq('key', this.COUNTERS_KEY)

        if (manualError) {
          console.error('❌ [AnonymousCounters] Error manual update Goodreads clicks:', manualError)
        } else {
          console.log('✅ [AnonymousCounters] Goodreads clicks incremented successfully (manual)')
        }
      } else {
        console.log('✅ [AnonymousCounters] Goodreads clicks incremented successfully (RPC)')
      }

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
      
      // Use SQL increment instead of upsert
      const { error: updateError } = await supabaseAdmin
        .rpc('increment_substack_clicks')

      if (updateError) {
        console.error('❌ [AnonymousCounters] Error incrementing Substack clicks:', updateError)
        
        // Fallback: manual increment
        const { data: existing, error: selectError } = await supabaseAdmin
          .from('anonymous_counters')
          .select('*')
          .eq('key', this.COUNTERS_KEY)
          .single()

        if (selectError) {
          console.error('❌ [AnonymousCounters] Error selecting Substack clicks:', selectError)
          return
        }

        const currentClicks = existing?.total_substack_clicks || 0
        const newClicks = currentClicks + 1
        
        console.log(`📊 [AnonymousCounters] Current Substack clicks: ${currentClicks}, New Substack clicks: ${newClicks}`)

        const { error: manualError } = await supabaseAdmin
          .from('anonymous_counters')
          .update({ 
            total_visits: existing?.total_visits || 0,
            total_downloads: existing?.total_downloads || 0,
            total_email_submissions: existing?.total_email_submissions || 0,
            total_goodreads_clicks: existing?.total_goodreads_clicks || 0,
            total_substack_clicks: newClicks,
            total_publisher_clicks: existing?.total_publisher_clicks || 0,
            last_updated: new Date().toISOString()
          })
          .eq('key', this.COUNTERS_KEY)

        if (manualError) {
          console.error('❌ [AnonymousCounters] Error manual update Substack clicks:', manualError)
        } else {
          console.log('✅ [AnonymousCounters] Substack clicks incremented successfully (manual)')
        }
      } else {
        console.log('✅ [AnonymousCounters] Substack clicks incremented successfully (RPC)')
      }

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
      
      // Use SQL increment instead of upsert
      const { error: updateError } = await supabaseAdmin
        .rpc('increment_publisher_clicks')

      if (updateError) {
        console.error('❌ [AnonymousCounters] Error incrementing Publisher clicks:', updateError)
        
        // Fallback: manual increment
        const { data: existing, error: selectError } = await supabaseAdmin
          .from('anonymous_counters')
          .select('*')
          .eq('key', this.COUNTERS_KEY)
          .single()

        if (selectError) {
          console.error('❌ [AnonymousCounters] Error selecting Publisher clicks:', selectError)
          return
        }

        const currentClicks = existing?.total_publisher_clicks || 0
        const newClicks = currentClicks + 1
        
        console.log(`📊 [AnonymousCounters] Current Publisher clicks: ${currentClicks}, New Publisher clicks: ${newClicks}`)

        const { error: manualError } = await supabaseAdmin
          .from('anonymous_counters')
          .update({ 
            total_visits: existing?.total_visits || 0,
            total_downloads: existing?.total_downloads || 0,
            total_email_submissions: existing?.total_email_submissions || 0,
            total_goodreads_clicks: existing?.total_goodreads_clicks || 0,
            total_substack_clicks: existing?.total_substack_clicks || 0,
            total_publisher_clicks: newClicks,
            last_updated: new Date().toISOString()
          })
          .eq('key', this.COUNTERS_KEY)

        if (manualError) {
          console.error('❌ [AnonymousCounters] Error manual update Publisher clicks:', manualError)
        } else {
          console.log('✅ [AnonymousCounters] Publisher clicks incremented successfully (manual)')
        }
      } else {
        console.log('✅ [AnonymousCounters] Publisher clicks incremented successfully (RPC)')
      }

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
      
      const { data: counters, error } = await supabaseAdmin
        .from('anonymous_counters')
        .select('*')
        .eq('key', this.COUNTERS_KEY)
        .single()

      if (error) {
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

      console.log('✅ [AnonymousCounters] Counters retrieved:', counters)

      return {
        totalVisits: counters?.total_visits || 0,
        totalDownloads: counters?.total_downloads || 0,
        totalEmailSubmissions: counters?.total_email_submissions || 0,
        totalGoodreadsClicks: counters?.total_goodreads_clicks || 0,
        totalSubstackClicks: counters?.total_substack_clicks || 0,
        totalPublisherClicks: counters?.total_publisher_clicks || 0,
        lastUpdated: counters?.last_updated || new Date().toISOString()
      }
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