import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gradientDescent, gradientDescentWithMomentum } from '../src/chapter-4/gradient-descent.js'
import { newtonMethod } from '../src/chapter-4/newton-method.js'
import {
  augmentedLagrangeMethod,
  printTable,
  renderHTMLTable,
} from '../src/chapter-4/augmented-lagrange-method.js'

/**
 * Exercise runner
 */
const exercises = {
  1: {
    name: 'Gradient Descent',
    alias: 'gradient-descent',
    run: () => {
      console.log('Gradient Descent - find local minimum of f(x)')
      console.log()

      const expression = '(e^x * sin(x)^2) / (x^2 + 1)'
      const x0 = 2
      const alpha = 0.05

      console.log(`f(x) = ${expression}`)
      console.log(`x0   = ${x0}`)
      console.log(`alpha = ${alpha}`)
      console.log()

      const result = gradientDescent(expression, x0, alpha)

      console.log('Result:')
      console.log(`  x     = ${result.x}`)
      console.log(`  f(x)  = ${result.value}`)
      console.log()
    },
  },
  2: {
    name: 'Gradient Descent with Momentum',
    alias: 'gradient-descent-momentum',
    run: () => {
      console.log('Gradient Descent with Momentum - find local minimum of f(x)')
      console.log()

      const expression = '(e^x * sin(x)^2) / (x^2 + 1)'
      const x0 = 2
      const alpha = 0.05
      const beta = 0.9

      console.log(`f(x)  = ${expression}`)
      console.log(`x0    = ${x0}`)
      console.log(`alpha = ${alpha}`)
      console.log(`beta  = ${beta}`)
      console.log()

      const result = gradientDescentWithMomentum(expression, x0, alpha, undefined, undefined, beta)

      console.log('Result:')
      console.log(`  x     = ${result.x}`)
      console.log(`  f(x)  = ${result.value}`)
      console.log()
    },
  },
  3: {
    name: "Newton's Method",
    alias: 'newton-method',
    run: () => {
      console.log("Newton's Method - find local minimum of f(x)")
      console.log()

      const expression = '(e^x * sin(x)^2) / (x^2 + 1)'
      // The newton method cannot determine whether the result is minimum, maximum
      // or saddle point.
      // After first try with x0 = 2, I find maximum instead of minimum.
      // x0 = 3 is when I retried and get minimum.

      const x0 = 3
      const alpha = 1

      console.log(`f(x)  = ${expression}`)
      console.log(`x0    = ${x0}`)
      console.log(`alpha = ${alpha}`)
      console.log()

      const result = newtonMethod(expression, x0, alpha)

      console.log('Result:')
      console.log(`  x     = ${result.x}`)
      console.log(`  f(x)  = ${result.value}`)
      console.log()
    },
  },
  4: {
    name: 'Augmented Lagrange Method',
    alias: 'augmented-lagrange',
    run: () => {
      console.log('Augmented Lagrange Method - constrained optimisation')
      console.log()

      // f(x1, x2) = (e^x1 · sin(x1)²) / (x1² + 1) + x2²
      // h(x1, x2) = x1 + 2·x2 − 2 = 0
      const fExpr = '(exp(x1) * sin(x1)^2) / (x1^2 + 1) + x2^2'
      const hExpr = 'x1 + 2*x2 - 2'
      const x0 = [1, 0.5]

      console.log(`f(x1, x2) = ${fExpr}`)
      console.log(`h(x1, x2) = ${hExpr} = 0`)
      console.log(`x0 = [${x0}]`)
      console.log()

      const { iterations, solution } = augmentedLagrangeMethod(fExpr, hExpr, x0, {
        lambda0: 0,
        r: 1,
        maxOuterIter: 20,
        precision: 1e-5,
      })

      printTable(iterations)
      console.log('Solution:')
      console.log(`  x1*    = ${solution.x1}`)
      console.log(`  x2*    = ${solution.x2}`)
      console.log(`  f(x*)  = ${solution.fValue}`)
      console.log(`  h(x*)  = ${solution.hValue}`)
      console.log()

      // Write HTML report
      const __dirname = dirname(fileURLToPath(import.meta.url))
      const html = renderHTMLTable(iterations, solution)
      const outPath = join(__dirname, 'chapter-4-augmented-lagrange.html')
      writeFileSync(outPath, html)
      console.log(`-> HTML report written to ${outPath}`)
    },
  },
}

/**
 * Show help function in case the user doesn't provide any arguments
 */
function showHelp() {
  console.log('>>> Chapter 4 - Optimization Exercises')
  console.log('Usage: npm run demo:ch4 <exercise>')
  console.log('Available exercises:')

  for (const [num, { name, alias }] of Object.entries(exercises)) {
    console.log(`  ${num}  ${alias.padEnd(32)} ${name}`)
  }

  console.log('>>> Examples:')
  console.log('  npm run demo:ch4 1')
  console.log('  npm run demo:ch4 gradient-descent')
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
