import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/fan/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: sports } = await supabase.from('sports').select('*').eq('is_active', true)

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <ProfileForm
        initialProfile={profile}
        userEmail={user.email ?? ''}
        sports={sports ?? []}
      />
    </div>
  )
}
