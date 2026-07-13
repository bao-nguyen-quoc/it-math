import { svd } from 'chapter-2/3-svd-decomposition.js'
import { multiply, transpose } from 'chapter-2/util.js'
import { describe, expect, it } from 'vitest'
import { expectMatrixClose } from './util.js'

/**
 * Assert a matrix is diagonal (off-diagonal entries ≈ 0).
 */
function expectDiagonal(M) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== j) {
        expect(M[i][j]).toBeCloseTo(0, 8)
      }
    }
  }
}

/**
 * Assert a 3x3 matrix is orthogonal: M^T * M ≈ I.
 */
function expectOrthogonal(M) {
  const MtM = multiply(transpose(M), M)
  const I = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
  expectMatrixClose(MtM, I, 6)
}

/**
 * Verify SVD: A ≈ U * Sigma * V^T.
 */
function verifySVD(A, { U, Sigma, V }) {
  const reconstructed = multiply(multiply(U, Sigma), transpose(V))
  expectMatrixClose(reconstructed, A)
}

// Diagonal matrix — singular values are the absolute diagonal entries
const DIAGONAL = [
  [3, 0, 0],
  [0, 5, 0],
  [0, 0, 2],
]

// Symmetric positive-definite matrix
const SYMMETRIC_PD = [
  [4, 2, 0],
  [2, 5, 1],
  [0, 1, 3],
]

// General non-symmetric full-rank matrix
const GENERAL = [
  [1, 2, 3],
  [0, 4, 5],
  [1, 0, 6],
]

// Identity matrix
const IDENTITY = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

// Symmetric matrix with off-diagonal structure
const SYMMETRIC_3x3 = [
  [2, 1, 0],
  [1, 3, 1],
  [0, 1, 2],
]

describe('3-svd-decomposition', () => {
  describe('structural properties', () => {
    it('returns U, Sigma, V as 3x3 matrices', () => {
      const { U, Sigma, V } = svd(DIAGONAL)

      expect(U).toHaveLength(3)
      expect(U[0]).toHaveLength(3)
      expect(Sigma).toHaveLength(3)
      expect(Sigma[0]).toHaveLength(3)
      expect(V).toHaveLength(3)
      expect(V[0]).toHaveLength(3)
    })

    it('Sigma is a diagonal matrix', () => {
      const { Sigma } = svd(SYMMETRIC_PD)
      expectDiagonal(Sigma)
    })

    it('Sigma has non-negative diagonal entries (singular values)', () => {
      const { Sigma } = svd(GENERAL)
      for (let i = 0; i < 3; i++) {
        expect(Sigma[i][i]).toBeGreaterThanOrEqual(-1e-10)
      }
    })

    it('U is orthogonal (U^T * U = I)', () => {
      const { U } = svd(SYMMETRIC_PD)
      expectOrthogonal(U)
    })

    it('V is orthogonal (V^T * V = I)', () => {
      const { V } = svd(SYMMETRIC_PD)
      expectOrthogonal(V)
    })
  })

  describe('reconstruction A = U * Sigma * V^T', () => {
    it('reconstructs a diagonal matrix', () => {
      const result = svd(DIAGONAL)
      verifySVD(DIAGONAL, result)
    })

    it('reconstructs the identity matrix', () => {
      const result = svd(IDENTITY)
      verifySVD(IDENTITY, result)
    })

    it('reconstructs a symmetric positive-definite matrix', () => {
      const result = svd(SYMMETRIC_PD)
      verifySVD(SYMMETRIC_PD, result)
    })

    it('reconstructs a symmetric matrix', () => {
      const result = svd(SYMMETRIC_3x3)
      verifySVD(SYMMETRIC_3x3, result)
    })

    it('reconstructs a general non-symmetric matrix', () => {
      const result = svd(GENERAL)
      verifySVD(GENERAL, result)
    })
  })

  describe('known singular values', () => {
    it('identity matrix has all singular values equal to 1', () => {
      const { Sigma } = svd(IDENTITY)
      for (let i = 0; i < 3; i++) {
        expect(Sigma[i][i]).toBeCloseTo(1, 8)
      }
    })

    it('diagonal matrix singular values match absolute diagonal entries', () => {
      const { Sigma } = svd(DIAGONAL)
      const expected = [3, 5, 2].sort((a, b) => b - a)
      const actual = [Sigma[0][0], Sigma[1][1], Sigma[2][2]].sort((a, b) => b - a)

      for (let i = 0; i < 3; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], 6)
      }
    })
  })
})
