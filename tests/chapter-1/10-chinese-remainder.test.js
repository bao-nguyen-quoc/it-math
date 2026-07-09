import { validatePairwiseCoprime, chineseRemainder } from 'chapter-1/10-chinese-remainder.js'
import { describe, expect, it } from 'vitest'

describe('chineseRemainder', () => {
  it("Slide's example: x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)", () => {
    const equations = [
      { a: 2, m: 3 },
      { a: 3, m: 5 },
      { a: 4, m: 7 },
    ]
    const { x, M } = chineseRemainder(equations)
    expect(M).toBe(105)
    expect(x).toBe(53)
    // Verify solution satisfies all congruences
    for (const { a, m } of equations) {
      expect(x % m).toBe(a)
    }
  })

  it('solves a 2-equation system', () => {
    // x ≡ 1 (mod 3), x ≡ 2 (mod 5)
    const equations = [
      { a: 1, m: 3 },
      { a: 2, m: 5 },
    ]
    const { x, M } = chineseRemainder(equations)
    expect(M).toBe(15)
    expect(x).toBe(7)
    for (const { a, m } of equations) {
      expect(x % m).toBe(a)
    }
  })

  it('handles a_i = 0 cases', () => {
    // x ≡ 0 (mod 3), x ≡ 0 (mod 5), x ≡ 0 (mod 7)
    const equations = [
      { a: 0, m: 3 },
      { a: 0, m: 5 },
      { a: 0, m: 7 },
    ]
    const { x, M } = chineseRemainder(equations)
    expect(M).toBe(105)
    expect(x).toBe(0)
  })
})

describe('validatePairwiseCoprime', () => {
  it('does not throw for pairwise coprime moduli', () => {
    const equations = [
      { a: 1, m: 3 },
      { a: 2, m: 5 },
      { a: 3, m: 7 },
    ]
    expect(() => validatePairwiseCoprime(equations)).not.toThrow()
  })

  it('throws when moduli are not pairwise coprime', () => {
    const equations = [
      { a: 1, m: 6 },
      { a: 2, m: 4 },
    ]
    expect(() => validatePairwiseCoprime(equations)).toThrow(/not coprime/)
  })
})
