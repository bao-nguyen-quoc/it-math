import { convexHull } from 'chapter-3/1-convex-hull.js'
import { describe, expect, it } from 'vitest'

describe('convex hull', () => {
  it('returns all points when fewer than 3', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]
    const hull = convexHull(points)
    expect(hull).toHaveLength(2)
  })

  it('returns a triangle for 3 non-collinear points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 3 },
    ]
    const hull = convexHull(points)
    expect(hull).toHaveLength(3)
  })

  it('excludes interior points', () => {
    // Square with a point inside
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
      { x: 2, y: 2 }, // interior
    ]
    const hull = convexHull(points)
    expect(hull).toHaveLength(4)
    // Interior point should not appear on hull
    const hasInterior = hull.some((p) => p.x === 2 && p.y === 2)
    expect(hasInterior).toBe(false)
  })

  it('excludes collinear points on hull edges', () => {
    // Triangle with a collinear point on one edge
    const points = [
      { x: 0, y: 0 },
      { x: 2, y: 0 }, // collinear on bottom edge
      { x: 4, y: 0 },
      { x: 2, y: 3 },
    ]
    const hull = convexHull(points)
    expect(hull).toHaveLength(3)
    // (2,0) is collinear and should be excluded from strict hull
    const hasCollinear = hull.some((p) => p.x === 2 && p.y === 0)
    expect(hasCollinear).toBe(false)
  })

  it('computes the hull for 15 points', () => {
    const points = [
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
    const hull = convexHull(points)

    // Verify hull vertices are a subset of input
    for (const hp of hull) {
      const found = points.some((p) => p.x === hp.x && p.y === hp.y)
      expect(found).toBe(true)
    }

    // Expected hull vertices (CCW from bottom-left after Andrew's algorithm)
    const expectedHull = [
      { x: 1, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 2 },
      { x: 9, y: 4 },
      { x: 7, y: 7 },
      { x: 5, y: 8 },
      { x: 1, y: 6 },
    ]
    expect(hull).toHaveLength(expectedHull.length)
    expect(hull).toEqual(expectedHull)
  })

  it('handles all collinear points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ]
    const hull = convexHull(points)
    // Strict hull: only endpoints remain
    expect(hull).toHaveLength(2)
    expect(hull).toContainEqual({ x: 0, y: 0 })
    expect(hull).toContainEqual({ x: 3, y: 3 })
  })
})
