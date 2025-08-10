import { test, expect } from '@playwright/test'

test.describe('BookCoverSection Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-book-cover-section')
    // Aspetta che il componente sia caricato
    await page.waitForSelector('[data-testid="cta-button"]', { timeout: 10000 })
  })

  test('should display book cover image', async ({ page }) => {
    const bookCover = page.locator('img[alt*="Cover"]')
    await expect(bookCover).toBeVisible()
  })

  test('should display download title', async ({ page }) => {
    await expect(page.getByText('Download Your Free Copy')).toBeVisible()
  })

  test('should display email input field', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('placeholder', 'your@email.com')
  })

  test('should display CTA button', async ({ page }) => {
    const ctaButton = page.getByTestId('cta-button')
    await expect(ctaButton).toBeVisible()
    await expect(ctaButton).toContainText('Get Free Copy')
  })

  test('should display mail icon in input', async ({ page }) => {
    const mailIcon = page.locator('svg[class*="lucide-mail"]')
    await expect(mailIcon).toBeVisible()
  })

  test('should display download icon in button', async ({ page }) => {
    const downloadIcon = page.locator('svg[class*="lucide-download"]')
    await expect(downloadIcon).toBeVisible()
  })

  test('should display email label', async ({ page }) => {
    await expect(page.getByText('Enter your email to get your free copy')).toBeVisible()
  })

  test('should display Substack section', async ({ page }) => {
    await expect(page.getByText(/I write/)).toBeVisible()
    await expect(page.getByText('Visit Substack')).toBeVisible()
  })

  test('should have proper form validation', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('required')
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByTestId('cta-button')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByTestId('cta-button')).toBeVisible()
  })

  test('should handle form submission state', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const ctaButton = page.getByTestId('cta-button')
    
    // Fill form
    await emailInput.fill('test@example.com')
    
    // Submit form
    await ctaButton.click()
    
    // Should show loading state briefly
    await expect(page.getByText('Processing...')).toBeVisible({ timeout: 5000 })
  })
})
