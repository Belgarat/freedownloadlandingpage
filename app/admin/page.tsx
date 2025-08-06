'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, BarChart3, Users, Download, Mail } from 'lucide-react'
import { AdminStats } from '@/types/admin'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<AdminStats>({
    totalDownloads: 0,
    totalEmails: 0,
    recentDownloads: 0,
    recentEmails: 0,
    downloadRequests: 0,
    downloadCompletionRate: 0,
          anonymousVisits: 0,
      anonymousDownloads: 0,
      anonymousEmails: 0,
      anonymousGoodreadsClicks: 0,
      anonymousSubstackClicks: 0,
      anonymousPublisherClicks: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchStats()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        sessionStorage.setItem('admin_authenticated', 'true')
        setIsAuthenticated(true)
        fetchStats()
      } else {
        setError('Incorrect password')
      }
    } catch (error) {
      setError('Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-8 w-full max-w-md border border-teal-700/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-teal-200">Sign in to view statistics</p>
          </div>
          
          {/* Back to Homepage Link */}
          <div className="text-center mb-6">
            <a
              href="/"
              className="text-teal-300 hover:text-white transition-colors duration-200 text-sm underline"
            >
              ← Back to Homepage
            </a>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-teal-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-teal-700/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-teal-200">Fish Cannot Carry Guns site statistics</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Anonymous Counters (Always Available) */}
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-teal-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Anonymous Counters (GDPR Compliant)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-teal-400 mr-2" />
                <span className="text-teal-200 text-sm">Total Visits</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.anonymousVisits}</p>
              <p className="text-xs text-teal-300">All visitors</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Download className="w-6 h-6 text-teal-400 mr-2" />
                <span className="text-teal-200 text-sm">Total Downloads</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.anonymousDownloads}</p>
              <p className="text-xs text-teal-300">All downloads</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-6 h-6 text-teal-400 mr-2" />
                <span className="text-teal-200 text-sm">Total Emails</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.anonymousEmails}</p>
              <p className="text-xs text-teal-300">All submissions</p>
            </div>
          </div>
        </div>

        {/* External Links Performance */}
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-teal-700/50">
          <h2 className="text-xl font-bold text-white mb-4">External Links Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-[#073E44] backdrop-blur-sm rounded-lg p-4 border border-teal-700/50">
              <div className="flex items-center justify-center mb-2">
                <span className="text-blue-200 text-sm">Goodreads Clicks</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">{stats.anonymousGoodreadsClicks}</p>
              <p className="text-xs text-blue-300">Book reviews platform</p>
            </div>
            
            <div className="text-center bg-[#073E44] backdrop-blur-sm rounded-lg p-4 border border-teal-700/50">
              <div className="flex items-center justify-center mb-2">
                <span className="text-orange-200 text-sm">Substack Clicks</span>
              </div>
              <p className="text-3xl font-bold text-orange-400">{stats.anonymousSubstackClicks}</p>
              <p className="text-xs text-orange-300">Content platform</p>
            </div>
            
            <div className="text-center bg-[#073E44] backdrop-blur-sm rounded-lg p-4 border border-teal-700/50">
              <div className="flex items-center justify-center mb-2">
                <span className="text-purple-200 text-sm">Publisher Clicks</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{stats.anonymousPublisherClicks}</p>
              <p className="text-xs text-purple-300">Publisher website</p>
            </div>
          </div>
        </div>

        {/* Consent Analytics (With User Consent) */}
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-teal-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Detailed Analytics (With Consent)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-4 border border-teal-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-200 text-sm">Completed Downloads</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDownloads}</p>
                  <p className="text-xs text-teal-300">{stats.downloadCompletionRate}% completion</p>
                </div>
                <Download className="w-6 h-6 text-teal-400" />
              </div>
            </div>

            <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-4 border border-teal-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-200 text-sm">Download Requests</p>
                  <p className="text-2xl font-bold text-white">{stats.downloadRequests}</p>
                  <p className="text-xs text-teal-300">Total link clicks</p>
                </div>
                <BarChart3 className="w-6 h-6 text-teal-400" />
              </div>
            </div>

            <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-4 border border-teal-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-200 text-sm">Emails Collected</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEmails}</p>
                </div>
                <Mail className="w-6 h-6 text-teal-400" />
              </div>
            </div>

            <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-4 border border-teal-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-200 text-sm">Recent Activity</p>
                  <p className="text-2xl font-bold text-white">{stats.recentDownloads + stats.recentEmails}</p>
                  <p className="text-xs text-teal-300">Last 7 days</p>
                </div>
                <Users className="w-6 h-6 text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 border border-teal-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={fetchStats}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Refresh Statistics</span>
            </button>
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>View Site</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 