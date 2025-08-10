'use client'

import { useAuth } from '@/lib/useAuth'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminProtected from '@/components/admin/AdminProtected'

export default function AnalyticsPage() {
  const { logout } = useAuth()



  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <AnalyticsDashboard />
            </div>

          </div>
        </div>
      </div>
    </AdminProtected>
  )
}
