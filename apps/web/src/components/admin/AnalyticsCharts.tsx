'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { EMOTION_META } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'

// ── Emotion colour map (reuse EMOTION_META colors approximated as hex) ─────────
const EMOTION_HEX: Record<EmotionType, string> = {
  excited:      '#f59e0b',
  hopeful:      '#38bdf8',
  calm:         '#2dd4bf',
  happy:        '#22c55e',
  proud:        '#8b5cf6',
  relieved:     '#34d399',
  nervous:      '#eab308',
  anxious:      '#f97316',
  stressed:     '#f87171',
  frustrated:   '#dc2626',
  disappointed: '#94a3b8',
  devastated:   '#e11d48',
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface EmotionRow { emotion: EmotionType; total: number }
interface WeekRow    { week: string; count: number }
interface GameRow    { game: string; count: number }

interface Props {
  emotionTotals: EmotionRow[]
  weeklyVolume:  WeekRow[]
  topGames:      GameRow[]
  totalCheckIns: number
  totalFans:     number
  activeGames:   number
}

export function AnalyticsCharts({ emotionTotals, weeklyVolume, topGames, totalCheckIns, totalFans, activeGames }: Props) {
  const isEmpty = totalCheckIns === 0

  return (
    <div className="space-y-8">
      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Total check-ins', value: totalCheckIns },
          { label: 'Registered fans',  value: totalFans },
          { label: 'Active games',     value: activeGames },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-3xl font-black text-gray-900">{s.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {isEmpty && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-medium">No check-in data yet.</p>
          <p className="text-sm mt-1">Charts will appear once fans start checking in.</p>
        </div>
      )}

      {!isEmpty && (
        <>
          {/* Emotion breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Emotion breakdown (all time)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={emotionTotals} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                <XAxis
                  dataKey="emotion"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={(v: string) => EMOTION_META[v as EmotionType]?.emoji ?? v}
                />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: number, _: string, props: { payload?: { emotion: EmotionType } }) => [val, EMOTION_META[props.payload?.emotion ?? 'calm']?.label ?? '']}
                  labelFormatter={() => ''}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {emotionTotals.map((row) => (
                    <Cell key={row.emotion} fill={EMOTION_HEX[row.emotion]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly check-in volume */}
          {weeklyVolume.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-6">Weekly check-in volume</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyVolume} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Check-ins" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top games */}
          {topGames.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-6">Top games by check-ins</h2>
              <ResponsiveContainer width="100%" height={Math.max(topGames.length * 48, 120)}>
                <BarChart data={topGames} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="game" tick={{ fontSize: 11, fill: '#6b7280' }} width={160} />
                  <Tooltip />
                  <Bar dataKey="count" name="Check-ins" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
