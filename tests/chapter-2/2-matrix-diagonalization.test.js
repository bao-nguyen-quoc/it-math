import { diagonalize } from 'chapter-2/2-matrix-diagonalization.js'
import { multiply } from 'chapter-2/util.js'
import { describe, expect, it } from 'vitest'
import { expectMatrixClose } from './util.js'

/**
 * Compute the inverse of a 3x3 matrix using the adjugate method.
 */
function inverse3(M) {
  const [a, b, c] = M[0]
  const [d, e, f] = M[1]
  const [g, h, k] = M[2]

  const det = a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g)

  if (Math.abs(det) < 1e-12) {
    throw new Error('Matrix is singular, cannot invert')
  }

  const inv = 1 / det
  return [
    [(e * k - f * h) * inv, (c * h - b * k) * inv, (b * f - c * e) * inv],
    [(f * g - d * k) * inv, (a * k - c * g) * inv, (c * d - a * f) * inv],
    [(d * h - e * g) * inv, (b * g - a * h) * inv, (a * e - b * d) * inv],
  ]
}

/**
 * Verify A = P * D * P^(-1) for a diagonalization result.
 */
function verifyDiagonalization(A, { P, D }) {
  const Pinv = inverse3(P)
  const reconstructed = multiply(multiply(P, D), Pinv)
  expectMatrixClose(reconstructed, A)
}

/**
 * Assert D is a diagonal matrix (off-diagonal entries are close to 0).
 */
function expectDiagonal(D) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== j) {
        expect(D[i][j]).toBeCloseTo(0, 10)
      }
    }
  }
}

// Diagonal matrix - trivially diagonalizable (eigenvalues are 1, 2, 3)
const DIAGONAL = [
  [1, 0, 0],
  [0, 2, 0],
  [0, 0, 3],
]

// Symmetric matrix with 3 distinct real eigenvalues
const SYMMETRIC_3x3 = [
  [2, 1, 0],
  [1, 3, 1],
  [0, 1, 2],
]

// General non-symmetric diagonalizable matrix
// Eigenvalues: 1, 2, 4
const GENERAL_DIAGONALIZABLE = [
  [1, 1, 0],
  [0, 2, 0],
  [0, 0, 4],
]

// Non diagonalize matrix (complex eigenvalues)
const COMPLEX_EIGENVALUES = [
  [0, -1, 0],
  [1, 0, 0],
  [0, 0, 1],
]

// Not enough eigenvectors (2, but 3 required)
const DEFECTIVE = [
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 2],
]

describe('diagonalize', () => {
  describe('diagonalizable matrices', () => {
    it('diagonalizes a diagonal matrix (A = P*D*P^(-1))', () => {
      const result = diagonalize(DIAGONAL)

      expectDiagonal(result.D)
      verifyDiagonalization(DIAGONAL, result)
    })

    it('diagonalizes a symmetric matrix with 3 distinct eigenvalues', () => {
      const result = diagonalize(SYMMETRIC_3x3)

      expectDiagonal(result.D)
      verifyDiagonalization(SYMMETRIC_3x3, result)
    })

    it('diagonalizes a general non-symmetric matrix', () => {
      const result = diagonalize(GENERAL_DIAGONALIZABLE)

      expectDiagonal(result.D)
      verifyDiagonalization(GENERAL_DIAGONALIZABLE, result)
    })

    it('returns P and D as 3x3 matrices', () => {
      const { P, D } = diagonalize(SYMMETRIC_3x3)

      expect(P).toHaveLength(3)
      expect(P[0]).toHaveLength(3)
      expect(D).toHaveLength(3)
      expect(D[0]).toHaveLength(3)
    })
  })

  describe('non-diagonalizable matrices', () => {
    it('throws for a matrix with complex eigenvalues', () => {
      expect(() => diagonalize(COMPLEX_EIGENVALUES)).toThrow(/not diagonalizable/i)
    })

    it('throws for a defective matrix (insufficient eigenvectors)', () => {
      expect(() => diagonalize(DEFECTIVE)).toThrow(/not diagonalizable/i)
    })
  })
})
