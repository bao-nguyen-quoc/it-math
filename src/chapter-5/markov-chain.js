// Cho 1 hệ thống có 4 trạng thái 1 - 4
// - Xác định ma trận chuyển trạng thái P
// - Giả sử hệ thống bắt đầu ở trạng thái 3 tại thời điểm t=0,
// tính xác suất hệ thống hoạt động ở trạng thái 1 sau 1, 2, và 3 bước thời gian

/**
 * Multiply two matrices A (mxn) and B (nxp).
 * @param {number[][]} A
 * @param {number[][]} B
 * @returns {number[][]}
 */
function matMul(A, B) {
  return Array.from({ length: A.length }, (_, i) =>
    Array.from({ length: B[0].length }, (_, j) =>
      A[i].reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0),
    ),
  )
}

/**
 * Raise a square matrix to the power of exp (binary exponentiation).
 * @param {number[][]} M
 * @param {number} exp - Non-negative integer
 * @returns {number[][]}
 */
function matPow(M, exp) {
  const n = M.length
  let result = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  )
  let base = M.map((row) => [...row])

  while (exp > 0) {
    if (exp % 2 === 1) result = matMul(result, base)
    base = matMul(base, base)
    exp = Math.floor(exp / 2)
  }

  return result
}

/**
 * Multiply a row vector by a matrix: vec * mat.
 * @param {number[]} vec
 * @param {number[][]} mat
 * @returns {number[]}
 */
function vecMatMul(vec, mat) {
  return mat[0].map((_, j) => vec.reduce((sum, v, i) => sum + v * mat[i][j], 0))
}

/**
 * Validate that P is a stochastic transition matrix.
 * @param {number[][]} P
 * @param {number} [tolerance=1e-9]
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateTransitionMatrix(P, tolerance = 1e-9) {
  const errors = []
  const n = P.length

  for (let i = 0; i < n; i++) {
    if (P[i].length !== n) errors.push(`Row ${i + 1} has ${P[i].length} columns, expected ${n}`)

    for (let j = 0; j < P[i].length; j++)
      if (P[i][j] < 0 || P[i][j] > 1)
        errors.push(`P[${i + 1}][${j + 1}] = ${P[i][j]} is outside [0, 1]`)

    const rowSum = P[i].reduce((s, v) => s + v, 0)
    if (Math.abs(rowSum - 1) > tolerance)
      errors.push(`Row ${i + 1} sums to ${rowSum.toFixed(6)}, expected 1`)
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Compute the state distribution vector after each step from a starting state.
 * Uses matrix exponentiation: pi_n = pi_0 * P^n
 *
 * @param {number[][]} P - Transition matrix
 * @param {number} startState - Starting state (1-indexed)
 * @param {number} steps
 * @returns {{ step: number, pi: number[] }[]}
 */
function computeStateDistributions(P, startState, steps) {
  const pi0 = Array(P.length).fill(0)
  pi0[startState - 1] = 1

  return Array.from({ length: steps }, (_, k) => {
    const pi = vecMatMul(pi0, matPow(P, k + 1))
    return { step: k + 1, pi }
  })
}

export { validateTransitionMatrix, computeStateDistributions }
