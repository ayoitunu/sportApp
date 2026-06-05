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
  const [sportPref, setSportPref]     = useState(initialProfile?.sport_pref ?? '')
  const [loading, setLoading]         = useState(false)
  const [saved, setSaved]             = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ display_name: displayName, sport_pref: sportPref as Profile['sport_pref'] })
        .eq('id', user.id)
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
    <div className="space-y-4 max-w-md">
      <div className="bg-pitch-900 rounded-2xl border border-pitch-700 p-6 space-y-5">
        {/* Email (read-only) */}
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Email</p>
          <p className="text-sm text-gray-400">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How fans see your name"
              className="w-full rounded-lg bg-pitch-800 border border-pitch-600 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-live-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Sport preference</label>
            <select
              value={sportPref}
              onChange={(e) => setSportPref(e.target.value)}
              className="w-full rounded-lg bg-pitch-800 border border-pitch-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-live-500 transition-colors"
            >
              {sports.map((s) => <option key={s.id} value={s.name}>{s.display}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-live-500 py-2.5 text-sm font-bold text-pitch-950 hover:bg-live-400 disabled:opacity-40 transition-colors"
          >
            {saved ? '✓ Saved!' : loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full rounded-xl border border-pitch-600 bg-pitch-900 py-2.5 text-sm font-semibold text-gray-400 hover:text-red-400 hover:border-red-800 transition-all"
      >
        Sign out
      </button>
    </div>
  )
}
