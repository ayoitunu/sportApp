import type { EmotionCategory, EmotionType } from '@sport-fan/types'

export interface EmotionMeta {
  label: string
  emoji: string
  /** Tailwind / NativeWind color token (e.g. "amber-500") */
  color: string
  category: EmotionCategory
}

export const EMOTION_META: Record<EmotionType, EmotionMeta> = {
  excited:      { label: 'Excited',      emoji: '🔥', color: 'amber-500',   category: 'positive' },
  hopeful:      { label: 'Hopeful',      emoji: '✨', color: 'sky-400',     category: 'positive' },
  calm:         { label: 'Calm',         emoji: '😌', color: 'teal-400',    category: 'neutral'  },
  happy:        { label: 'Happy',        emoji: '😄', color: 'green-500',   category: 'positive' },
  proud:        { label: 'Proud',        emoji: '🦁', color: 'violet-500',  category: 'positive' },
  relieved:     { label: 'Relieved',     emoji: '😮‍💨', color: 'emerald-400', category: 'positive' },
  nervous:      { label: 'Nervous',      emoji: '😬', color: 'yellow-500',  category: 'neutral'  },
  anxious:      { label: 'Anxious',      emoji: '😰', color: 'orange-500',  category: 'negative' },
  stressed:     { label: 'Stressed',     emoji: '😤', color: 'red-400',     category: 'negative' },
  frustrated:   { label: 'Frustrated',   emoji: '😠', color: 'red-600',     category: 'negative' },
  disappointed: { label: 'Disappointed', emoji: '😔', color: 'slate-400',   category: 'negative' },
  devastated:   { label: 'Devastated',   emoji: '💔', color: 'rose-600',    category: 'negative' },
}

export const ALL_EMOTIONS: EmotionType[] = Object.keys(EMOTION_META) as EmotionType[]
