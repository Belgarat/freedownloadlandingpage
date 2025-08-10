import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  test.beforeEach(async ({ page }) => {
    // Login first
    await page.context().clearCookies()
    await page.goto('/admin')
    await page.getByPlaceholder('Enter admin password').fill(adminPassword)
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    // Wait for login to complete
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
  })

  test('should display admin dashboard with all sections', async ({ page }) => {
    // Check main dashboard content
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
    await expect(page.getByText('Manage your landing page configuration')).toBeVisible()
    
    // Check admin sections are present
    await expect(page.getByText('Configuration')).toBeVisible()
    await expect(page.getByText('Analytics')).toBeVisible()
    await expect(page.getByText('SEO')).toBeVisible()
    await expect(page.getByText('Marketing')).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    // Test navigation to Configuration
    await page.getByText('Configuration').click()
    await expect(page).toHaveURL('/admin/config')
    await expect(page.getByText('Configuration')).toBeVisible()
    
    // Navigate back to dashboard
    await page.getByText('Dashboard').click()
    await expect(page).toHaveURL('/admin')
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
  })

  test('should display admin topbar with navigation', async ({ page }) => {
    // Check topbar navigation
    await expect(page.getByText('Admin')).toBeVisible()
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Configuration')).toBeVisible()
    await expect(page.getByText('Analytics')).toBeVisible()
    
    // Check logout button
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    
    // Check "View site" link
    await expect(page.getByText('View site')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
  })

  test('should maintain authentication state', async ({ page }) => {
    // Navigate to different admin pages
    await page.goto('/admin/config')
    await expect(page.getByText('Configuration')).toBeVisible()
    
    await page.goto('/admin/analytics')
    await expect(page.getByText('Analytics')).toBeVisible()
    
    await page.goto('/admin/seo')
    await expect(page.getByText('SEO')).toBeVisible()
    
    await page.goto('/admin/marketing')
    await expect(page.getByText('Marketing')).toBeVisible()
    
    // Should still be authenticated on all pages
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
  })

  test('should have proper page titles and metadata', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Admin|Dashboard/)
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toBeAttached()
  })
}) 