import { formatLocaleNumber } from "../../lib/formatNumber";

import type { Locale } from "locales/types";

export interface ReverseResultLabels {
  eyebrow: string;
  doseIs: string;
  units: string;
  concentration: string;
  invalid: string;
}

interface ReverseResultCardProps {
  doseMcg: number | null;
  concentrationMgPerMl: number;
  units: number;
  labels: ReverseResultLabels;
  locale: Locale;
}

export function ReverseResultCard({ doseMcg, concentrationMgPerMl, units, labels, locale }: ReverseResultCardProps) {
  return (
    <section
      aria-live="polite"
      className="mt-10 rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-sm sm:p-8"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">{labels.eyebrow}</p>

      {doseMcg === null ? (
        <p className="text-lg text-base-content/60">{labels.invalid}</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-base-content sm:text-4xl">
            {labels.doseIs} <span className="text-primary">{formatLocaleNumber(doseMcg, 2, locale)} mcg</span>
            <span className="ml-3 block text-base font-normal text-base-content/60 sm:inline">
              {units} {labels.units} = {formatLocaleNumber(doseMcg / 1000, 4, locale)} mg
            </span>
          </h2>

          <div className="mt-6 rounded-xl bg-base-200 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-base-content/50">{labels.concentration}</div>
            <div className="text-lg font-bold text-base-content">
              {formatLocaleNumber(concentrationMgPerMl, 3, locale)} mg/mL
            </div>
          </div>
        </>
      )}
    </section>
  );
}
