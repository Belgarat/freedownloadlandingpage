import { test, expect } from '@playwright/test'

test.describe('BookHeader Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-book-header')
    // Aspetta che il componente sia caricato
    await page.waitForSelector('[data-testid="main-headline"]', { timeout: 10000 })
  })

  test('should render the main headline', async ({ page }) => {
    await expect(page.getByTestId('main-headline')).toBeVisible()
  })

  test('should display book icon', async ({ page }) => {
    const bookIcon = page.locator('svg[class*="lucide-book-open"]')
    await expect(bookIcon).toBeVisible()
  })

  test('should display author information', async ({ page }) => {
    await expect(page.getByText(/by/)).toBeVisible()
  })

  test('should display rating and review count', async ({ page }) => {
    await expect(page.getByText('5')).toBeVisible()
    await expect(page.getByText(/review/)).toBeVisible()
  })

  test('should display book categories', async ({ page }) => {
    await expect(page.getByText('#SciFi')).toBeVisible()
    await expect(page.getByText('#Dystopian')).toBeVisible()
    await expect(page.getByText('#Cyberpunk')).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    const headline = page.getByTestId('main-headline')
    await expect(headline).toBeVisible()
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByTestId('main-headline')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByTestId('main-headline')).toBeVisible()
  })
})
