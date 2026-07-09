// Nhập N từ bàn phím (N >= 100)
// - Tìm số lượng các số nguyên tố cùng nhau với N
// - Liệt kê các số nguyên tố cùng nhau với N

import { primeFactors } from './1-prime-factorization.js'

/**
 * Count integers in [1, n] that are coprime with n, using Euler's totient function.
 * The used function was a transformed function compared to the one mentioned in slide.
 *
 * @param {number} n - Input number (n >= 100)
 * @returns {number} - Count of integers coprime with n
 */
function countCoprime(n) {
  const factorsMap = primeFactors(n)
  const primes = Object.keys(factorsMap).map(Number)

  let result = n
  for (const p of primes) {
    result = (result / p) * (p - 1)
  }

  return result
}

/**
 * List all integers in [1, n] that are coprime with n.
 *
 * @param {number} n - Input number (n >= 100)
 * @returns {number[]} - Array of integers coprime with n
 */
function listCoprime(n) {
  const factorsMap = primeFactors(n)
  const primes = Object.keys(factorsMap).map(Number)

  const result = []
  for (let k = 1; k <= n; k++) {
    const isCoprime = primes.every((p) => k % p !== 0)
    if (isCoprime) result.push(k)
  }

  return result
}

export { countCoprime, listCoprime }
