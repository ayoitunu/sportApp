'use client'
import { EMOTION_META, ALL_EMOTIONS } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'
import { clsx } from 'clsx'

interface Props {
  selected: EmotionType | null
  onSelect: (emotion: EmotionType) => void
  disabled?: boolean
}

export function EmotionPicker({ selected, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {ALL_EMOTIONS.map((emotion) => {
        const meta = EMOTION_META[emotion]
        const isSelected = selected === emotion
        return (
          <button
            key={emotion}
            type="button"
            onClick={() => onSelect(emotion)}
            disabled={disabled}
            className={clsx(
              'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all',
              isSelected
                ? 'border-brand-500 bg-brand-50 shadow-sm scale-[1.03]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="text-2xl">{meta.emoji}</span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {meta.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
