import type { Locale } from "locales/types";

/** Locales that write the decimal separator as a comma rather than a point. */
const COMMA_DECIMAL_LOCALES: ReadonlySet<Locale> = new Set(["fr", "es", "pt", "ru"]);

/**
 * Rounds `value` to at most `decimals` fraction digits, strips trailing zeros
 * (so `12.50` renders as `12.5`, never as false precision), and renders the
 * result using the decimal separator convention of `locale`.
 *
 * Deliberately avoids `Intl.NumberFormat`'s locale-aware formatting for the
 * integer part: `new Intl.NumberFormat("fr").format(2000)` would inject a
 * U+202F narrow no-break space (and `ru` a U+00A0 no-break space) as a
 * thousands separator. Those codepoints were audited out of every locale
 * content string; grouping is not wanted here either way (a reverse-mode dose
 * in mcg can exceed 999, and `2000 mcg` reads better than `2 000 mcg`).
 * Formatting via `toFixed`/`toString` and swapping only the decimal
 * separator keeps the output free of grouping characters by construction.
 */
export function formatLocaleNumber(value: number, decimals: number, locale: Locale): string {
  const rounded = roundToPrecision(value, decimals).toString();

  return COMMA_DECIMAL_LOCALES.has(locale) ? rounded.replace(".", ",") : rounded;
}

/**
 * Rounds `value` to at most `decimals` fraction digits and returns it as a
 * plain `number` (not a locale-formatted string). Use this when the value
 * feeds a numeric prop — e.g. the syringe ruler's `units` — rather than
 * being rendered as text.
 */
export function roundToPrecision(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

/** Micrograms below the thousand read as `mcg`; past it, `8 mg` beats `8000 mcg`. */
export const DOSE_UNIT_SWITCH_MCG = 1000;

export interface FormattedDose {
  value: string;
  unit: "mcg" | "mg";
}

/**
 * Renders a dose in whichever unit keeps it readable, as `{value, unit}` so the
 * caller can style the two parts separately (the result headline colours the unit).
 */
export function formatDose(doseMcg: number, locale: Locale): FormattedDose {
  const asMg = doseMcg >= DOSE_UNIT_SWITCH_MCG;

  return {
    value: formatLocaleNumber(asMg ? doseMcg / 1000 : doseMcg, asMg ? 3 : 0, locale),
    unit: asMg ? "mg" : "mcg",
  };
}
