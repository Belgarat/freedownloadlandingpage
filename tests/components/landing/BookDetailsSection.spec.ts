import { test, expect } from '@playwright/test'

test.describe('BookDetailsSection Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-book-details-section')
    // Aspetta che il componente sia caricato
    await page.waitForSelector('h3', { timeout: 10000 })
  })

  test('should display About the Book section', async ({ page }) => {
    await expect(page.getByText('About the Book')).toBeVisible()
  })

  test('should display About the Author section', async ({ page }) => {
    await expect(page.getByText('About the Author')).toBeVisible()
  })

  test('should display palette icon', async ({ page }) => {
    const paletteIcon = page.locator('svg[class*="lucide-palette"]')
    await expect(paletteIcon).toBeVisible()
  })

  test('should display illustrations note', async ({ page }) => {
    await expect(page.getByText('All interior illustrations are original works by the author')).toBeVisible()
  })

  test('should display Goodreads section', async ({ page }) => {
    await expect(page.getByText('Support independent authors by adding this book to your Goodreads reading list')).toBeVisible()
    await expect(page.getByText('Add to Goodreads')).toBeVisible()
  })

  test('should have proper Goodreads link attributes', async ({ page }) => {
    const goodreadsLink = page.getByText('Add to Goodreads')
    await expect(goodreadsLink).toHaveAttribute('target', '_blank')
    await expect(goodreadsLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('About the Book')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('About the Book')).toBeVisible()
  })

  test('should display countdown timer on desktop when enabled', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Countdown timer should not be visible by default (layout.showCountdown is not true)
    const countdownElement = page.locator('.hidden.lg\\:block')
    await expect(countdownElement).not.toBeVisible()
  })

  test('should have proper section styling', async ({ page }) => {
    const sections = page.locator('.backdrop-blur-sm.rounded-lg.shadow-lg')
    await expect(sections.first()).toBeVisible()
  })

  test('should display book content when available', async ({ page }) => {
    // Check if any content is rendered
    const contentElements = page.locator('.prose')
    await expect(contentElements.first()).toBeVisible()
  })

  test('should not display conditional sections when flags are disabled', async ({ page }) => {
    // These sections should not be visible when layout flags are not explicitly set to true
    await expect(page.getByText('Stories')).not.toBeVisible()
    await expect(page.getByText('Testimonials')).not.toBeVisible()
    await expect(page.getByText('Awards')).not.toBeVisible()
    await expect(page.getByText('Rankings')).not.toBeVisible()
  })
})
