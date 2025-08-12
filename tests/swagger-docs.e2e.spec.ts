import { test, expect } from '@playwright/test'

test.describe('Swagger Documentation', () => {
  test('should load API documentation page', async ({ page }) => {
    await page.goto('/api-docs')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check that the Swagger UI is loaded
    await expect(page.locator('.swagger-ui')).toBeVisible()
    
    // Check that the API title is present in Swagger UI
    await expect(page.locator('.info .title')).toContainText('Book Landing Stack API')
    
    // Check that API endpoints are visible
    const tagCount = await page.locator('.opblock-tag').count()
    expect(tagCount).toBeGreaterThanOrEqual(7)
    
    // Check that the health endpoint is documented
    await expect(page.getByText('/api/health')).toBeVisible()
    
    // Check that the send-ebook endpoint is documented
    await expect(page.getByText('/api/send-ebook')).toBeVisible()
  })

  test('should serve OpenAPI specification JSON', async ({ request }) => {
    const response = await request.get('/api/docs/swagger.json')
    
    expect(response.ok()).toBeTruthy()
    
    const spec = await response.json()
    
    // Check basic OpenAPI structure
    expect(spec.openapi).toBe('3.0.0')
    expect(spec.info.title).toBe('Book Landing Stack API')
    expect(spec.info.version).toBe('1.0.0')
    
    // Check that paths are defined
    expect(spec.paths).toBeDefined()
    expect(spec.paths['/api/health']).toBeDefined()
    expect(spec.paths['/api/send-ebook']).toBeDefined()
    expect(spec.paths['/api/analytics']).toBeDefined()
    
    // Check that schemas are defined
    expect(spec.components.schemas).toBeDefined()
    expect(spec.components.schemas.EmailRequest).toBeDefined()
    expect(spec.components.schemas.AnalyticsEvent).toBeDefined()
    expect(spec.components.schemas.Error).toBeDefined()
  })

  test('should have correct content type for OpenAPI spec', async ({ request }) => {
    const response = await request.get('/api/docs/swagger.json')
    
    expect(response.headers()['content-type']).toContain('application/json')
  })
})
