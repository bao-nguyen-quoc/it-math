// Kiểm tra một số có phải số hoàn hảo không.

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'

import { primeFactors } from './1-prime-factorization.js'
import { listDivisors } from './2-number-of-divisors.js'
import { sumDivisors } from './3-sum-of-divisors.js'

// Method 1: Calc the sum of divisors
/**
 * Check if a number is a perfect number
 * @param {number} n - Input number, integer greater than 1
 * @returns {boolean} True if n is a perfect number, false otherwise
 */
function isPerfect(n) {
  const factorsMap = primeFactors(n)
  const sumOfDivisors = sumDivisors(factorsMap)
  return n === sumOfDivisors - n
}

// Method 2: Sum all divisors from listDivisors (brute force)
/**
 * Check if a number is a perfect number using brute force divisor listing
 * @param {number} n - Input number, integer greater than 1
 * @returns {boolean} True if n is a perfect number, false otherwise
 */
function isPerfectBruteForce(n) {
  const factorsMap = primeFactors(n)
  const divisors = listDivisors(factorsMap)
  const sumOfDivisors = divisors.reduce((acc, d) => acc + d, 0)
  return n === sumOfDivisors - n
}

// const rl = createInterface({ input: process.stdin, output: process.stdout })

// function ask() {
//   rl.question('Enter integer N (N > 1): ', (input) => {
//     const n = Number(input.trim())

//     if (!Number.isInteger(n) || n <= 1) {
//       console.error(`Invalid value: "${input.trim()}". Please enter an integer greater than 1.`)
//       return ask()
//     } else {
//       let result = isPerfect(n)
//       console.log(`${n} is${result ? '' : ' not'} a perfect number.`)
//       result = isPerfectBruteForce(n)
//       console.log(`${n} is${result ? '' : ' not'} a perfect number (brute force calc).`)
//       rl.close()
//     }
//   })
// }

// ask()

export { isPerfect, isPerfectBruteForce }
