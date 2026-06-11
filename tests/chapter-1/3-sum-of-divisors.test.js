import { sumDivisors } from 'chapter-1/3-sum-of-divisors.js'
import { primeFactors } from 'chapter-1/1-prime-factorization.js'
import { describe, expect, it } from 'vitest'

const TEST_CASES = [
  [2, 3],
  [12, 28],
  [36, 91],
  [100, 217],
  [360, 1170],
  [1001, 1344],
  [99991, 99992],
  [1_000_000, 2480437],
]

describe('sum of divisors', () => {
  it.each(TEST_CASES)('Sum of divisors of %i', (n, expectedSum) => {
    expect(sumDivisors(primeFactors(n))).toBe(expectedSum)
  })
})
