// Nhập N từ bàn phím, tính tích các ước số của N

// eslint-disable-next-line no-unused-vars
import { createInterface } from 'node:readline'

import { primeFactors } from './1-prime-factorization.js'
import { countDivisors } from './2-number-of-divisors.js'

/**
 * Calc product of divisors
 * @param {number} n - Input number, integer greater than 1
 * @returns {number} Product of divisors of the input number
 */
function productDivisors(n) {
  const factorsMap = primeFactors(n)
  const numOfDivisors = countDivisors(factorsMap)

  if (numOfDivisors % 2 === 0) {
    return n ** (numOfDivisors / 2)
  } else {
    const sqrt = Math.round(Math.sqrt(n))
    return n ** ((numOfDivisors - 1) / 2) * sqrt
  }
}

// const rl = createInterface({ input: process.stdin, output: process.stdout })

// function ask() {
//   rl.question('Enter integer N (N > 1): ', (input) => {
//     const n = Number(input.trim())

//     if (!Number.isInteger(n) || n <= 1) {
//       console.error(`Invalid value: "${input.trim()}". Please enter an integer greater than 1.`)
//       return ask()
//     } else {
//       const product = productDivisors(n)
//       console.log(`Product of divisors of ${n}: ${product}`)
//       rl.close()
//     }
//   })
// }

// ask()

export { productDivisors }
