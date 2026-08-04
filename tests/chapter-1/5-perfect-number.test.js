import { isPerfect, isPerfectEvenMersenne } from 'chapter-1/5-perfect-number.js'
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

// Even perfect numbers for Mersenne check (same results as isPerfect for even inputs)
const EVEN_TEST_CASES = [
  [6, true],
  [12, false],
  [28, true],
  [100, false],
  [496, true],
  [8128, true],
]

// Odd numbers always return false for the Mersenne method
const ODD_TEST_CASES = [
  [3, false],
  [7, false],
  [1001, false],
]

describe('perfect number', () => {
  describe('isPerfect', () => {
    it.each(TEST_CASES)('Check if %i is a perfect number', (n, expected) => {
      expect(isPerfect(n)).toBe(expected)
    })
  })

  describe('isPerfectEvenMersenne', () => {
    it.each(EVEN_TEST_CASES)('Check if %i is an even perfect number (Mersenne)', (n, expected) => {
      expect(isPerfectEvenMersenne(n)).toBe(expected)
    })

    it.each(ODD_TEST_CASES)('Returns false for odd number %i', (n, expected) => {
      expect(isPerfectEvenMersenne(n)).toBe(expected)
    })
  })
})
