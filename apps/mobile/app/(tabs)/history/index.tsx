import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { EMOTION_META } from '@sport-fan/shared-logic'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { CheckInWithDetails, EmotionType } from '@sport-fan/types'

export default function HistoryScreen() {
  const { data: checkIns, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['user-history'],
    queryFn: async (): Promise<CheckInWithDetails[]> => {
      const { data } = await supabase
        .from('check_ins')
        .select('*, game:games(*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)), suggestion:suggestion_templates(*)')
        .order('created_at', { ascending: false })
        .limit(50)
      return (data as CheckInWithDetails[]) ?? []
    },
  })

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-gray-900">My History</Text>
        <Text className="text-gray-500 text-sm mt-1">Your fan emotion journey.</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-12" color="#0ea5e9" />
      ) : (
        <FlatList
          data={checkIns}
          keyExtractor={(c) => c.id}
          contentContainerClassName="px-4 pt-2 pb-8"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          renderItem={({ item: c }) => {
            const meta = EMOTION_META[c.emotion as EmotionType]
            const game = c.game
            return (
              <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-2xl">{meta.emoji}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-gray-900 text-sm">
                        {game.home_team.name} vs {game.away_team.name}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {meta.label} · {c.phase === 'pre_game' ? 'Before game' : 'After game'}
                      </Text>
                      {c.suggestion && (
                        <Text className="text-xs text-brand-600 mt-1 italic" numberOfLines={2}>
                          &ldquo;{(c.suggestion as {text: string}).text}&rdquo;
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              </View>
            )
          }}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-4xl mb-3">💭</Text>
              <Text className="text-gray-500 font-medium">No check-ins yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}
