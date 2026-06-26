// Nhập số N, liệt kê tất cả các số nguyên tố nhỏ hơn hoặc bằng N. Sử dụng thuật toán Eratosthenes

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'
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

// const rl = createInterface({ input: process.stdin, output: process.stdout })

// function ask() {
//   rl.question('Enter integer N (N > 1): ', (input) => {
//     const n = Number(input.trim())

//     if (!Number.isInteger(n) || n <= 1) {
//       console.error(`Invalid value: "${input.trim()}". Please enter an integer > 1.`)
//       return ask()
//     }

//     const primes = listPrimes(n)
//     console.log(`List primes from 2 to ${n}: ${primes.join(', ')}`)
//     rl.close()
//   })
// }

// ask()

export { listPrimes }
