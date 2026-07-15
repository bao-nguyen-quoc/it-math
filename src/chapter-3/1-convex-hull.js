// Cho tập hợp 15 điểm trong không gian 2D. Viết chương trình xác định đường bao lồi.

/**
 * Compute the 2D cross product of vectors OA and OB.
 * > 0: counter-clockwise (left turn)
 * = 0: collinear
 * < 0: clockwise (right turn)
 *
 * @param {{ x: number, y: number }} O
 * @param {{ x: number, y: number }} A
 * @param {{ x: number, y: number }} B
 * @returns {number}
 */
function cross(O, A, B) {
  return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)
}

/**
 * Compute the convex hull of a set of 2D points using Andrew's Monotone Chain algorithm.
 * Points collinear with hull edges are excluded (strict convex hull).
 *
 * Algorithm:
 *  1. Sort points lexicographically (by x, then by y).
 *  2. Build the lower hull left-to-right, discarding right turns (cross <= 0).
 *  3. Build the upper hull right-to-left, discarding right turns (cross <= 0).
 *  4. Concatenate, removing duplicate endpoints.
 *
 * @param {{ x: number, y: number }[]} points - array of 2D points
 * @returns {{ x: number, y: number }[]} vertices of the convex hull in counter-clockwise order
 */
function convexHull(points) {
  const n = points.length
  if (n < 3) return [...points]

  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y)

  // Lower hull: left to right
  const lower = []
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop()
    }
    lower.push(p)
  }

  // Upper hull: right to left
  const upper = []
  for (let i = n - 1; i >= 0; i--) {
    const p = sorted[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop()
    }
    upper.push(p)
  }

  // Remove last point of each half (duplicates of first point of the other)
  lower.pop()
  upper.pop()

  return [...lower, ...upper]
}

/**
 * Print the convex hull vertices to the console.
 *
 * @param {{ x: number, y: number }[]} hull - convex hull vertices in counter-clockwise order
 */
function printHull(hull) {
  console.log(`Convex hull (${hull.length} vertices, counter-clockwise order):`)
  hull.forEach((p, i) => {
    console.log(`  [${i}] (${p.x}, ${p.y})`)
  })
}

export { convexHull, printHull }
