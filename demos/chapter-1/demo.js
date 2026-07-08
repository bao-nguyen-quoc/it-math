// Unified CLI runner for Chapter 1 exercises
// Usage: node demos/chapter-1/demo.js <exercise>
//
// Examples:
//   node demos/chapter-1/demo.js 1
//   node demos/chapter-1/demo.js prime-factorization

import { createInterface } from 'node:readline/promises'
import { primeFactors, formatFactorization } from '../../src/chapter-1/1-prime-factorization.js'
import { countDivisors, listDivisors } from '../../src/chapter-1/2-number-of-divisors.js'
import { sumDivisors } from '../../src/chapter-1/3-sum-of-divisors.js'
import { productDivisors } from '../../src/chapter-1/4-product-of-divisors.js'
import { isPerfect, isPerfectBruteForce } from '../../src/chapter-1/5-perfect-number.js'
import {
  sieveOfEratosthenes,
  approximateNumberOfPrimes,
} from '../../src/chapter-1/6-number-of-primes.js'
import { listPrimes } from '../../src/chapter-1/7-list-primes.js'
import {
  gcdByPrimeFactors,
  lcmByPrimeFactors,
  gcdByEuclid,
  lcmByEuclid,
} from '../../src/chapter-1/8-gcd-lcm.js'

// ── Helpers ──────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout })

/**
 * Prompt the user for an integer, re-asking on invalid input.
 * @param {string} prompt - The prompt message
 * @param {function} validate - Validation function: returns true if valid
 * @param {string} errorMsg - Error message shown on invalid input
 * @returns {Promise<number>}
 */
async function askInteger(prompt, validate, errorMsg) {
  while (true) {
    const input = await rl.question(prompt)
    const n = Number(input.trim())

    if (!Number.isInteger(n) || !validate(n)) {
      console.error(errorMsg.replace('%s', input.trim()))
    } else {
      return n
    }
  }
}

/** Shorthand: ask for N > 1 */
async function askN(prompt = 'Enter integer N (N > 1): ') {
  return askInteger(
    prompt,
    (n) => n > 1,
    'Invalid value: "%s". Please enter an integer greater than 1.',
  )
}

// ── Exercise Runners ─────────────────────────────────────────────────────

const exercises = {
  1: {
    name: 'Prime Factorization',
    alias: 'prime-factorization',
    run: async () => {
      const n = await askN()
      const factorsMap = primeFactors(n)
      console.log(`${n} = ${formatFactorization(factorsMap)}`)
    },
  },

  2: {
    name: 'Number of Divisors',
    alias: 'number-of-divisors',
    run: async () => {
      const n = await askN()
      const factorsMap = primeFactors(n)
      const count = countDivisors(factorsMap)
      const divisors = listDivisors(factorsMap)
      console.log(`Number of divisors of ${n}: ${count}`)
      console.log(`Divisors: ${divisors.join(', ')}`)
    },
  },

  3: {
    name: 'Sum of Divisors',
    alias: 'sum-of-divisors',
    run: async () => {
      const n = await askN()
      const factorsMap = primeFactors(n)
      const divisors = listDivisors(factorsMap)
      const sum = sumDivisors(factorsMap)
      console.log(`Divisors of ${n}: ${divisors.join(', ')}`)
      console.log(`Sum of divisors of ${n}: ${sum}`)
    },
  },

  4: {
    name: 'Product of Divisors',
    alias: 'product-of-divisors',
    run: async () => {
      const n = await askN()
      const product = productDivisors(n)
      console.log(`Product of divisors of ${n}: ${product}`)
    },
  },

  5: {
    name: 'Perfect Number',
    alias: 'perfect-number',
    run: async () => {
      const n = await askN()
      let result = isPerfect(n)
      console.log(`${n} is${result ? '' : ' not'} a perfect number.`)
      result = isPerfectBruteForce(n)
      console.log(`${n} is${result ? '' : ' not'} a perfect number (brute force calc).`)
    },
  },

  6: {
    name: 'Number of Primes',
    alias: 'number-of-primes',
    run: async () => {
      const n = await askInteger(
        'Enter integer N (N >= 1,000,000): ',
        (n) => n >= 1_000_000,
        'Invalid value: "%s". Please enter an integer >= 1,000,000.',
      )
      const { count } = sieveOfEratosthenes(n)
      const approximateNumber = approximateNumberOfPrimes(n)
      console.log(`Exact number of primes from 1 to ${n}: ${count}`)
      console.log(`Approximate number of primes from 1 to ${n}: ${approximateNumber}`)
    },
  },

  7: {
    name: 'List Primes',
    alias: 'list-primes',
    run: async () => {
      const n = await askN()
      const primes = listPrimes(n)
      console.log(`List primes from 2 to ${n}: ${primes.join(', ')}`)
    },
  },

  8: {
    name: 'GCD & LCM',
    alias: 'gcd-lcm',
    run: async () => {
      const a = await askN('Enter first integer A (A > 1): ')
      const b = await askN('Enter second integer B (B > 1): ')

      const { gcd, factorsMap: gcdMap } = gcdByPrimeFactors(a, b)
      const { lcm, factorsMap: lcmMap } = lcmByPrimeFactors(a, b)

      const gcdExpr = Object.keys(gcdMap).length === 0 ? '1' : formatFactorization(gcdMap)
      console.log(`GCD(${a}, ${b}) = ${gcdExpr} = ${gcd}`)
      console.log(`LCM(${a}, ${b}) = ${formatFactorization(lcmMap)} = ${lcm}`)
      console.log(`GCD by Euclid: ${gcdByEuclid(a, b)}`)
      console.log(`LCM by Euclid: ${lcmByEuclid(a, b)}`)
    },
  },
}

// ── CLI Entry Point ──────────────────────────────────────────────────────

function showHelp() {
  console.log('>>> Chapter 1 — Number Theory Exercises\n')
  console.log('Usage: npm run demo:ch1 <exercise>\n')
  console.log('Available exercises:\n')

  for (const [num, { name, alias }] of Object.entries(exercises)) {
    console.log(`  ${num}  ${alias.padEnd(22)} ${name}`)
  }

  console.log('>>> Examples:')
  console.log('  npm run demo:ch1 1')
  console.log('  npm run demo:ch1 prime-factorization\n')
}

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
    console.error(`Unknown exercise: "${arg}"\n`)
    showHelp()
    process.exit(1)
  }

  console.log(`>>> Exercise: ${entry.name}\n`)

  try {
    await entry.run()
  } finally {
    rl.close()
  }
}

main()
