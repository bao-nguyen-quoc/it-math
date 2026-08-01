import { gradientDescent, gradientDescentWithMomentum } from 'chapter-4/gradient-descent.js'
import { describe, expect, it } from 'vitest'

describe('gradientDescent', () => {
  it('finds minimum of x^2 at x = 0', () => {
    const result = gradientDescent('x^2', 5, 0.1)
    expect(result.x).toBeCloseTo(0, 4)
    expect(result.value).toBeCloseTo(0, 4)
  })

  it('finds minimum of (x - 3)^2 at x = 3', () => {
    const result = gradientDescent('(x - 3)^2', 0, 0.1)
    expect(result.x).toBeCloseTo(3, 4)
    expect(result.value).toBeCloseTo(0, 4)
  })

  it('finds minimum of x^2 + 2*x + 1 at x = -1', () => {
    const result = gradientDescent('x^2 + 2*x + 1', 5, 0.1)
    expect(result.x).toBeCloseTo(-1, 4)
    expect(result.value).toBeCloseTo(0, 4)
  })

  it('converges on (e^x * sin(x)^2) / (x^2 + 1) from x0 = 2', () => {
    const result = gradientDescent('(e^x * sin(x)^2) / (x^2 + 1)', 2, 0.05)
    expect(typeof result.x).toBe('number')
    expect(isFinite(result.x)).toBe(true)
    expect(typeof result.value).toBe('number')
    expect(isFinite(result.value)).toBe(true)
  })

  it('returns immediately when starting at the minimum of x^2', () => {
    const result = gradientDescent('x^2', 0, 0.1)
    expect(result.x).toBeCloseTo(0, 6)
    expect(result.value).toBeCloseTo(0, 6)
  })
})

describe('gradientDescentWithMomentum', () => {
  it('finds minimum of x^2 at x = 0', () => {
    const result = gradientDescentWithMomentum('x^2', 5, 0.1)
    expect(result.x).toBeCloseTo(0, 4)
    expect(result.value).toBeCloseTo(0, 4)
  })

  it('finds minimum of (x - 3)^2 at x = 3', () => {
    const result = gradientDescentWithMomentum('(x - 3)^2', 0, 0.1)
    expect(result.x).toBeCloseTo(3, 4)
    expect(result.value).toBeCloseTo(0, 4)
  })

  it('finds minimum of x^2 + 2*x + 1 at x = -1', () => {
    const result = gradientDescentWithMomentum('x^2 + 2*x + 1', 5, 0.1)
    expect(result.x).toBeCloseTo(-1, 4)
    expect(result.value).toBeCloseTo(0, 4)
  })

  it('converges on (e^x * sin(x)^2) / (x^2 + 1) from x0 = 2', () => {
    const result = gradientDescentWithMomentum('(e^x * sin(x)^2) / (x^2 + 1)', 2, 0.05)
    expect(typeof result.x).toBe('number')
    expect(isFinite(result.x)).toBe(true)
    expect(typeof result.value).toBe('number')
    expect(isFinite(result.value)).toBe(true)
  })

  it('returns immediately when starting at the minimum of x^2', () => {
    const result = gradientDescentWithMomentum('x^2', 0, 0.1)
    expect(result.x).toBeCloseTo(0, 6)
    expect(result.value).toBeCloseTo(0, 6)
  })
})
