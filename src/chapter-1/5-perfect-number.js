// Kiểm tra một số có phải số hoàn hảo không.

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

export { isPerfect, isPerfectBruteForce }
