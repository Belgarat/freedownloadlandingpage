import { test, expect } from '@playwright/test'

test.describe('Authentication System', () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  test.describe('Login Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Clear any existing authentication
      await page.context().clearCookies()
      await page.goto('/admin')
    })

    test('should show login form when not authenticated', async ({ page }) => {
      // Check login form is visible
      await expect(page.getByText('Admin Login')).toBeVisible()
      await expect(page.getByText('Enter your admin password to continue')).toBeVisible()
      await expect(page.getByPlaceholder('Enter admin password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    })

    test('should show error for invalid password', async ({ page }) => {
      const passwordInput = page.getByPlaceholder('Enter admin password')
      const loginButton = page.getByRole('button', { name: 'Sign in' })

      // Enter invalid password
      await passwordInput.fill('wrongpassword')
      await loginButton.click()

      // Should show error message
      await expect(page.getByText('Invalid password')).toBeVisible({ timeout: 5000 })
    })

    test('should successfully login and be able to access admin pages', async ({ page }) => {
      const passwordInput = page.getByPlaceholder('Enter admin password')
      const loginButton = page.getByRole('button', { name: 'Sign in' })

      // Enter correct password
      await passwordInput.fill(adminPassword)
      await loginButton.click()

      // Wait for redirect and check URL
      await expect(page).toHaveURL('/admin', { timeout: 10000 })
      
      // After login, navigate to a different admin page to verify authentication
      await page.goto('/admin/config')
      await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible({ timeout: 10000 })
    })

    test('should have proper form validation', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: 'Sign in' })

      // Try to submit without password
      await loginButton.click()

      // Form should not submit (HTML5 validation)
      await expect(page.getByText('Admin Login')).toBeVisible()
    })
  })

  test.describe('Logout Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login first and navigate to a working page
      await page.context().clearCookies()
      await page.goto('/admin')
      await page.getByPlaceholder('Enter admin password').fill(adminPassword)
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Navigate to config page where authentication works
      await page.goto('/admin/config')
      await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible({ timeout: 10000 })
    })

    test('should show logout button when authenticated', async ({ page }) => {
      // Should show logout button in header
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    })

    test('should successfully logout and redirect to login', async ({ page }) => {
      const logoutButton = page.getByRole('button', { name: 'Logout' })

      // Click logout
      await logoutButton.click()

      // Should redirect to admin login page
      await expect(page).toHaveURL('/admin', { timeout: 10000 })
      
      // Should show login form
      await expect(page.getByText('Admin Login')).toBeVisible()
    })
  })

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.context().clearCookies()

      // Try to access protected admin routes
      const protectedRoutes = ['/admin/config', '/admin/analytics', '/admin/seo', '/admin/marketing']
      
      for (const route of protectedRoutes) {
        await page.goto(route)
        
        // Should be redirected to login
        await expect(page).toHaveURL(/\/admin(\?.*)?$/, { timeout: 10000 })
        await expect(page.getByText('Admin Login')).toBeVisible()
      }
    })

    test('should allow authenticated users to access admin pages', async ({ page }) => {
      // Login first
      await page.context().clearCookies()
      await page.goto('/admin')
      await page.getByPlaceholder('Enter admin password').fill(adminPassword)
      await page.getByRole('button', { name: 'Sign in' }).click()
      await expect(page).toHaveURL('/admin', { timeout: 10000 })

      // Try to access admin config page
      await page.goto('/admin/config')
      
      // Should be able to access the page
      await expect(page).toHaveURL('/admin/config')
      await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible()
    })
  })
})
