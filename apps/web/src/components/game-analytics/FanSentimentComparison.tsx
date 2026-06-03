'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { EMOTION_META } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'

interface Row { emotion: EmotionType; home: number; away: number }

interface Props {
  data: Row[]
  homeTeam: string
  awayTeam: string
  homeTotal: number
  awayTotal: number
}

export function FanSentimentComparison({ data, homeTeam, awayTeam, homeTotal, awayTotal }: Props) {
  const chartData = data
    .filter((d) => d.home > 0 || d.away > 0)
    .sort((a, b) => (b.home + b.away) - (a.home + a.away))
    .slice(0, 8)
    .map((d) => ({
      name: `${EMOTION_META[d.emotion].emoji} ${EMOTION_META[d.emotion].label}`,
      [homeTeam]: d.home,
      [awayTeam]: d.away,
    }))

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{homeTeam}: <strong className="text-gray-800">{homeTotal} fans</strong></span>
        <span>{awayTeam}: <strong className="text-gray-800">{awayTotal} fans</strong></span>
      </div>
      {chartData.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-4">No check-ins yet for this phase.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey={homeTeam} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar dataKey={awayTeam} fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
