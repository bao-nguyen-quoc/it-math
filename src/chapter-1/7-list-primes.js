// Nhập số N, liệt kê tất cả các số nguyên tố nhỏ hơn hoặc bằng N. Sử dụng thuật toán Eratosthenes

import { sieveOfEratosthenes } from './6-number-of-primes.js'

/**
 * List all prime numbers from 2 to N using the sieve result.
 * @param {number} n - Upper bound (inclusive), integer greater than 1
 * @returns {number[]} - Array of prime numbers up to N
 */
function listPrimes(n) {
  const { sieve } = sieveOfEratosthenes(n)
  const primes = []

  for (let i = 2; i <= n; i++) {
    if (sieve[i] === 1) primes.push(i)
  }

  return primes
}

export { listPrimes }
