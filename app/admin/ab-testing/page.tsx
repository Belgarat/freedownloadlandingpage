'use client'

import { useLogout } from '@/lib/useLogout'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminProtected from '@/components/admin/AdminProtected'
import ABTestingDashboard from '@/components/admin/ABTestingDashboard'

export default function ABTestingPage() {
  const { handleLogout } = useLogout()

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">A/B Testing</h1>
                <p className="text-sm text-gray-600">Create and manage conversion optimization tests</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>

            <ABTestingDashboard />
          </div>
        </div>
      </div>
    </AdminProtected>
  )
}
