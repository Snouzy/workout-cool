import { PeptideResult, WarningCode } from "../../lib/types";
import { SyringeRuler } from "./SyringeRuler";

export interface ResultLabels {
  eyebrow: string;
  drawTo: string;
  units: string;
  concentration: string;
  dosesPerVial: string;
  invalid: string;
  warnings: Record<WarningCode, string>;
}

interface ResultCardProps {
  result: PeptideResult | null;
  capacity: number;
  doseMcg: number;
  labels: ResultLabels;
}

function round(value: number, decimals: number): string {
  return Number(value.toFixed(decimals)).toString();
}

export function ResultCard({ result, capacity, doseMcg, labels }: ResultCardProps) {
  return (
    <section
      aria-live="polite"
      className="mt-10 rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-sm sm:p-8"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">{labels.eyebrow}</p>

      {result === null ? (
        <p className="text-lg text-base-content/60">{labels.invalid}</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-base-content sm:text-4xl">
            {labels.drawTo}{" "}
            <span className="text-primary">
              {round(result.units, 2)} {labels.units}
            </span>
            <span className="ml-3 block text-base font-normal text-base-content/60 sm:inline">
              {doseMcg} mcg = {round(result.volumeMl, 4)} ml
            </span>
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl bg-base-200 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-base-content/50">{labels.concentration}</div>
              <div className="text-lg font-bold text-base-content">{round(result.concentrationMgPerMl, 3)} mg/ml</div>
            </div>
            <div className="rounded-xl bg-base-200 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-base-content/50">{labels.dosesPerVial}</div>
              <div className="text-lg font-bold text-base-content">{result.dosesPerVial}</div>
            </div>
          </div>

          <SyringeRuler capacity={capacity} units={Number(round(result.units, 2))} unitsLabel={labels.units} />

          {result.warnings.length > 0 && (
            <ul className="mt-6 space-y-2">
              {result.warnings.map((warning) => (
                <li
                  className="rounded-xl bg-warning/10 px-4 py-3 text-sm text-base-content"
                  key={warning}
                  role="status"
                >
                  {labels.warnings[warning]}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
