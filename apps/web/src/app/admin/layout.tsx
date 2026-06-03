import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const NAV_LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/sports', label: 'Sports' },
  { href: '/admin/teams', label: 'Teams' },
  { href: '/admin/players', label: 'Players' },
  { href: '/admin/games', label: 'Games' },
  { href: '/admin/suggestions', label: 'Suggestions' },
  { href: '/admin/check-ins', label: 'Check-ins' },
  { href: '/admin/analytics', label: 'Analytics' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.['role'] !== 'admin') redirect('/games')

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-5 border-b border-gray-200">
          <Link href="/admin" className="text-lg font-bold text-brand-600">FanPulse Admin</Link>
        </div>
        <nav className="p-3 space-y-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-gray-200" />
          <Link href="/games" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-700">
            ← Fan view
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
