import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'
import type { SportType } from '@sport-fan/types'

const SPORTS: { type: SportType; label: string; emoji: string; description: string }[] = [
  { type: 'soccer', label: 'Soccer / Football', emoji: '⚽', description: 'Premier League, La Liga & more' },
  { type: 'basketball', label: 'Basketball', emoji: '🏀', description: 'NBA and international' },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const { user, setSportPref } = useAuthStore()
  const [selected, setSelected] = useState<SportType | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!selected || !user) return
    setLoading(true)
    await supabase.from('profiles').update({ sport_pref: selected }).eq('id', user.id)
    setSportPref(selected)
    setLoading(false)
    router.replace('/(tabs)/games')
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-6 pt-20">
      <View className="mb-8">
        <Text className="text-3xl font-black text-gray-900">Welcome to FanPulse</Text>
        <Text className="text-gray-500 mt-2">Which sport are you most passionate about?</Text>
      </View>

      <View className="space-y-3 mb-8">
        {SPORTS.map((sport) => (
          <TouchableOpacity
            key={sport.type}
            onPress={() => setSelected(sport.type)}
            className={`rounded-2xl border-2 p-5 flex-row items-center gap-4 ${
              selected === sport.type ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'
            }`}
          >
            <Text className="text-4xl">{sport.emoji}</Text>
            <View>
              <Text className="font-bold text-gray-900">{sport.label}</Text>
              <Text className="text-sm text-gray-500">{sport.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={!selected || loading}
        className="bg-brand-600 rounded-xl py-3.5 items-center disabled:opacity-40"
      >
        <Text className="text-white font-bold">{loading ? 'Saving…' : 'Continue'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
