# it-math

Course name: Applied Mathematics in Information Technology

# Description

Project to serve my learning purpose on "Applied Mathematics in Information Technology"

# Chapter 1

## Exercises

| #   | Name                      | Description                                                          |
| --- | ------------------------- | -------------------------------------------------------------------- |
| 1   | Prime Factorization       | Factorize an integer N (N > 1) into prime factors                    |
| 2   | Number of Divisors        | Count and list all divisors of N                                     |
| 3   | Sum of Divisors           | Compute the sum of all divisors of N                                 |
| 4   | Product of Divisors       | Compute the product of all divisors of N                             |
| 5   | Perfect Number            | Check whether N is a perfect number                                  |
| 6   | Number of Primes          | Count primes up to N (N ≥ 10⁶) using Sieve of Eratosthenes           |
| 7   | List Primes               | List all primes up to N using Sieve of Eratosthenes                  |
| 8   | GCD & LCM                 | Find GCD and LCM via prime factorization and Euclid's algorithm      |
| 9   | Coprime Numbers           | Count and list integers coprime with N (N ≥ 100) using Euler totient |
| 10  | Chinese Remainder Theorem | Solve a system of congruences using CRT                              |

## How to run

```bash
# Run the interactive demo for an exercise (by number or alias)
npm run demo:ch1 <exercise>

# Examples
npm run demo:ch1 1
npm run demo:ch1 prime-factorization

# Run all chapter 1 tests
npm test -- tests/chapter-1

# Run a specific exercise test
npm test -- tests/chapter-1/1-prime-factorization
```

# Chapter 2

## Exercises

| #   | Name                   | Description                                                       |
| --- | ---------------------- | ----------------------------------------------------------------- |
| 1   | Cholesky Decomposition | Decompose a 3\*3 matrix using Cholesky method (classic & variant) |
| 2   | Matrix Diagonalization | Diagonalize a 3\*3 matrix                                         |
| 3   | SVD Decomposition      | Decompose a 3\*3 matrix using Singular Value Decomposition        |

## How to run

```bash
# Run the interactive demo for an exercise (by number or alias)
npm run demo:ch2 <exercise>

# Examples
npm run demo:ch2 1
npm run demo:ch2 cholesky-decomposition

# Run all chapter 2 tests
npm test -- tests/chapter-2

# Run a specific exercise test
npm test -- tests/chapter-2/1-cholesky-decomposition
```

# Chapter 3

## Exercises

| #   | Name                | Description                                                                                                    |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Convex Hull         | Find the convex hull of a set of 15 points in 2D space                                                         |
| 2   | Area of Convex Hull | Compute the area of the convex hull using two methods: standard method and Pick's theorem (for integer coords) |

## How to run

Unlike chapters 1 and 2, chapter 3 exercises read input from `demos/chapter-3.input.json` since geometry problems involve many points to input.

```bash
# Run the demo for an exercise (by number or alias)
npm run demo:ch3 <exercise>

# Examples
npm run demo:ch3 1
npm run demo:ch3 convex-hull

# Run all chapter 3 tests
npm test -- tests/chapter-3

# Run a specific exercise test
npm test -- tests/chapter-3/1-convex-hull
```
