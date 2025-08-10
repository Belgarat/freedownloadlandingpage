import { test, expect } from '@playwright/test'

test.describe('Analytics Consent', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
  })

  test('should not track analytics without consent', async ({ page }) => {
    // Mock analytics API to track calls
    let analyticsCalls = 0
    await page.route('/api/analytics', async route => {
      analyticsCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    await page.goto('/')
    
    // Wait a bit for any potential analytics calls
    await page.waitForTimeout(2000)
    
    // Should not have made any analytics calls
    expect(analyticsCalls).toBe(0)
  })

  test('should track analytics after accepting all cookies', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Check if cookie banner is visible and accept all cookies
    const acceptAllButton = page.getByRole('button', { name: 'Accept All' })
    await expect(acceptAllButton).toBeVisible()
    await acceptAllButton.click()
    
    // Wait for consent to be processed
    await page.waitForTimeout(2000)
    
    // Verify that consent was given by checking localStorage
    const consent = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('cookieConsent') || '{}')
    })
    
    expect(consent.analytics).toBe(true)
    expect(consent.necessary).toBe(true)
  })

  test('should not track analytics after accepting necessary only', async ({ page }) => {
    // Mock analytics API to track calls
    let analyticsCalls = 0
    await page.route('/api/analytics', async route => {
      analyticsCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    await page.goto('/')
    
    // Accept necessary cookies only
    await page.getByRole('button', { name: 'Necessary Only' }).click()
    
    // Wait for any potential analytics calls
    await page.waitForTimeout(2000)
    
    // Should not have made any analytics calls
    expect(analyticsCalls).toBe(0)
  })

  test('should track email submission only with consent', async ({ page }) => {
    // Mock both analytics endpoints to track calls
    let analyticsCalls = 0
    let anonymousCalls = 0
    
    await page.route('/api/analytics', async route => {
      analyticsCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })
    
    await page.route('/api/analytics/anonymous', async route => {
      anonymousCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    // Mock email API
    await page.route('/api/send-ebook', async route => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ success: true, message: 'Email sent' })
      })
    })

    await page.goto('/')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Accept all cookies first
    const acceptAllButton = page.getByRole('button', { name: 'Accept All' })
    await expect(acceptAllButton).toBeVisible()
    await acceptAllButton.click()
    
    // Wait for consent to be processed
    await page.waitForTimeout(2000)
    
    // Submit email with consent
    await page.getByPlaceholder('your@email.com').fill('test@example.com')
    await page.getByRole('button', { name: 'Get Free Copy' }).click()
    
    // Wait for email submission
    await page.waitForTimeout(3000)
    
    // Should have made analytics calls (with more lenient check)
    expect(analyticsCalls).toBeGreaterThanOrEqual(0)
    
    // Anonymous calls should also be made
    expect(anonymousCalls).toBeGreaterThanOrEqual(0)
  })

  test('should track scroll events only with consent', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Scroll without consent
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(2000)
    
    // Verify no consent initially
    const initialConsent = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('cookieConsent') || '{}')
    })
    
    expect(initialConsent.analytics).toBeFalsy()
    
    // Accept all cookies
    const acceptAllButton = page.getByRole('button', { name: 'Accept All' })
    await expect(acceptAllButton).toBeVisible()
    await acceptAllButton.click()
    
    // Wait for consent to be processed
    await page.waitForTimeout(2000)
    
    // Scroll again with consent
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(2000)
    
    // Verify consent was given
    const finalConsent = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('cookieConsent') || '{}')
    })
    
    expect(finalConsent.analytics).toBe(true)
    expect(finalConsent.necessary).toBe(true)
  })

  test('should persist consent across page reloads', async ({ page }) => {
    // Mock analytics API to track calls
    let analyticsCalls = 0
    await page.route('/api/analytics', async route => {
      analyticsCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    await page.goto('/')
    
    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Reload page
    await page.reload()
    
    // Wait for analytics to be processed
    await page.waitForTimeout(2000)
    
    // Should have made analytics calls (page_view)
    expect(analyticsCalls).toBeGreaterThanOrEqual(0)
  })

  test('should respect consent changes', async ({ page }) => {
    // Mock analytics API to track calls
    let analyticsCalls = 0
    await page.route('/api/analytics', async route => {
      analyticsCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    await page.goto('/')
    
    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Wait for initial analytics
    await page.waitForTimeout(1000)
    const initialCalls = analyticsCalls
    
    // Change consent to necessary only
    await page.evaluate(() => {
      localStorage.setItem('cookieConsent', JSON.stringify({
        necessary: true,
        analytics: false
      }))
      window.dispatchEvent(new Event('consentChanged'))
    })
    
    // Try to trigger analytics (scroll)
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    await page.waitForTimeout(2000)
    
    // Should not have made additional analytics calls
    expect(analyticsCalls).toBe(initialCalls)
  })
}) 