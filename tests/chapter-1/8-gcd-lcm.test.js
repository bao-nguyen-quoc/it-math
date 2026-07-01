import {
  gcdByPrimeFactors,
  lcmByPrimeFactors,
  gcdByEuclid,
  lcmByEuclid,
} from 'chapter-1/8-gcd-lcm.js'
import { describe, expect, it } from 'vitest'

const gcdCases = [
  [12, 18, 6],
  [100, 75, 25],
  [36, 48, 12],
  [7, 13, 1], // coprime: GCD = 1
  [360, 840, 120],
  [1001, 77, 77], // 77 = 7*11 divides 1001 = 7*11*13
]

const lcmCases = [
  [12, 18, 36],
  [100, 75, 300],
  [36, 48, 144],
  [7, 13, 91], // coprime: LCM = a*b
  [360, 840, 2520],
  [1001, 77, 1001], // 77 divides 1001
]

describe('GCD by prime factorization', () => {
  it.each(gcdCases)('GCD(%i, %i) = %i', (a, b, expected) => {
    const { gcd } = gcdByPrimeFactors(a, b)
    expect(gcd).toBe(expected)
  })
})

describe('LCM by prime factorization', () => {
  it.each(lcmCases)('LCM(%i, %i) = %i', (a, b, expected) => {
    const { lcm } = lcmByPrimeFactors(a, b)
    expect(lcm).toBe(expected)
  })
})

describe('GCD by Euclid', () => {
  it.each(gcdCases)('GCD(%i, %i) = %i', (a, b, expected) => {
    expect(gcdByEuclid(a, b)).toBe(expected)
  })
})

describe('LCM by Euclid', () => {
  it.each(lcmCases)('LCM(%i, %i) = %i', (a, b, expected) => {
    expect(lcmByEuclid(a, b)).toBe(expected)
  })
})
