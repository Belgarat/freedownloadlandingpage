import jwt from 'jsonwebtoken'

const TEST_SECRET = 'test-secret-key-for-e2e-tests'

export interface TestUser {
  id: string
  email: string
  role: 'admin' | 'user'
}

export function generateTestToken(user: TestUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000)
  }
  
  return jwt.sign(payload, TEST_SECRET)
}

export function verifyTestToken(token: string): TestUser | null {
  try {
    const decoded = jwt.verify(token, TEST_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }
  } catch {
    return null
  }
}

export const TEST_ADMIN_USER: TestUser = {
  id: 'test-admin-1',
  email: 'admin@test.com',
  role: 'admin'
}

export const TEST_USER: TestUser = {
  id: 'test-user-1',
  email: 'user@test.com',
  role: 'user'
}
