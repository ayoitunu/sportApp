import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/authStore'

export default function LoginScreen() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { Alert.alert('Sign in failed', error.message); return }
    setUser(data.user)
    router.replace('/')
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-6 pt-20">
      <View className="mb-8">
        <Text className="text-3xl font-black text-gray-900">FanPulse</Text>
        <Text className="text-gray-500 mt-1">How does the game make you feel?</Text>
      </View>

      <View className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput
            value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" autoComplete="email"
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900"
          />
        </View>
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
          <TextInput
            value={password} onChangeText={setPassword}
            secureTextEntry autoComplete="password"
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900"
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin} disabled={loading}
          className="bg-brand-600 rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold">{loading ? 'Signing in…' : 'Sign in'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="mt-4">
        <Text className="text-center text-sm text-gray-500">
          No account? <Text className="text-brand-600 font-medium">Sign up free</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
