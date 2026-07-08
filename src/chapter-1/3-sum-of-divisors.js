// Nhập N từ bàn phím, tính tổng các ước số của N

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

export { sumDivisors }
