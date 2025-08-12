import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/config/theme/route'
import { NextRequest } from 'next/server'

// Mock the config service
vi.mock('@/lib/config-service', () => ({
  configService: {
    getThemeConfigs: vi.fn(),
    createThemeConfig: vi.fn()
  }
}))

// Mock NextResponse and NextRequest
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({
      json: vi.fn().mockResolvedValue(data),
      status: options?.status || 200,
      headers: new Headers()
    }))
  },
  NextRequest: class {
    constructor(url: string, init?: any) {
      this.url = url
      this.method = init?.method || 'GET'
      this.body = init?.body
    }
    url: string
    method: string
    body: any
    json() {
      return Promise.resolve(JSON.parse(this.body))
    }
  }
}))

describe('Theme Config API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/config/theme', () => {
    it('should return all theme configs successfully', async () => {
      const mockConfigs = [
        {
          id: 1,
          name: 'Test Theme',
          description: 'Test description',
          colors: { primary: '#000000', secondary: '#ffffff' },
          fonts: { heading: 'serif', body: 'system-ui' },
          layout: { type: 'sidebar', showCountdown: true },
          spacing: { container: 'max-w-7xl', section: 'py-20' },
          animations: { enabled: true, duration: '300ms' },
          development: { debug: true, hotReload: true },
          surface: { mode: 'auto' },
          is_active: true,
          is_default: true,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        }
      ]

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getThemeConfigs).mockResolvedValue(mockConfigs)

      const response = await GET()
      const data = await response.json()

      expect(configService.getThemeConfigs).toHaveBeenCalledOnce()
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConfigs)
    })

    it('should handle errors when fetching configs fails', async () => {
      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getThemeConfigs).mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/config/theme', () => {
    it('should create a new theme config successfully', async () => {
      const mockConfig = {
        id: 1,
        name: 'New Theme',
        description: 'New description',
        colors: { primary: '#000000', secondary: '#ffffff' },
        fonts: { heading: 'serif', body: 'system-ui' },
        layout: { type: 'sidebar', showCountdown: true },
        spacing: { container: 'max-w-7xl', section: 'py-20' },
        animations: { enabled: true, duration: '300ms' },
        development: { debug: true, hotReload: true },
        surface: { mode: 'auto' },
        is_active: true,
        is_default: false,
        created_at: '2025-01-01',
        updated_at: '2025-01-01'
      }

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.createThemeConfig).mockResolvedValue(mockConfig)

      const requestBody = {
        name: 'New Theme',
        description: 'New description',
        colors: { primary: '#000000', secondary: '#ffffff' },
        fonts: { heading: 'serif', body: 'system-ui' },
        layout: { type: 'sidebar', showCountdown: true },
        spacing: { container: 'max-w-7xl', section: 'py-20' },
        animations: { enabled: true, duration: '300ms' },
        development: { debug: true, hotReload: true },
        surface: { mode: 'auto' }
      }

      const request = new NextRequest('http://localhost:3000/api/config/theme', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(configService.createThemeConfig).toHaveBeenCalledWith(requestBody)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConfig)
      expect(data.message).toBe('Theme configuration created successfully')
      expect(response.status).toBe(201)
    })

    it('should return 400 when required fields are missing', async () => {
      const requestBody = {
        name: 'New Theme'
        // Missing required fields
      }

      const request = new NextRequest('http://localhost:3000/api/config/theme', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toContain('Missing required fields')
      expect(response.status).toBe(400)
    })

    it('should handle errors when creating config fails', async () => {
      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.createThemeConfig).mockRejectedValue(new Error('Database error'))

      const requestBody = {
        name: 'New Theme',
        description: 'New description',
        colors: { primary: '#000000', secondary: '#ffffff' },
        fonts: { heading: 'serif', body: 'system-ui' },
        layout: { type: 'sidebar', showCountdown: true },
        spacing: { container: 'max-w-7xl', section: 'py-20' },
        animations: { enabled: true, duration: '300ms' },
        development: { debug: true, hotReload: true },
        surface: { mode: 'auto' }
      }

      const request = new NextRequest('http://localhost:3000/api/config/theme', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
      expect(response.status).toBe(500)
    })
  })
})
