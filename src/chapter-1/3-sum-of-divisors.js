// Nhập N từ bàn phím, tính tổng các ước số của N

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'
// eslint-disable-next-line no-unused-vars
import { primeFactors } from './1-prime-factorization.js'
// eslint-disable-next-line no-unused-vars
import { listDivisors } from './2-number-of-divisors.js'

/**
 * Calc sum of divisors of a number based on their factorsMap
 * @param {Object.<number, number>} factorsMap - Object mapping prime factors to their exponents
 * @returns {number} Sum of divisors of a number based on its factors map
 */
function sumDivisors(factorsMap) {
  return Object.entries(factorsMap).reduce((acc, [p, e]) => {
    const prime = Number(p)
    // Calc sum 1 + p^1 + p^2 + ... + p^e
    const sum = (prime ** (e + 1) - 1) / (prime - 1)
    return acc * sum
  }, 1)
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
//       const divisors = listDivisors(factorsMap)
//       const sum = sumDivisors(factorsMap)

//       console.log(`Divisors of ${n}: ${divisors.join(', ')}`)
//       console.log(`Sum of divisors of ${n}: ${sum}`)
//       rl.close()
//     }
//   })
// }

// ask()

export { sumDivisors }
