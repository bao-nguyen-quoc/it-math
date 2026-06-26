// Nhập số N với N > 10^6, xác định gần đúng số lượng các số nguyên tố nhỏ hơn. Dùng 2 cách khác nhau
// - Cách 1: Dùng Sieve of Eratosthenes

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'

/**
 * Count the number of primes from 1 to N using the Sieve of Eratosthenes.
 * @param {number} n - Upper bound (inclusive), integer greater than 1
 * @returns {{ count: number, sieve: Uint8Array }} - Count of primes and the sieve boolean array
 */
function sieveOfEratosthenes(n) {
  const sieve = new Uint8Array(n + 1).fill(1)
  sieve[0] = 0
  sieve[1] = 0

  for (let i = 2; i * i <= n; i++) {
    if (sieve[i] === 1) {
      // Mark all multiples of i starting from i^2 as composite.
      // Multiples smaller than i^2 have already been marked by earlier primes.
      for (let j = i * i; j <= n; j += i) {
        sieve[j] = 0
      }
    }
  }

  let count = 0
  for (let i = 2; i <= n; i++) {
    if (sieve[i] === 1) count++
  }

  return { count, sieve }
}

/**
 * Approximate the number of primes up to N using formula in the "Density of primes" slide.
 * @param {number} n - Upper bound (inclusive), integer greater than 1
 * @returns {number} - Approximate count of primes up to N (rounded to nearest integer)
 */
function approximateNumberOfPrimes(n) {
  return Math.round(n / Math.log(n))
}

// const rl = createInterface({ input: process.stdin, output: process.stdout })

// function ask() {
//   rl.question('Enter integer N (N >= 1,000,000): ', (input) => {
//     const n = Number(input.trim())

//     if (!Number.isInteger(n) || n < 1_000_000) {
//       console.error(`Invalid value: "${input.trim()}". Please enter an integer greater than 1,000,000.`)
//       return ask()
//     } else {
//       const { count } = sieveOfEratosthenes(n)
//       const approximateNumber = approximateNumberOfPrimes(n)
//       console.log(`Exact number of primes from 1 to ${n}: ${count}`)
//       console.log(`Approximate number of primes from 1 to ${n}: ${approximateNumber}`)
//       rl.close()
//     }
//   })
// }

// ask()

export { approximateNumberOfPrimes, sieveOfEratosthenes }
