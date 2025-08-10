const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carica le variabili d'ambiente dal file .env.local
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '../.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        envVars[key.trim()] = value.trim()
      }
    })
    
    return envVars
  } catch (error) {
    console.error('Error loading .env.local:', error)
    return {}
  }
}

const env = loadEnv()

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanupABTesting() {
  console.log('🧹 Cleaning up A/B Testing database...')

  try {
    // 1. Ottieni tutti i test
    const { data: tests, error: testsError } = await supabase
      .from('ab_tests')
      .select('*')

    if (testsError) {
      console.error('Error fetching tests:', testsError)
      return
    }

    console.log(`Found ${tests.length} tests`)

    // 2. Identifica i test da mantenere (quelli con nomi specifici)
    const testsToKeep = tests.filter(test => 
      test.name === 'CTA Button Color Test' || 
      test.name === 'Headline Test'
    )

    const testsToDelete = tests.filter(test => 
      test.name !== 'CTA Button Color Test' && 
      test.name !== 'Headline Test'
    )

    console.log(`Keeping ${testsToKeep.length} tests`)
    console.log(`Deleting ${testsToDelete.length} tests`)

    // 3. Elimina i test duplicati
    for (const test of testsToDelete) {
      console.log(`Deleting test: ${test.name} (${test.id})`)
      
      // Elimina prima i risultati
      const { error: resultsError } = await supabase
        .from('ab_test_results')
        .delete()
        .eq('test_id', test.id)

      if (resultsError) {
        console.error('Error deleting test results:', resultsError)
      }

      // Elimina le assegnazioni
      const { error: assignmentsError } = await supabase
        .from('ab_visitor_assignments')
        .delete()
        .eq('test_id', test.id)

      if (assignmentsError) {
        console.error('Error deleting assignments:', assignmentsError)
      }

      // Elimina le varianti
      const { error: variantsError } = await supabase
        .from('ab_variants')
        .delete()
        .eq('test_id', test.id)

      if (variantsError) {
        console.error('Error deleting variants:', variantsError)
      }

      // Elimina il test
      const { error: testError } = await supabase
        .from('ab_tests')
        .delete()
        .eq('id', test.id)

      if (testError) {
        console.error('Error deleting test:', testError)
      }
    }

    console.log('✅ Cleanup completed!')

    // 4. Verifica i test rimanenti
    const { data: remainingTests } = await supabase
      .from('ab_tests')
      .select(`
        *,
        ab_variants (
          id,
          name,
          value,
          css_class
        )
      `)

    console.log('\n📊 Remaining tests:')
    remainingTests?.forEach(test => {
      console.log(`\n${test.name}:`)
      console.log(`  ID: ${test.id}`)
      console.log(`  Status: ${test.status}`)
      console.log(`  Type: ${test.type}`)
      console.log(`  Variants: ${test.ab_variants?.length || 0}`)
      test.ab_variants?.forEach(variant => {
        console.log(`    - ${variant.name}: ${variant.value} (${variant.css_class || 'no CSS'})`)
      })
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

cleanupABTesting()
