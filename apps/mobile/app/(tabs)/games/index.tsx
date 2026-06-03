import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase/client'
import { getWeekStart, getWeekEnd, toDateString } from '@sport-fan/shared-logic'
import type { Game, Sport } from '@sport-fan/types'
import { SafeAreaView } from 'react-native-safe-area-context'

function MobileGameCard({ game, onPress }: { game: Game; onPress: () => void }) {
  const date = new Date(game.scheduled_at)
  const finished = game.status === 'finished'
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl border border-gray-200 p-4 mb-3"
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className={`text-xs font-semibold px-2 py-1 rounded-full ${
          game.status === 'live' ? 'bg-red-100 text-red-700' :
          finished ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
        }`}>
          {game.status === 'live' ? '🔴 LIVE' : game.status.charAt(0).toUpperCase() + game.status.slice(1)}
        </Text>
        <Text className="text-xs text-gray-400">
          {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
        </Text>
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-center font-bold text-gray-900">{game.home_team.name}</Text>
        <Text className="text-sm font-black text-gray-400 min-w-[40px] text-center">
          {finished && game.home_score !== null ? `${game.home_score}–${game.away_score}` : 'vs'}
        </Text>
        <Text className="flex-1 text-center font-bold text-gray-900">{game.away_team.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function GamesScreen() {
  const router = useRouter()
  const [selectedSportId, setSelectedSportId] = useState<string | undefined>()

  const { data: sports } = useQuery({
    queryKey: ['sports'],
    queryFn: async (): Promise<Sport[]> => {
      const { data } = await supabase.from('sports').select('*').eq('is_active', true)
      return data ?? []
    },
  })

  const { data: games, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['games', 'week', selectedSportId],
    queryFn: async (): Promise<Game[]> => {
      const weekStart = toDateString(getWeekStart(new Date()))
      const weekEnd = toDateString(getWeekEnd(getWeekStart(new Date())))
      let query = supabase
        .from('games')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
        .gte('week_start', weekStart)
        .lte('week_start', weekEnd)
        .in('status', ['scheduled', 'live', 'finished'])
        .order('scheduled_at', { ascending: true })
      if (selectedSportId) query = query.eq('sport_id', selectedSportId)
      const { data } = await query
      return (data as Game[]) ?? []
    },
  })

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-gray-900">This Week</Text>
        {sports && sports.length > 1 && (
          <View className="flex-row gap-2 mt-3 flex-wrap">
            <TouchableOpacity
              onPress={() => setSelectedSportId(undefined)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${!selectedSportId ? 'bg-brand-600' : 'bg-white border border-gray-300'}`}
            >
              <Text className={!selectedSportId ? 'text-white' : 'text-gray-700'}>All</Text>
            </TouchableOpacity>
            {sports.map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedSportId(s.id)}
                className={`px-3 py-1.5 rounded-full ${selectedSportId === s.id ? 'bg-brand-600' : 'bg-white border border-gray-300'}`}
              >
                <Text className={`text-xs font-semibold ${selectedSportId === s.id ? 'text-white' : 'text-gray-700'}`}>
                  {s.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-12" color="#0ea5e9" />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(g) => g.id}
          contentContainerClassName="px-4 pt-2 pb-8"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <MobileGameCard game={item} onPress={() => router.push(`/(tabs)/games/${item.id}`)} />
          )}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-4xl mb-3">📅</Text>
              <Text className="text-gray-500 font-medium">No games this week.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}
