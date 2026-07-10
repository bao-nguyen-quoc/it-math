// Cho ma trận A kích thước 3*3. Thực hiện phân rã ma trận bằng phương pháp Cholesky:
// - Cổ điển
// - Biến thể

/**
 * Validate that a 3x3 matrix is symmetric: A[i][j] === A[j][i] for all i ≠ j.
 * Throws an error identifying the first violating pair.
 *
 * @param {number[][]} A - 3x3 matrix to validate
 */
function validateSymmetric(A) {
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (A[i][j] !== A[j][i]) {
        throw new Error(
          `Matrix is not symmetric: A[${i}][${j}]=${A[i][j]} ≠ A[${j}][${i}]=${A[j][i]}`,
        )
      }
    }
  }
}

/**
 * Validate that a 3x3 symmetric matrix is positive definite.
 * Uses Sylvester's criterion: all leading principal minors must have positive determinant.
 * Throws an error on the first violated minor.
 *
 * @param {number[][]} A - 3x3 symmetric matrix to validate
 */
function validatePositiveDefinite(A) {
  // Minor 1x1: det = A[0][0]
  const det1 = A[0][0]
  if (det1 <= 0) {
    throw new Error(`Leading principal minor 1*1 is not positive: det=${det1}`)
  }

  // Minor 2x2: det = A[0][0]*A[1][1] - A[0][1]^2
  const det2 = A[0][0] * A[1][1] - A[0][1] * A[1][0]
  if (det2 <= 0) {
    throw new Error(`Leading principal minor 2*2 is not positive: det=${det2}`)
  }

  // Minor 3x3: full determinant (cofactor expansion along first row)
  const det3 =
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
  if (det3 <= 0) {
    throw new Error(`Leading principal minor 3*3 is not positive: det=${det3}`)
  }
}

/**
 * Perform classic Cholesky decomposition of a 3x3 symmetric positive definite matrix A.
 * Finds a lower triangular matrix L such that A = L * L^T.
 *
 * @param {number[][]} A - 3x3 symmetric positive definite matrix (row-major array of arrays)
 * @returns {number[][]} L - 3x3 lower triangular matrix such that A = L * L^T
 */
function classicCholesky(A) {
  const L = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j <= i; j++) {
      // Sum of L[i][k] * L[j][k] for k < j
      const dot = Array.from({ length: j }, (_, k) => L[i][k] * L[j][k]).reduce(
        (acc, v) => acc + v,
        0,
      )

      if (i === j) {
        // Diagonal: L[i][i] = sqrt(A[i][i] - sum(L[i][k]^2, k<i))
        L[i][j] = Math.sqrt(A[i][i] - dot)
      } else {
        // Off-diagonal: L[i][j] = (A[i][j] - dot) / L[j][j]
        L[i][j] = (A[i][j] - dot) / L[j][j]
      }
    }
  }

  return L
}

/**
 * Perform variant Cholesky (LDL^T) decomposition of a 3x3 symmetric matrix A.
 * Finds a unit lower triangular matrix L and a diagonal matrix D such that A = L * D * L^T.
 * Unlike classic Cholesky, only requires A to be symmetric — not necessarily positive definite.
 *
 * @param {number[][]} A - 3x3 symmetric matrix (row-major array of arrays)
 * @returns {{ L: number[][], D: number[] }} - Unit lower triangular L and diagonal D (as a 1D array)
 */
function variantCholesky(A) {
  const L = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]
  const D = [0, 0, 0]

  for (let j = 0; j < 3; j++) {
    // D[j] = A[j][j] - sum(D[k] * L[j][k]^2, k < j)
    D[j] =
      A[j][j] -
      Array.from({ length: j }, (_, k) => D[k] * L[j][k] ** 2).reduce((acc, v) => acc + v, 0)

    // L[i][j] = (A[i][j] - sum(D[k] * L[i][k] * L[j][k], k < j)) / D[j]  for i > j
    for (let i = j + 1; i < 3; i++) {
      const dot = Array.from({ length: j }, (_, k) => D[k] * L[i][k] * L[j][k]).reduce(
        (acc, v) => acc + v,
        0,
      )
      L[i][j] = (A[i][j] - dot) / D[j]
    }
  }

  return { L, D }
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

export {
  validateSymmetric,
  validatePositiveDefinite,
  classicCholesky,
  variantCholesky,
  printMatrix,
}
