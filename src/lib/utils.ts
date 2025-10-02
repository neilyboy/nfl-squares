import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random array of numbers 0-9
 */
export function generateRandomNumbers(): number[] {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

/**
 * Gets the last digit of a score
 */
export function getLastDigit(score: number): number {
  return score % 10;
}

/**
 * Formats currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculates total pot
 */
export function calculateTotalPot(costPerSquare: number): number {
  return costPerSquare * 100; // 10x10 grid
}

/**
 * Calculates payout for a quarter
 */
export function calculateQuarterPayout(
  costPerSquare: number,
  percentage: number
): number {
  return (costPerSquare * 100 * percentage) / 100;
}
