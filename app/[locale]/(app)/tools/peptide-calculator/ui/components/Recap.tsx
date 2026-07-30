import { MUTED } from "../../lib/classes";
import { Vial } from "./Vial";

/**
 * The same recap in the two shapes the layouts want: pills next to the desktop headline,
 * a sentence with the reconstituted vial on mobile.
 *
 * It exists to answer "where does that number come from?" without scrolling back up to the
 * settings — the one question a calculator that recomputes on every keystroke keeps raising.
 */
export function RecapPills({ items }: { items: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          className={`rounded-full border border-base-200 bg-base-100 px-2.5 py-1 text-[11px] font-semibold dark:border-slate-700 ${MUTED}`}
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function RecapHint({ sentence, waterMl }: { sentence: string; waterMl: number }) {
  return (
    <div
      className={`mt-3 flex items-center gap-3 rounded-xl border border-base-200 bg-gradient-to-br from-slate-50 to-slate-100 p-2.5 text-[11px] leading-[1.5] dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 ${MUTED}`}
    >
      <Vial className="w-14 flex-none" variant="mixed" waterMl={waterMl} />
      <p>{sentence}</p>
    </div>
  );
}
