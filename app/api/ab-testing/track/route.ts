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
    
    // Validazione base
    if (!result.testId || !result.variantId || !result.visitorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Salva il risultato nel database
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

    // Aggiorna le statistiche del test
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
    
    // Ottieni i risultati dal database
    const { data: testResults, error: fetchError } = await supabase
      .from('ab_test_results')
      .select(`
        *,
        ab_variants!inner(name, is_control)
      `)
      .eq('test_id', testId)

    if (fetchError) {
      console.error('Error fetching test results:', fetchError)
      // Se non ci sono risultati, restituisci statistiche vuote
      return NextResponse.json({
        testId,
        totalVisits: 0,
        totalConversions: 0,
        overallConversionRate: 0,
        variantStats: []
      })
    }

    // Calcola le statistiche
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
    // Per ora, calcoliamo le statistiche manualmente
    // In futuro, useremo la funzione SQL calculate_ab_test_stats
    
    // Ottieni tutti i risultati per questo test
    const { data: results, error: resultsError } = await supabase
      .from('ab_test_results')
      .select('*')
      .eq('test_id', testId)

    if (resultsError) {
      console.error('Error fetching results for stats:', resultsError)
      return
    }

    if (!results || results.length === 0) return

    // Calcola statistiche aggregate
    const totalVisitors = results.length
    const totalConversions = results.filter(r => r.conversion).length
    const overallConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0

    // Aggiorna il test
    await supabase
      .from('ab_tests')
      .update({
        total_visitors: totalVisitors,
        conversions: totalConversions,
        conversion_rate: overallConversionRate,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)

    // Calcola statistiche per variante
    const variantStats = new Map()
    results.forEach(result => {
      const current = variantStats.get(result.variant_id) || { visits: 0, conversions: 0 }
      current.visits++
      if (result.conversion) {
        current.conversions++
      }
      variantStats.set(result.variant_id, current)
    })

    // Aggiorna le varianti
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


