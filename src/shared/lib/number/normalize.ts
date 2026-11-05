export interface NormalizeDecimalOptions {
  /** Maximum number of fractional digits to keep. Default: 3. */
  maxDecimals?: number;
}

/**
 * Normalize an integer-like string.
 *
 * Behavior:
 * - Preserve empty string while editing.
 * - Treat "." or "," as decimal separators and **drop the fractional part**.
 *   e.g., "2.0" -> "2", "00,7" -> "0"
 * - Keep digits only.
 * - Remove redundant leading zeros, but keep a single "0" if the value is zero.
 */
export function normalizeInteger(raw: string): string {
  const input = raw.trim();
  if (input === "") return "";

  // Unify separators, then drop any fractional part.
  const noFraction = input.replace(/,/g, ".").replace(/\..*$/, "");

  const digitsOnly = noFraction.replace(/\D+/g, "");
  const withoutRedundantZeros = digitsOnly.replace(/^0+(?=\d)/, "");

  return withoutRedundantZeros === "" ? "0" : withoutRedundantZeros;
}

/**
 * Normalize a decimal-like string (supports "." and "," as decimal separators).
 *
 * Behavior:
 * - Preserve empty string while editing.
 * - Convert commas to dots.
 * - Remove invalid characters (keep digits and at most one dot).
 * - If it starts with ".", prefix "0" (".5" -> "0.5").
 * - Strip redundant leading zeros except for "0.xxx".
 * - Limit fractional length via `maxDecimals` (default 3).
 */
export function normalizeDecimal(raw: string, opts?: NormalizeDecimalOptions): string {
  const { maxDecimals = 3 } = opts ?? {};
  const input = raw.trim();
  if (input === "") return "";

  const unifiedSeparator = input.replace(/,/g, ".");
  const digitsAndDots = unifiedSeparator.replace(/[^0-9.]/g, "");

  const firstDotIndex = digitsAndDots.indexOf(".");
  const singleDot =
    firstDotIndex === -1
      ? digitsAndDots
      : digitsAndDots.slice(0, firstDotIndex + 1) +
      digitsAndDots.slice(firstDotIndex + 1).replace(/\./g, "");

  let normalized = singleDot.startsWith(".") ? `0${singleDot}` : singleDot;

  if (!normalized.startsWith("0.")) {
    normalized = normalized.replace(/^0+(?=\d)/, "");
    if (normalized === "") normalized = "0";
  }

  const [integerPart, fractionalPart] = normalized.split(".");
  if (fractionalPart && fractionalPart.length > maxDecimals) {
    normalized = `${integerPart}.${fractionalPart.slice(0, maxDecimals)}`;
  }

  return normalized;
}
