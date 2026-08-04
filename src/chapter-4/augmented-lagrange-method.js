// Hiện thực hoá bài toán quy hoạch không tuyến tính
// Phương pháp lựa chọn: Augmented Lagrange Multiplier method

import * as math from 'mathjs'
import { newtonMethod } from './newton-method.js'

/**
 * Evaluate the expression
 * @param {string} expr - The expression to evaluate
 * @param {number} x1 - The value of x1
 * @param {number} x2 - The value of x2
 * @returns {number} The result of the evaluation
 */
function evaluate(expr, x1, x2) {
  return math.evaluate(expr, { x1, x2 })
}

/**
 * Build Augmented Lagrange function
 * @param {string} fExpr - Objective function expression in string format
 * @param {string} hExpr - Constraint function expression in string format
 * @param {number} lambda - Lagrange multiplier
 * @param {number} r - Penalty coefficient
 * @returns {string} The Augmented Lagrange function expression in string format
 */
function buildAugLagrangian(fExpr, hExpr, lambda, r) {
  return `(${fExpr}) + (${lambda}) * (${hExpr}) + (${r}) * (${hExpr})^2`
}

/**
 * Prepare expression for Newton method
 * 1. Substitude a variable with number value in expression
 * 2. Rename other variable to "x"
 * 3. Return new expression, ready to use in `newtonMethod`
 * @param {string} expr - The expression
 * @param {string} fixedVar - The name of fixed variable
 * @param {number} fixedVal - The value of fixed variable
 * @param {string} freeVar - The name of free variable
 * @returns {string} The new expression, ready to use in `newtonMethod`
 */
function prepareForNewton(expr, fixedVar, fixedVal, freeVar) {
  const node = math.parse(expr)
  const transformed = node.transform((n) => {
    if (n.isSymbolNode && n.name === fixedVar) {
      return new math.ConstantNode(fixedVal)
    }
    if (n.isSymbolNode && n.name === freeVar) {
      return new math.SymbolNode('x')
    }
    return n
  })
  return transformed.toString()
}

/**
 * @typedef CoordinateDescentOptions
 * @property {number} maxCoordIter - Max iterations for coordinate descent
 * @property {number} coordPrecision - Precision for coordinate descent
 * @property {number} newtonAlpha - Step size for Newton method
 * @property {number} newtonMaxIter - Max iterations for Newton method
 */

/**
 * Minimise L(x1, x2) using coordinate descent method.
 * @param {string} augExpr - Augmented Lagrange function
 * @param {number} x1Init - Initial value of x1
 * @param {number} x2Init - Initial value of x2
 * @param {CoordinateDescentOptions} opts - Options for coordinate descent
 * @returns {{x1: number, x2: number}} - The result of the minimisation
 */
function coordinateDescent(augExpr, x1Init, x2Init, opts = {}) {
  const { maxCoordIter = 200, coordPrecision = 1e-9, newtonAlpha = 1, newtonMaxIter = 1000 } = opts

  let x1 = x1Init
  let x2 = x2Init

  for (let i = 0; i < maxCoordIter; i++) {
    const x1Prev = x1
    const x2Prev = x2

    // Solve for x1
    const expr1 = prepareForNewton(augExpr, 'x2', x2, 'x1')
    x1 = newtonMethod(expr1, x1, newtonAlpha, newtonMaxIter).x

    // Solve for x2
    const expr2 = prepareForNewton(augExpr, 'x1', x1, 'x2')
    x2 = newtonMethod(expr2, x2, newtonAlpha, newtonMaxIter).x

    // Assert precision
    if (Math.abs(x1 - x1Prev) < coordPrecision && Math.abs(x2 - x2Prev) < coordPrecision) {
      break
    }
  }

  return { x1, x2 }
}

/**
 * @typedef AugmentedLagrangeIteration
 * @property {number} k - Iteration index (1-based)
 * @property {number} lambda - Value of lambda(k) in iteration
 * @property {number} r - Penalty coefficient
 * @property {number} x1 - Value of x1* found
 * @property {number} x2 - Value of x2* found
 * @property {number} hVal - h(x*) Constraint violation value
 */

/**
 * Find min of constrained problem using Augmented Lagrange Multiplier method
 * @param {string} fExpr - Objective function expression in string format
 * @param {string} hExpr - Constraint function expression in string format
 * @param {number[]} x0 - Initial values of variables (e.g. [1, 0.5])
 * @param {object} opts - Options for the method
 * @returns {AugmentedLagrangeIteration[]} - Array of iterations
 */
