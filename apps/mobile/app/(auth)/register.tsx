import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase/client'

export default function RegisterScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleRegister() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) { Alert.alert('Sign up failed', error.message); return }
    setDone(true)
  }

  if (done) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <Text className="text-2xl font-black text-gray-900 mb-2">Check your inbox!</Text>
        <Text className="text-gray-500 text-center mb-6">
          We sent a confirmation link to {email}. Tap it to activate your account.
        </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')} className="bg-brand-600 rounded-xl px-6 py-3">
          <Text className="text-white font-semibold">Back to sign in</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-6 pt-20">
      <View className="mb-8">
        <Text className="text-3xl font-black text-gray-900">Join FanPulse</Text>
        <Text className="text-gray-500 mt-1">Track your emotions. Support your team.</Text>
      </View>

      <View className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Display name</Text>
          <TextInput value={name} onChangeText={setName} autoComplete="name"
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900" />
        </View>
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900" />
        </View>
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900" />
        </View>
        <TouchableOpacity onPress={handleRegister} disabled={loading}
          className="bg-brand-600 rounded-xl py-3 items-center">
          <Text className="text-white font-semibold">{loading ? 'Creating account…' : 'Create account'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-4">
        <Text className="text-center text-sm text-gray-500">
          Already have an account? <Text className="text-brand-600 font-medium">Sign in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
