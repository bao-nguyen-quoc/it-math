// Cho hàm số f(x) thoả mãn:
// - Là hàm phân số
// - Chứa hàm mũ
// - Chứa hàm siêu việt
// Tìm min của f(x) bằng phương pháp
// - Gradient descent
// - Gradient descent with momentum

import * as math from 'mathjs'

/**
 * Parse string f(x) to mathjs function
 * @param {string} expression - f(x) expression in string format
 * @returns {import('mathjs').MathNode} mathjs MathNode
 */
function parseExpression(expression) {
  return math.parse(expression)
}

/**
 * Convert mathjs MathNode to evaluate function
 * @param {import('mathjs').MathNode} node - mathjs MathNode
 * @returns {(x: number) => number} evaluate function
 */
function toEvaluateFunction(node) {
  const compiled = node.compile()
  return (x) => compiled.evaluate({ x })
}

/**
 * @typedef {object} DerivativeObj
 * @property {function(number): number} f - f(x)
 * @property {function(number): number} df - f'(x)
 * @property {function(number): number} d2f - f''(x)
 */

/**
 * Get f(x), f'(x), f''(x)
 * @param {string} expression - f(x) expression in string format
 * @returns {DerivativeObj} - object with f(x), f'(x), f''(x)
 */
function getEvaluateAndDerivatives(expression) {
  const node = parseExpression(expression)
  // f'(x)
  const derivative = math.derivative(node, 'x')
  // f''(x)
  const secondDerivative = math.derivative(derivative, 'x')
  return {
    f: toEvaluateFunction(node),
    df: toEvaluateFunction(derivative),
    d2f: toEvaluateFunction(secondDerivative),
  }
}

/**
 * Check if gradient has converged
 * @param {number} gradient - gradient value
 * @param {number} precision - precision
 * @returns {boolean} - true if gradient has converged, false otherwise
 */
function hasConverged(gradient, precision) {
  return math.abs(gradient) < precision
}

/**
 * Find min of f(x) by gradient descent method
 * @param {string} expression - f(x) expression in string format
 * @param {number} x0 - initial value of x
 * @param {number} alpha - alpha (step size, default 0.1)
 * @param {number} maxIterations - max iterations (default 10000)
 * @param {number} precision - precision (default 1e-6)
 * @returns {{x: number; value: number}} - x and value of f(x) at the local minimum
 */
function gradientDescent(expression, x0, alpha = 0.1, maxIterations = 10000, precision = 1e-6) {
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
  const { f, df } = getEvaluateAndDerivatives(expression)

  let x = x0
  for (let i = 0; i < maxIterations; i++) {
    const gradient = df(x)
    if (!isFinite(gradient)) {
      throw new Error(`Gradient diverged (NaN/Infinity) tại x = ${x}, iteration ${i}.`)
    }
    if (hasConverged(gradient, precision)) {
      return { x, value: f(x) }
    }
    x = x - alpha * gradient
  }
  return {
    x,
    value: f(x),
  }
}

/**
 * Find min of f(x) by gradient descent with momentum method
 * @param {string} expression - f(x) expression in string format
 * @param {number} x0 - initial value of x
 * @param {number} alpha - alpha (step size, default 0.1)
 * @param {number} maxIterations - max iterations (default 10000)
 * @param {number} precision - precision (default 1e-6)
 * @param {number} beta - beta (momentum factor, default 0.9)
 * @returns {{x: number; value: number}} - x and value of f(x) at the local minimum
 */
function gradientDescentWithMomentum(
  expression,
  x0,
  alpha = 0.1,
  maxIterations = 10000,
  precision = 1e-6,
  beta = 0.9,
) {
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
  if (beta < 0 || beta >= 1) {
    throw new RangeError('beta must be between 0 and 1 (exclusive of 1).')
  }
  const { f, df } = getEvaluateAndDerivatives(expression)

  let x = x0
  let deltaX = 0
  for (let i = 0; i < maxIterations; i++) {
    const gradient = df(x)
    if (!isFinite(gradient)) {
      throw new Error(`Gradient diverged (NaN/Infinity) tại x = ${x}, iteration ${i}.`)
    }
    if (hasConverged(gradient, precision)) {
      return { x, value: f(x) }
    }
    deltaX = beta * deltaX + alpha * gradient
    x = x - deltaX
  }
  return {
    x,
    value: f(x),
  }
}

export { getEvaluateAndDerivatives, gradientDescent, gradientDescentWithMomentum, hasConverged }
