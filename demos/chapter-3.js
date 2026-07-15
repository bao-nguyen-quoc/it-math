import data from './chapter-3.input.json' with { type: 'json' }
import { convexHull, printHull } from '../src/chapter-3/1-convex-hull.js'
import { shoelaceFormula, pickTheorem } from '../src/chapter-3/2-area-of-convex-hull.js'

/**
 * Exercise runner
 */
const exercises = {
  1: {
    name: 'Convex Hull',
    alias: 'convex-hull',
    run: () => {
      const { points } = data['1']

      console.log(`Input: ${points.length} points`)
      points.forEach((p, i) => {
        console.log(`  [${i}] (${p.x}, ${p.y})`)
      })
      console.log()

      const hull = convexHull(points)
      printHull(hull)
    },
  },
  2: {
    name: 'Area of Convex Hull',
    alias: 'area-of-convex-hull',
    run: () => {
      const { points } = data['2']

      console.log(`Input: ${points.length} points`)
      points.forEach((p, i) => {
        console.log(`  [${i}] (${p.x}, ${p.y})`)
      })
      console.log()

      const hull = convexHull(points)
      printHull(hull)
      console.log()

      const areaShoelace = shoelaceFormula(hull)
      console.log(`Area (Shoelace formula): ${areaShoelace}`)

      const areaPick = pickTheorem(hull)
      console.log(`Area (Pick's theorem):   ${areaPick}`)
    },
  },
}

/**
 * Show help function in case the user doesn't provide any arguments
 */
function showHelp() {
  console.log('>>> Chapter 3 - Computational Geometry Exercises')
  console.log('Usage: npm run demo:ch3 <exercise>')
  console.log('Available exercises:')

  for (const [num, { name, alias }] of Object.entries(exercises)) {
    console.log(`  ${num}  ${alias.padEnd(22)} ${name}`)
  }

  console.log('>>> Examples:')
  console.log('  npm run demo:ch3 1')
  console.log('  npm run demo:ch3 convex-hull')
}

/**
 * Main function
 */
function main() {
  const arg = process.argv[2]

  if (!arg) {
    showHelp()
    process.exit(0)
  }

  // Resolve by number or alias
  const entry =
    exercises[arg] || Object.values(exercises).find((e) => e.alias === arg.toLowerCase())

  if (!entry) {
    console.error(`Unknown exercise: "${arg}"`)
    showHelp()
    process.exit(1)
  }

  console.log(`>>> Exercise: ${entry.name}`)
  entry.run()
}

main()
