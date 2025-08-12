import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConfigStatus from '@/components/ConfigStatus'
import ThemeVariables from '@/components/ThemeVariables'
import BookSchemaInjector from '@/components/BookSchemaInjector'
import { ToastProvider } from '@/components/ui/ToastContext'
import configLoader from '@/lib/config-loader'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const { seo, book } = await configLoader.loadConfig()
  const meta = seo?.meta
  const og = seo?.openGraph
  const tw = seo?.twitter
  return {
    title: meta?.title || book?.title || 'Book Landing',
    description: meta?.description || undefined,
    keywords: meta?.keywords || undefined,
    authors: meta?.author ? [{ name: meta.author }] : undefined,
    robots: (meta?.robots as any) || undefined,
    alternates: meta?.canonical ? { canonical: meta.canonical } : undefined,
    openGraph: og
      ? {
          title: og.title || meta?.title || book?.title,
          description: og.description || meta?.description,
          type: (og.type as any) || 'website',
          url: og.url || undefined,
          images: og.image ? [{ url: og.image }] : undefined,
          siteName: og.siteName || undefined,
        }
      : undefined,
    twitter: tw
      ? {
          card: (tw.card as any) || 'summary_large_image',
          title: tw.title || meta?.title || book?.title,
          description: tw.description || meta?.description,
          images: tw.image ? [tw.image] : undefined,
        }
      : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
        {/* Book Schema injected client-side from config */}
      </head>
      <body className={inter.className} style={{ fontFamily: 'var(--font-body, inherit)' }}>
        <ToastProvider>
          <ThemeVariables />

          <BookSchemaInjector />
          {children}
          <ConfigStatus />
        </ToastProvider>
      </body>
    </html>
  )
}