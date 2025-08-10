'use client'

import { useRouter } from 'next/navigation'
import { Settings, BookOpen, Megaphone, Search, LogOut } from 'lucide-react'
import { useLogout } from '@/lib/useLogout'
import AdminProtected from '@/components/admin/AdminProtected'

export default function AdminPage() {
  const { handleLogout } = useLogout()
  const router = useRouter()

  const adminSections = [
    { 
      id: 'config', 
      name: 'Configuration', 
      description: 'Manage all landing page settings',
      icon: Settings,
      href: '/admin/config',
      permission: 'write'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      description: 'View download and engagement metrics',
      icon: BookOpen,
      href: '/admin/analytics',
      permission: 'read'
    },
    { 
      id: 'seo', 
      name: 'SEO Settings', 
      description: 'Configure meta tags and SEO',
      icon: Search,
      href: '/admin/seo',
      permission: 'write'
    },
    { 
      id: 'marketing', 
      name: 'Marketing Tools', 
      description: 'Manage CTAs and marketing settings',
      icon: Megaphone,
      href: '/admin/marketing',
      permission: 'write'
    }
  ]

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Book Landing Stack Admin</h1>
                <p className="text-sm text-gray-600">Manage your landing page configuration</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => {
                const Icon = section.icon
                return (
                  <div
                    key={section.id}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(section.href)}
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {section.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {section.permission === 'write' ? 'Read & Write' : 'Read Only'}
                        </span>
                        <div className="text-xs text-gray-400">
                          Click to access →
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Downloads
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Loading...
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Megaphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Email Submissions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Loading...
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Search className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Page Views
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Loading...
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  )
} 