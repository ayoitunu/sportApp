import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function FanLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('sport_pref, display_name')
    .eq('id', user!.id)
    .maybeSingle()

  const profile = profileData as { sport_pref: string | null; display_name: string | null } | null

  if (!profile || !profile.sport_pref) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-pitch-950">
      {/* Top navigation bar */}
      <nav className="bg-pitch-900 border-b border-pitch-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/games"
            className="font-display text-2xl font-bold tracking-tight text-white hover:text-live-500 transition-colors"
          >
            FAN<span className="text-live-500">PULSE</span>
          </Link>

          <div className="flex items-center gap-1 text-sm font-medium">
            <NavLink href="/games">Games</NavLink>
            <NavLink href="/history">History</NavLink>
            <NavLink href="/profile">
              {profile.display_name ?? 'Profile'}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-pitch-700 transition-all"
    >
      {children}
    </Link>
  )
}
