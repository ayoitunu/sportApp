import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, profile, reset } = useAuthStore()

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          reset()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 space-y-6">
        <Text className="text-2xl font-black text-gray-900">Profile</Text>

        <View className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <View>
            <Text className="text-xs text-gray-400 mb-0.5">Display name</Text>
            <Text className="text-base font-semibold text-gray-900">{profile?.display_name ?? '—'}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400 mb-0.5">Email</Text>
            <Text className="text-base text-gray-700">{user?.email ?? '—'}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400 mb-0.5">Sport preference</Text>
            <Text className="text-base text-gray-700 capitalize">{profile?.sport_pref ?? '—'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/onboarding')}
          className="bg-white border border-gray-200 rounded-xl py-3 items-center"
        >
          <Text className="text-sm font-medium text-gray-700">Change sport preference</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-50 border border-red-200 rounded-xl py-3 items-center"
        >
          <Text className="text-sm font-semibold text-red-600">Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
