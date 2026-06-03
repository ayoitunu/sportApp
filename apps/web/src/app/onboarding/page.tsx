'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SportType } from '@sport-fan/types'

const SPORTS: { type: SportType; label: string; emoji: string; description: string }[] = [
  { type: 'soccer', label: 'Soccer / Football', emoji: '⚽', description: 'Premier League, La Liga, Champions League & more' },
  { type: 'basketball', label: 'Basketball', emoji: '🏀', description: 'NBA and international basketball' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<SportType | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ sport_pref: selected }).eq('id', user.id)
    }
    router.push('/games')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to FanPulse</h1>
          <p className="mt-3 text-gray-600">Which sport are you most passionate about?</p>
          <p className="text-sm text-gray-400 mt-1">You can change this in your profile anytime.</p>
        </div>
        <div className="space-y-3">
          {SPORTS.map((sport) => (
            <button
              key={sport.type}
              onClick={() => setSelected(sport.type)}
              className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                selected === sport.type
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{sport.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900">{sport.label}</p>
                  <p className="text-sm text-gray-500">{sport.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
