import { augmentedLagrangeMethod } from 'chapter-4/augmented-lagrange-method.js'
import { describe, expect, it } from 'vitest'

describe('augmentedLagrangeMethod', () => {
  it('finds constrained minimum of x1^2+x2^2 subject to x1+x2-1=0', () => {
    // min f = x1^2 + x2^2 subject to x1 + x2 = 1
    // Analytical solution: x1 = 0.5, x2 = 0.5, f = 0.5
    const fExpr = 'x1^2 + x2^2'
    const hExpr = 'x1 + x2 - 1'
    const x0 = [0, 0]

    const { iterations, solution } = augmentedLagrangeMethod(fExpr, hExpr, x0, {
      lambda0: 0,
      r: 1,
      maxOuterIter: 20,
      precision: 1e-6,
    })

    // Should have at least one iteration
    expect(iterations.length).toBeGreaterThanOrEqual(1)

    // The constraint h(x*) should be satisfied (close to 0)
    expect(solution.hValue).toBeCloseTo(0, 4)

    // The solution should be x1 = x2 = 0.5
    expect(solution.x1).toBeCloseTo(0.5, 3)
    expect(solution.x2).toBeCloseTo(0.5, 3)

    // f(x*) = 0.5
    expect(solution.fValue).toBeCloseTo(0.5, 3)
  })
})
