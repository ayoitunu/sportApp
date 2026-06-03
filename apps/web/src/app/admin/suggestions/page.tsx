import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EMOTION_META } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'

export default async function AdminSuggestionsPage() {
  const supabase = await createClient()
  const { data: templates } = await supabase
    .from('suggestion_templates')
    .select('*')
    .order('phase')
    .order('emotion')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Suggestion Templates</h1>
        <Link href="/admin/suggestions/new" className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors">
          + New template
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Phase</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Emotion</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Outcome</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Text</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(templates ?? []).map((t) => {
              const meta = EMOTION_META[t.emotion as EmotionType]
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.phase === 'pre_game' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {t.phase === 'pre_game' ? 'Pre-game' : 'Post-game'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <span>{meta.emoji}</span>
                      <span className="text-gray-700">{meta.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{t.outcome ?? 'Any'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs">
                    <p className="line-clamp-2">{t.text}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${t.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                      {t.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/suggestions/${t.id}`} className="text-xs text-brand-600 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
