import { Readout } from "../../lib/readout";
import { ResultLabels } from "../../lib/labels";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { MONO, MUTED } from "../../lib/classes";

import type { Locale } from "locales/types";

interface StatTilesProps {
  readout: Readout;
  labels: ResultLabels;
  locale: Locale;
}

function Tile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg bg-gray-300 px-2.5 py-2 dark:bg-slate-800">
      <div className={`text-[9px] uppercase tracking-[0.06em] ${MUTED}`}>{label}</div>
      <div className={`text-[15px] font-bold text-base-content ${MONO}`}>
        {value}
        {unit && <span className="text-[10px] font-medium"> {unit}</span>}
      </div>
    </div>
  );
}

/** The three numbers behind the headline — the ones a user re-checks rather than reads once. */
export function StatTiles({ readout, labels, locale }: StatTilesProps) {
  return (
    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
      <Tile label={labels.concentration} unit="mg/mL" value={formatLocaleNumber(readout.concentrationMgPerMl, 2, locale)} />
      <Tile label={labels.volumePerDose} unit="mL" value={formatLocaleNumber(readout.volumeMl, 3, locale)} />
      <Tile label={labels.dosesPerVial} value={formatLocaleNumber(readout.dosesPerVial, 0, locale)} />
    </div>
  );
}
