import { listPrimes } from 'chapter-1/7-list-primes.js'
import { describe, expect, it } from 'vitest'

const PRIMES_UP_TO_50 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

describe('list primes', () => {
  describe('listPrimes', () => {
    it('returns only [2] for N = 2', () => {
      expect(listPrimes(2)).toEqual([2])
    })

    it('returns correct primes up to 10', () => {
      const listOfPrimes = listPrimes(10)
      // Not contains 1 in result
      expect(listOfPrimes).not.toContain(1)
      expect(listOfPrimes).toEqual([2, 3, 5, 7])
    })

    it('returns correct primes up to 20', () => {
      expect(listPrimes(20)).toEqual([2, 3, 5, 7, 11, 13, 17, 19])
    })

    it('returns correct primes up to 50', () => {
      expect(listPrimes(50)).toEqual(PRIMES_UP_TO_50)
    })

    it('returns correct count for N = 50', () => {
      expect(listPrimes(50)).toHaveLength(15)
    })
  })
})
