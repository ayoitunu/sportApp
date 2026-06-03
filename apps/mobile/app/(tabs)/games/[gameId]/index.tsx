import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { isGameStarted } from '@sport-fan/shared-logic'
import type { Game } from '@sport-fan/types'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function GameDetailScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>()
  const router = useRouter()

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async (): Promise<Game | null> => {
      const { data } = await supabase
        .from('games')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
        .eq('id', gameId)
        .single()
      return data as Game
    },
  })

  if (isLoading) return <ActivityIndicator className="flex-1" color="#0ea5e9" />
  if (!game) return <Text className="flex-1 text-center pt-20 text-red-500">Game not found.</Text>

  const finished = game.status === 'finished'

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="p-4 space-y-4">
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} className="mb-2">
          <Text className="text-brand-600 font-medium">← Back</Text>
        </TouchableOpacity>

        {/* Game card */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5">
          <Text className={`text-xs font-semibold px-2 py-1 rounded-full self-start mb-4 ${
            game.status === 'live' ? 'bg-red-100 text-red-700' :
            finished ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
          }`}>
            {game.status === 'live' ? '🔴 LIVE' : game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 text-center text-xl font-black text-gray-900">{game.home_team.name}</Text>
            <Text className="text-2xl font-black text-gray-400 mx-2">
              {finished && game.home_score !== null ? `${game.home_score}–${game.away_score}` : 'vs'}
            </Text>
            <Text className="flex-1 text-center text-xl font-black text-gray-900">{game.away_team.name}</Text>
          </View>
        </View>

        {/* Check-in CTAs */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/games/${gameId}/pre-checkin`)}
            className="flex-1 bg-brand-600 rounded-xl py-3 items-center"
          >
            <Text className="text-white font-semibold text-sm">Before game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => finished && router.push(`/(tabs)/games/${gameId}/post-checkin`)}
            className={`flex-1 rounded-xl py-3 items-center ${finished ? 'bg-green-600' : 'bg-gray-200'}`}
          >
            <Text className={`font-semibold text-sm ${finished ? 'text-white' : 'text-gray-400'}`}>
              After game
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
