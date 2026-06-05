'use client'
import { EMOTION_META, ALL_EMOTIONS } from '@sport-fan/shared-logic'
import type { EmotionType } from '@sport-fan/types'

interface Props {
  selected: EmotionType | null
  onSelect: (emotion: EmotionType) => void
  disabled?: boolean
}

// Maps EMOTION_META color tokens → Tailwind bg/border/text classes for dark UI
const EMOTION_STYLE: Record<EmotionType, { bg: string; border: string; text: string; selectedBg: string }> = {
  excited:      { bg: 'bg-amber-950/40',   border: 'border-amber-700/40',   text: 'text-amber-300',   selectedBg: 'bg-amber-500'   },
  hopeful:      { bg: 'bg-sky-950/40',      border: 'border-sky-700/40',     text: 'text-sky-300',     selectedBg: 'bg-sky-500'     },
  calm:         { bg: 'bg-teal-950/40',     border: 'border-teal-700/40',    text: 'text-teal-300',    selectedBg: 'bg-teal-500'    },
  happy:        { bg: 'bg-green-950/40',    border: 'border-green-700/40',   text: 'text-green-300',   selectedBg: 'bg-green-500'   },
  proud:        { bg: 'bg-violet-950/40',   border: 'border-violet-700/40',  text: 'text-violet-300',  selectedBg: 'bg-violet-500'  },
  relieved:     { bg: 'bg-emerald-950/40',  border: 'border-emerald-700/40', text: 'text-emerald-300', selectedBg: 'bg-emerald-500' },
  nervous:      { bg: 'bg-yellow-950/40',   border: 'border-yellow-700/40',  text: 'text-yellow-300',  selectedBg: 'bg-yellow-500'  },
  anxious:      { bg: 'bg-orange-950/40',   border: 'border-orange-700/40',  text: 'text-orange-300',  selectedBg: 'bg-orange-500'  },
  stressed:     { bg: 'bg-red-950/40',      border: 'border-red-700/40',     text: 'text-red-300',     selectedBg: 'bg-red-500'     },
  frustrated:   { bg: 'bg-red-950/60',      border: 'border-red-600/50',     text: 'text-red-200',     selectedBg: 'bg-red-600'     },
  disappointed: { bg: 'bg-slate-800/60',    border: 'border-slate-600/40',   text: 'text-slate-300',   selectedBg: 'bg-slate-500'   },
  devastated:   { bg: 'bg-rose-950/50',     border: 'border-rose-700/50',    text: 'text-rose-300',    selectedBg: 'bg-rose-600'    },
}

export function EmotionPicker({ selected, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
      {ALL_EMOTIONS.map((emotion) => {
        const meta = EMOTION_META[emotion]
        const style = EMOTION_STYLE[emotion]
        const isSelected = selected === emotion

        return (
          <button
            key={emotion}
            type="button"
            onClick={() => !disabled && onSelect(emotion)}
            disabled={disabled}
            className={[
              'group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all duration-150 select-none',
              isSelected
                ? `${style.selectedBg} border-transparent shadow-lg scale-105`
                : `${style.bg} ${style.border} hover:scale-[1.03] hover:border-opacity-70`,
              disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            <span className="text-2xl leading-none">{meta.emoji}</span>
            <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-white' : style.text}`}>
              {meta.label}
            </span>
            {isSelected && (
              <span className="absolute inset-0 rounded-xl ring-2 ring-white/20" />
            )}
          </button>
        )
      })}
    </div>
  )
}
