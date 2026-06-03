import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function FanLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if onboarding is complete
  const { data: profile } = await supabase
    .from('profiles')
    .select('sport_pref, display_name')
    .eq('id', user.id)
    .single()

  if (!profile?.sport_pref) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/games" className="text-lg font-bold text-brand-600">FanPulse</Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/games" className="text-gray-600 hover:text-gray-900">Games</Link>
            <Link href="/history" className="text-gray-600 hover:text-gray-900">History</Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              {profile.display_name ?? 'Profile'}
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
