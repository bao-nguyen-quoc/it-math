// Cho ma trận A kích thước 3*3, thực hiện chéo hóa ma trận

import { det3, printMatrix } from './util.js'

/**
 * Solve a monic cubic equation of the form lambda^3 + a*lambda^2 + b*lambda + c = 0.
 * Uses the trigonometric method for the three-real-roots case (casus irreducibilis).
 * Returns only real roots.
 *
 * @param {number} a - coefficient of lambda^2
 * @param {number} b - coefficient of lambda
 * @param {number} c - constant term
 * @returns {number[]} array of distinct real roots
 */
function solveMonicCubic(a, b, c) {
  // Depress: substitute lambda = t - a/3  ->  t^3 + pt + q = 0
  const p = b - (a * a) / 3
  const q = (2 * a ** 3) / 27 - (a * b) / 3 + c
  const disc = (q * q) / 4 + p ** 3 / 27
  const shift = -a / 3

  if (disc > 1e-9) {
    // One real root, two complex conjugates
    const sqrtDisc = Math.sqrt(disc)
    const u = Math.cbrt(-q / 2 + sqrtDisc)
    const v = Math.cbrt(-q / 2 - sqrtDisc)
    return [shift + u + v]
  } else if (disc < -1e-9) {
    // Three distinct real roots
    const r = Math.sqrt((-p) ** 3 / 27)
    const theta = Math.acos(-q / (2 * r))
    const m = 2 * Math.cbrt(r)
    return [
      shift + m * Math.cos(theta / 3),
      shift + m * Math.cos((theta + 2 * Math.PI) / 3),
      shift + m * Math.cos((theta + 4 * Math.PI) / 3),
    ]
  } else {
    // Repeated root
    const u = Math.cbrt(-q / 2)
    // shift + 2u is the simple root; shift - u is the double root
    return [shift + 2 * u, shift - u]
  }
}

/**
 * Compute the eigenvalues of a 3x3 matrix by solving its characteristic polynomial
 * det(A - lambda*I) = 0, which expands to: -lambda^3 + tr(A)*lambda^2 - (sum of 2x2 principal minors)*lambda + det(A) = 0
 * Equivalently: lambda^3 - tr(A)*lambda^2 + M2*lambda - det(A) = 0, a monic cubic in lambda.
 *
 * @param {number[][]} A - 3x3 matrix
 * @returns {number[]} array of real eigenvalues (1 or 3 values)
 */
function eigenvalues(A) {
  const a = -(A[0][0] + A[1][1] + A[2][2]) // -tr(A)
  const b = // sum of 2x2 principal minors
    A[0][0] * A[1][1] -
    A[0][1] * A[1][0] +
    A[0][0] * A[2][2] -
    A[0][2] * A[2][0] +
    A[1][1] * A[2][2] -
    A[1][2] * A[2][1]
  const c = -det3(A) // -det(A)

  return solveMonicCubic(a, b, c)
}

/**
 * Compute the null space (kernel) of a 3x3 matrix using Gaussian elimination.
 * Returns the basis vectors of ker(M), i.e. all x such that M*x = 0.
 *
 * @param {number[][]} M - 3x3 matrix
 * @returns {number[][]} array of basis vectors (each vector is a number[3])
 */
function nullspace(M) {
  const EPS = 1e-9

  // Work on a copy with augmented-style row reduction (no RHS needed, just track columns)
  const R = M.map((row) => [...row])
  const pivotCol = [] // which column holds the pivot for each row

  let row = 0
  for (let col = 0; col < 3 && row < 3; col++) {
    // Find pivot in this column at or below current row
    let maxRow = row
    for (let r = row + 1; r < 3; r++) {
      if (Math.abs(R[r][col]) > Math.abs(R[maxRow][col])) maxRow = r
    }
    if (Math.abs(R[maxRow][col]) < EPS)
      continue // no pivot here -> free variable
      // Swap
    ;[R[row], R[maxRow]] = [R[maxRow], R[row]]

    // Eliminate all other rows (full RREF)
    const scale = R[row][col]
    R[row] = R[row].map((v) => v / scale)
    for (let r = 0; r < 3; r++) {
      if (r !== row) {
        const factor = R[r][col]
        R[r] = R[r].map((v, k) => v - factor * R[row][k])
      }
    }

    pivotCol.push(col)
    row++
  }

  // Free variables: columns not in pivotCol
  const allCols = [0, 1, 2]
  const freeCols = allCols.filter((c) => !pivotCol.includes(c))

  // Build one basis vector per free variable
  return freeCols.map((fc) => {
    const vec = [0, 0, 0]
    vec[fc] = 1
    // For each pivot row, the pivot variable = -R[pivotRow][fc]
    pivotCol.forEach((pc, pivotRow) => {
      vec[pc] = -R[pivotRow][fc]
    })
    return vec
  })
}

