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

export { det2, det3, printMatrix }
