import { gradientDescent, gradientDescentWithMomentum } from '../src/chapter-4/gradient-descent.js'
import { newtonMethod } from '../src/chapter-4/newton-method.js'

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
      const alpha = 0.05

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
