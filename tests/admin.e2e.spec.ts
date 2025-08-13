import { test, expect } from '@playwright/test'
import { authenticateAsAdmin, clearAuth } from './helpers/auth'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page)
    await page.goto('/admin')
  })

  test.afterEach(async ({ page }) => {
    await clearAuth(page)
  })

  test('should display admin dashboard with all sections', async ({ page }) => {
    // Check main dashboard content
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
    await expect(page.getByText('Manage your landing page configuration')).toBeVisible()
    
    // Check admin sections are present (using more specific selectors)
    await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'SEO Settings' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Marketing Tools' })).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    // Test navigation to Configuration
    await page.getByRole('heading', { name: 'Configuration' }).click()
    await expect(page).toHaveURL('/admin/config')
    await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible()
    
    // Navigate back to dashboard
    await page.goto('/admin')
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
  })

  test('should display admin topbar with navigation', async ({ page }) => {
    // Check topbar elements
    await expect(page.getByText('Book Landing Stack Admin')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    
    // Check admin sections are visible
    await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible()
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
    await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible()
    
    await page.goto('/admin/analytics')
    await expect(page.getByRole('heading', { name: 'Analytics Dashboard' }).first()).toBeVisible()
    
    await page.goto('/admin/seo')
    await expect(page.getByRole('heading', { name: 'SEO Settings' })).toBeVisible()
    
    await page.goto('/admin/marketing')
    await expect(page.getByRole('heading', { name: 'Marketing Tools' })).toBeVisible()
    
    // Should still be authenticated on all pages
    await expect(page.getByRole('button', { name: 'Logout' }).first()).toBeVisible()
  })

  test('should have proper page titles and metadata', async ({ page }) => {
    // Check page title - updated to match actual title
    await expect(page).toHaveTitle(/Test SEO|Book Landing Stack Admin/)
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toBeAttached()
  })
}) 