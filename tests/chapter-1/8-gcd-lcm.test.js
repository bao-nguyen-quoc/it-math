import { gcdByPrimeFactors, lcmByPrimeFactors } from 'chapter-1/8-gcd-lcm.js'
import { describe, expect, it } from 'vitest'

describe('GCD by prime factorization', () => {
  it.each([
    [12, 18, 6],
    [100, 75, 25],
    [36, 48, 12],
    [7, 13, 1],
    [360, 840, 120],
    [1001, 77, 77],
  ])('GCD(%i, %i) = %i', (a, b, expected) => {
    const { gcd } = gcdByPrimeFactors(a, b)
    expect(gcd).toBe(expected)
  })
})

describe('LCM by prime factorization', () => {
  it.each([
    [12, 18, 36],
    [100, 75, 300],
    [36, 48, 144],
    [7, 13, 91],
    [360, 840, 2520],
    [1001, 77, 1001],
  ])('LCM(%i, %i) = %i', (a, b, expected) => {
    const { lcm } = lcmByPrimeFactors(a, b)
    expect(lcm).toBe(expected)
  })
})
