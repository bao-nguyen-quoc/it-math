// Tìm ước chung lớn nhất và bội chung nhỏ nhất bằng 2 cách.
// - Cách 1: dùng phân tích thừa số nguyên tố
// - Cách 2: dùng thuật toán Euclid

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'
// eslint-disable-next-line no-unused-vars
import { primeFactors, formatFactorization } from './1-prime-factorization.js'

/**
 * Compute GCD of two integers using their prime factorizations.
 * GCD takes the minimum exponent of each common prime factor.
 *
 * @param {number} a - First positive integer (> 1)
 * @param {number} b - Second positive integer (> 1)
 * @returns {{ gcd: number, factorsMap: Object.<number, number> }} - GCD value and its factor map
 */
function gcdByPrimeFactors(a, b) {
  const mapA = primeFactors(a)
  const mapB = primeFactors(b)

  // Intersect: keep only primes present in both, take the lesser exponent
  const gcdMap = {}
  for (const [prime, exp] of Object.entries(mapA)) {
    if (mapB[prime] !== undefined) {
      gcdMap[prime] = Math.min(exp, mapB[prime])
    }
  }

  const gcd = Object.entries(gcdMap).reduce((acc, [prime, exp]) => acc * prime ** exp, 1)
  return { gcd, factorsMap: gcdMap }
}

/**
 * Compute LCM of two integers using their prime factorizations.
 * LCM takes the maximum exponent across all prime factors from both numbers.
 *
 * @param {number} a - First positive integer (> 1)
 * @param {number} b - Second positive integer (> 1)
 * @returns {{ lcm: number, factorsMap: Object.<number, number> }} - LCM value and its factor map
 */
function lcmByPrimeFactors(a, b) {
  const mapA = primeFactors(a)
  const mapB = primeFactors(b)

  // Union: collect all primes, take the greater exponent
  const lcmMap = { ...mapA }
  for (const [prime, exp] of Object.entries(mapB)) {
    lcmMap[prime] = Math.max(lcmMap[prime] ?? 0, exp)
  }

  const lcm = Object.entries(lcmMap).reduce((acc, [prime, exp]) => acc * prime ** exp, 1)
  return { lcm, factorsMap: lcmMap }
}

// const rl = createInterface({ input: process.stdin, output: process.stdout })

// function askNumber(prompt) {
//   return new Promise((resolve) => {
//     rl.question(prompt, (input) => {
//       const n = Number(input.trim())
//       if (!Number.isInteger(n) || n <= 1) {
//         console.error(`Invalid value: "${input.trim()}". Please enter an integer greater than 1.`)
//         resolve(askNumber(prompt)) // Ask again
//       } else {
//         resolve(n)
//       }
//     })
//   })
// }

// async function main() {
//   const a = await askNumber('Enter first integer A (A > 1): ')
//   const b = await askNumber('Enter second integer B (B > 1): ')

//   console.log(`\nPrime factorization of ${a}: ${a} = ${formatFactorization(primeFactors(a))}`)
//   console.log(`Prime factorization of ${b}: ${b} = ${formatFactorization(primeFactors(b))}`)

//   const { gcd, factorsMap: gcdMap } = gcdByPrimeFactors(a, b)
//   const { lcm, factorsMap: lcmMap } = lcmByPrimeFactors(a, b)

//   const gcdExpr = Object.keys(gcdMap).length === 0 ? '1' : formatFactorization(gcdMap)
//   console.log(`\nGCD(${a}, ${b}) = ${gcdExpr} = ${gcd}`)
//   console.log(`LCM(${a}, ${b}) = ${formatFactorization(lcmMap)} = ${lcm}`)

//   rl.close()
// }

// main()

export { gcdByPrimeFactors, lcmByPrimeFactors }
