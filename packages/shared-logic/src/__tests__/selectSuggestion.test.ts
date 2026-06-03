import { describe, expect, it } from 'vitest'
import { pickSuggestion } from '../suggestion-engine/selectSuggestion'

const mockCandidates = [
  { id: 'a', text: 'Stay calm and enjoy the game!', tone: 'encouraging' },
  { id: 'b', text: 'Your passion shows great love for the sport.', tone: 'hopeful' },
]

describe('pickSuggestion', () => {
  it('returns null for empty candidates', () => {
    expect(pickSuggestion([])).toBeNull()
  })

  it('returns the only candidate when there is one', () => {
    const result = pickSuggestion([mockCandidates[0]!])
    expect(result).toEqual(mockCandidates[0])
  })

  it('returns one of the candidates', () => {
    const result = pickSuggestion(mockCandidates)
    expect(mockCandidates).toContainEqual(result)
  })

  it('returns a result with id and text', () => {
    const result = pickSuggestion(mockCandidates)
    expect(result).not.toBeNull()
    expect(result!.id).toBeTruthy()
    expect(result!.text).toBeTruthy()
  })
})
