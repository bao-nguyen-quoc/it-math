// Cho tập hợp 15 điểm trong không gian 2D. Viết chương trình tính diện tích đường bao lồi bằng 2 cách.
// Cách 1: Shoelace formula, cách tính thông thường
// Cách 2: Pick's theorem, áp dụng khi các điểm có toạ độ số nguyên.

import { gcdByEuclid } from '../chapter-1/8-gcd-lcm.js'

/**
 * Check whether every point in an array has integer x and y coordinates.
 *
 * @param {{ x: number, y: number }[]} points
 * @returns {boolean}
 */
function areAllCoordinatesInteger(points) {
  return points.every(({ x, y }) => Number.isInteger(x) && Number.isInteger(y))
}

/**
 * Compute the area of a polygon using the Shoelace formula (Gauss's area formula).
 *   A = (1/2) * |sum_{i=0}^{n-1} (x_i * y_{i+1} - x_{i+1} * y_i)|
 * Works for any simple polygon given vertices in CCW or CW order.
 *
 * @param {{ x: number, y: number }[]} hull - convex hull vertices in CCW order
 * @returns {number} area of the polygon
 */
function shoelaceFormula(hull) {
  const n = hull.length
  const twice = Array.from({ length: n }, (_, i) => {
    const cur = hull[i]
    const nxt = hull[(i + 1) % n]
    return cur.x * nxt.y - nxt.x * cur.y
  }).reduce((acc, v) => acc + v, 0)

  return Math.abs(twice) / 2
}

/**
 * Check whether a point P is strictly inside a convex polygon (hull in CCW order).
 * Uses the cross-product test: P is interior iff cross(edge, P) > 0 for every edge.
 *
 * @param {{ x: number, y: number }[]} hull - convex hull vertices in CCW order
 * @param {{ x: number, y: number }} p - the point to test
 * @returns {boolean} true if p is strictly inside the hull
 */
function isInterior(hull, p) {
  const n = hull.length
  return hull.every((cur, i) => {
    const nxt = hull[(i + 1) % n]
    return (nxt.x - cur.x) * (p.y - cur.y) - (nxt.y - cur.y) * (p.x - cur.x) > 0
  })
}

/**
 * Compute the area of a polygon using Pick's theorem:
 *   A = i + B/2 - 1
 * where:
 *   i = number of interior lattice points (integer coordinate points strictly inside the hull)
 *   B = number of boundary lattice points (counted via gcd on each hull edge)
 *
 * Enumerates all integer lattice points in the hull's bounding box,
 * then classifies each as interior or boundary.
 * Throws if any hull vertex has non-integer coordinates.
 *
 * @param {{ x: number, y: number }[]} hull - convex hull vertices in CCW order
 * @returns {number} area of the polygon
 */
function pickTheorem(hull) {
  if (!areAllCoordinatesInteger(hull)) {
    throw new Error("Pick's theorem requires integer coordinates for all hull vertices.")
  }

  const n = hull.length

  // B: boundary lattice points – for each edge, gcd(|dx|, |dy|) gives the count
  const B = Array.from({ length: n }, (_, i) => {
    const cur = hull[i]
    const nxt = hull[(i + 1) % n]
    return gcdByEuclid(Math.abs(nxt.x - cur.x), Math.abs(nxt.y - cur.y))
  }).reduce((acc, v) => acc + v, 0)

  // i: enumerate all lattice points in the bounding box, keep those strictly inside the hull.
  const xs = hull.map((p) => p.x)
  const ys = hull.map((p) => p.y)
  const xMin = Math.min(...xs),
    xMax = Math.max(...xs)
  const yMin = Math.min(...ys),
    yMax = Math.max(...ys)

  let i = 0
  for (let x = xMin; x <= xMax; x++)
    for (let y = yMin; y <= yMax; y++) if (isInterior(hull, { x, y })) i++

  return i + B / 2 - 1
}

export { shoelaceFormula, pickTheorem }
