'use client'
import { useUserHistory } from '@/hooks/useUserHistory'
import { EMOTION_META } from '@sport-fan/shared-logic'
import { CheckInHistoryList } from '@/components/fan/CheckInHistoryList'

export default function HistoryPage() {
  const { data: checkIns, isLoading } = useUserHistory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Check-in History</h1>
        <p className="text-gray-500 mt-1">Your emotional journey as a fan.</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      )}

      {checkIns && checkIns.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">💭</p>
          <p className="font-medium">No check-ins yet.</p>
          <p className="text-sm mt-1">Check in before your next game to get started!</p>
        </div>
      )}

      {checkIns && checkIns.length > 0 && (
        <CheckInHistoryList checkIns={checkIns} />
      )}
    </div>
  )
}
