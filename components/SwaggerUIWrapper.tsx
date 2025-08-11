'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import SwaggerUI with no SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading Swagger UI...</span>
    </div>
  )
})

interface SwaggerUIWrapperProps {
  spec: any
}

export default function SwaggerUIWrapper({ spec }: SwaggerUIWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Initializing...</span>
      </div>
    )
  }

  return (
    <div className="swagger-wrapper">
      <SwaggerUI 
        spec={spec}
        docExpansion="list"
        defaultModelsExpandDepth={2}
        defaultModelExpandDepth={2}
        tryItOutEnabled={true}
        displayRequestDuration={true}
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        requestInterceptor={(request) => {
          // Add base URL for try-it-out functionality
          if (!request.url.startsWith('http')) {
            request.url = `${window.location.origin}${request.url}`
          }
          return request
        }}
        responseInterceptor={(response) => {
          return response
        }}
        onComplete={(system) => {
          // Suppress all React Strict Mode warnings for Swagger UI
          const originalWarn = console.warn
          console.warn = (...args) => {
            const message = args[0]
            if (typeof message === 'string' && (
              message.includes('UNSAFE_componentWillReceiveProps') ||
              message.includes('ModelCollapse') ||
              message.includes('OperationContainer') ||
              message.includes('Servers') ||
              message.includes('ContentType') ||
              message.includes('ModelExample') ||
              message.includes('RequestBodyEditor') ||
              message.includes('strict mode') ||
              message.includes('componentWillReceiveProps')
            )) {
              return // Suppress these warnings
            }
            originalWarn.apply(console, args)
          }
          
          console.log('Swagger UI loaded successfully')
        }}
      />
      
      <style jsx global>{`
        /* Enhanced Swagger UI styles */
        .swagger-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Hide Swagger UI topbar */
        .swagger-ui .topbar {
          display: none !important;
        }
        
        /* Enhanced info section */
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
        
        /* Enhanced operation blocks */
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
        
        /* Enhanced tags */
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
        
        .swagger-ui .opblock-tag-section {
          margin: 0 0 40px;
        }
        
        /* Enhanced execute button */
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
        
        /* Enhanced responses table */
        .swagger-ui .responses-table {
          margin: 20px 0;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .swagger-ui .responses-table .response-col_status {
          font-weight: 600;
          color: #3b4151;
        }
        
        .swagger-ui .responses-table .response-col_description {
          font-size: 14px;
          line-height: 1.5;
          color: #555;
        }
        
        /* Enhanced models */
        .swagger-ui .model {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
        }
        
        .swagger-ui .model-title {
          font-weight: 600;
          color: #3b4151;
          font-size: 14px;
        }
        
        .swagger-ui .model-box {
          background: #f8f9fa;
          border: 1px solid #e3e5e8;
          border-radius: 6px;
          padding: 15px;
          margin: 10px 0;
        }
        
        /* Fix for React Strict Mode warnings */
        .swagger-ui .model-box .model-box {
          margin: 0;
        }
        
        /* Enhanced form inputs */
        .swagger-ui .parameters-container .parameter__name {
          font-weight: 600;
          color: #3b4151;
        }
        
        .swagger-ui .parameters-container input,
        .swagger-ui .parameters-container textarea {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 14px;
        }
        
        .swagger-ui .parameters-container input:focus,
        .swagger-ui .parameters-container textarea:focus {
          border-color: #4990e2;
          outline: none;
          box-shadow: 0 0 0 3px rgba(73, 144, 226, 0.1);
        }
        
        /* Responsive design */
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
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .swagger-ui {
            background: #1a1a1a;
            color: #e0e0e0;
          }
          
          .swagger-ui .info {
            background: #2a2a2a;
            border-left-color: #4990e2;
          }
          
          .swagger-ui .opblock {
            background: #2a2a2a;
            border-color: #444;
          }
          
          .swagger-ui .model-box {
            background: #2a2a2a;
            border-color: #444;
          }
        }
      `}</style>
    </div>
  )
}
