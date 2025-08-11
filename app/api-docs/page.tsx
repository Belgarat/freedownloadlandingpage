'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import SwaggerUIWrapper from '@/components/SwaggerUIWrapper'

export default function ApiDocsPage() {
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

  return (
    <>
      <Head>
        <title>API Documentation - Book Landing Stack</title>
        <meta name="description" content="Interactive API documentation for Book Landing Stack" />
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
      </Head>
      
      <div className="min-h-screen bg-white">
        <div className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">Book Landing Stack API Documentation</h1>
            <p className="text-gray-300 mt-2">
              Interactive API documentation with try-it-out functionality
            </p>
          </div>
        </div>
        
        <div className="swagger-container">
          <SwaggerUIWrapper spec={spec} />
        </div>
      </div>

      <style jsx global>{`
        /* Container styles */
        .swagger-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        /* Ensure proper spacing */
        .swagger-container > div {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  )
}
