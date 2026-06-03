import { Redirect } from 'expo-router'
import { useAuthStore } from '@/stores/authStore'

export default function IndexRoute() {
  const { user, sportPref } = useAuthStore()
  if (!user) return <Redirect href="/(auth)/login" />
  if (!sportPref) return <Redirect href="/onboarding" />
  return <Redirect href="/(tabs)/games" />
}
