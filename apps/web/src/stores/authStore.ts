'use client'
import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Profile, SportType } from '@sport-fan/types'

interface AuthState {
  user: User | null
  profile: Profile | null
  sportPref: SportType | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setSportPref: (sport: SportType) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  sportPref: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, sportPref: profile?.sport_pref ?? null }),
  setSportPref: (sport) => set({ sportPref: sport }),
  reset: () => set({ user: null, profile: null, sportPref: null }),
}))
