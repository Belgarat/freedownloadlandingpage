'use client'

import { useEffect, useState } from 'react'
import { Download, AlertCircle, CheckCircle, BookOpen, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DownloadPageProps {
  params: Promise<{ token: string }>
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const [token, setToken] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [downloadStarted, setDownloadStarted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getToken = async () => {
      try {
        const { token: tokenParam } = await params
        setToken(tokenParam)
        
        // Validate token
        const response = await fetch(`/api/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenParam }),
        })

        if (response.ok) {
          setIsValid(true)
        } else {
          const data = await response.json()
          setError(data.error || 'Invalid download link')
          setIsValid(false)
        }
      } catch {
        setError('Failed to validate download link')
        setIsValid(false)
      } finally {
        setIsLoading(false)
      }
    }

    getToken()
  }, [params])

  const handleDownload = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      // Track download attempt
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'download_page_clicked',
          timestamp: new Date().toISOString(),
        }),
      })

      // Trigger download
      const response = await fetch(`/api/download/${token}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'fish-cannot-carry-guns.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setDownloadStarted(true)
        
        // Track successful download
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'download_completed',
            timestamp: new Date().toISOString(),
          }),
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Download failed')
      }
      } catch {
      setError('Download failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center">
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-8 text-center border border-teal-700/50 max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-teal-100">Validating your download link...</p>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center">
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-8 text-center border border-teal-700/50 max-w-md w-full mx-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-4">Download Link Invalid</h1>
          <p className="text-teal-100 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Download is Ready!</h1>
            <p className="text-teal-100 text-lg">Click the button below to download your free copy of &quot;Fish Cannot Carry Guns&quot;</p>
          </div>

          {/* Download Section */}
          <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 sm:p-8 border border-teal-700/50 mb-8">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-4">Fish Cannot Carry Guns</h2>
              <p className="text-teal-100 mb-6">
                A collection of speculative short stories that delve into how technology fractures identity, 
                erodes trust, and distorts reality.
              </p>
              
              {downloadStarted ? (
                <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-300 font-medium">Download started! Check your downloads folder.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Preparing Download...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 sm:p-8 border border-teal-700/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Support Independent Authors</h3>
              <p className="text-teal-100 text-center mb-6">
                Since this book is completely free, we&apos;d be grateful if you could support Michael B. Morgan in these ways:
              </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://www.goodreads.com/book/show/237833382-fish-cannot-carry-guns"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Add to Goodreads</span>
              </a>
              
              <a
                href="https://aroundscifi.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Subscribe to Substack</span>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-teal-200 text-sm">
            <p>© 2025 Michael B. Morgan. All rights reserved.</p>
            <div className="mt-4">
              <Link href="/" className="underline hover:text-white transition-colors">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 