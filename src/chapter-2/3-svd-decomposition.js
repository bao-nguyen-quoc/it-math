// Cho ma trận A kích thước 3*3. Thực hiện phân rã ma trận dùng SVD (Singular value decomposition)

import { diagonalize } from './2-matrix-diagonalization.js'
import { multiply, printMatrix, transpose, normalize, matvec } from './util.js'

/**
 * Perform Singular Value Decomposition of a 3x3 matrix A.
 * Finds U, Sigma, V such that A = U * Sigma * V^T, where:
 *   - V is orthogonal (columns = right singular vectors)
 *   - Sigma is diagonal (singular values in non-increasing order)
 *   - U is orthogonal (columns = left singular vectors)
 *
 * Algorithm:
 *  1. Compute B = A^T * A (symmetric, positive semi-definite).
 *  2. Diagonalize B = P * D * P^T to get eigenvalues (lambda_i) and eigenvectors.
 *  3. Normalize each eigenvector column of P -> columns of V.
 *  4. Singular values: sigma_i = sqrt(lambda_i).
 *  5. Left singular vectors: u_i = A * v_i / sigma_i.
 *
 * @param {number[][]} A - 3x3 matrix
 * @returns {{ U: number[][], Sigma: number[][], V: number[][] }}
 */
function svd(A) {
  // Step 1: B = A^T * A
  const B = multiply(transpose(A), A)

  // Step 2: Diagonalize B -> columns of P are eigenvectors, diagonal of D are eigenvalues
  const { P, D } = diagonalize(B)
  const lambdas = [D[0][0], D[1][1], D[2][2]]

  // Step 3: Normalize each eigenvector column of P -> columns of V
  const V_cols = [0, 1, 2].map((j) => normalize([P[0][j], P[1][j], P[2][j]]))

  // V: column j = V_cols[j]  ->  V[row][col] = V_cols[col][row]
  const V = [0, 1, 2].map((i) => V_cols.map((col) => col[i]))

  // Step 4: Singular values sigma_i = sqrt(lambda_i)
  const sigmas = lambdas.map((lam) => Math.sqrt(lam))

  // Step 5: Left singular vectors u_i = A * v_i / sigma_i
  const U_cols = [0, 1, 2].map((i) => normalize(matvec(A, V_cols[i])))

  // U: column j = U_cols[j]
  const U = [0, 1, 2].map((i) => U_cols.map((col) => col[i]))

  // Sigma: diagonal matrix
  const Sigma = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? sigmas[i] : 0)))

  return { U, Sigma, V }
}

/**
 * Print the result of SVD: U, Sigma, V^T.
 *
 * @param {{ U: number[][], Sigma: number[][], V: number[][] }} result
 */
function printSVD({ U, Sigma, V }) {
  const sigmas = [Sigma[0][0], Sigma[1][1], Sigma[2][2]]
  console.log('Singular values: ' + sigmas.map((v) => v.toFixed(4)).join(', '))
  printMatrix(U, 'U (left singular vectors as columns)')
  printMatrix(Sigma, 'Sigma (diagonal singular values)')
  printMatrix(transpose(V), 'V^T (right singular vectors as rows)')
}

export { svd, printSVD }
