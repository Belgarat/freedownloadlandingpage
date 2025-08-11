import { createSwaggerSpec } from 'next-swagger-doc'
import path from 'path'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: path.join(process.cwd(), 'app', 'api'), // define api folder under app folder
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Book Landing Stack API',
        version: '1.0.0',
        description: 'Complete API for Book Landing Stack - A platform for authors to create landing pages, capture emails, and distribute ebooks.',
        contact: {
          name: 'Book Landing Stack Support',
          email: 'support@booklandingstack.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server'
        },
        {
          url: 'https://yourdomain.com/api',
          description: 'Production server'
        }
      ],
      components: {
        securitySchemes: {
          adminAuth: {
            type: 'http',
            scheme: 'bearer',
            description: 'Admin authentication via session cookie'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              error: {
                type: 'string',
                example: 'Error description'
              },
              status: {
                type: 'integer',
                example: 400
              }
            }
          },
          Success: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: true
              },
              data: {
                type: 'object'
              },
              message: {
                type: 'string',
                example: 'Operation completed successfully'
              }
            }
          },
          EmailRequest: {
            type: 'object',
            required: ['email', 'name'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                example: 'reader@example.com'
              },
              name: {
                type: 'string',
                example: 'John Doe'
              }
            }
          },
          AnalyticsEvent: {
            type: 'object',
            required: ['action'],
            properties: {
              action: {
                type: 'string',
                enum: ['page_view', 'scroll', 'exit', 'email_submit', 'download_requested', 'download_completed'],
                example: 'page_view'
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'reader@example.com'
              },
              scrollDepth: {
                type: 'integer',
                minimum: 0,
                maximum: 100,
                example: 75
              },
              timeOnPage: {
                type: 'integer',
                example: 120000
              }
            }
          },
          AnonymousEvent: {
            type: 'object',
            required: ['type'],
            properties: {
              type: {
                type: 'string',
                enum: ['visit', 'download', 'email_submit', 'goodreads_click', 'substack_click', 'publisher_click'],
                example: 'visit'
              }
            }
          },
          ABTest: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'test_123'
              },
              name: {
                type: 'string',
                example: 'CTA Button Test'
              },
              description: {
                type: 'string',
                example: 'Testing different button colors'
              },
              status: {
                type: 'string',
                enum: ['draft', 'running', 'paused', 'completed'],
                example: 'running'
              },
              variants: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ABVariant'
                }
              }
            }
          },
          ABVariant: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'variant_1'
              },
              name: {
                type: 'string',
                example: 'Blue Button'
              },
              is_control: {
                type: 'boolean',
                example: true
              },
              css_class: {
                type: 'string',
                example: 'bg-blue-600'
              },
              css_style: {
                type: 'string',
                example: 'background-color: #2563eb;'
              },
              total_visitors: {
                type: 'integer',
                example: 150
              },
              conversion_rate: {
                type: 'number',
                format: 'float',
                example: 25.5
              }
            }
          },
          UploadResult: {
            type: 'object',
            properties: {
              publicUrl: {
                type: 'string',
                example: '/uploads/covers/1754922802822-abc123.jpg'
              },
              pathname: {
                type: 'string',
                example: '/path/to/file.jpg'
              },
              filename: {
                type: 'string',
                example: 'cover.jpg'
              },
              size: {
                type: 'integer',
                example: 1024000
              },
              type: {
                type: 'string',
                example: 'image/jpeg'
              }
            }
          },
          AdminStats: {
            type: 'object',
            properties: {
              totalDownloads: {
                type: 'integer',
                example: 45
              },
              downloadRequests: {
                type: 'integer',
                example: 67
              },
              downloadCompletionRate: {
                type: 'number',
                format: 'float',
                example: 67.2
              },
              totalEmails: {
                type: 'integer',
                example: 89
              },
              recentDownloads: {
                type: 'integer',
                example: 12
              },
              recentEmails: {
                type: 'integer',
                example: 15
              },
              anonymousVisits: {
                type: 'integer',
                example: 234
              },
              anonymousDownloads: {
                type: 'integer',
                example: 45
              },
              anonymousEmails: {
                type: 'integer',
                example: 67
              },
              abTesting: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ABTest'
                }
              }
            }
          }
        }
      },
      tags: [
        {
          name: 'Health',
          description: 'System health and status endpoints'
        },
        {
          name: 'Email',
          description: 'Email delivery and management'
        },
        {
          name: 'Analytics',
          description: 'Event tracking and statistics'
        },
        {
          name: 'A/B Testing',
          description: 'A/B testing management and tracking'
        },
        {
          name: 'Admin',
          description: 'Admin panel operations (requires authentication)'
        },
        {
          name: 'Files',
          description: 'File upload and management'
        },
        {
          name: 'Configuration',
          description: 'System configuration management'
        }
      ]
    }
  })
  return spec
}
