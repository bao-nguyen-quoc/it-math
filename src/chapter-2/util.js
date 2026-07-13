/**
 * Compute the determinant of a 2x2 matrix.
 *
 * @param {number} a - top-left
 * @param {number} b - top-right
 * @param {number} c - bottom-left
 * @param {number} d - bottom-right
 * @returns {number} a*d - b*c
 */
function det2(a, b, c, d) {
  return a * d - b * c
}

/**
 * Compute the determinant of a 3x3 matrix via cofactor expansion along the first row.
 *
 * @param {number[][]} A - 3x3 matrix
 * @returns {number}
 */
function det3(A) {
  return (
    A[0][0] * det2(A[1][1], A[1][2], A[2][1], A[2][2]) -
    A[0][1] * det2(A[1][0], A[1][2], A[2][0], A[2][2]) +
    A[0][2] * det2(A[1][0], A[1][1], A[2][0], A[2][1])
  )
}

/**
 * Compute the dot product of two 3-vectors.
 *
 * @param {number[]} u - First vector
 * @param {number[]} v - Second vector
 * @returns {number}
 */
function dot(u, v) {
  return Array.from({ length: 3 }, (_, i) => u[i] * v[i]).reduce((acc, x) => acc + x, 0)
}

/**
 * Multiply a 3x3 matrix by a 3-vector: result = M * v
 *
 * @param {number[][]} M - 3x3 matrix
 * @param {number[]} v - 3-vector
 * @returns {number[]} Resulting 3-vector
 */
function matvec(M, v) {
  return M.map((row) => dot(row, v))
}

/**
 * Multiply two 3x3 matrices: C = A * B
 * @param {Array<Array<number>>} A - First 3x3 matrix
 * @param {Array<Array<number>>} B - Second 3x3 matrix
 * @returns {Array<Array<number>>} Resultant 3x3 matrix
 */
function multiply(A, B) {
  const C = Array.from({ length: 3 }, () => [0, 0, 0])
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        C[i][j] += A[i][k] * B[k][j]
      }
    }
  }
  return C
}

/**
 * Normalize a 3-vector to unit length.
 * Throws if the vector is the zero vector.
 *
 * @param {number[]} v - Input vector
 * @returns {number[]} Unit vector in the same direction
 */
function normalize(v) {
  const norm = Math.sqrt(dot(v, v))
  if (norm < 1e-12) throw new Error('Cannot normalize a zero vector.')
  return v.map((x) => x / norm)
}

/**
 * Print a matrix to the console with aligned columns.
 *
 * @param {number[][]} M - Matrix to print
 * @param {string} label - Label to display above the matrix
 */
function printMatrix(M, label) {
  console.log(`${label}:`)
  for (const row of M) {
    console.log('  ' + row.map((v) => v.toFixed(2)).join('  '))
  }
}

/**
 * Transpose a 3x3 matrix
 * @param {Array<Array<number>>} M - Input array of 3x3 matrix
 * @returns {Array<Array<number>>} Transposed matrix
 */
function transpose(M) {
  return M[0].map((_, j) => M.map((row) => row[j]))
}

export { det2, det3, dot, matvec, multiply, normalize, printMatrix, transpose }
