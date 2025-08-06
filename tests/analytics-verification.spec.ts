import { test, expect } from '@playwright/test'

test.describe('Analytics System Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
  })

  test('should track anonymous events without consent', async ({ page }) => {
    // Mock anonymous analytics API to track calls
    let anonymousCalls = 0
    await page.route('/api/analytics/anonymous', async route => {
      anonymousCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    // Mock detailed analytics API to track calls
    let detailedCalls = 0
    await page.route('/api/analytics', async route => {
      detailedCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    await page.goto('/')
    
    // Wait for page to load and analytics to be processed
    await page.waitForTimeout(2000)
    
    // Should have made anonymous analytics call (always active)
    expect(anonymousCalls).toBeGreaterThan(0)
    
    // Should NOT have made detailed analytics call (no consent)
    expect(detailedCalls).toBe(0)
  })

  test('should track both anonymous and detailed events with consent', async ({ page }) => {
    // Mock anonymous analytics API to track calls
    let anonymousCalls = 0
    await page.route('/api/analytics/anonymous', async route => {
      anonymousCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    // Mock detailed analytics API to track calls
    let detailedCalls = 0
    await page.route('/api/analytics', async route => {
      detailedCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    await page.goto('/')
    
    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Wait for analytics to be processed
    await page.waitForTimeout(2000)
    
    // Should have made both anonymous and detailed analytics calls
    expect(anonymousCalls).toBeGreaterThan(0)
    expect(detailedCalls).toBeGreaterThan(0)
  })

  test('should track email submission anonymously and with consent', async ({ page }) => {
    // Mock anonymous analytics API to track calls
    let anonymousCalls = 0
    await page.route('/api/analytics/anonymous', async route => {
      anonymousCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    // Mock detailed analytics API to track calls
    let detailedCalls = 0
    await page.route('/api/analytics', async route => {
      detailedCalls++
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
    
    // Submit email without consent
    await page.getByPlaceholder('your@email.com').fill('test@example.com')
    await page.getByRole('button', { name: 'Get Free Copy' }).click()
    
    // Wait for email submission
    await page.waitForTimeout(2000)
    
    // Should have made anonymous analytics call
    expect(anonymousCalls).toBeGreaterThan(0)
    
    // Should NOT have made detailed analytics call (no consent)
    expect(detailedCalls).toBe(0)
    
    // Now accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Submit email again
    await page.getByPlaceholder('your@email.com').fill('test2@example.com')
    await page.getByRole('button', { name: 'Get Free Copy' }).click()
    
    // Wait for email submission
    await page.waitForTimeout(2000)
    
    // Should have made both anonymous and detailed analytics calls
    expect(anonymousCalls).toBeGreaterThan(1)
    expect(detailedCalls).toBeGreaterThan(0)
  })

  test('should track download requests anonymously', async ({ page }) => {
    // Mock anonymous analytics API to track calls
    let anonymousCalls = 0
    await page.route('/api/analytics/anonymous', async route => {
      anonymousCalls++
      await route.fulfill({ status: 200, body: '{"success": true}' })
    })

    // Mock download API
    await page.route('/api/download/*', async route => {
      await route.fulfill({ 
        status: 200, 
        body: 'PDF content',
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="test.pdf"'
        }
      })
    })

    // Mock email API to get download link
    await page.route('/api/send-ebook', async route => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ 
          success: true, 
          message: 'Email sent',
          downloadUrl: '/api/download/test-token'
        })
      })
    })

    await page.goto('/')
    
    // Submit email to get download link
    await page.getByPlaceholder('your@email.com').fill('test@example.com')
    await page.getByRole('button', { name: 'Get Free Copy' }).click()
    
    // Wait for email submission
    await page.waitForTimeout(2000)
    
    // Should have made anonymous analytics call for email submission
    expect(anonymousCalls).toBeGreaterThan(0)
  })

  test('should show anonymous counters in admin dashboard', async ({ page }) => {
    // Mock admin stats API
    await page.route('/api/admin/stats', async route => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({
          totalDownloads: 5,
          downloadRequests: 10,
          downloadCompletionRate: 50,
          totalEmails: 20,
          recentDownloads: 2,
          recentEmails: 3,
          anonymousVisits: 100,
          anonymousDownloads: 25,
          anonymousEmails: 30
        })
      })
    })

    await page.goto('/admin')
    
    // Login (you'll need to set up the password in your test environment)
    await page.getByPlaceholder('Enter password').fill('admin123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Wait for dashboard to load
    await page.waitForTimeout(2000)
    
    // Check if anonymous counters are displayed
    await expect(page.getByText('Anonymous Counters (GDPR Compliant)')).toBeVisible()
    await expect(page.getByText('100')).toBeVisible() // anonymous visits
    await expect(page.getByText('25')).toBeVisible() // anonymous downloads
    await expect(page.getByText('30')).toBeVisible() // anonymous emails
    
    // Check if detailed analytics are displayed
    await expect(page.getByText('Detailed Analytics (With Consent)')).toBeVisible()
    await expect(page.getByText('5')).toBeVisible() // completed downloads
    await expect(page.getByText('20')).toBeVisible() // emails collected
  })
}) 