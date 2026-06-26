import { sieveOfEratosthenes } from 'chapter-1/6-number-of-primes.js'
import { describe, expect, it } from 'vitest'

const TEST_CASES = [
  [10, 4],
  [20, 8],
  [100, 25],
  [1_000, 168],
  [10_000, 1_229],
  [100_000, 9_592],
  [1_000_000, 78_498],
  [10_000_000, 664_579],
]

describe('number of primes', () => {
  describe('sieveOfEratosthenes', () => {
    it.each(TEST_CASES)('Count primes from 1 to %i', (n, expectedCount) => {
      const { count } = sieveOfEratosthenes(n)
      expect(count).toBe(expectedCount)
    })

    it('sieve correctly marks known primes', () => {
      const { sieve } = sieveOfEratosthenes(20)
      const primes = [2, 3, 5, 7, 11, 13, 17, 19]
      const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20]

      for (const p of primes) expect(sieve[p]).toBe(1)
      for (const c of composites) expect(sieve[c]).toBe(0)
    })
  })
})
