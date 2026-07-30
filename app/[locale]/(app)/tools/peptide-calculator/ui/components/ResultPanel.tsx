import { Readout, CalculatorMode } from "../../lib/readout";
import { ResultLabels } from "../../lib/labels";
import { MUTED } from "../../lib/classes";
import { Vial } from "./Vial";
import { SyringeGauge } from "./SyringeGauge";
import { ResultHeadline } from "./ResultHeadline";
import { ResultAlerts } from "./ResultAlerts";
import { RecapPills } from "./Recap";

import type { Locale } from "locales/types";

interface ResultPanelProps {
  readout: Readout | null;
  mode: CalculatorMode;
  capacity: number;
  waterMl: number;
  labels: ResultLabels;
  locale: Locale;
  recap: string[];
  vialSummary: string;
}

/**
 * The desktop result: settings above, answer below, in that reading order.
 *
 * It is the page's hero — a tinted card the eye lands on after the four settings — and it
 * holds the full-width gauge, because on desktop there is room to show the graduation at the
 * size a syringe is actually read.
 */
export function ResultPanel({ readout, mode, capacity, waterMl, labels, locale, recap, vialSummary }: ResultPanelProps) {
  return (
    <section
      aria-live="polite"
      className="mt-4 hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[#f8fbff] to-[#eef4ff] p-[18px] shadow-3xl dark:from-slate-800 dark:to-slate-900 sm:block"
    >
      {readout === null ? (
        <p className={`text-sm ${MUTED}`}>{labels.invalid}</p>
      ) : (
        <>
          <div className="grid grid-cols-[minmax(0,1fr)_110px] items-center gap-5">
            <div>
              <ResultHeadline labels={labels} locale={locale} mode={mode} readout={readout} size="lg" />
              <RecapPills items={recap} />

              <div className="mt-4">
                <SyringeGauge
                  capacity={capacity}
                  locale={locale}
                  over={readout.over}
                  units={readout.units}
                  unitsLabel={labels.units}
                />
              </div>
            </div>

            <figure className="m-0 text-center">
              <Vial className="mx-auto w-[110px]" variant="mixed" waterMl={waterMl} />
              <figcaption className={`mt-1.5 text-[11px] ${MUTED}`}>
                <b className="block text-slate-700 dark:text-slate-200">{labels.vialCaption}</b>
                {vialSummary}
              </figcaption>
            </figure>
          </div>

          <ResultAlerts labels={labels} readout={readout} />
        </>
      )}
    </section>
  );
}
