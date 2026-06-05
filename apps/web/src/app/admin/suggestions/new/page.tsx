import Link from 'next/link'
import { SuggestionForm } from '@/components/admin/SuggestionForm'

export default function NewSuggestionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/suggestions" className="text-sm text-gray-400 hover:text-gray-700">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New suggestion template</h1>
      </div>
      <SuggestionForm />
    </div>
  )
}