function augmentedLagrangeMethod(fExpr, hExpr, x0, opts = {}) {
  const {
    lambda0 = 0,
    r = 1,
    maxOuterIter = 20,
    precision = 1e-6,
    maxCoordIter = 200,
    coordPrecision = 1e-9,
    newtonAlpha = 1,
    newtonMaxIter = 1000,
  } = opts

  let lambda = lambda0
  let [x1, x2] = x0

  const iterations = []
  for (let k = 1; k <= maxOuterIter; k++) {
    const augExpr = buildAugLagrangian(fExpr, hExpr, lambda, r)
    const result = coordinateDescent(augExpr, x1, x2, {
      maxCoordIter,
      coordPrecision,
      newtonAlpha,
      newtonMaxIter,
    })
    x1 = result.x1
    x2 = result.x2

    const hVal = evaluate(hExpr, x1, x2)
    iterations.push({ k, lambda, r, x1, x2, hValue: hVal })
    if (Math.abs(hVal) < precision) break

    lambda = lambda + 2 * r * hVal
  }

  return {
    iterations,
    solution: {
      x1,
      x2,
      fValue: evaluate(fExpr, x1, x2),
      hValue: evaluate(hExpr, x1, x2),
    },
  }
}

/**
 * Print iteration table
 * @param {AugmentedLagrangeIteration[]} iterations - Array of iterations
 */
function printTable(iterations) {
  const pad = (s, n) => String(s).padStart(n)
  const fmt = (n) => n.toFixed(5)
  const W = 76
  const header = [
    pad('k', 4),
    pad('λ(k)', 12),
    pad('r_k', 10),
    pad('x1*(k)', 12),
    pad('x2*(k)', 12),
    pad('Value of h', 13),
  ].join('  ')

  console.log('\n' + '-'.repeat(W))
  console.log(header)
  console.log('-'.repeat(W))
  for (const it of iterations) {
    console.log(
      [
        pad(it.k, 4),
        pad(fmt(it.lambda), 12),
        pad(fmt(it.r), 10),
        pad(fmt(it.x1), 12),
        pad(fmt(it.x2), 12),
        pad(fmt(it.hValue), 13),
      ].join('  '),
    )
  }
  console.log('-'.repeat(W) + '\n')
}

/**
 * Render iteration table to HTML
 * @param {AugmentedLagrangeIteration[]} iterations - Array of iterations
 * @param {object} solution - Solution
 * @returns {string} HTML table
 */
function renderHTMLTable(iterations, solution) {
  const fmt = (n) => n.toFixed(5)
  const rows = iterations
    .map(
      (it) => `
    <tr>
      <td>${it.k}</td>
      <td>${fmt(it.lambda)}</td>
      <td>${fmt(it.r)}</td>
      <td>${fmt(it.x1)}</td>
      <td>${fmt(it.x2)}</td>
      <td class="${Math.abs(it.hValue) < 1e-4 ? 'converged' : ''}">${fmt(it.hValue)}</td>
    </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <title>Augmented Lagrangian Method</title>
  <style>
    body { font-family: 'Courier New', monospace; padding: 2rem; background: #f5f5f5; color: #111; }
    h2   { margin-bottom: 0.25rem; font-size: 1.3rem; }
    .subtitle { color: #555; font-size: 0.85rem; margin-bottom: 1.5rem; }
    table { border-collapse: collapse; width: 100%; max-width: 680px; }
    th, td { border: 1px solid #bbb; padding: 0.4rem 0.9rem; text-align: right; font-size: 0.88rem; }
    thead th { background: #1a1a2e; color: #e0e0e0; font-weight: normal; letter-spacing: 0.04em; }
    tr:nth-child(even) td { background: #ebebeb; }
    td.converged { color: #166534; font-weight: bold; }
    .solution { margin-top: 1.5rem; padding: 1rem 1.4rem; background: #fff;
                border: 1px solid #bbb; max-width: 680px; border-radius: 2px; }
    .solution h3 { margin: 0 0 0.6rem; font-size: 1rem; }
    .solution p  { margin: 0.2rem 0; font-size: 0.88rem; }
  </style>
</head>
<body>
  <h2>Augmented Lagrangian Method</h2>
  <p class="subtitle">Minimise f(x₁, x₂) &nbsp;·&nbsp; subject to h(x₁, x₂) = 0</p>
  <table>
    <thead>
      <tr>
        <th>k</th>
        <th>λ<sup>(k)</sup></th><th>r<sub>k</sub></th>
        <th>x₁*<sup>(k)</sup></th><th>x₂*<sup>(k)</sup></th>
        <th>Value of h</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="solution">
    <h3>Nghiệm tìm được</h3>
    <p>x₁* = ${fmt(solution.x1)}</p>
    <p>x₂* = ${fmt(solution.x2)}</p>
    <p>f(x*) = ${fmt(solution.fValue)}</p>
    <p>h(x*) = ${fmt(solution.hValue)}</p>
  </div>
</body>
</html>`
}

export { augmentedLagrangeMethod, printTable, renderHTMLTable }
