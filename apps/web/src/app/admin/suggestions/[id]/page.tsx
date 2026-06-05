import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SuggestionForm } from '@/components/admin/SuggestionForm'

export default async function EditSuggestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: template } = await supabase
    .from('suggestion_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (!template) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/suggestions" className="text-sm text-gray-400 hover:text-gray-700">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit suggestion template</h1>
      </div>
      <SuggestionForm existing={template} />
    </div>
  )
}
