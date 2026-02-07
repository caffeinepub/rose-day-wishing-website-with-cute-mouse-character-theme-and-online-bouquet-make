/**
 * Helper utilities for bouquet Select component to avoid empty string values
 * which are not allowed by Radix UI Select.
 */

// Sentinel value for "No bouquet" option (non-empty string)
export const NO_BOUQUET_VALUE = '__NO_BOUQUET__';

/**
 * Converts a bouquet ID (bigint | null) to a Select-compatible string value.
 * null or undefined becomes the NO_BOUQUET sentinel.
 */
export function bouquetIdToSelectValue(bouquetId: bigint | null | undefined): string {
  if (bouquetId == null) {
    return NO_BOUQUET_VALUE;
  }
  return bouquetId.toString();
}

/**
 * Converts a Select value string back to bigint | null for backend submission.
 * The NO_BOUQUET sentinel or empty string becomes null.
 * Numeric strings are converted to BigInt.
 */
export function selectValueToBouquetId(value: string): bigint | null {
  if (!value || value === NO_BOUQUET_VALUE) {
    return null;
  }
  try {
    return BigInt(value);
  } catch {
    // If conversion fails, treat as no bouquet
    return null;
  }
}
