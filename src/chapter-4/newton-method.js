// Cho hàm số f(x) thoả mãn:
// - Là hàm phân số
// - Chứa hàm mũ
// - Chứa hàm siêu việt
// Tìm min của f(x) bằng phương pháp
// - Newton

import { getEvaluateAndDerivatives, hasConverged } from './gradient-descent.js'

/**
 * Find min of f(x) by Newton's method
 * @param {string} expression - f(x) expression in string format
 * @param {number} x0 - initial value of x
 * @param {number} alpha - alpha (step size, default 1)
 * @param {number} maxIterations - max iterations (default 1000)
 * @param {number} precision - precision (default 1e-6)
 * @returns {{x: number; value: number}} - x and value of f(x) at the local minimum
 */
function newtonMethod(expression, x0, alpha = 1, maxIterations = 1000, precision = 1e-6) {
  if (typeof expression !== 'string' || expression.trim() === '') {
    throw new TypeError('expression must be a non-empty string.')
  }
  if (typeof x0 !== 'number' || !isFinite(x0)) {
    throw new TypeError('x0 must be a finite number.')
  }
  if (alpha <= 0) {
    throw new RangeError('alpha must be positive.')
  }
  if (maxIterations < 1 || !Number.isInteger(maxIterations)) {
    throw new RangeError('maxIterations must be a positive integer.')
  }
  if (precision <= 0) {
    throw new RangeError('precision must be positive.')
  }

  const { f, df, d2f } = getEvaluateAndDerivatives(expression)

  let x = x0
  for (let i = 0; i < maxIterations; i++) {
    const gradient = df(x)
    const hessian = d2f(x)

    if (!isFinite(gradient)) {
      throw new Error(`Gradient diverged (NaN/Infinity) tại x = ${x}, iteration ${i}.`)
    }
    if (!isFinite(hessian)) {
      throw new Error(`Hessian diverged (NaN/Infinity) tại x = ${x}, iteration ${i}.`)
    }

    if (hasConverged(gradient, precision)) {
      return { x, value: f(x) }
    }

    x = x - (alpha * gradient) / hessian
  }
  return { x, value: f(x) }
}

export { newtonMethod }
