import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/config/content/route'
import { NextRequest } from 'next/server'

// Mock the config service
vi.mock('@/lib/config-service', () => ({
  configService: {
    getContentConfigs: vi.fn(),
    createContentConfig: vi.fn()
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

describe('Content Config API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/config/content', () => {
    it('should return all content configs successfully', async () => {
      const mockConfigs = [
        {
          id: 1,
          language: 'en',
          name: 'Test Content',
          about_book: '<p>Test about</p>',
          author_bio: '<p>Test bio</p>',
          stories: [{ title: 'Test', description: 'Test', content: '<p>Test</p>' }],
          testimonials: [{ text: 'Test', author: 'Test', rating: 5, source: 'Test' }],
          footer: { copyright: 'Test', supportText: 'Test' },
          is_active: true,
          is_default: true,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        }
      ]

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getContentConfigs).mockResolvedValue(mockConfigs)

      const request = new NextRequest('http://localhost:3000/api/config/content')
      const response = await GET(request)
      const data = await response.json()

      expect(configService.getContentConfigs).toHaveBeenCalledOnce()
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConfigs)
    })

    it('should filter content configs by language', async () => {
      const mockConfigs = [
        {
          id: 1,
          language: 'en',
          name: 'English Content',
          about_book: '<p>English about</p>',
          author_bio: '<p>English bio</p>',
          stories: [{ title: 'English', description: 'English', content: '<p>English</p>' }],
          testimonials: [{ text: 'English', author: 'English', rating: 5, source: 'English' }],
          footer: { copyright: 'English', supportText: 'English' },
          is_active: true,
          is_default: true,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: 2,
          language: 'it',
          name: 'Italian Content',
          about_book: '<p>Italian about</p>',
          author_bio: '<p>Italian bio</p>',
          stories: [{ title: 'Italian', description: 'Italian', content: '<p>Italian</p>' }],
          testimonials: [{ text: 'Italian', author: 'Italian', rating: 5, source: 'Italian' }],
          footer: { copyright: 'Italian', supportText: 'Italian' },
          is_active: true,
          is_default: true,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        }
      ]

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getContentConfigs).mockResolvedValue(mockConfigs)

      const request = new NextRequest('http://localhost:3000/api/config/content?language=en')
      const response = await GET(request)
      const data = await response.json()

      expect(configService.getContentConfigs).toHaveBeenCalledOnce()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].language).toBe('en')
    })

    it('should handle errors when fetching configs fails', async () => {
      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.getContentConfigs).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/config/content')
      const response = await GET(request)
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/config/content', () => {
    it('should create a new content config successfully', async () => {
      const mockConfig = {
        id: 1,
        language: 'en',
        name: 'New Content',
        about_book: '<p>New about</p>',
        author_bio: '<p>New bio</p>',
        stories: [{ title: 'New', description: 'New', content: '<p>New</p>' }],
        testimonials: [{ text: 'New', author: 'New', rating: 5, source: 'New' }],
        footer: { copyright: 'New', supportText: 'New' },
        is_active: true,
        is_default: false,
        created_at: '2025-01-01',
        updated_at: '2025-01-01'
      }

      const { configService } = await import('@/lib/config-service')
      vi.mocked(configService.createContentConfig).mockResolvedValue(mockConfig)

      const requestBody = {
        language: 'en',
        name: 'New Content',
        about_book: '<p>New about</p>',
        author_bio: '<p>New bio</p>',
        stories: [{ title: 'New', description: 'New', content: '<p>New</p>' }],
        testimonials: [{ text: 'New', author: 'New', rating: 5, source: 'New' }],
        footer: { copyright: 'New', supportText: 'New' }
      }

      const request = new NextRequest('http://localhost:3000/api/config/content', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(configService.createContentConfig).toHaveBeenCalledWith(requestBody)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConfig)
      expect(data.message).toBe('Content configuration created successfully')
      expect(response.status).toBe(201)
    })

    it('should return 400 when required fields are missing', async () => {
      const requestBody = {
        language: 'en',
        name: 'New Content'
        // Missing required fields
      }

      const request = new NextRequest('http://localhost:3000/api/config/content', {
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
      vi.mocked(configService.createContentConfig).mockRejectedValue(new Error('Database error'))

      const requestBody = {
        language: 'en',
        name: 'New Content',
        about_book: '<p>New about</p>',
        author_bio: '<p>New bio</p>',
        stories: [{ title: 'New', description: 'New', content: '<p>New</p>' }],
        testimonials: [{ text: 'New', author: 'New', rating: 5, source: 'New' }],
        footer: { copyright: 'New', supportText: 'New' }
      }

      const request = new NextRequest('http://localhost:3000/api/config/content', {
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
