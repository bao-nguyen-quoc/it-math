// Cho ma trận A kích thước 3x3, thực hiện chéo hóa ma trận

import { eigs } from 'mathjs'

/**
 * Diagonalize a 3x3 matrix A, finding invertible P and diagonal D
 * such that A = P * D * P^(-1).
 *
 * Uses mathjs `eigs` to compute eigenvalues and eigenvectors,
 * filtering out complex eigenvectors to keep only real ones.
 *
 * @param {number[][]} A - 3x3 matrix
 * @returns {{ P: number[][], D: number[][] }}
 * @throws if A is not diagonalizable over R (too few real eigenvectors)
 */
function diagonalize(A) {
  // eigs returns { values: number[], eigenvectors: { value, vector }[] }
  // vectors may include complex eigenvectors; keep only real ones
  const { eigenvectors: allEigenvectors } = eigs(A)
  const eigenvectors = allEigenvectors.filter((e) => typeof e.value === 'number')

  if (eigenvectors.length < 3) {
    throw new Error(
      `Matrix is not diagonalizable over R: only ${eigenvectors.length} real eigenvector(s) found, need 3.`,
    )
  }

  // P: each eigenvector becomes one column -> P[row][col] = eigenvectors[col].vector[row]
  const P = [0, 1, 2].map((i) => eigenvectors.map((e) => e.vector[i]))

  // D: diagonal entries are the matching eigenvalues
  const D = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? eigenvectors[i].value : 0)))

  return { P, D }
}

/**
 * Print eigenvalues, P, and D to the console.
 *
 * @param {{ P: number[][], D: number[][] }} result
 */
function printDiagonalization({ P, D }) {
  const fmt = (v) => v.toFixed(2)
  const fmtRow = (row) => row.map(fmt).join('\t')

  console.log('Eigenvalues:', [D[0][0], D[1][1], D[2][2]].map(fmt).join(', '))
  console.log('\nP (eigenvectors as columns):')
  P.forEach((row) => console.log(' ', fmtRow(row)))
  console.log('\nD (diagonal):')
  D.forEach((row) => console.log(' ', fmtRow(row)))
}

export { diagonalize, printDiagonalization }

/**
 * Trong trường hợp giải tay cho ma trận kích thước 3x3:
 *
 * Bước 1: Tìm trị riêng (lambda)
 *
 * Phương trình đặc trưng: det(A - lambda*I) = 0
 *
 * Phương trình trên sẽ mở rộng thành:
 *
 * > (lambda^3) - trace(A)*lambda^2 + M2*lambda - det(A) = 0
 *
 * Trong đó:
 *
 * > trace(A) = a11 + a22 + a33
 * > M2 = a11*a22 + a11*a33 + a22*a33 - a12*a21 - a13*a31 - a23*a32
 * > det(A): định thức ma trận A
 *
 * Giải phương trình trên tìm các trị riêng.
 *
 * Bước 2: Tìm vector riêng tương ứng với mỗi trị riêng
 *
 * Phương trình: (A - lambda*I) * x = 0
 *
 * Giải hệ phương trình tuyến tính trên tìm vector riêng.
 *
 * Bước 3: Xây dựng ma trận chéo D
 *
 * > D = [lambda1, 0, 0]
 * >     [0, lambda2, 0]
 * >     [0, 0, lambda3]
 *
 * Bước 4: Xây dựng ma trận chéo hóa P
 *
 * Ma trận P được xây dựng bằng cách ghép các vector riêng thành các "cột":
 *
 * > P = [v1, v2, v3]
 *
 * Với v1, v2, v3 là các vector riêng tương ứng với các trị riêng lambda1, lambda2, lambda3.
 */
