import { expect } from 'vitest'

/**
 * Assert two 3x3 matrices are approximately equal (element-wise).
 *
 * @param {number[][]} actual - The computed matrix
 * @param {number[][]} expected - The expected matrix
 * @param {number} [precision=2] - Number of decimal digits to check
 */
function expectMatrixClose(actual, expected, precision = 2) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      expect(actual[i][j]).toBeCloseTo(expected[i][j], precision)
    }
  }
}

export { expectMatrixClose }
