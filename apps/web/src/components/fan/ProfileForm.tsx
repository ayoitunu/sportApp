'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Sport } from '@sport-fan/types'

interface Props {
  initialProfile: Profile | null
  userEmail: string
  sports: Sport[]
}

export function ProfileForm({ initialProfile, userEmail, sports }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(initialProfile?.display_name ?? '')
  const [sportPref, setSportPref] = useState(initialProfile?.sport_pref ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ display_name: displayName, sport_pref: sportPref as Profile['sport_pref'] }).eq('id', user.id)
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Email</p>
          <p className="text-sm font-medium text-gray-700">{userEmail}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input
              type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sport preference</label>
            <select value={sportPref} onChange={(e) => setSportPref(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {sports.map((s) => <option key={s.id} value={s.name}>{s.display}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors">
            {saved ? '✓ Saved!' : loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
