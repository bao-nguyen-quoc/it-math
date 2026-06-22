import { isPerfect, isPerfectBruteForce } from 'chapter-1/5-perfect-number.js'
import { describe, expect, it } from 'vitest'

const TEST_CASES = [
  [2, false],
  [6, true],
  [12, false],
  [28, true],
  [100, false],
  [496, true],
  [1001, false],
  [8128, true],
]

describe('perfect number', () => {
  describe('isPerfect', () => {
    it.each(TEST_CASES)('Check if %i is a perfect number', (n, expected) => {
      expect(isPerfect(n)).toBe(expected)
    })
  })

  describe('isPerfectBruteForce', () => {
    it.each(TEST_CASES)('Check if %i is a perfect number (brute force)', (n, expected) => {
      expect(isPerfectBruteForce(n)).toBe(expected)
    })
  })
})
