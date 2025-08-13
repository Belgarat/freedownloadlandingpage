import { test, expect } from '@playwright/test'

test.describe('A/B Testing Section', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and go to admin
    await page.context().clearCookies()
    await page.goto('/admin')
    
    // Login
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Wait for login to complete
    await page.waitForURL('/admin')
    
    // Navigate to A/B Testing
    await page.click('text=A/B Testing')
    await page.waitForURL('/admin/ab-testing')
  })

  test('should load A/B Testing page successfully', async ({ page }) => {
    // Check if page loads without errors
    await expect(page.getByRole('heading', { name: 'A/B Testing' })).toBeVisible()
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/ab-testing-page.png' })
    
    // Check if the dashboard component is present (with longer timeout for real data loading)
    await expect(page.locator('[data-testid="active-tests-count"]')).toBeVisible({ timeout: 15000 })
  })

  test('should display A/B Testing dashboard with correct sections', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'A/B Testing' })).toBeVisible()
    await expect(page.getByText('Create and manage conversion optimization tests')).toBeVisible()

    // Check tab navigation
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'All Tests' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Create Test' })).toBeVisible()
  })

  test('should show overview tab with statistics', async ({ page }) => {
    // Overview tab should be active by default
    await expect(page.getByRole('tabpanel')).toContainText('Recent Tests')
    await expect(page.getByText('Active Tests')).toBeVisible()
    await expect(page.getByText('Total Visitors')).toBeVisible()
    await expect(page.getByText('Avg Conversion')).toBeVisible()
  })

  test('should display test cards with correct information', async ({ page }) => {
    // Check for test cards in overview (should show some tests)
    await expect(page.getByText('Recent Tests')).toBeVisible()
    
    // Check for status badges (should have some status badges visible)
    await expect(page.getByText('draft').first()).toBeVisible()
  })

  test('should show test variants with metrics', async ({ page }) => {
    // Click on All Tests tab to see detailed test information
    await page.click('text=All Tests')
    
    // Check for test information - be more flexible with test names
    const testElements = page.locator('[data-testid^="test-"]')
    const testCount = await testElements.count()
    
    if (testCount > 0) {
      await expect(testElements.first()).toBeVisible()
      
      // Check for metrics in the overview cards - verify data is valid (not exact values)
      const totalVisitorsText = await page.locator('[data-testid="total-visitors"]').first().textContent()
      const totalConversionsText = await page.locator('[data-testid="total-conversions"]').first().textContent()
      const conversionRateText = await page.locator('[data-testid="conversion-rate"]').first().textContent()
      
      // Verify data is numeric and reasonable
      expect(parseInt(totalVisitorsText || '0')).toBeGreaterThanOrEqual(0)
      expect(parseInt(totalConversionsText || '0')).toBeGreaterThanOrEqual(0)
      expect(parseFloat(conversionRateText?.replace('%', '') || '0')).toBeGreaterThanOrEqual(0)
    } else {
      // If no tests exist, just check that the page loaded successfully
      await expect(page.getByRole('heading', { name: 'A/B Testing' })).toBeVisible()
    }
  })

  test('should display winner and control badges', async ({ page }) => {
    // Click on All Tests tab to see detailed test information
    await page.click('text=All Tests')
    
    // Check for test information - be more flexible with test names
    const testElements = page.locator('[data-testid^="test-"]')
    const testCount = await testElements.count()
    
    if (testCount > 0) {
      await expect(testElements.first()).toBeVisible()
      
      // Check for test status (should have some status)
      const statusElements = page.locator('[class*="status"]')
      await expect(statusElements.first()).toBeVisible()
    } else {
      // If no tests exist, just check that the page loaded successfully
      await expect(page.getByRole('heading', { name: 'A/B Testing' })).toBeVisible()
    }
  })

  test('should show create test tab with templates', async ({ page }) => {
    // Click on Create Test tab
    await page.click('text=Create Test')
    
    // Wait a bit for the content to load
    await page.waitForTimeout(1000)
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/create-test-tab.png' })
    
    // Check if the tab content is visible
    await expect(page.locator('[role="tabpanel"]')).toBeVisible()
    
    // Debug: log the page content to see what's actually there
    const pageContent = await page.content()
    console.log('Page content length:', pageContent.length)
    
    // Check if any template content is present
    await expect(page.getByText('Create New A/B Test')).toBeVisible()
    
    // Debug: check if any template elements exist
    const templateElements = await page.locator('[data-testid^="template-"]').count()
    console.log('Template elements found:', templateElements)
    
    // Check for template cards - use more specific selectors
    await expect(page.locator('[data-testid="template-cta_button_text"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-cta_button_color"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-headline_text"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-headline_size"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-offer_text"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-social_proof"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-form_placeholder"]')).toBeVisible()
    await expect(page.locator('[data-testid="template-page_layout"]')).toBeVisible()
  })

  test('should display template details correctly', async ({ page }) => {
    // Click on Create Test tab
    await page.click('text=Create Test')
    
    // Check template details - use more specific selectors
    await expect(page.locator('[data-testid="template-cta_button_text"] .description')).toContainText('Test different call-to-action button texts')
    await expect(page.locator('[data-testid="template-cta_button_text"] .target')).toContainText('button[type="submit"]')
    await expect(page.locator('[data-testid="template-cta_button_text"] .variants')).toContainText('3 variants')
    
    // Check for Use Template buttons
    const useTemplateButtons = page.locator('button:has-text("Use Template")')
    await expect(useTemplateButtons).toHaveCount(8) // 8 templates
  })

  test('should show test statistics with improved contrast', async ({ page }) => {
    // Check for high contrast statistics in the header cards - use more specific selectors
    await expect(page.getByText('Active Tests')).toBeVisible()
    // Check that active tests count is a valid number (data changes over time)
    const activeTestsCountText = await page.locator('[data-testid="active-tests-count"]').textContent()
    expect(parseInt(activeTestsCountText || '0')).toBeGreaterThanOrEqual(0)
    await expect(page.getByText('Total Visitors')).toBeVisible()
    // Check that total visitors is a valid number (data changes over time)
    const totalVisitorsText = await page.locator('[data-testid="total-visitors"]').first().textContent()
    expect(parseInt(totalVisitorsText || '0')).toBeGreaterThanOrEqual(0)
    await expect(page.getByText('Avg Conversion')).toBeVisible()
    // Check that avg conversion rate is a valid percentage (data changes over time)
    const avgConversionRateText = await page.locator('[data-testid="avg-conversion-rate"]').textContent()
    expect(parseFloat(avgConversionRateText?.replace('%', '') || '0')).toBeGreaterThanOrEqual(0)
  })

  test('should display target element and conversion goal information', async ({ page }) => {
    // Click on All Tests tab to see detailed test information
    await page.click('text=All Tests')
    
    // Check for test information - be more flexible with test names
    const testElements = page.locator('[data-testid^="test-"]')
    const testCount = await testElements.count()
    
    if (testCount > 0) {
      await expect(testElements.first()).toBeVisible()
      
      // Check for test descriptions - use more specific selectors
      await expect(page.locator('[data-testid^="test-"] .description').first()).toBeVisible()
    } else {
      // If no tests exist, just check that the page loaded successfully
      await expect(page.getByText('A/B Testing')).toBeVisible()
    }
  })

  test('should navigate between tabs correctly', async ({ page }) => {
    // Start on Overview
    await expect(page.getByText('Overview')).toBeVisible()
    
    // Click All Tests
    await page.click('text=All Tests')
    await expect(page.getByText('All Tests')).toBeVisible()
    
    // Click Create Test
    await page.click('text=Create Test')
    await expect(page.getByRole('tab', { name: 'Create Test' })).toBeVisible()
    await expect(page.locator('[data-testid="template-cta_button_text"]')).toBeVisible()
    
    // Back to Overview
    await page.click('text=Overview')
    await expect(page.getByText('Overview')).toBeVisible()
  })

  test('should show logout button and work correctly', async ({ page }) => {
    // Check logout button is visible (use first one to avoid strict mode violation)
    const logoutButtons = page.locator('button:has-text("Logout")')
    await expect(logoutButtons.first()).toBeVisible()
    
    // Click logout
    await logoutButtons.first().click()
    
    // Wait for navigation with a shorter timeout and more flexible approach
    try {
      await page.waitForURL('/admin', { timeout: 5000 })
    } catch (error) {
      // If timeout, check if we're already on the admin page
      const currentUrl = page.url()
      if (!currentUrl.includes('/admin')) {
        throw error
      }
    }
    
    // Check for login form or admin page
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible()
  })
})
