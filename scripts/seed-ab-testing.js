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

async function seedABTesting() {
  console.log('🌱 Seeding A/B Testing database with sample data...')

  try {
    // 1. Crea test per CTA Button Color
    const ctaTest = {
      name: 'CTA Button Color Test',
      description: 'Testing different button colors for the main download CTA',
      type: 'cta_button_color',
      status: 'running',
      traffic_split: 50,
      start_date: new Date().toISOString(),
      target_element: 'Download Button',
      target_selector: 'button[type="submit"]',
      conversion_goal: { type: 'email_submit' }
    }

    const { data: createdCtaTest, error: ctaError } = await supabase
      .from('ab_tests')
      .insert(ctaTest)
      .select()
      .single()

    if (ctaError) {
      console.error('Error creating CTA test:', ctaError)
      return
    }

    console.log('✅ Created CTA test:', createdCtaTest.id)

    // Crea varianti per CTA test
    const ctaVariants = [
      {
        test_id: createdCtaTest.id,
        name: 'Control (Blue)',
        description: 'Original blue button',
        value: 'blue',
        css_class: 'bg-blue-600',
        is_control: true,
        traffic_split: 50
      },
      {
        test_id: createdCtaTest.id,
        name: 'Variant A (Green)',
        description: 'Green button variant',
        value: 'green',
        css_class: 'bg-green-600',
        is_control: false,
        traffic_split: 50
      }
    ]

    const { data: createdCtaVariants, error: ctaVariantsError } = await supabase
      .from('ab_variants')
      .insert(ctaVariants)
      .select()

    if (ctaVariantsError) {
      console.error('Error creating CTA variants:', ctaVariantsError)
      return
    }

    console.log('✅ Created CTA variants:', createdCtaVariants.length)

    // 2. Crea test per Headline
    const headlineTest = {
      name: 'Headline Test',
      description: 'Testing different headlines for the landing page',
      type: 'headline',
      status: 'running',
      traffic_split: 50,
      start_date: new Date().toISOString(),
      target_element: 'Main Headline',
      target_selector: 'h1',
      conversion_goal: { type: 'email_submit' }
    }

    const { data: createdHeadlineTest, error: headlineError } = await supabase
      .from('ab_tests')
      .insert(headlineTest)
      .select()
      .single()

    if (headlineError) {
      console.error('Error creating headline test:', headlineError)
      return
    }

    console.log('✅ Created headline test:', createdHeadlineTest.id)

    // Crea varianti per headline test
    const headlineVariants = [
      {
        test_id: createdHeadlineTest.id,
        name: 'Control (Original)',
        description: 'Original headline',
        value: 'Get Your Free Ebook Now',
        is_control: true,
        traffic_split: 50
      },
      {
        test_id: createdHeadlineTest.id,
        name: 'Variant A (Benefit-focused)',
        description: 'Benefit-focused headline',
        value: 'Transform Your Life with This Free Guide',
        is_control: false,
        traffic_split: 50
      }
    ]

    const { data: createdHeadlineVariants, error: headlineVariantsError } = await supabase
      .from('ab_variants')
      .insert(headlineVariants)
      .select()

    if (headlineVariantsError) {
      console.error('Error creating headline variants:', headlineVariantsError)
      return
    }

    console.log('✅ Created headline variants:', createdHeadlineVariants.length)

    // 3. Aggiungi alcuni risultati di test (simulati)
    const testResults = []
    const visitors = ['visitor-1', 'visitor-2', 'visitor-3', 'visitor-4', 'visitor-5']

    // Risultati per CTA test
    visitors.forEach((visitor, index) => {
      const variant = createdCtaVariants[index % 2] // Alterna tra le varianti
      const conversion = Math.random() > 0.7 // 30% di conversione
      
      testResults.push({
        test_id: createdCtaTest.id,
        variant_id: variant.id,
        visitor_id: visitor,
        conversion: conversion,
        conversion_value: conversion ? Math.random() * 20 + 5 : null
      })
    })

    // Risultati per headline test
    visitors.forEach((visitor, index) => {
      const variant = createdHeadlineVariants[index % 2]
      const conversion = Math.random() > 0.6 // 40% di conversione
      
      testResults.push({
        test_id: createdHeadlineTest.id,
        variant_id: variant.id,
        visitor_id: `headline-${visitor}`,
        conversion: conversion,
        conversion_value: conversion ? Math.random() * 25 + 10 : null
      })
    })

    const { data: createdResults, error: resultsError } = await supabase
      .from('ab_test_results')
      .insert(testResults)
      .select()

    if (resultsError) {
      console.error('Error creating test results:', resultsError)
      return
    }

    console.log('✅ Created test results:', createdResults.length)

    // 4. Aggiungi alcune assegnazioni di visitatori
    const assignments = []
    
    // Assegnazioni per CTA test
    visitors.forEach((visitor, index) => {
      const variant = createdCtaVariants[index % 2]
      assignments.push({
        visitor_id: visitor,
        test_id: createdCtaTest.id,
        variant_id: variant.id
      })
    })

    // Assegnazioni per headline test
    visitors.forEach((visitor, index) => {
      const variant = createdHeadlineVariants[index % 2]
      assignments.push({
        visitor_id: `headline-${visitor}`,
        test_id: createdHeadlineTest.id,
        variant_id: variant.id
      })
    })

    const { data: createdAssignments, error: assignmentsError } = await supabase
      .from('ab_visitor_assignments')
      .insert(assignments)
      .select()

    if (assignmentsError) {
      console.error('Error creating assignments:', assignmentsError)
      return
    }

    console.log('✅ Created visitor assignments:', createdAssignments.length)

    console.log('\n🎉 Database seeded successfully!')
    console.log('📊 Sample data created:')
    console.log(`   - ${2} A/B tests`)
    console.log(`   - ${4} variants`)
    console.log(`   - ${10} test results`)
    console.log(`   - ${10} visitor assignments`)

    // Mostra le statistiche
    console.log('\n📈 Test Statistics:')
    
    const { data: tests } = await supabase
      .from('ab_tests')
      .select(`
        *,
        ab_variants (
          id,
          name,
          visitors,
          conversions,
          conversion_rate
        )
      `)

    tests?.forEach(test => {
      console.log(`\n${test.name}:`)
      test.ab_variants?.forEach(variant => {
        console.log(`  ${variant.name}: ${variant.visitors || 0} visitors, ${variant.conversions || 0} conversions (${variant.conversion_rate || 0}%)`)
      })
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

seedABTesting()
