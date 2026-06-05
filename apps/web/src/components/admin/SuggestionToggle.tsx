'use client'
import { useTransition } from 'react'
import { toggleSuggestionActive } from '@/server-actions/manageSuggestion'

interface Props {
  id: string
  isActive: boolean
}

export function SuggestionToggle({ id, isActive }: Props) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleSuggestionActive(id, !isActive)
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none disabled:opacity-50 ${isActive ? 'bg-brand-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}
