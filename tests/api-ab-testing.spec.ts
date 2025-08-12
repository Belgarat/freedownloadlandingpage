import { test, expect } from '@playwright/test'
import type { ABTest } from '@/types/ab-testing'

test.describe('A/B Testing API', () => {
  test.beforeEach(async ({ page }) => {
    // Login come admin
    await page.goto('/admin')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test('should create and manage A/B tests', async ({ page }) => {
    // Test data
    const testData = {
      name: 'API Test - CTA Button Color',
      description: 'Testing CTA button colors via API',
      type: 'cta_button_color',
      status: 'draft',
      traffic_split: 50,
      start_date: new Date().toISOString(),
      target_element: 'Download Button',
      target_selector: 'button[type="submit"]',
      conversion_goal: { type: 'email_submit' },
      variants: [
        {
          name: 'Control (Blue)',
          description: 'Original blue button',
          value: 'blue',
          css_class: 'bg-blue-600',
          is_control: true,
          traffic_split: 50
        },
        {
          name: 'Variant A (Green)',
          description: 'Green button variant',
          value: 'green',
          css_class: 'bg-green-600',
          is_control: false,
          traffic_split: 50
        }
      ]
    }

    console.log('Creating test with data:', JSON.stringify(testData, null, 2))

    // Create test
    const createResponse = await page.request.post('/api/ab-testing/tests', {
      data: testData
    })
    
    expect(createResponse.status()).toBe(200)
    const createdTest = await createResponse.json()
    console.log('Created test:', JSON.stringify(createdTest, null, 2))
    expect(createdTest.test.name).toBe(testData.name)
    expect(createdTest.test.variants).toHaveLength(2)

    const testId = createdTest.test.id

    // Get all tests
    const getResponse = await page.request.get('/api/ab-testing/tests')
    expect(getResponse.status()).toBe(200)
    const tests: ABTest[] = await getResponse.json()
    expect(Array.isArray(tests)).toBe(true)
    expect(tests.some((t: ABTest) => t.id === testId)).toBe(true)

    // Update test status
    const updateResponse = await page.request.patch(`/api/ab-testing/tests/${testId}`, {
      data: { status: 'running' }
    })
    expect(updateResponse.status()).toBe(200)
    const updatedTest = await updateResponse.json()
    expect(updatedTest.status).toBe('running')

        // Track a visit (solo se ci sono varianti)
    let visitorId = 'test-visitor-123'
    let variantId = null
    
    if (createdTest.test.variants && createdTest.test.variants.length > 0) {
      // Ottieni il test aggiornato per avere gli ID corretti delle varianti
      const updatedTestResponse = await page.request.get(`/api/ab-testing/tests`)
      const updatedTests: ABTest[] = await updatedTestResponse.json()
      const updatedTest = updatedTests.find((t: ABTest) => t.id === testId)
      
      if (updatedTest && updatedTest.variants && updatedTest.variants.length > 0) {
        variantId = updatedTest.variants[0].id
        
        console.log('Tracking visit with variant ID:', variantId)
        
        const trackResponse = await page.request.post('/api/ab-testing/track', {
          data: {
            testId,
            variantId,
            visitorId,
            conversion: false
          }
        })
        
        console.log('Track response status:', trackResponse.status())
        if (trackResponse.status() !== 200) {
          const errorData = await trackResponse.json()
          console.log('Track error:', errorData)
        }
        
        expect(trackResponse.status()).toBe(200)

        // Track a conversion
        const conversionResponse = await page.request.post('/api/ab-testing/track', {
          data: {
            testId,
            variantId,
            visitorId,
            conversion: true,
            conversionValue: 10.50
          }
        })
        expect(conversionResponse.status()).toBe(200)

        // Get test statistics
        const statsResponse = await page.request.get(`/api/ab-testing/track?testId=${testId}`)
        expect(statsResponse.status()).toBe(200)
        const stats = await statsResponse.json()
        expect(stats.testId).toBe(testId)
        expect(stats.totalVisits).toBe(2)
        expect(stats.totalConversions).toBe(1)
      }
    }



    // Create assignment (solo se abbiamo un visitorId e variantId)
    if (visitorId && variantId) {
      const assignmentResponse = await page.request.post('/api/ab-testing/assignments', {
        data: {
          visitorId,
          testId,
          variantId
        }
      })
      expect(assignmentResponse.status()).toBe(200)
    }

    // Get assignment (solo se abbiamo un visitorId)
    if (visitorId) {
      const getAssignmentResponse = await page.request.get(
        `/api/ab-testing/assignments?visitorId=${visitorId}&testId=${testId}`
      )
      expect(getAssignmentResponse.status()).toBe(200)
      const assignment = await getAssignmentResponse.json()
      if (variantId) {
        expect(assignment.variantId).toBe(variantId)
      }
    }

    // Delete test
    const deleteResponse = await page.request.delete(`/api/ab-testing/tests/${testId}`)
    expect(deleteResponse.status()).toBe(200)
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Test with invalid data
    const invalidResponse = await page.request.post('/api/ab-testing/tests', {
      data: { name: '' } // Missing required fields
    })
    expect(invalidResponse.status()).toBe(400)

    // Test with non-existent test ID
    const nonExistentResponse = await page.request.get('/api/ab-testing/track?testId=non-existent')
    expect(nonExistentResponse.status()).toBe(200) // Should return empty stats
  })
})
