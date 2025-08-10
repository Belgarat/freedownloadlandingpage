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

async function setupABTesting() {
  try {
    console.log('🚀 Setting up A/B Testing tables...')
    
    // Leggi il file SQL
    const sqlFile = path.join(__dirname, '../migrations/ab_testing_tables.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // Esegui le query SQL
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('❌ Error creating tables:', error)
      console.log('\n📋 Manual setup required:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and paste the contents of migrations/ab_testing_tables.sql')
      console.log('4. Execute the SQL script')
      return
    }
    
    console.log('✅ A/B Testing tables created successfully!')
    console.log('📊 Tables created:')
    console.log('  - ab_tests')
    console.log('  - ab_variants') 
    console.log('  - ab_test_results')
    console.log('  - ab_visitor_assignments')
    
    // Test delle API
    console.log('\n🧪 Testing APIs...')
    
    // Test setup API
    const setupResponse = await fetch('http://localhost:3000/api/ab-testing/setup', {
      method: 'POST'
    })
    console.log('✅ Setup API:', setupResponse.status)
    
    // Test tests API
    const testsResponse = await fetch('http://localhost:3000/api/ab-testing/tests')
    console.log('✅ Tests API:', testsResponse.status)
    
    console.log('\n🎉 A/B Testing setup completed successfully!')
    console.log('📈 Dashboard available at: http://localhost:3000/admin/ab-testing')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

setupABTesting()
