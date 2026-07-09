// Giải bài toán số dư Trung Hoa với hệ 4 phương trình
// x ≡ a1 (mod m1)
// x ≡ a2 (mod m2)
// x ≡ a3 (mod m3)
// x ≡ a4 (mod m4)
// Các số a1, a2, a3, a4, m1, m2, m3, m4 nhập từ bàn phím.
// Các số m1, m2, m3, m4 đôi một nguyên tố cùng nhau.

import { gcdByEuclid } from './8-gcd-lcm.js'

/**
 * Compute the modular inverse of a modulo m using the Extended Euclidean algorithm.
 * Returns x such that a * x ≡ 1 (mod m).
 * Assumes gcd(a, m) = 1.
 *
 * @param {number} a
 * @param {number} m
 * @returns {number} - Modular inverse of a mod m
 */
function modInverse(a, m) {
  let [old_r, r] = [a, m]
  let [old_s, s] = [1, 0]

  while (r !== 0) {
    const q = Math.floor(old_r / r)
    ;[old_r, r] = [r, old_r - q * r]
    ;[old_s, s] = [s, old_s - q * s]
  }

  // old_s is the Bézout coefficient for a; reduce mod m to keep it positive
  return ((old_s % m) + m) % m
}

/**
 * Validate that all moduli in the system are pairwise coprime.
 * @param {{ a: number, m: number }[]} equations - Array of congruence equations
 */
function validatePairwiseCoprime(equations) {
  for (let i = 0; i < equations.length; i++) {
    for (let j = i + 1; j < equations.length; j++) {
      if (gcdByEuclid(equations[i].m, equations[j].m) !== 1) {
        throw new Error(
          `Moduli m${i + 1}=${equations[i].m} and m${j + 1}=${equations[j].m} are not coprime`,
        )
      }
    }
  }
}

/**
 * Solve a system of congruences using the Chinese Remainder Theorem (CRT).
 *
 * Input is an array of equation objects { a, m } representing x ≡ a (mod m).
 * All moduli must be pairwise coprime.
 *
 * @param {{ a: number, m: number }[]} equations - Array of congruence equations
 * @returns {{ x: number, M: number }} - Smallest non-negative solution x and the combined modulus M
 */
function chineseRemainder(equations) {
  // M = product of all moduli
  const M = equations.reduce((acc, { m }) => acc * m, 1)

  // x = sum of (a_i * M_i * y_i) mod M
  // where M_i = M / m_i and y_i = modular inverse of M_i mod m_i
  const x = equations.reduce((acc, { a, m }) => {
    const Mi = M / m
    const yi = modInverse(Mi, m)
    return acc + a * Mi * yi
  }, 0)

  return { x: ((x % M) + M) % M, M }
}

/**
 * Print the system of congruences and its CRT solution to the console.
 *
 * @param {{ a: number, m: number }[]} equations
 * @param {{ x: number, M: number }} solution
 */
function printSolution(equations, { x, M }) {
  console.log('System of congruences:')
  for (const { a, m } of equations) {
    console.log(`  x ≡ ${a}(mod ${m})`)
  }
  console.log(`Solution: x ≡ ${x}(mod ${M})`)
}

export { validatePairwiseCoprime, chineseRemainder, printSolution }
