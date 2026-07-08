// Tìm ước chung lớn nhất và bội chung nhỏ nhất bằng 2 cách.
// - Cách 1: dùng phân tích thừa số nguyên tố
// - Cách 2: dùng thuật toán Euclid

import { primeFactors } from './1-prime-factorization.js'

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

/**
 * Compute GCD of two integers using the Euclidean algorithm.
 * Repeatedly replaces (a, b) with (b, a mod b) until b reaches 0.
 *
 * @param {number} a - First positive integer (> 1)
 * @param {number} b - Second positive integer (> 1)
 * @returns {number} - GCD value
 */
function gcdByEuclid(a, b) {
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/**
 * Compute LCM of two integers using the Euclidean algorithm.
 * Uses the identity: LCM(a, b) = (a / GCD(a, b)) * b  to avoid overflow.
 *
 * @param {number} a - First positive integer (> 1)
 * @param {number} b - Second positive integer (> 1)
 * @returns {number} - LCM value
 */
function lcmByEuclid(a, b) {
  return (a / gcdByEuclid(a, b)) * b
}

export { gcdByPrimeFactors, lcmByPrimeFactors, gcdByEuclid, lcmByEuclid }
