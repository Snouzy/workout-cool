import { ReactNode } from "react";

import { MONO, MUTED } from "../../lib/classes";

interface SettingRowProps {
  /** `01`…`04`, in the numbered badge. */
  number: string;
  title: string;
  hint: string;
  /** The vial vignette that identifies what the step is about. Steps 02 and 03 only. */
  vial?: ReactNode;
  children: ReactNode;
}

/**
 * One of the four settings: the question stacked above its options, at every width.
 *
 * There is deliberately no wide-screen variant. A desktop-only label/options row would be a
 * second layout to design, translate and keep in step with this one, for no gain — the four
 * questions read the same way on a phone and on a monitor. The vial sits before the badge so
 * the eye meets the object before it meets the step number.
 */
export function SettingRow({ number, title, hint, vial, children }: SettingRowProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2">
        {vial && <span className="w-[26px] flex-none">{vial}</span>}

        <span
          className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#252F35] text-[10px] font-bold leading-none text-white dark:bg-slate-600 ${MONO}`}
        >
          {number}
        </span>

        <span className="min-w-0 text-sm font-semibold leading-snug text-base-content">
          {title}
          <small className={`block text-[10px] font-medium leading-tight ${MUTED}`}>{hint}</small>
        </span>
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
