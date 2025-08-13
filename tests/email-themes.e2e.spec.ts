import { test, expect } from '@playwright/test'
import { authenticateAsAdmin, clearAuth } from './helpers/auth'

test.describe('Email Themes Management', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAsAdmin(page)
    // Navigate to email templates page first
    await page.goto('/admin/email-templates')
  })

  test.afterEach(async ({ page }) => {
    await clearAuth(page)
  })

  test('should navigate to themes page and display themes', async ({ page }) => {
    // Click on Themes button
    await page.click('text=Themes')
    
    // Should navigate to themes page
    await expect(page).toHaveURL('/admin/email-templates/themes')
    
    // Should display themes
    await expect(page.locator('h1')).toContainText('Email Themes')
    
    // Should show theme cards
    await expect(page.locator('[data-testid="theme-card"]')).toHaveCount(5) // Default themes
    
    // Should show search input
    await expect(page.locator('input[placeholder*="search"]')).toBeVisible()
    
    // Should show category filter
    await expect(page.locator('select')).toBeVisible()
  })

  test('should create a new theme', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Click on New Theme button
    await page.click('text=New Theme')
    
    // Should navigate to new theme page
    await expect(page).toHaveURL('/admin/email-templates/themes/new')
    
    // Fill in theme form
    await page.fill('input[name="name"]', 'Test Theme')
    await page.fill('textarea[name="description"]', 'Test theme description')
    await page.selectOption('select[name="category_id"]', '1') // Business category
    
    // Fill in style properties
    await page.fill('input[name="primary_color"]', '#2563eb')
    await page.fill('input[name="secondary_color"]', '#64748b')
    await page.fill('input[name="background_color"]', '#ffffff')
    await page.fill('input[name="text_color"]', '#1f2937')
    await page.fill('input[name="font_family"]', 'Arial, sans-serif')
    await page.fill('input[name="border_radius"]', '8px')
    
    // Save theme
    await page.click('button[type="submit"]')
    
    // Should redirect to themes list
    await expect(page).toHaveURL('/admin/email-templates/themes')
    
    // Should show success message or new theme in list
    await expect(page.locator('text=Test Theme')).toBeVisible()
  })

  test('should edit an existing theme', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Click edit button on first theme
    await page.click('[data-testid="theme-card"]:first-child button:has-text("Edit")')
    
    // Should navigate to edit page
    await expect(page).toHaveURL(/\/admin\/email-templates\/themes\/\d+\/edit/)
    
    // Update theme name
    await page.fill('input[name="name"]', 'Updated Theme Name')
    
    // Save changes
    await page.click('button[type="submit"]')
    
    // Should redirect to themes list
    await expect(page).toHaveURL('/admin/email-templates/themes')
    
    // Should show updated theme name
    await expect(page.locator('text=Updated Theme Name')).toBeVisible()
  })

  test('should duplicate a theme', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Get original theme name
    const originalThemeName = await page.locator('[data-testid="theme-card"]:first-child h3').textContent()
    
    // Click duplicate button on first theme
    await page.click('[data-testid="theme-card"]:first-child button:has-text("Duplicate")')
    
    // Should show confirmation dialog or redirect
    // The behavior depends on implementation - could be immediate or with confirmation
    
    // Should show duplicated theme (usually with "Copy" suffix)
    await expect(page.locator(`text=${originalThemeName} (Copy)`)).toBeVisible()
  })

  test('should delete a theme', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Count themes before deletion
    const themesBefore = await page.locator('[data-testid="theme-card"]').count()
    
    // Click delete button on first theme (that's not default)
    await page.click('[data-testid="theme-card"]:nth-child(2) button:has-text("Delete")')
    
    // Should show confirmation dialog
    await expect(page.locator('text=Are you sure?')).toBeVisible()
    
    // Confirm deletion
    await page.click('button:has-text("Delete")')
    
    // Should have one less theme
    const themesAfter = await page.locator('[data-testid="theme-card"]').count()
    expect(themesAfter).toBe(themesBefore - 1)
  })

  test('should search and filter themes', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Search for a specific theme
    await page.fill('input[placeholder*="search"]', 'Classic Business')
    
    // Should show only matching themes
    await expect(page.locator('text=Classic Business')).toBeVisible()
    await expect(page.locator('text=Modern Marketing')).not.toBeVisible()
    
    // Clear search
    await page.fill('input[placeholder*="search"]', '')
    
    // Filter by category
    await page.selectOption('select', '1') // Business category
    
    // Should show only business themes
    await expect(page.locator('text=Classic Business')).toBeVisible()
    await expect(page.locator('text=Modern Marketing')).not.toBeVisible()
  })

  test('should preview theme', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Click preview button on first theme
    await page.click('[data-testid="theme-card"]:first-child button:has-text("Preview")')
    
    // Should show preview modal
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Should show theme preview content
    await expect(page.locator('[role="dialog"] h2')).toBeVisible()
    
    // Close preview
    await page.click('button:has-text("Close")')
    
    // Modal should be closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('should assign theme to template', async ({ page }) => {
    // Navigate to email templates page
    await page.goto('/admin/email-templates')
    
    // Click edit on first template
    await page.click('tr:first-child button:has-text("Edit")')
    
    // Should navigate to edit template page
    await expect(page).toHaveURL(/\/admin\/email-templates\/\d+\/edit/)
    
    // Should show theme selector
    await expect(page.locator('text=Email Theme')).toBeVisible()
    
    // Select a theme
    await page.click('[data-testid="theme-card"]:first-child')
    
    // Save template
    await page.click('button[type="submit"]')
    
    // Should show success message
    await expect(page.locator('text=Template updated successfully')).toBeVisible()
  })

  test('should handle theme creation validation', async ({ page }) => {
    // Navigate to new theme page
    await page.goto('/admin/email-templates/themes/new')
    
    // Try to save without required fields
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible()
    
    // Fill in required fields
    await page.fill('input[name="name"]', 'Valid Theme')
    await page.fill('textarea[name="description"]', 'Valid description')
    await page.selectOption('select[name="category_id"]', '1')
    
    // Should be able to save now
    await page.click('button[type="submit"]')
    
    // Should redirect to themes list
    await expect(page).toHaveURL('/admin/email-templates/themes')
  })

  test('should handle theme editing validation', async ({ page }) => {
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Click edit on first theme
    await page.click('[data-testid="theme-card"]:first-child button:has-text("Edit")')
    
    // Clear required field
    await page.fill('input[name="name"]', '')
    
    // Try to save
    await page.click('button[type="submit"]')
    
    // Should show validation error
    await expect(page.locator('text=Name is required')).toBeVisible()
    
    // Fill in name
    await page.fill('input[name="name"]', 'Updated Theme')
    
    // Should be able to save
    await page.click('button[type="submit"]')
    
    // Should redirect to themes list
    await expect(page).toHaveURL('/admin/email-templates/themes')
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/email-templates/themes', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })
    
    // Navigate to themes page
    await page.goto('/admin/email-templates/themes')
    
    // Should show error message
    await expect(page.locator('text=Error loading themes')).toBeVisible()
  })

  test('should handle theme preview with live updates', async ({ page }) => {
    // Navigate to new theme page
    await page.goto('/admin/email-templates/themes/new')
    
    // Fill in basic theme info
    await page.fill('input[name="name"]', 'Live Preview Theme')
    await page.fill('textarea[name="description"]', 'Test live preview')
    await page.selectOption('select[name="category_id"]', '1')
    
    // Fill in colors
    await page.fill('input[name="primary_color"]', '#ff0000')
    await page.fill('input[name="secondary_color"]', '#00ff00')
    
    // Should see live preview update
    await expect(page.locator('iframe')).toBeVisible()
    
    // Change colors and see preview update
    await page.fill('input[name="primary_color"]', '#0000ff')
    
    // Should see updated preview
    // Note: This test might need adjustment based on actual preview implementation
  })
})
