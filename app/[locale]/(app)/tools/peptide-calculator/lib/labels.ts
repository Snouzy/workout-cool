import { WarningCode } from "./types";

/**
 * Every string the result block needs, resolved once by the client component.
 *
 * Passing one object rather than a dozen props keeps the three result surfaces (desktop
 * panel, mobile sheet, sticky bar) interchangeable: they render the same readout, so they
 * take the same labels.
 */
export interface ResultLabels {
  /** Eyebrow above the headline: what the big number answers. */
  eyebrowForward: string;
  eyebrowReverse: string;
  units: string;
  concentration: string;
  volumePerDose: string;
  dosesPerVial: string;
  invalid: string;
  vialCaption: string;
  /** Overflow alert, with `{units}`, `{syringe}` and `{capacity}` placeholders already filled. */
  overflow: string;
  warnings: Record<WarningCode, string>;
}
