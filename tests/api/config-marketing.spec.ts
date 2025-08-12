import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/config/marketing/route'
import { NextRequest } from 'next/server'

// Mock the config service
vi.mock('@/lib/config-service', () => ({
  configService: {
    getMarketingConfigs: vi.fn(),
    createMarketingConfig: vi.fn()
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

describe('Marketing Config API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/config/marketing', () => {
    it('should return all marketing configs successfully', async () => {
      const mockConfigs = [
        {
          id: 1,
          name: 'Test Config',
          description: 'Test description',
          cta_config: { primary: { text: 'Test' } },
          modal_config: { success: { title: 'Test' } },
          offer_config: { isLimited: true },
          social_proof_config: { showRating: true },
          is_active: true,
          is_default: true,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        }
      ]

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getMarketingConfigs).mockResolvedValue(mockConfigs)

      const response = await GET()
      const data = await response.json()

      expect(configService.getMarketingConfigs).toHaveBeenCalledOnce()
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConfigs)
    })

    it('should handle errors when fetching configs fails', async () => {
      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getMarketingConfigs).mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/config/marketing', () => {
    it('should create a new marketing config successfully', async () => {
      const mockConfig = {
        id: 1,
        name: 'New Config',
        description: 'New description',
        cta_config: { primary: { text: 'Test' } },
        modal_config: { success: { title: 'Test' } },
        offer_config: { isLimited: true },
        social_proof_config: { showRating: true },
        is_active: true,
        is_default: false,
        created_at: '2025-01-01',
        updated_at: '2025-01-01'
      }

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.createMarketingConfig).mockResolvedValue(mockConfig)

      const requestBody = {
        name: 'New Config',
        description: 'New description',
        cta_config: { primary: { text: 'Test' } },
        modal_config: { success: { title: 'Test' } },
        offer_config: { isLimited: true },
        social_proof_config: { showRating: true }
      }

      const request = new NextRequest('http://localhost:3000/api/config/marketing', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(configService.createMarketingConfig).toHaveBeenCalledWith(requestBody)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConfig)
      expect(data.message).toBe('Marketing configuration created successfully')
      expect(response.status).toBe(201)
    })

    it('should return 400 when required fields are missing', async () => {
      const requestBody = {
        name: 'New Config'
        // Missing required fields
      }

      const request = new NextRequest('http://localhost:3000/api/config/marketing', {
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
      vi.mocked(configService.createMarketingConfig).mockRejectedValue(new Error('Database error'))

      const requestBody = {
        name: 'New Config',
        description: 'New description',
        cta_config: { primary: { text: 'Test' } },
        modal_config: { success: { title: 'Test' } },
        offer_config: { isLimited: true },
        social_proof_config: { showRating: true }
      }

      const request = new NextRequest('http://localhost:3000/api/config/marketing', {
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
