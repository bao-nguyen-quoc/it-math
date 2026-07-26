import fs from 'fs'
import path from 'path'

const WIDTH = 640
const HEIGHT = 640
const CX = WIDTH / 2
const CY = HEIGHT / 2
const ORBIT_R = 200 // distance from center to node centers
const NODE_R = 28 // node circle radius
const CURVE = 40 // curvature of edges between different nodes

/**
 * Compute (x, y) for node i in a regular polygon layout, top-first.
 * @param {number} i
 * @param {number} n
 * @returns {{ x: number, y: number }}
 */
function nodePosition(i, n) {
  const angle = (2 * Math.PI * i) / n - Math.PI / 2
  return {
    x: CX + ORBIT_R * Math.cos(angle),
    y: CY + ORBIT_R * Math.sin(angle),
  }
}

/**
 * SVG path + label position for a curved edge between two different nodes.
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @returns {{ path: string, lx: number, ly: number }}
 */
function edgePath(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / dist
  const uy = dy / dist

  // start/end points on node circumference
  const sx = from.x + ux * NODE_R
  const sy = from.y + uy * NODE_R
  const ex = to.x - ux * NODE_R
  const ey = to.y - uy * NODE_R

  // quadratic bezier control point — offset perpendicular for curve
  const mx = (sx + ex) / 2 - uy * CURVE
  const my = (sy + ey) / 2 + ux * CURVE

  return { path: `M${sx},${sy} Q${mx},${my} ${ex},${ey}`, lx: mx, ly: my }
}

/**
 * SVG path + label position for a self-loop on node i.
 * Loop extends outward from the center.
 * @param {{ x: number, y: number }} node
 * @param {number} i
 * @param {number} n
 * @returns {{ path: string, lx: number, ly: number }}
 */
function selfLoopPath(node, i, n) {
  const angle = (2 * Math.PI * i) / n - Math.PI / 2

  // outward unit vector
  const ox = Math.cos(angle)
  const oy = Math.sin(angle)

  // perpendicular unit vector
  const px = -oy
  const py = ox

  // two anchor points on node circumference, slightly offset
  const a1x = node.x + px * NODE_R
  const a1y = node.y + py * NODE_R
  const a2x = node.x - px * NODE_R
  const a2y = node.y - py * NODE_R

  // control points bulging outward
  const bulge = 70
  const c1x = a1x + ox * bulge
  const c1y = a1y + oy * bulge
  const c2x = a2x + ox * bulge
  const c2y = a2y + oy * bulge

  // label at the tip of the loop, clamped inside viewport
  const margin = 20
  const lx = Math.min(Math.max(node.x + ox * (NODE_R + bulge + 16), margin), WIDTH - margin)
  const ly = Math.min(Math.max(node.y + oy * (NODE_R + bulge + 16), margin), HEIGHT - margin)

  return {
    path: `M${a1x},${a1y} C${c1x},${c1y} ${c2x},${c2y} ${a2x},${a2y}`,
    lx,
    ly,
  }
}

/**
 * Generate an SVG string for the given Markov chain transition matrix.
 * @param {number[][]} P
 * @param {string} [title='Markov Chain']
 * @returns {string}
 */
function generateMarkovSVG(P, title = 'Markov Chain') {
  const n = P.length
  const nodes = Array.from({ length: n }, (_, i) => ({
    ...nodePosition(i, n),
    label: `S${i + 1}`,
  }))

  const defs = `
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
      </marker>
    </defs>`

  let edges = ''
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const p = P[i][j]
      if (p === 0) continue

      const { path, lx, ly } = i === j ? selfLoopPath(nodes[i], i, n) : edgePath(nodes[i], nodes[j])

      edges += `<path d="${path}" fill="none" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>`
      edges += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#c0392b">${p.toFixed(2)}</text>`
    }
  }

  const nodesSvg = nodes
    .map(
      (nd) =>
        `<circle cx="${nd.x.toFixed(1)}" cy="${nd.y.toFixed(1)}" r="${NODE_R}" fill="#2980b9" stroke="#1a5276" stroke-width="2"/>` +
        `<text x="${nd.x.toFixed(1)}" y="${nd.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="bold" fill="white">${nd.label}</text>`,
    )
    .join('')

  const titleSvg = `<text x="${CX}" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">${title}</text>`

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" style="background:#f9f9f9">`,
    defs,
    edges,
    nodesSvg,
    titleSvg,
    `</svg>`,
  ].join('\n')
}

/**
 * Write the Markov chain graph to an SVG file, overwriting if it exists.
 * @param {number[][]} P
 * @param {string} outputPath
 * @param {string} [title]
 */
function exportMarkovGraph(P, outputPath, title) {
  const svg = generateMarkovSVG(P, title)
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(outputPath, svg, 'utf-8')
}

export { exportMarkovGraph, generateMarkovSVG }
