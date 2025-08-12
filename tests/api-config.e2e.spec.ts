import { test, expect } from '@playwright/test'

test.describe('Configuration API E2E Tests', () => {
  const baseUrl = 'http://localhost:3001'

  test.describe('Marketing Config API', () => {
    test('should get all marketing configs', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/marketing`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
      
      // Check structure of first config
      const config = data.data[0]
      expect(config).toHaveProperty('id')
      expect(config).toHaveProperty('name')
      expect(config).toHaveProperty('cta_config')
      expect(config).toHaveProperty('modal_config')
      expect(config).toHaveProperty('offer_config')
      expect(config).toHaveProperty('social_proof_config')
    })

    test('should get active marketing config', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/marketing/active`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('is_active', true)
    })

    test('should create new marketing config', async ({ request }) => {
      const newConfig = {
        name: 'Test Marketing Config',
        description: 'Test description',
        cta_config: {
          primary: { text: 'Test CTA', subtext: 'Test subtext' },
          social: { goodreads: { text: 'Test', url: 'test.com' } },
          newsletter: { text: 'Test', placeholder: 'test@example.com' }
        },
        modal_config: {
          success: { title: 'Test Success', message: 'Test message' },
          error: { title: 'Test Error', message: 'Test error' }
        },
        offer_config: { isLimited: true, limitedText: 'Test limited' },
        social_proof_config: { showRating: true, showReviewCount: true }
      }

      const response = await request.post(`${baseUrl}/api/config/marketing`, {
        data: newConfig
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(newConfig.name)
      expect(data.message).toBe('Marketing configuration created successfully')
    })

    test('should return 400 for invalid marketing config', async ({ request }) => {
      const invalidConfig = {
        name: 'Test Config'
        // Missing required fields
      }

      const response = await request.post(`${baseUrl}/api/config/marketing`, {
        data: invalidConfig
      })
      
      expect(response.status()).toBe(400)
      
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error).toContain('Missing required fields')
    })
  })

  test.describe('Theme Config API', () => {
    test('should get all theme configs', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/theme`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
      
      // Check structure of first config
      const config = data.data[0]
      expect(config).toHaveProperty('id')
      expect(config).toHaveProperty('name')
      expect(config).toHaveProperty('colors')
      expect(config).toHaveProperty('fonts')
      expect(config).toHaveProperty('layout')
      expect(config).toHaveProperty('spacing')
      expect(config).toHaveProperty('animations')
      expect(config).toHaveProperty('development')
      expect(config).toHaveProperty('surface')
    })

    test('should get active theme config', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/theme/active`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('is_active', true)
    })

    test('should create new theme config', async ({ request }) => {
      const newConfig = {
        name: 'Test Theme Config',
        description: 'Test description',
        colors: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#cccccc',
          background: '#f0f0f0',
          text: { primary: '#000000', secondary: '#666666', muted: '#999999' },
          success: '#00ff00',
          error: '#ff0000',
          warning: '#ffff00'
        },
        fonts: { heading: 'serif', body: 'system-ui', mono: 'monospace' },
        layout: { type: 'sidebar', showCountdown: true, showStories: false },
        spacing: { container: 'max-w-7xl', section: 'py-20', element: 'mb-6' },
        animations: { enabled: true, duration: '300ms', easing: 'ease-in-out' },
        development: { debug: true, hotReload: true },
        surface: { mode: 'auto' }
      }

      const response = await request.post(`${baseUrl}/api/config/theme`, {
        data: newConfig
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(newConfig.name)
      expect(data.message).toBe('Theme configuration created successfully')
    })
  })

  test.describe('Content Config API', () => {
    test('should get all content configs', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/content`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
      
      // Check structure of first config
      const config = data.data[0]
      expect(config).toHaveProperty('id')
      expect(config).toHaveProperty('language')
      expect(config).toHaveProperty('name')
      expect(config).toHaveProperty('about_book')
      expect(config).toHaveProperty('author_bio')
      expect(config).toHaveProperty('stories')
      expect(config).toHaveProperty('testimonials')
      expect(config).toHaveProperty('footer')
    })

    test('should filter content configs by language', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/content?language=en`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      
      // All configs should be in English
      data.data.forEach((config: any) => {
        expect(config.language).toBe('en')
      })
    })

    test('should get active content config', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/content/active`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('is_active', true)
    })

    test('should create new content config', async ({ request }) => {
      const newConfig = {
        language: 'en',
        name: 'Test Content Config',
        about_book: '<p>Test about book content</p>',
        author_bio: '<p>Test author biography</p>',
        stories: [
          {
            title: 'Test Story',
            description: 'Test story description',
            content: '<p>Test story content</p>'
          }
        ],
        testimonials: [
          {
            text: 'Test testimonial',
            author: 'Test Author',
            rating: 5,
            source: 'Test Source'
          }
        ],
        footer: {
          copyright: 'Test Copyright',
          supportText: 'Test Support Text'
        }
      }

      const response = await request.post(`${baseUrl}/api/config/content`, {
        data: newConfig
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(newConfig.name)
      expect(data.message).toBe('Content configuration created successfully')
    })
  })

  test.describe('A/B Testing API', () => {
    test('should get all A/B tests', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/ab-testing`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    test('should create new A/B test', async ({ request }) => {
      const newTest = {
        test_name: 'Test A/B Test',
        config_type: 'marketing',
        config_a_id: 1,
        config_b_id: 2,
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        status: 'active'
      }

      const response = await request.post(`${baseUrl}/api/config/ab-testing`, {
        data: newTest
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.test_name).toBe(newTest.test_name)
      expect(data.message).toBe('A/B test created successfully')
    })
  })

  test.describe('Analytics API', () => {
    test('should get config analytics', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/analytics?type=marketing&timeRange=7d`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  test.describe('Usage API', () => {
    test('should track config usage', async ({ request }) => {
      const usageData = {
        config_type: 'marketing',
        config_id: 1,
        visitor_id: 'test-visitor-123',
        page_view: 1,
        email_submission: 0,
        download_request: 0,
        download_completed: 0
      }

      const response = await request.post(`${baseUrl}/api/config/usage`, {
        data: usageData
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toBe('Usage tracked successfully')
    })

    test('should get config stats', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/config/usage?configId=1&configType=marketing`)
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('config_id', 1)
    })
  })

  test.describe('Assign API', () => {
    test('should assign config to visitor', async ({ request }) => {
      const assignData = {
        visitor_id: 'test-visitor-456',
        config_type: 'marketing'
      }

      const response = await request.post(`${baseUrl}/api/config/assign`, {
        data: assignData
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('config_id')
      expect(data.message).toBe('Configuration assigned successfully')
    })
  })

  test.describe('Duplicate API', () => {
    test('should duplicate config', async ({ request }) => {
      const duplicateData = {
        id: 1,
        type: 'marketing',
        newName: 'Duplicated Marketing Config'
      }

      const response = await request.post(`${baseUrl}/api/config/duplicate`, {
        data: duplicateData
      })
      
      expect(response.ok()).toBeTruthy()
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(duplicateData.newName)
      expect(data.message).toBe('Configuration duplicated successfully')
    })
  })
})
