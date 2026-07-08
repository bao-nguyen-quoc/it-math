// Nhập N từ bàn phím, tính tích các ước số của N

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

export { productDivisors }
