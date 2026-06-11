import { productDivisors } from 'chapter-1/4-product-of-divisors.js'
import { describe, expect, it } from 'vitest'

const TEST_CASES = [
  [2, 2],
  [12, 1728],
  [36, 10077696],
  [100, 1_000_000_000],
  [1001, 1004006004001],
  [99991, 99991],
]

describe('product of divisors', () => {
  it.each(TEST_CASES)('Product divisors of %i', (n, expectedProduct) => {
    expect(productDivisors(n)).toBe(expectedProduct)
  })
})
