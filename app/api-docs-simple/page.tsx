'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function ApiDocsSimplePage() {
  const [spec, setSpec] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/docs/swagger.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then(data => {
        setSpec(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load API spec:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    )
  }

  if (error || !spec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading API Documentation</h1>
          <p className="text-gray-600">
            {error || 'Failed to load the OpenAPI specification.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Create HTML content for iframe
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Landing Stack API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .swagger-ui .topbar {
            display: none;
        }
        .swagger-ui .info {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #4990e2;
        }
        .swagger-ui .info .title {
            font-size: 2.5em;
            color: #3b4151;
            margin-bottom: 10px;
        }
        .swagger-ui .info .description {
            font-size: 1.1em;
            line-height: 1.6;
            color: #555;
        }
        .swagger-ui .opblock {
            margin: 0 0 15px;
            border: 1px solid #e3e5e8;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .swagger-ui .opblock.opblock-get {
            border-color: #61affe;
            background: linear-gradient(135deg, rgba(97, 175, 254, 0.1) 0%, rgba(97, 175, 254, 0.05) 100%);
        }
        .swagger-ui .opblock.opblock-post {
            border-color: #49cc90;
            background: linear-gradient(135deg, rgba(73, 204, 144, 0.1) 0%, rgba(73, 204, 144, 0.05) 100%);
        }
        .swagger-ui .opblock.opblock-put {
            border-color: #fca130;
            background: linear-gradient(135deg, rgba(252, 161, 48, 0.1) 0%, rgba(252, 161, 48, 0.05) 100%);
        }
        .swagger-ui .opblock.opblock-delete {
            border-color: #f93e3e;
            background: linear-gradient(135deg, rgba(249, 62, 62, 0.1) 0%, rgba(249, 62, 62, 0.05) 100%);
        }
        .swagger-ui .opblock .opblock-summary {
            padding: 15px 20px;
        }
        .swagger-ui .opblock .opblock-summary-method {
            font-weight: bold;
            text-transform: uppercase;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
        }
        .swagger-ui .opblock .opblock-summary-description {
            font-weight: 500;
            color: #3b4151;
        }
        .swagger-ui .opblock .opblock-summary-path {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            color: #555;
        }
        .swagger-ui .opblock-tag {
            font-size: 1.3em;
            font-weight: 600;
            color: #3b4151;
            margin: 30px 0 15px;
            padding: 15px 0 10px;
            border-bottom: 2px solid #e3e5e8;
            position: relative;
        }
        .swagger-ui .opblock-tag::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 50px;
            height: 2px;
            background: #4990e2;
        }
        .swagger-ui .execute-wrapper {
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e3e5e8;
        }
        .swagger-ui .btn.execute {
            background: linear-gradient(135deg, #4990e2 0%, #357abd 100%);
            border: none;
            color: white;
            font-weight: 600;
            padding: 10px 30px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(73, 144, 226, 0.3);
            transition: all 0.2s ease;
        }
        .swagger-ui .btn.execute:hover {
            background: linear-gradient(135deg, #357abd 0%, #2d6da3 100%);
            box-shadow: 0 4px 8px rgba(73, 144, 226, 0.4);
            transform: translateY(-1px);
        }
        @media (max-width: 768px) {
            .swagger-ui .info .title {
                font-size: 2em;
            }
            .swagger-ui .opblock .opblock-summary-path {
                font-size: 12px;
            }
            .swagger-ui .execute-wrapper {
                padding: 15px;
            }
            .swagger-ui .opblock-tag {
                font-size: 1.1em;
            }
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const spec = ${JSON.stringify(spec)};
            
            const ui = SwaggerUIBundle({
                spec: spec,
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                docExpansion: "list",
                defaultModelsExpandDepth: 2,
                defaultModelExpandDepth: 2,
                tryItOutEnabled: true,
                displayRequestDuration: true,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                requestInterceptor: function(request) {
                    if (!request.url.startsWith('http')) {
                        request.url = window.location.origin + request.url;
                    }
                    return request;
                },
                responseInterceptor: function(response) {
                    return response;
                },
                onComplete: function() {
                    console.log('Swagger UI loaded successfully');
                }
            });
        };
    </script>
</body>
</html>
  `

  return (
    <>
      <Head>
        <title>API Documentation - Book Landing Stack</title>
        <meta name="description" content="Interactive API documentation for Book Landing Stack" />
      </Head>
      
      <div className="min-h-screen bg-white">
        <div className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">Book Landing Stack API Documentation</h1>
            <p className="text-gray-300 mt-2">
              Interactive API documentation with try-it-out functionality
            </p>
            <div className="mt-4 flex gap-2">
              <a 
                href="/api-docs" 
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                React Version
              </a>
              <span className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                Iframe Version (Recommended)
              </span>
            </div>
          </div>
        </div>
        
        <iframe
          srcDoc={swaggerHtml}
          className="w-full h-screen border-0"
          title="API Documentation"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </>
  )
}
