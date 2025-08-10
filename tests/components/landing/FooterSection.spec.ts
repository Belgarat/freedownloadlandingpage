import { test, expect } from '@playwright/test'

test.describe('FooterSection Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-footer-section')
    // Aspetta che il componente sia caricato
    await page.waitForSelector('img[alt="3/7 Indie Lab Logo"]', { timeout: 10000 })
  })

  test('should display copyright text', async ({ page }) => {
    await expect(page.getByText(/©/)).toBeVisible()
  })

  test('should display privacy policy link', async ({ page }) => {
    const privacyLink = page.getByText('Privacy Policy')
    await expect(privacyLink).toBeVisible()
    await expect(privacyLink).toHaveAttribute('href', '/privacy')
  })

  test('should display publisher logo', async ({ page }) => {
    const logo = page.locator('img[alt="3/7 Indie Lab Logo"]')
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('src', '/logo_transparent.png')
  })

  test('should display publisher name', async ({ page }) => {
    await expect(page.getByText('3/7 Indie Lab').first()).toBeVisible()
  })

  test('should display publisher tagline', async ({ page }) => {
    await expect(page.getByText('Be independent, be unique.')).toBeVisible()
  })

  test('should display publisher website link', async ({ page }) => {
    const websiteLink = page.getByText('www.37indielab.com')
    await expect(websiteLink).toBeVisible()
    await expect(websiteLink).toHaveAttribute('href', 'https://37indielab.com/')
    await expect(websiteLink).toHaveAttribute('target', '_blank')
  })

  test('should display imprint description', async ({ page }) => {
    await expect(page.getByText(/3\/7 Indie Lab is an author-centric imprint/)).toBeVisible()
  })

  test('should have proper publisher link attributes', async ({ page }) => {
    const publisherLink = page.locator('a[href*="37indielab.com"]').first()
    await expect(publisherLink).toHaveAttribute('target', '_blank')
    await expect(publisherLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Privacy Policy')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('Privacy Policy')).toBeVisible()
  })

  test('should display current year in copyright', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString()
    await expect(page.getByText(currentYear)).toBeVisible()
  })
})
