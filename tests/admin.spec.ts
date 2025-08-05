import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin')
  })

  test('should show login form when not authenticated', async ({ page }) => {
    // Check login form is visible
    await expect(page.getByText('Admin Panel')).toBeVisible()
    await expect(page.getByText('Accedi per visualizzare le statistiche')).toBeVisible()
    await expect(page.getByPlaceholder('Inserisci password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Accedi' })).toBeVisible()
  })

  test('should show password toggle functionality', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Inserisci password')
    const toggleButton = page.locator('button[type="button"]').last()

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click toggle to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')

    // Click toggle to hide password again
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should show error for invalid password', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Inserisci password')
    const loginButton = page.getByRole('button', { name: 'Accedi' })

    // Enter invalid password
    await passwordInput.fill('wrongpassword')
    await loginButton.click()

    // Should show error message (with longer timeout for API call)
    await expect(page.getByText('Password non corretta')).toBeVisible({ timeout: 10000 })
  })

  test('should show loading state during login', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Inserisci password')
    const loginButton = page.getByRole('button', { name: 'Accedi' })

    // Enter password and click login
    await passwordInput.fill('testpassword')
    await loginButton.click()

    // Should show loading state (with longer timeout for API call)
    await expect(page.getByText('Accesso in corso...')).toBeVisible({ timeout: 10000 })
  })

  test('should have proper form validation', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Accedi' })

    // Try to submit without password
    await loginButton.click()

    // Form should not submit (HTML5 validation)
    await expect(page.getByText('Admin Panel')).toBeVisible()
  })

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper labels
    await expect(page.getByLabel('Password')).toBeVisible()
    
    // Check for proper ARIA attributes
    const passwordInput = page.getByPlaceholder('Inserisci password')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should have back to homepage link', async ({ page }) => {
    // Check back to homepage link is visible
    await expect(page.getByText('← Torna alla Homepage')).toBeVisible()
    
    // Check link points to homepage
    const backLink = page.getByText('← Torna alla Homepage')
    await expect(backLink).toHaveAttribute('href', '/')
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Admin Panel')).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('Admin Panel')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('Admin Panel')).toBeVisible()
  })
}) 