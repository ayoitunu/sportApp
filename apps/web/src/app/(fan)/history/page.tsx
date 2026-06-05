'use client'
import { useUserHistory } from '@/hooks/useUserHistory'
import { CheckInHistoryList } from '@/components/fan/CheckInHistoryList'

export default function HistoryPage() {
  const { data: checkIns, isLoading } = useUserHistory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white">My History</h1>
        <p className="text-gray-500 mt-1 text-sm">Your emotional journey as a fan.</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-pitch-800 animate-pulse" />)}
        </div>
      )}

      {checkIns && checkIns.length === 0 && !isLoading && (
        <div className="text-center py-16 text-gray-600">
          <p className="font-display text-5xl mb-3 text-gray-700">—</p>
          <p className="font-semibold text-gray-500">No check-ins yet.</p>
          <p className="text-sm mt-1">Check in before your next game to get started.</p>
        </div>
      )}

      {checkIns && checkIns.length > 0 && (
        <CheckInHistoryList checkIns={checkIns} />
      )}
    </div>
  )
}
