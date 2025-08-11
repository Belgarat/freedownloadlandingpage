'use client'

import { useEffect } from 'react'

// Disable React Strict Mode for Swagger UI page
export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Suppress React Strict Mode warnings for Swagger UI components
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
        message.includes('RequestBodyEditor')
      )) {
        return // Suppress these specific warnings
      }
      originalWarn.apply(console, args)
    }

    return () => {
      console.warn = originalWarn
    }
  }, [])

  return (
    <div className="api-docs-layout">
      {children}
    </div>
  )
}
