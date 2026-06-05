'use client'
import { useState, useTransition } from 'react'
import { toggleSportActive, updateSportDisplay } from '@/server-actions/manageSport'

type Sport = { id: string; name: string; display: string; is_active: boolean }

export function SportRow({ sport }: { sport: Sport }) {
  const [editing, setEditing] = useState(false)
  const [display, setDisplay] = useState(sport.display)
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => { await toggleSportActive(sport.id, !sport.is_active) })
  }

  function handleSaveDisplay(e: React.FormEvent) {
    e.preventDefault()
    if (!display.trim()) return
    startTransition(async () => {
      await updateSportDisplay(sport.id, display.trim())
      setEditing(false)
    })
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-gray-700 capitalize">{sport.name}</td>
      <td className="px-4 py-3">
        {editing ? (
          <form onSubmit={handleSaveDisplay} className="flex items-center gap-2">
            <input
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1 text-sm w-48"
              autoFocus
            />
            <button type="submit" disabled={pending}
              className="text-xs text-brand-600 font-medium hover:underline disabled:opacity-50">
              Save
            </button>
            <button type="button" onClick={() => { setDisplay(sport.display); setEditing(false) }}
              className="text-xs text-gray-400 hover:underline">
              Cancel
            </button>
          </form>
        ) : (
          <span
            className="text-gray-700 cursor-pointer hover:text-brand-600"
            onClick={() => setEditing(true)}
            title="Click to edit"
          >
            {sport.display}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={pending}
          className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none disabled:opacity-50 ${sport.is_active ? 'bg-brand-600' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${sport.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">{sport.is_active ? 'Visible to fans' : 'Hidden'}</td>
    </tr>
  )
}
