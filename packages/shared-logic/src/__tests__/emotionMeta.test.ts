import { describe, expect, it } from 'vitest'
import type { EmotionType } from '@sport-fan/types'
import { ALL_EMOTIONS, EMOTION_META } from '../emotion-engine/emotionMeta'

const ALL_EMOTION_VALUES: EmotionType[] = [
  'excited', 'nervous', 'anxious', 'hopeful', 'stressed', 'calm',
  'happy', 'devastated', 'frustrated', 'proud', 'disappointed', 'relieved',
]

describe('EMOTION_META', () => {
  it('covers all 12 emotion types', () => {
    for (const emotion of ALL_EMOTION_VALUES) {
      expect(EMOTION_META[emotion]).toBeDefined()
    }
  })

  it('has exactly 12 entries', () => {
    expect(Object.keys(EMOTION_META)).toHaveLength(12)
  })

  it('every entry has label, emoji, color, and category', () => {
    for (const meta of Object.values(EMOTION_META)) {
      expect(meta.label).toBeTruthy()
      expect(meta.emoji).toBeTruthy()
      expect(meta.color).toBeTruthy()
      expect(['positive', 'negative', 'neutral']).toContain(meta.category)
    }
  })

  it('ALL_EMOTIONS matches EMOTION_META keys', () => {
    expect(ALL_EMOTIONS.sort()).toEqual(ALL_EMOTION_VALUES.sort())
  })
})
