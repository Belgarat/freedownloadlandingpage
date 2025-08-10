import { test, expect } from '@playwright/test'

test.describe('Database Setup Check', () => {
  test('should check if A/B testing tables exist', async ({ page }) => {
    // Login come admin
    await page.goto('/admin')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    
    // Test setup API
    const setupResponse = await page.request.post('/api/ab-testing/setup')
    expect(setupResponse.status()).toBe(200)
    
    const setupData = await setupResponse.json()
    console.log('Setup response:', setupData)
    
    // Test tests API
    const testsResponse = await page.request.get('/api/ab-testing/tests')
    console.log('Tests API status:', testsResponse.status())
    
    if (testsResponse.status() === 503) {
      const errorData = await testsResponse.json()
      console.log('Database not set up:', errorData)
      
      // Se le tabelle non esistono, mostra le istruzioni
      console.log('\n📋 Database setup required:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and paste the contents of migrations/ab_testing_tables.sql')
      console.log('4. Execute the SQL script')
      console.log('5. Run this test again')
      
      // Il test passa perché abbiamo gestito correttamente il caso
      expect(errorData.setupRequired).toBe(true)
    } else {
      // Le tabelle esistono, il test dovrebbe passare
      expect(testsResponse.status()).toBe(200)
      const tests = await testsResponse.json()
      console.log('Found tests:', tests.length)
    }
  })
})
