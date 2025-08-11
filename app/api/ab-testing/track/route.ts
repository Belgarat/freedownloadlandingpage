import { NextRequest, NextResponse } from 'next/server'
import { ABTestResult } from '@/types/ab-testing'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const result: ABTestResult = await request.json()
    
    // Basic validation
    if (!result.testId || !result.variantId || !result.visitorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Save the result to the database
    const { error: insertError } = await supabase
      .from('ab_test_results')
      .insert({
        test_id: result.testId,
        variant_id: result.variantId,
        visitor_id: result.visitorId,
        conversion: result.conversion,
        conversion_value: result.conversionValue
      })

    if (insertError) {
      console.error('Error saving test result:', insertError)
      return NextResponse.json(
        { 
          error: 'Failed to save test result',
          details: insertError.message,
          code: insertError.code
        },
        { status: 500 }
      )
    }

    // Update test statistics
    await updateTestStats(result.testId)
    
    console.log('A/B Test Result saved:', result)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking A/B test result:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    
    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      )
    }
    
    // Get results from database
    const { data: testResults, error: fetchError } = await supabase
      .from('ab_test_results')
      .select(`
        *,
        ab_variants!inner(name, is_control)
      `)
      .eq('test_id', testId)

    if (fetchError) {
      console.error('Error fetching test results:', fetchError)
      // If no results, return empty statistics
      return NextResponse.json({
        testId,
        totalVisits: 0,
        totalConversions: 0,
        overallConversionRate: 0,
        variantStats: []
      })
    }

    // Calculate statistics
    const stats = calculateTestStats(testResults || [])
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting A/B test stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateTestStats(testId: string) {
  try {
    // For now, we calculate statistics manually
    // In the future, we'll use the SQL calculate_ab_test_stats function
    
    // Get all results for this test
    const { data: results, error: resultsError } = await supabase
      .from('ab_test_results')
      .select('*')
      .eq('test_id', testId)

    if (resultsError) {
      console.error('Error fetching results for stats:', resultsError)
      return
    }

    if (!results || results.length === 0) return

    // Calculate aggregate statistics
    const totalVisitors = results.length
    const totalConversions = results.filter(r => r.conversion).length
    const overallConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0

    // Update the test
    await supabase
      .from('ab_tests')
      .update({
        total_visitors: totalVisitors,
        conversions: totalConversions,
        conversion_rate: overallConversionRate,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)

    // Calculate statistics per variant
    const variantStats = new Map()
    results.forEach(result => {
      const current = variantStats.get(result.variant_id) || { visits: 0, conversions: 0 }
      current.visits++
      if (result.conversion) {
        current.conversions++
      }
      variantStats.set(result.variant_id, current)
    })

    // Update variants
    for (const [variantId, stats] of variantStats.entries()) {
      const conversionRate = stats.visits > 0 ? (stats.conversions / stats.visits) * 100 : 0
      
      await supabase
        .from('ab_variants')
        .update({
          visitors: stats.visits,
          conversions: stats.conversions,
          conversion_rate: conversionRate,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantId)
    }
  } catch (error) {
    console.error('Error in updateTestStats:', error)
  }
}

function calculateTestStats(results: any[]) {
  const variantStats = new Map<string, { visits: number; conversions: number }>()
  
  results.forEach(result => {
    const variantId = result.variant_id
    const current = variantStats.get(variantId) || { visits: 0, conversions: 0 }
    current.visits++
    if (result.conversion) {
      current.conversions++
    }
    variantStats.set(variantId, current)
  })
  
  const stats = Array.from(variantStats.entries()).map(([variantId, data]) => ({
    variantId,
    visits: data.visits,
    conversions: data.conversions,
    conversionRate: data.visits > 0 ? (data.conversions / data.visits) * 100 : 0
  }))
  
  return {
    testId: results[0]?.test_id,
    totalVisits: results.length,
    totalConversions: results.filter(r => r.conversion).length,
    overallConversionRate: results.length > 0 ? (results.filter(r => r.conversion).length / results.length) * 100 : 0,
    variants: stats
  }
}


