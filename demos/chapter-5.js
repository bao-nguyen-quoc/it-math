import {
  validateTransitionMatrix,
  computeStateDistributions,
} from '../src/chapter-5/markov-chain.js'

/**
 * Print a transition matrix with row/column labels.
 * @param {number[][]} P
 * @param {string} label
 */
function printTransitionMatrix(P, label) {
  const n = P.length
  const pad = (s) => String(s).padStart(7)

  console.log(`${label}:`)
  console.log('    ' + Array.from({ length: n }, (_, i) => pad(`S${i + 1}`)).join(''))
  for (let i = 0; i < n; i++) {
    console.log(`  S${i + 1}` + P[i].map((v) => pad(v.toFixed(2))).join(''))
  }
  console.log()
}

/**
 * Print the state distribution for each step as a compact table.
 * @param {{ step: number, pi: number[] }[]} distributions
 * @param {number} targetState - 1-indexed state to highlight
 */
function printDistributions(distributions, targetState) {
  const n = distributions[0].pi.length
  const colW = 10
  const fmt = (s) => String(s).padStart(colW)
  const headers = [
    'Step',
    ...Array.from({ length: n }, (_, i) => `P(S${i + 1})`),
    `P(S${targetState})*`,
  ]
  const divider = '-'.repeat(headers.length * colW + 2)

  console.log(divider)
  console.log(headers.map(fmt).join(''))
  console.log(divider)
  for (const { step, pi } of distributions) {
    const cols = [step, ...pi.map((v) => v.toFixed(4)), pi[targetState - 1].toFixed(4)]
    console.log(cols.map(fmt).join(''))
  }
  console.log(divider)
  console.log(`${''.padStart(colW * (n + 1))}* target state`)
  console.log()
}

/**
 * Exercise runner
 */
const exercises = {
  1: {
    name: 'Markov Chain',
    alias: 'markov-chain',
    run: () => {
      console.log('Markov Chain - state distributions via matrix exponentiation')
      console.log()

      // Transition matrix for a 4-state system
      const P = [
        [0.2, 0.5, 0.2, 0.1],
        [0.3, 0.1, 0.4, 0.2],
        [0.2, 0.3, 0.3, 0.2],
        [0.4, 0.2, 0.1, 0.3],
      ]

      // Validate the transition matrix
      const { valid, errors } = validateTransitionMatrix(P)
      if (!valid) {
        console.error('Invalid transition matrix:')
        errors.forEach((e) => console.error(`  - ${e}`))
        process.exit(1)
      }
      console.log('[OK] Transition matrix is valid (all rows sum to 1, entries in [0,1])')
      console.log()

      printTransitionMatrix(P, 'Transition matrix P')

      // Starting state 3, compute distributions for 1, 2, and 3 steps
      const startState = 3
      const steps = 3
      const targetState = 1

      console.log(`Starting state: S${startState}`)
      console.log(`Computing P(state ${targetState}) after ${steps} steps...`)
      console.log()

      const distributions = computeStateDistributions(P, startState, steps)
      printDistributions(distributions, targetState)
    },
  },
}

/**
 * Show help function in case the user doesn't provide any arguments
 */
function showHelp() {
  console.log('>>> Chapter 5 - Markov Chain Exercises')
  console.log('Usage: npm run demo:ch5 <exercise>')
  console.log('Available exercises:')

  for (const [num, { name, alias }] of Object.entries(exercises)) {
    console.log(`  ${num}  ${alias.padEnd(22)} ${name}`)
  }

  console.log('>>> Examples:')
  console.log('  npm run demo:ch5 1')
  console.log('  npm run demo:ch5 markov-chain')
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
