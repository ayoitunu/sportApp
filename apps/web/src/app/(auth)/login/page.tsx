import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In — FanPulse' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">FanPulse</h1>
          <p className="mt-2 text-gray-600">How does the game make you feel?</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          No account?{' '}
          <Link href="/register" className="font-medium text-brand-600 hover:text-brand-500">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
