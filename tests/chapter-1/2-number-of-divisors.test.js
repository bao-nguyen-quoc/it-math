import { countDivisors, listDivisors } from 'chapter-1/2-number-of-divisors.js'
import { primeFactors } from 'chapter-1/1-prime-factorization.js'
import { describe, expect, it } from 'vitest'

const TEST_CASES = [
  [2, 2, [1, 2]],
  [12, 6, [1, 2, 3, 4, 6, 12]],
  [36, 9, [1, 2, 3, 4, 6, 9, 12, 18, 36]],
  [100, 9, [1, 2, 4, 5, 10, 20, 25, 50, 100]],
  [
    360,
    24,
    [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360],
  ],
  [1001, 8, [1, 7, 11, 13, 77, 91, 143, 1001]],
  [99991, 2, [1, 99991]],
  [
    1_000_000,
    49,
    [
      1, 2, 4, 5, 8, 10, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500,
      625, 800, 1000, 1250, 1600, 2000, 2500, 3125, 4000, 5000, 6250, 8000, 10000, 12500, 15625,
      20000, 25000, 31250, 40000, 50000, 62500, 100000, 125000, 200000, 250000, 500000, 1000000,
    ],
  ],
]

describe('number of divisors', () => {
  describe('countDivisors', () => {
    it.each(TEST_CASES.map(([n, count]) => [n, count]))(
      'Count divisors of %i',
      (n, expectedCount) => {
        expect(countDivisors(primeFactors(n))).toBe(expectedCount)
      },
    )
  })

  describe('listDivisors', () => {
    it.each(TEST_CASES)('List divisors of %i', (n, _count, expectedDivisors) => {
      expect(listDivisors(primeFactors(n))).toEqual(expectedDivisors)
    })
  })
})
