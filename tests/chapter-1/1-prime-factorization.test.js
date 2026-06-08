import { primeFactors, formatFactorization } from 'chapter-1/1-prime-factorization.js'
import { describe, expect, it } from 'vitest'

describe('prime factorization', () => {
  it.each([
    [2, '2'],
    [12, '2^2*3'],
    [36, '2^2*3^2'],
    [100, '2^2*5^2'],
    [360, '2^3*3^2*5'],
    [1001, '7*11*13'],
    [99991, '99991'],
    [1_000_000, '2^6*5^6'],
  ])('primeFactors(%i) → "%s"', (n, expected) => {
    const result = formatFactorization(primeFactors(n))
    expect(result).toBe(expected)
  })
})
