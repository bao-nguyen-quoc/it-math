import { shoelaceFormula, pickTheorem } from 'chapter-3/2-area-of-convex-hull.js'
import { convexHull } from 'chapter-3/1-convex-hull.js'
import { describe, expect, it } from 'vitest'

describe('shoelaceFormula', () => {
  it('computes area of a right triangle', () => {
    // Triangle with vertices (0,0), (4,0), (0,3) → area = 6
    const hull = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ]
    expect(shoelaceFormula(hull)).toBe(6)
  })

  it('computes area of a unit square', () => {
    // CCW order: (0,0) → (1,0) → (1,1) → (0,1)
    const hull = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    expect(shoelaceFormula(hull)).toBe(1)
  })

  it('computes area of a larger square', () => {
    // 4×4 square → area = 16
    const hull = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ]
    expect(shoelaceFormula(hull)).toBe(16)
  })

  it('works with CW vertex order (absolute value)', () => {
    // CW order: (0,0) → (0,3) → (4,0)
    const hull = [
      { x: 0, y: 0 },
      { x: 0, y: 3 },
      { x: 4, y: 0 },
    ]
    expect(shoelaceFormula(hull)).toBe(6)
  })

  it('computes area for an irregular polygon', () => {
    // Pentagon: (0,0), (4,0), (5,3), (2,5), (0,3)
    const hull = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 3 },
      { x: 2, y: 5 },
      { x: 0, y: 3 },
    ]
    expect(shoelaceFormula(hull)).toBe(18.5)
  })
})

describe('pickTheorem', () => {
  it('computes area of a right triangle', () => {
    // Triangle (0,0), (4,0), (0,3) → area = 6
    const hull = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ]
    expect(pickTheorem(hull)).toBe(6)
  })

  it('computes area of a unit square', () => {
    const hull = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    expect(pickTheorem(hull)).toBe(1)
  })

  it('computes area of a 4x4 square', () => {
    const hull = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ]
    expect(pickTheorem(hull)).toBe(16)
  })

  it('throws for non-integer coordinates', () => {
    const hull = [
      { x: 0, y: 0 },
      { x: 1.5, y: 0 },
      { x: 0, y: 1.5 },
    ]
    expect(() => pickTheorem(hull)).toThrow("Pick's theorem requires integer coordinates")
  })
})

describe('shoelace vs pick cross-verification', () => {
  it('both methods agree on the 15-point dataset', () => {
    const inputPoints = [
      { x: 1, y: 1 },
      { x: 2, y: 5 },
      { x: 3, y: 3 },
      { x: 5, y: 3 },
      { x: 3, y: 1 },
      { x: 7, y: 7 },
      { x: 4, y: 6 },
      { x: 8, y: 2 },
      { x: 6, y: 5 },
      { x: 2, y: 2 },
      { x: 5, y: 8 },
      { x: 9, y: 4 },
      { x: 1, y: 6 },
      { x: 7, y: 1 },
      { x: 4, y: 4 },
    ]
    const hull = convexHull(inputPoints)

    const areaShoelace = shoelaceFormula(hull)
    const areaPick = pickTheorem(hull)

    expect(areaShoelace).toBe(areaPick)
  })

  it('both methods agree on a simple triangle', () => {
    const hull = [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 4 },
    ]

    const areaShoelace = shoelaceFormula(hull)
    const areaPick = pickTheorem(hull)

    expect(areaShoelace).toBe(12)
    expect(areaPick).toBe(12)
  })

  it('both methods agree on a 4x4 square', () => {
    const hull = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ]

    const areaShoelace = shoelaceFormula(hull)
    const areaPick = pickTheorem(hull)

    expect(areaShoelace).toBe(16)
    expect(areaPick).toBe(16)
  })
})
