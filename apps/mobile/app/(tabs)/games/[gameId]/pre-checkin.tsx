import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { EMOTION_META, ALL_EMOTIONS } from '@sport-fan/shared-logic'
import { pickSuggestion } from '@sport-fan/shared-logic'
import type { EmotionType, Game } from '@sport-fan/types'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MobilePreCheckinScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>()
  const router = useRouter()
  const [teamId, setTeamId] = useState<string | null>(null)
  const [emotion, setEmotion] = useState<EmotionType | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async (): Promise<Game | null> => {
      const { data } = await supabase
        .from('games')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
        .eq('id', gameId).single()
      return data as Game
    },
  })

  if (isLoading) return <ActivityIndicator className="flex-1" color="#0ea5e9" />
  if (!game) return null

  async function handleSubmit() {
    if (!emotion || !teamId) return
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: templates } = await supabase
      .from('suggestion_templates')
      .select('id, text, tone')
      .eq('phase', 'pre_game')
      .eq('emotion', emotion)
      .is('outcome', null)
      .eq('is_active', true)

    const chosen = pickSuggestion(templates ?? [])

    await supabase.from('check_ins').insert({
      user_id: user.id,
      game_id: gameId,
      team_id: teamId,
      phase: 'pre_game',
      emotion,
      suggestion_id: chosen?.id ?? null,
    })

    setSubmitting(false)
    setSuggestion(chosen?.text ?? null)
  }

  if (suggestion) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView contentContainerClassName="p-6 space-y-6">
          <View className="items-center space-y-2">
            <Text className="text-4xl">✅</Text>
            <Text className="text-xl font-black text-gray-900">Check-in saved!</Text>
          </View>
          <View className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <Text className="text-sm font-semibold text-brand-700 mb-2">✨ Before the game</Text>
            <Text className="text-gray-800 leading-6">{suggestion}</Text>
            <Text className="text-xs text-gray-400 mt-3">This is a friendly suggestion, not medical advice.</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} className="bg-brand-600 rounded-xl py-3 items-center">
            <Text className="text-white font-semibold">Back to game</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="p-4 space-y-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-brand-600 font-medium">← Back</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-xs text-gray-500 mb-1">Pre-game check-in</Text>
          <Text className="text-xl font-black text-gray-900">{game.home_team.name} vs {game.away_team.name}</Text>
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-700 mb-2">Which team are you supporting?</Text>
          <View className="flex-row gap-3">
            {[game.home_team, game.away_team].map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => setTeamId(team.id)}
                className={`flex-1 rounded-xl border-2 py-3 items-center ${teamId === team.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'}`}
              >
                <Text className={`text-sm font-bold ${teamId === team.id ? 'text-brand-700' : 'text-gray-700'}`}>{team.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-700 mb-2">How are you feeling?</Text>
          <View className="flex-row flex-wrap gap-2">
            {ALL_EMOTIONS.map((e) => {
              const meta = EMOTION_META[e]
              return (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEmotion(e)}
                  className={`rounded-xl border-2 p-3 items-center w-[30%] ${emotion === e ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'}`}
                >
                  <Text className="text-xl mb-1">{meta.emoji}</Text>
                  <Text className="text-xs text-gray-700 text-center">{meta.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!emotion || !teamId || submitting}
          className="bg-brand-600 rounded-xl py-3.5 items-center"
          style={{ opacity: (!emotion || !teamId) ? 0.4 : 1 }}
        >
          <Text className="text-white font-bold">{submitting ? 'Saving…' : 'Submit check-in'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
