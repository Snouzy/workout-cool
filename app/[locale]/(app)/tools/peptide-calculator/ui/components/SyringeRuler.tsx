import { formatLocaleNumber } from "../../lib/formatNumber";

import type { Locale } from "locales/types";

interface SyringeRulerProps {
  units: number;
  capacity: number;
  unitsLabel: string;
  locale: Locale;
}

const LABEL_EVERY = 5;

function getLabelTransformClass(fillPercent: number): string {
  if (fillPercent < 10) return "translate-x-0";
  if (fillPercent > 90) return "-translate-x-full";
  return "-translate-x-1/2";
}

export function SyringeRuler({ units, capacity, unitsLabel, locale }: SyringeRulerProps) {
  const ticks = Array.from({ length: capacity + 1 }, (_, index) => index);
  const clamped = Math.min(Math.max(units, 0), capacity);
  const fillPercent = (clamped / capacity) * 100;

  return (
    <div className="mt-6">
      <div className="mb-1 flex justify-between text-xs text-base-content/50">
        <span>0</span>
        <span>
          {capacity} {unitsLabel}
        </span>
      </div>

      <div className="relative h-16 rounded-lg border border-base-content/15 bg-base-100">
        <div
          className="absolute inset-y-0 left-0 rounded-l-lg bg-gradient-to-r from-primary/70 to-primary"
          style={{ width: `${fillPercent}%` }}
        />

        {ticks.map((tick) => {
          const isLabelled = tick % LABEL_EVERY === 0;

          return (
            <div
              className={`absolute top-0 ${isLabelled ? "" : "hidden sm:block"}`}
              key={tick}
              style={{ left: `${(tick / capacity) * 100}%` }}
            >
              <div className={`w-px bg-base-content/40 ${isLabelled ? "h-5" : "h-2.5"}`} />
              {isLabelled && tick > 0 && tick < capacity && (
                <span className="absolute left-1/2 top-5 -translate-x-1/2 text-[10px] text-base-content/60">{tick}</span>
              )}
            </div>
          );
        })}

        <div className="absolute inset-y-0 w-0.5 bg-base-content" style={{ left: `${fillPercent}%` }} />
      </div>

      <div className="relative h-6">
        <span
          className={`absolute rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-content ${getLabelTransformClass(fillPercent)}`}
          style={{ left: `${fillPercent}%` }}
        >
          {formatLocaleNumber(units, 2, locale)} {unitsLabel}
        </span>
      </div>
    </div>
  );
}
