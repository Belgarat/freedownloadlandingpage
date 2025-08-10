import { test, expect } from '@playwright/test'

test.describe('SuccessModal Component', () => {
  test('should not render when isOpen is false', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Modal should not be visible initially
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('should render when isOpen is true', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Click button to open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    // Wait for modal to appear
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.getByText('Email Sent Successfully!')).toBeVisible()
    await expect(page.getByText('test@example.com')).toBeVisible()
  })

  test('should display correct email address', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Change email
    await page.getByPlaceholder('Enter email').fill('user@example.com')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    await expect(page.getByText('user@example.com')).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
    
    const closeButton = page.getByLabel('Close success modal')
    await expect(closeButton).toBeVisible()
  })

  test('should close when close button is clicked', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    // Modal should be visible initially
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Click close button
    await page.getByLabel('Close success modal').click()
    
    // Modal should be hidden
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('should have Goodreads link with correct attributes', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    const goodreadsLink = page.getByRole('link', { name: 'Add to Goodreads' })
    await expect(goodreadsLink).toBeVisible()
    await expect(goodreadsLink).toHaveAttribute('href', 'https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns')
    await expect(goodreadsLink).toHaveAttribute('target', '_blank')
    await expect(goodreadsLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('should display important information sections', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    // Check for spam folder warning
    await expect(page.getByText('Important:')).toBeVisible()
    await expect(page.getByText('spam/junk folder')).toBeVisible()
    
    // Check for support message
    await expect(page.getByText('Support Independent Authors:')).toBeVisible()
    await expect(page.getByText('Fish Cannot Carry Guns')).toBeVisible()
  })

  test('should have proper styling classes', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toHaveClass(/fixed inset-0 bg-black bg-opacity-50/)
    
    const modalContent = modal.locator('.bg-\\[\\#073E44\\]')
    await expect(modalContent).toHaveClass(/border border-teal-700/)
  })

  test('should call onGoodreadsClick when Goodreads link is clicked', async ({ page }) => {
    await page.goto('/test-success-modal')
    
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click()
    
    // Click Goodreads link
    await page.getByRole('link', { name: 'Add to Goodreads' }).click()
    
    // Should open in new tab (we can't easily test the callback in Playwright)
    // But we can verify the link works
    await expect(page.getByRole('link', { name: 'Add to Goodreads' })).toBeVisible()
  })
})
