import {
  validateSymmetric,
  validatePositiveDefinite,
  classicCholesky,
  variantCholesky,
} from 'chapter-2/1-cholesky-decomposition.js'
import { multiply, transpose } from 'chapter-2/util.js'
import { describe, expect, it } from 'vitest'
import { expectMatrixClose } from './util.js'

/**
 * Build a 3x3 diagonal matrix from a 1D array
 */
function diagMatrix(D) {
  return [
    [D[0], 0, 0],
    [0, D[1], 0],
    [0, 0, D[2]],
  ]
}

// ── Test data ────────────────────────────────────────────────────────────

// Symmetric positive definite (from the demo run)
const SPD_1 = [
  [4, 12, -16],
  [12, 37, -43],
  [-16, -43, 98],
]

// Another SPD matrix (3x3 identity)
const SPD_IDENTITY = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

// Symmetric but NOT positive definite (negative eigenvalue)
const SYMMETRIC_NOT_PD = [
  [1, 2, 0],
  [2, 1, 0],
  [0, 0, 1],
]

// Non-symmetric matrix
const NON_SYMMETRIC = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

// ── Tests ────────────────────────────────────────────────────────────────

describe('validateSymmetric', () => {
  it('passes for a symmetric matrix', () => {
    expect(() => validateSymmetric(SPD_1)).not.toThrow()
  })

  it('passes for the identity matrix', () => {
    expect(() => validateSymmetric(SPD_IDENTITY)).not.toThrow()
  })

  it('throws for a non-symmetric matrix', () => {
    expect(() => validateSymmetric(NON_SYMMETRIC)).toThrow(/not symmetric/)
  })
})

describe('validatePositiveDefinite', () => {
  it('passes for a positive definite matrix', () => {
    expect(() => validatePositiveDefinite(SPD_1)).not.toThrow()
  })

  it('throws for a symmetric but not positive definite matrix', () => {
    expect(() => validatePositiveDefinite(SYMMETRIC_NOT_PD)).toThrow(/not positive/)
  })
})

describe('classicCholesky', () => {
  it('decomposes SPD_1 so that L * L^T = A', () => {
    const L = classicCholesky(SPD_1)
    const reconstructed = multiply(L, transpose(L))
    expectMatrixClose(reconstructed, SPD_1)
  })

  it('produces the expected L for SPD_1', () => {
    const L = classicCholesky(SPD_1)
    // Known result from the demo run
    expectMatrixClose(L, [
      [2, 0, 0],
      [6, 1, 0],
      [-8, 5, 3],
    ])
  })

  it('decomposes identity matrix to identity', () => {
    const L = classicCholesky(SPD_IDENTITY)
    expectMatrixClose(L, SPD_IDENTITY)
  })
})

describe('variantCholesky', () => {
  it('decomposes SPD_1 so that L * D * L^T = A', () => {
    const { L, D } = variantCholesky(SPD_1)
    const reconstructed = multiply(multiply(L, diagMatrix(D)), transpose(L))
    expectMatrixClose(reconstructed, SPD_1)
  })

  it('produces the expected L and D for SPD_1', () => {
    const { L, D } = variantCholesky(SPD_1)
    // Known result from the demo run
    expectMatrixClose(L, [
      [1, 0, 0],
      [3, 1, 0],
      [-4, 5, 1],
    ])
    expect(D).toEqual([4, 1, 9])
  })

  it('decomposes identity matrix to L=I, D=[1,1,1]', () => {
    const { L, D } = variantCholesky(SPD_IDENTITY)
    expectMatrixClose(L, SPD_IDENTITY)
    expect(D).toEqual([1, 1, 1])
  })

  it('works on symmetric but not positive definite matrices', () => {
    const { L, D } = variantCholesky(SYMMETRIC_NOT_PD)
    const reconstructed = multiply(multiply(L, diagMatrix(D)), transpose(L))
    expectMatrixClose(reconstructed, SYMMETRIC_NOT_PD)
  })
})
