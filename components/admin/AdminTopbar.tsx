'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLogout } from '@/lib/useLogout'

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/config', label: 'Configuration' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/ab-testing', label: 'A/B Testing' },
]

export default function AdminTopbar() {
  const pathname = usePathname()
  const { handleLogout } = useLogout()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold text-gray-900">
            Admin
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}


