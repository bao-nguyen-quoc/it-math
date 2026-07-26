import { validateTransitionMatrix, computeStateDistributions } from 'chapter-5/markov-chain.js'
import { describe, expect, it } from 'vitest'

/**
 * Helper: assert two vectors are element-wise close.
 */
function expectVectorClose(actual, expected, precision = 6) {
  expect(actual).toHaveLength(expected.length)
  for (let i = 0; i < expected.length; i++) {
    expect(actual[i]).toBeCloseTo(expected[i], precision)
  }
}

/** Valid 4-state transition matrix (all rows sum to 1, entries in [0,1]) */
const VALID_P = [
  [0.2, 0.5, 0.2, 0.1],
  [0.3, 0.1, 0.4, 0.2],
  [0.2, 0.3, 0.3, 0.2],
  [0.4, 0.2, 0.1, 0.3],
]

/** Simple 2x2 matrix for easy hand-verification */
const SIMPLE_2x2 = [
  [0.7, 0.3],
  [0.4, 0.6],
]

describe('validateTransitionMatrix', () => {
  it('returns valid for a correct stochastic matrix', () => {
    const { valid, errors } = validateTransitionMatrix(VALID_P)
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('returns valid for a 2x2 stochastic matrix', () => {
    const { valid } = validateTransitionMatrix(SIMPLE_2x2)
    expect(valid).toBe(true)
  })

  it('returns valid for identity matrix', () => {
    const I = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    const { valid } = validateTransitionMatrix(I)
    expect(valid).toBe(true)
  })

  it('detects row that does not sum to 1', () => {
    const bad = [
      [0.5, 0.5],
      [0.3, 0.3], // sums to 0.6
    ]
    const { valid, errors } = validateTransitionMatrix(bad)
    expect(valid).toBe(false)
    expect(errors.some((e) => /row 2/i.test(e) && /sum/i.test(e))).toBe(true)
  })

  it('detects negative probability', () => {
    const bad = [
      [1.2, -0.2],
      [0.4, 0.6],
    ]
    const { valid, errors } = validateTransitionMatrix(bad)
    expect(valid).toBe(false)
    expect(errors.some((e) => /outside/i.test(e))).toBe(true)
  })

  it('detects probability greater than 1', () => {
    const bad = [
      [1.5, -0.5],
      [0.4, 0.6],
    ]
    const { valid, errors } = validateTransitionMatrix(bad)
    expect(valid).toBe(false)
    expect(errors.some((e) => /outside/i.test(e))).toBe(true)
  })

  it('detects non-square matrix (wrong column count)', () => {
    const bad = [
      [0.5, 0.3, 0.2],
      [0.4, 0.6],
    ]
    const { valid, errors } = validateTransitionMatrix(bad)
    expect(valid).toBe(false)
    expect(errors.some((e) => /columns/i.test(e))).toBe(true)
  })
})

describe('computeStateDistributions', () => {
  it('returns the correct number of steps', () => {
    const result = computeStateDistributions(VALID_P, 3, 3)
    expect(result).toHaveLength(3)
    expect(result.map((r) => r.step)).toEqual([1, 2, 3])
  })

  it('each distribution sums to 1', () => {
    const result = computeStateDistributions(VALID_P, 3, 5)
    for (const { pi } of result) {
      const sum = pi.reduce((s, v) => s + v, 0)
      expect(sum).toBeCloseTo(1, 10)
    }
  })

  it('step-1 distribution equals the starting row of P', () => {
    // Starting at state 3 -> pi_1 = row 3 of P (index 2)
    const result = computeStateDistributions(VALID_P, 3, 1)
    expectVectorClose(result[0].pi, VALID_P[2])
  })

  it('computes correct step-1 distribution for 2x2 matrix', () => {
    // Start at state 1 -> pi_1 = [0.7, 0.3]
    const result = computeStateDistributions(SIMPLE_2x2, 1, 1)
    expectVectorClose(result[0].pi, [0.7, 0.3])
  })

  it('computes correct step-2 distribution for 2x2 matrix', () => {
    // pi_2 = pi_0 * P^2
    // P^2 = [[0.7*0.7+0.3*0.4, 0.7*0.3+0.3*0.6], [0.4*0.7+0.6*0.4, 0.4*0.3+0.6*0.6]]
    //      = [[0.61, 0.39], [0.52, 0.48]]
    // Start at state 1 -> pi_2 = [0.61, 0.39]
    const result = computeStateDistributions(SIMPLE_2x2, 1, 2)
    expectVectorClose(result[1].pi, [0.61, 0.39])
  })

  it('computes correct distributions for the 4-state matrix from state 3', () => {
    const result = computeStateDistributions(VALID_P, 3, 3)

    // Step 1: pi_1 = e_3 * P = P[2] = [0.2, 0.3, 0.3, 0.2]
    expectVectorClose(result[0].pi, [0.2, 0.3, 0.3, 0.2])

    // Step 2: pi_2 = e_3 * P^2  (hand-computed)
    // P^2[2] = P[2] * P = [0.2, 0.3, 0.3, 0.2] * P
    // j=0: 0.2*0.2 + 0.3*0.3 + 0.3*0.2 + 0.2*0.4 = 0.04+0.09+0.06+0.08 = 0.27
    // j=1: 0.2*0.5 + 0.3*0.1 + 0.3*0.3 + 0.2*0.2 = 0.10+0.03+0.09+0.04 = 0.26
    // j=2: 0.2*0.2 + 0.3*0.4 + 0.3*0.3 + 0.2*0.1 = 0.04+0.12+0.09+0.02 = 0.27
    // j=3: 0.2*0.1 + 0.3*0.2 + 0.3*0.2 + 0.2*0.3 = 0.02+0.06+0.06+0.06 = 0.20
    expectVectorClose(result[1].pi, [0.27, 0.26, 0.27, 0.2])
  })

  it('handles single-state system', () => {
    const trivial = [[1]]
    const result = computeStateDistributions(trivial, 1, 3)
    for (const { pi } of result) {
      expectVectorClose(pi, [1])
    }
  })

  it('handles starting from different states', () => {
    // Starting from state 1 -> step 1 should equal row 1 of P
    const r1 = computeStateDistributions(VALID_P, 1, 1)
    expectVectorClose(r1[0].pi, VALID_P[0])

    // Starting from state 4 -> step 1 should equal row 4 of P
    const r4 = computeStateDistributions(VALID_P, 4, 1)
    expectVectorClose(r4[0].pi, VALID_P[3])
  })
})
