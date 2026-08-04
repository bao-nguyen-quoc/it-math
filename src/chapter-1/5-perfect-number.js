// Kiểm tra một số có phải số hoàn hảo không.
// Cách 1: Tính tổng các ước số
// Cách 2: Sử dụng định lý Euclid-Euler (chỉ áp dụng cho số chẵn)

import { primeFactors } from './1-prime-factorization.js'
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

// Method 2: Check even perfect numbers via Mersenne primes (Euclid-Euler theorem)
// An even number is perfect if n = 2^(p-1) * (2^p - 1) where (2^p - 1) is prime.
// Note: No odd perfect numbers are known, so this method returns false for odd inputs.

/**
 * Check primality of a number using trial division.
 * @param {number} num - The number to check
 * @returns {boolean} True if num is prime
 */
function isPrime(num) {
  if (num < 2) return false
  if (num === 2) return true
  if (num % 2 === 0) return false
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false
  }
  return true
}

/**
 * Check if an even number is a perfect number using the Euclid-Euler theorem.
 * An even number is perfect iff it can be written as 2^(p-1) * (2^p - 1)
 * where (2^p - 1) is a Mersenne prime.
 * Returns false for odd numbers (no odd perfect numbers are known).
 * @param {number} n - Input number, integer greater than 1
 * @returns {boolean} True if n is an even perfect number, false otherwise
 */
function isPerfectEvenMersenne(n) {
  // Odd numbers cannot be checked by this method
  if (n % 2 !== 0) return false

  // Factor out powers of 2: n = 2^k * oddPart
  let k = 0
  let temp = n
  while (temp % 2 === 0) {
    k++
    temp = Math.floor(temp / 2)
  }
  const oddPart = temp

  // For n = 2^(p-1) * (2^p - 1), we need k = p - 1, so p = k + 1
  const p = k + 1
  const mersenne = 2 ** p - 1

  // Check that the odd part equals the Mersenne number and it is prime
  return oddPart === mersenne && isPrime(mersenne)
}

export { isPerfect, isPerfectEvenMersenne }
