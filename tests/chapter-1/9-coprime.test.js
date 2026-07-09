import { countCoprime, listCoprime } from 'chapter-1/9-coprime.js'
import { describe, expect, it } from 'vitest'

describe('countCoprime (Euler totient)', () => {
  it.each([
    [100, 40],
    [120, 32],
    [210, 48],
    [360, 96],
    [1000, 400],
  ])('φ(%i) = %i', (n, expected) => {
    expect(countCoprime(n)).toBe(expected)
  })
})

describe('listCoprime', () => {
  it('lists coprimes for 100', () => {
    const result = listCoprime(100)
    expect(result).toHaveLength(countCoprime(100))
    // 1 is always coprime with any n
    expect(result[0]).toBe(1)
    // n itself is never coprime with n (for n > 1)
    expect(result).not.toContain(100)
    // Spot-check: 3 is coprime with 100 (100 = 2^2 * 5^2)
    expect(result).toContain(3)
    // 10 shares factor 2 and 5 with 100
    expect(result).not.toContain(10)
  })

  it('lists coprimes for 210', () => {
    const result = listCoprime(210)
    expect(result).toHaveLength(countCoprime(210))
    // 210 = 2 * 3 * 5 * 7, so 11 is coprime
    expect(result).toContain(11)
    // 14 = 2 * 7, shares factors with 210
    expect(result).not.toContain(14)
  })

  it('count matches list length for 360', () => {
    const result = listCoprime(360)
    expect(result).toHaveLength(countCoprime(360))
  })
})
