import { test, expect } from '@playwright/test'

test.describe('Genre Templates', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin config page
    await page.goto('/admin/config')
    
    // Login if needed
    const isLoginPage = await page.locator('input[name="password"]').isVisible()
    if (isLoginPage) {
      await page.fill('input[name="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/admin/config')
    }
  })

  test('should display genre templates tab', async ({ page }) => {
    // Check if genre templates tab exists
    const genreTab = page.locator('button:has-text("Genre Templates")')
    await expect(genreTab).toBeVisible()
  })

  test('should show all genre presets', async ({ page }) => {
    // Click on genre templates tab
    await page.click('button:has-text("Genre Templates")')
    
    // Check if all genre presets are displayed
    const expectedGenres = [
      'Fantasy Realm',
      'Romantic Elegance', 
      'Dark Suspense',
      'Future Tech',
      'Mystery Noir',
      'Historical Elegance',
      'Modern Clean',
      'Youthful Energy',
      'Professional Authority',
      'Personal Story'
    ]
    
    for (const genre of expectedGenres) {
      await expect(page.locator(`text=${genre}`)).toBeVisible()
    }
  })

  test('should apply fantasy genre template', async ({ page }) => {
    // Click on genre templates tab
    await page.click('button:has-text("Genre Templates")')
    
    // Click on Fantasy Realm template
    await page.click('button:has-text("Fantasy Realm")')
    
    // Check if success toast appears
    await expect(page.locator('text=Genre Applied')).toBeVisible()
    
    // Check if the template is selected
    await expect(page.locator('text=Selected: Fantasy Realm')).toBeVisible()
  })

  test('should show genre preview', async ({ page }) => {
    // Click on genre templates tab
    await page.click('button:has-text("Genre Templates")')
    
    // Click preview button for Fantasy Realm
    const fantasyCard = page.locator('button:has-text("Fantasy Realm")').first()
    await fantasyCard.locator('button:has-text("Preview")').click()
    
    // Check if preview modal appears
    await expect(page.locator('text=Preview: Fantasy Realm')).toBeVisible()
    
    // Check if color palette is shown
    await expect(page.locator('text=Color Palette')).toBeVisible()
    
    // Close preview
    await page.click('button[aria-label="Close"]')
  })

  test('should apply genre and save configuration', async ({ page }) => {
    // Click on genre templates tab
    await page.click('button:has-text("Genre Templates")')
    
    // Apply romance template
    await page.click('button:has-text("Romantic Elegance")')
    
    // Go back to book config to see changes
    await page.click('button:has-text("Book")')
    
    // Check if genre is applied
    await expect(page.locator('text=romance')).toBeVisible()
    
    // Save configuration
    await page.click('button:has-text("Save Changes")')
    
    // Check if save success message appears
    await expect(page.locator('text=Configuration Saved')).toBeVisible()
  })
})
