'use client'

import Script from 'next/script'
import { useConfig } from '@/lib/useConfig'

export default function BookSchemaInjector() {
  const { seo } = useConfig()
  const schema = seo?.structuredData?.book
  if (!schema) return null
  return (
    <Script id="book-schema" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  )
}