/**
 * Subtract lambda from the diagonal of A, producing (A - lambda*I).
 *
 * @param {number[][]} A - 3x3 matrix
 * @param {number} lambda - scalar
 * @returns {number[][]} A - lambda*I
 */
function shiftDiag(A, lambda) {
  return A.map((row, i) => row.map((v, j) => (i === j ? v - lambda : v)))
}

/**
 * Diagonalize a 3x3 matrix A, finding invertible P and diagonal D such that A = P*D*P^(-1).
 *
 * Algorithm:
 *  1. Find eigenvalues by solving the characteristic polynomial.
 *  2. For each eigenvalue lambda_i, compute ker(A - lambda_i*I) to get eigenvectors.
 *  3. Verify that exactly 3 linearly independent eigenvectors exist.
 *  4. Return P (columns = eigenvectors) and D (diagonal = eigenvalues).
 *
 * Throws if A is not diagonalizable over R (complex eigenvalues or deficient eigenspace).
 *
 * @param {number[][]} A - 3x3 matrix
 * @returns {{ P: number[][], D: number[][] }} P is the modal matrix, D is the diagonal matrix
 */
function diagonalize(A) {
  const lambdas = eigenvalues(A)

  if (lambdas.length === 1) {
    throw new Error(
      `Matrix is not diagonalizable over R: characteristic polynomial has complex roots (only 1 real eigenvalue lambda=${lambdas[0].toFixed(4)}).`,
    )
  }

  // Collect eigenvectors for each distinct eigenvalue
  const eigenvectorColumns = [] // will hold up to 3 vectors
  const eigenvalueEntries = [] // parallel array: which lambda each vector belongs to

  const EPS = 1e-6
  const seen = []
  for (const lambda of lambdas) {
    // Skip near-duplicate eigenvalues (already processed)
    if (seen.some((s) => Math.abs(s - lambda) < EPS)) continue
    seen.push(lambda)

    const basis = nullspace(shiftDiag(A, lambda))

    if (basis.length === 0) {
      throw new Error(
        `Matrix is not diagonalizable: eigenspace for lambda=${lambda.toFixed(4)} is empty (numerical error).`,
      )
    }

    for (const v of basis) {
      eigenvectorColumns.push(v)
      eigenvalueEntries.push(lambda)
    }
  }

  if (eigenvectorColumns.length < 3) {
    throw new Error(
      `Matrix is not diagonalizable over R: only ${eigenvectorColumns.length} linearly independent eigenvector(s) found, need 3.`,
    )
  }

  // P: columns are eigenvectors -> P[row][col] = eigenvectorColumns[col][row]
  const P = [0, 1, 2].map((i) => eigenvectorColumns.map((v) => v[i]))

  // D: diagonal matrix of eigenvalues in matching order
  const D = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? eigenvalueEntries[i] : 0)))

  return { P, D }
}

/**
 * Print the result of diagonalization: eigenvalues, P, and D.
 *
 * @param {{ P: number[][], D: number[][] }} result
 */
function printDiagonalization({ P, D }) {
  const lambdas = [D[0][0], D[1][1], D[2][2]]
  console.log('Eigenvalues: ' + lambdas.map((v) => v.toFixed(2)).join(', '))
  printMatrix(P, 'P (eigenvectors as columns)')
  printMatrix(D, 'D (diagonal)')
}

export { diagonalize, printDiagonalization }
