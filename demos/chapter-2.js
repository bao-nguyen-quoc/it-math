import { createInterface } from 'node:readline/promises'
import {
  validateSymmetric,
  validatePositiveDefinite,
  classicCholesky,
  variantCholesky,
} from '../src/chapter-2/1-cholesky-decomposition.js'
import { diagonalize, printDiagonalization } from '../src/chapter-2/2-matrix-diagonalization.js'
import { printMatrix } from '../src/chapter-2/util.js'

const rl = createInterface({ input: process.stdin, output: process.stdout })

/**
 * Prompt the user for a number (integer or float), re-asking on invalid input.
 * @param {string} prompt - The prompt message
 * @returns {Promise<number>}
 */
// eslint-disable-next-line no-unused-vars
async function askNumber(prompt) {
  while (true) {
    const input = await rl.question(prompt)
    const n = Number(input.trim())

    if (Number.isNaN(n)) {
      console.error(`Invalid value: "${input.trim()}". Please enter a valid number.`)
    } else {
      return n
    }
  }
}

/**
 * Prompt the user to input a 3x3 matrix row by row.
 * Each row is entered as 3 space-separated numbers.
 * @param {string} label - Label to display before asking
 * @returns {Promise<number[][]>} 3x3 matrix
 */
async function askMatrix3x3(label) {
  console.log(`${label} (enter each row as 3 space-separated numbers):`)

  const matrix = []
  for (let i = 0; i < 3; i++) {
    while (true) {
      const input = await rl.question(`  Row ${i + 1}: `)
      const values = input.trim().split(/\s+/).map(Number)

      if (values.length !== 3 || values.some(Number.isNaN)) {
        console.error('  Invalid row. Please enter exactly 3 numbers separated by spaces.')
      } else {
        matrix.push(values)
        break
      }
    }
  }

  return matrix
}

/**
 * Exercise runner
 */
const exercises = {
  1: {
    name: 'Cholesky Decomposition',
    alias: 'cholesky-decomposition',
    run: async () => {
      console.log('Decompose a 3*3 symmetric matrix using Cholesky methods')

      const A = await askMatrix3x3('Enter matrix A')

      printMatrix(A, 'Input matrix A')

      try {
        validateSymmetric(A)
        const { L: Lv, D } = variantCholesky(A)
        printMatrix(Lv, 'Variant Cholesky method > Cholesky factor L')
        console.log(`Variant Cholesky method > D = diag(${D.map((v) => v.toFixed(2)).join(', ')})`)

        validatePositiveDefinite(A)
        const L = classicCholesky(A)
        printMatrix(L, 'Classic Cholesky method > Cholesky factor L')
      } catch (error) {
        console.log(error.message)
      }
    },
  },
  2: {
    name: 'Matrix Diagonalization',
    alias: 'matrix-diagonalization',
    run: async () => {
      console.log('Diagonalize a 3*3 matrix: find P and D such that A = P*D*P^(-1)')

      const A = await askMatrix3x3('Enter matrix A')

      printMatrix(A, 'Input matrix A')

      try {
        const result = diagonalize(A)
        printDiagonalization(result)
      } catch (error) {
        console.log(error.message)
      }
    },
  },
}

/**
 * Show help function in case the user doesn't provide any arguments
 */
function showHelp() {
  console.log('>>> Chapter 2 - Matrix Decomposition Exercises')
  console.log('Usage: npm run demo:ch2 <exercise>')
  console.log('Available exercises:')

  for (const [num, { name, alias }] of Object.entries(exercises)) {
    console.log(`  ${num}  ${alias.padEnd(26)} ${name}`)
  }

  console.log('>>> Examples:')
  console.log('  npm run demo:ch2 1')
  console.log('  npm run demo:ch2 cholesky-decomposition')
}

/**
 * Main function
 */
async function main() {
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

  try {
    await entry.run()
  } finally {
    rl.close()
  }
}

main()
