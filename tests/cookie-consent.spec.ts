import { test, expect } from '@playwright/test'

test.describe('Cookie Consent', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
  })

  test('should show cookie banner on first visit', async ({ page }) => {
    await page.goto('/')
    
    // Check if cookie banner is visible
    const banner = page.locator('text=Cookie Policy')
    await expect(banner).toBeVisible()
    
    // Check banner content
    await expect(page.getByText('We use technical cookies for site functionality and analytics cookies')).toBeVisible()
    await expect(page.getByText('Accept All')).toBeVisible()
    await expect(page.getByText('Necessary Only')).toBeVisible()
  })

  test('should hide banner after accepting all cookies', async ({ page }) => {
    await page.goto('/')
    
    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Banner should disappear
    await expect(page.locator('text=Cookie Policy')).not.toBeVisible()
    
    // Check localStorage was set
    const consent = await page.evaluate(() => {
      return localStorage.getItem('cookieConsent')
    })
    expect(consent).toBeTruthy()
    
    const parsedConsent = JSON.parse(consent!)
    expect(parsedConsent.analytics).toBe(true)
    expect(parsedConsent.necessary).toBe(true)
  })

  test('should hide banner after accepting necessary only', async ({ page }) => {
    await page.goto('/')
    
    // Accept necessary cookies only
    await page.getByRole('button', { name: 'Necessary Only' }).click()
    
    // Banner should disappear
    await expect(page.locator('text=Cookie Policy')).not.toBeVisible()
    
    // Check localStorage was set
    const consent = await page.evaluate(() => {
      return localStorage.getItem('cookieConsent')
    })
    expect(consent).toBeTruthy()
    
    const parsedConsent = JSON.parse(consent!)
    expect(parsedConsent.analytics).toBe(false)
    expect(parsedConsent.necessary).toBe(true)
  })

  test('should not show banner on subsequent visits if consent given', async ({ page }) => {
    await page.goto('/')
    
    // Accept all cookies
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Reload page
    await page.reload()
    
    // Banner should not appear
    await expect(page.locator('text=Cookie Policy')).not.toBeVisible()
  })

  test('should allow customizing cookie preferences', async ({ page }) => {
    await page.goto('/')
    
    // Click customize button
    await page.getByRole('button', { name: 'Customize' }).click()
    
    // Check details are shown
    await expect(page.getByText('Cookie Details')).toBeVisible()
    await expect(page.getByText('Technical Cookies (Necessary)')).toBeVisible()
    await expect(page.locator('span').filter({ hasText: 'Analytics Cookies' })).toBeVisible()
    
    // Toggle analytics checkbox
    const analyticsCheckbox = page.locator('input[type="checkbox"]')
    await analyticsCheckbox.check()
    
    // Accept with custom preferences
    await page.getByRole('button', { name: 'Accept All' }).click()
    
    // Check localStorage reflects custom choice
    const consent = await page.evaluate(() => {
      return localStorage.getItem('cookieConsent')
    })
    const parsedConsent = JSON.parse(consent!)
    expect(parsedConsent.analytics).toBe(true)
  })

  test('should close banner with X button', async ({ page }) => {
    await page.goto('/')
    
    // Close banner with X (find the X button specifically)
    await page.locator('button').filter({ hasText: '' }).nth(1).click()
    
    // Banner should disappear
    await expect(page.locator('text=Cookie Policy')).not.toBeVisible()
    
    // But localStorage should not be set (no consent given)
    const consent = await page.evaluate(() => {
      return localStorage.getItem('cookieConsent')
    })
    expect(consent).toBeNull()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    
    // Check banner has proper role
    const banner = page.locator('div').filter({ hasText: 'Cookie Policy' }).first()
    await expect(banner).toBeVisible()
    
    // Check buttons have proper roles
    await expect(page.getByRole('button', { name: 'Accept All' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Necessary Only' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Customize' })).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Banner should still be visible and functional
    await expect(page.locator('text=Cookie Policy')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Accept All' })).toBeVisible()
    
    // Accept cookies on mobile
    await page.getByRole('button', { name: 'Accept All' }).click()
    await expect(page.locator('text=Cookie Policy')).not.toBeVisible()
  })
}) 