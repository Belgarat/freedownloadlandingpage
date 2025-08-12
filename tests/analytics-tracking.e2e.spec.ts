import { test, expect } from '@playwright/test'

test.describe('Analytics Tracking', () => {
  test('should track page view and other events', async ({ page }) => {
    // Intercetta le chiamate API per verificare che vengano fatte
    const analyticsCalls: any[] = []
    const anonymousCalls: any[] = []
    
    page.on('request', request => {
      if (request.url().includes('/api/analytics') && request.method() === 'POST') {
        analyticsCalls.push(request.url())
      }
      if (request.url().includes('/api/analytics/anonymous') && request.method() === 'POST') {
        anonymousCalls.push(request.url())
      }
    })

    // Visita la landing page
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Aspetta un po' per permettere agli analytics di essere inviati
    await page.waitForTimeout(2000)

    // Verifica che siano state fatte chiamate analytics
    expect(analyticsCalls.length).toBeGreaterThan(0)
    expect(anonymousCalls.length).toBeGreaterThan(0)

    console.log('Analytics calls:', analyticsCalls.length)
    console.log('Anonymous calls:', anonymousCalls.length)

    // Verifica che i dati siano stati salvati nel database
    const statsResponse = await page.request.get('/api/analytics/stats')
    expect(statsResponse.status()).toBe(200)
    const stats = await statsResponse.json()
    
    console.log('Stats:', {
      pageViews: stats.pageViews,
      anonymousVisits: stats.anonymousVisits,
      emailSubmissions: stats.emailSubmissions
    })

    // Verifica che almeno gli analytics anonimi siano stati incrementati
    expect(stats.anonymousVisits).toBeGreaterThan(0)
  })
})
