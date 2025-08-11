import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'

export const getApiDocs = async () => {
  const options: swaggerJSDoc.Options = {
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
          },
          EmailTemplate: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1
              },
              name: {
                type: 'string',
                example: 'Default Download Email'
              },
              subject: {
                type: 'string',
                example: 'Your free ebook is ready! 📚'
              },
              html_content: {
                type: 'string',
                example: '<!DOCTYPE html><html>...</html>'
              },
              text_content: {
                type: 'string',
                example: 'Hi {{user_name}}, Thank you for...'
              },
              description: {
                type: 'string',
                example: 'Default template for download confirmation emails'
              },
              is_default: {
                type: 'boolean',
                example: true
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              },
              placeholders: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TemplatePlaceholder'
                }
              },
              categories: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TemplateCategory'
                }
              }
            }
          },
          TemplatePlaceholder: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1
              },
              template_id: {
                type: 'integer',
                example: 1
              },
              placeholder_key: {
                type: 'string',
                example: 'user_name'
              },
              placeholder_name: {
                type: 'string',
                example: 'User Name'
              },
              description: {
                type: 'string',
                example: 'The recipient\'s name'
              },
              default_value: {
                type: 'string',
                example: 'there'
              },
              is_required: {
                type: 'boolean',
                example: false
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              }
            }
          },
          TemplateCategory: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1
              },
              name: {
                type: 'string',
                example: 'Download'
              },
              description: {
                type: 'string',
                example: 'Download confirmation emails'
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              }
            }
          },
          EmailTemplateFormData: {
            type: 'object',
            required: ['name', 'subject', 'html_content'],
            properties: {
              name: {
                type: 'string',
                example: 'Welcome Email'
              },
              subject: {
                type: 'string',
                example: 'Welcome to our platform!'
              },
              html_content: {
                type: 'string',
                example: '<!DOCTYPE html><html>...</html>'
              },
              text_content: {
                type: 'string',
                example: 'Welcome to our platform!'
              },
              description: {
                type: 'string',
                example: 'Welcome email template'
              },
              is_default: {
                type: 'boolean',
                example: false
              },
              placeholders: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    placeholder_key: {
                      type: 'string',
                      example: 'user_name'
                    },
                    placeholder_name: {
                      type: 'string',
                      example: 'User Name'
                    },
                    description: {
                      type: 'string',
                      example: 'The recipient\'s name'
                    },
                    default_value: {
                      type: 'string',
                      example: 'there'
                    },
                    is_required: {
                      type: 'boolean',
                      example: false
                    }
                  }
                }
              },
              category_ids: {
                type: 'array',
                items: {
                  type: 'integer'
                },
                example: [1, 2]
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
        },
        {
          name: 'Email Templates',
          description: 'Email template management and editing'
        }
      ]
    },
    apis: [
      path.join(process.cwd(), 'app', 'api', '**', '*.ts'),
      path.join(process.cwd(), 'app', 'api', '**', '*.js'),
      path.join(process.cwd(), 'lib', '**', '*.ts'),
      path.join(process.cwd(), 'lib', '**', '*.js')
    ]
  }

  return swaggerJSDoc(options)
}
