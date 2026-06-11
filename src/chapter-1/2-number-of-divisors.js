// Nhập N từ bàn phím, tìm số lượng các ước số của N và liệt kê chúng

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'
// eslint-disable-next-line no-unused-vars
import { primeFactors } from './1-prime-factorization.js'

/**
 * Count number of devisors
 * @param {Object.<number, number>} factorsMap - Object mapping prime factors to their exponents
 * @returns
 */
function countDivisors(factorsMap) {
  return Object.values(factorsMap).reduce((acc, exp) => acc * (exp + 1), 1)
}

/**
 * List all divisors of N in ascending order.
 *
 * @param {Object.<number, number>} factorsMap
 * @returns {number[]} Sorted array of divisors
 */
function listDivisors(factorsMap) {
  const entries = Object.entries(factorsMap).map(([p, e]) => [Number(p), e])

  let divisors = [1]

  for (const [prime, exp] of entries) {
    const next = []
    let primePow = 1

    for (let i = 0; i <= exp; i++) {
      for (const d of divisors) {
        next.push(d * primePow)
      }
      primePow *= prime
    }

    divisors = next
  }

  return divisors.sort((a, b) => a - b)
}

// const rl = createInterface({ input: process.stdin, output: process.stdout })

// function ask() {
//   rl.question('Enter integer N (N > 1): ', (input) => {
//     const n = Number(input.trim())

//     if (!Number.isInteger(n) || n <= 1) {
//       console.error(`Invalid value: "${input.trim()}". Please enter an integer greater than 1.`)
//       return ask()
//     } else {
//       const factorsMap = primeFactors(n)
//       const count = countDivisors(factorsMap)
//       const divisors = listDivisors(factorsMap)

//       console.log(`Number of divisors of ${n}: ${count}`)
//       console.log(`Divisors: ${divisors.join(', ')}`)
//       rl.close()
//     }
//   })
// }

// ask()

export { countDivisors, listDivisors }
