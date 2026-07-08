// Viết chương trình phân tích số nguyên N (N > 1) thành tích các thừa số nguyên tố

/**
 * Get array of prime factors (with repetition) of a given integer n > 1.
 * @param {number} n - Input number, integer greater than 1
 * @returns {Object.<number, number>} - Object mapping prime factors to their exponents
 */
function primeFactors(n) {
  const factors = []
  let remaining = n

  // Divide by 2 first to speed up the subsequent loop (only iterate over odd numbers)
  while (remaining % 2 === 0) {
    factors.push(2)
    remaining /= 2
  }

  // Iterate over odd divisors from 3 to sqrt(remaining)
  for (let divisor = 3; divisor * divisor <= remaining; divisor += 2) {
    while (remaining % divisor === 0) {
      factors.push(divisor)
      remaining /= divisor
    }
  }

  // If there's a remainder > 1, it's a prime factor
  if (remaining > 1) {
    factors.push(remaining)
  }

  return factors.reduce((map, p) => {
    map[p] = (map[p] ?? 0) + 1
    return map
  }, {})
}

/**
 * Format result
 *
 * @param {Object.<number, number>} map - Object mapping prime factors to their exponents
 * @returns {string} - Formatted string of the prime factorization
 */
function formatFactorization(map) {
  const expr = Object.entries(map)
    .map(([base, exp]) => `${base}${exp > 1 ? `^${exp}` : ''}`)
    .join('*')

  return `${expr}`
}

export { primeFactors, formatFactorization }
