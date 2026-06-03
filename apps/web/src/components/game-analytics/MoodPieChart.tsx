'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EMOTION_META } from '@sport-fan/shared-logic'
import { toPieData } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'

// Tailwind color → hex approximations for Recharts SVG
const COLOR_MAP: Record<string, string> = {
  'amber-500': '#f59e0b', 'sky-400': '#38bdf8', 'teal-400': '#2dd4bf',
  'green-500': '#22c55e', 'violet-500': '#8b5cf6', 'emerald-400': '#34d399',
  'yellow-500': '#eab308', 'orange-500': '#f97316', 'red-400': '#f87171',
  'red-600': '#dc2626', 'slate-400': '#94a3b8', 'rose-600': '#e11d48',
}

interface Props {
  data: { emotion: EmotionType; count: number }[]
  title: string
}

export function MoodPieChart({ data, title }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 rounded-xl bg-gray-50 text-xs text-gray-400">
        No data
      </div>
    )
  }

  const pieData = toPieData(data)

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-600 text-center">{title}</p>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={55}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLOR_MAP[EMOTION_META[entry.name as EmotionType].color] ?? '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              value,
              `${EMOTION_META[name as EmotionType]?.emoji ?? ''} ${EMOTION_META[name as EmotionType]?.label ?? name}`,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
