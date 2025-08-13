import { Page } from '@playwright/test'
import { generateTestToken, TEST_ADMIN_USER } from '@/lib/test-auth'

export async function authenticateAsAdmin(page: Page) {
  const token = generateTestToken(TEST_ADMIN_USER)
  await page.context().addCookies([
    {
      name: 'admin_auth',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
    }
  ])
}

export async function clearAuth(page: Page) {
  await page.context().clearCookies()
}
