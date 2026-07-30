"use client";

import { useMemo, useRef, useState } from "react";
import { useCurrentLocale, useI18n } from "locales/client";
import { useInView } from "framer-motion";

import { PeptideInput } from "../lib/types";
import { buildReadout, CalculatorMode } from "../lib/readout";
import { DEFAULT_INPUT, STEP_UNITS, STEP_VIAL_MG, STEP_WATER_ML, SYRINGE_OPTIONS, VIAL_MG_OPTIONS, WATER_ML_OPTIONS } from "../lib/presets";
import { ResultLabels } from "../lib/labels";
import { formatDose, formatLocaleNumber, roundToPrecision } from "../lib/formatNumber";
import { MUTED } from "../lib/classes";
import { usePeptideUrlState } from "./usePeptideUrlState";
import { Vial } from "./components/Vial";
import { ValueChips } from "./components/ValueChips";
import { SyringeChoice } from "./components/SyringeChoice";
import { SettingRow } from "./components/SettingRow";
import { SegmentedControl } from "./components/SegmentedControl";
import { ResultSheet } from "./components/ResultSheet";
import { RecapHint } from "./components/Recap";
import { NumberField } from "./components/NumberField";
import { DoseField } from "./components/DoseField";

interface PeptideCalculatorClientProps {
  defaultInput?: PeptideInput;
  /** The page's own disclaimer text, folded into a collapsed note at the end of the widget. */
  disclaimer: string;
  title: string;
  subtitle: string;
}

/**
 * The calculator: four settings, then the graduation to draw.
 *
 * Desktop and mobile read the same state through two result surfaces — an in-flow hero panel
 * and a sheet pinned above the bottom navigation — because the answer has to stay reachable
 * while the settings are being adjusted, and only one of those two ways works per screen size.
 */
export function PeptideCalculatorClient({ defaultInput = DEFAULT_INPUT, disclaimer, title, subtitle }: PeptideCalculatorClientProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const { input, patch } = usePeptideUrlState(defaultInput);
  const [mode, setMode] = useState<CalculatorMode>("forward");
  const [drawnUnits, setDrawnUnits] = useState(10);
  const [sheetOpen, setSheetOpen] = useState(true);

  const readout = useMemo(() => buildReadout(mode, input, drawnUnits), [mode, input, drawnUnits]);

  const rootRef = useRef<HTMLDivElement>(null);
  const calculatorInView = useInView(rootRef);
  // The reminder bar earns its place in exactly one situation: settings on screen, answer below
  // the fold. Tying it to the settings rather than to the whole widget makes it appear on the
  // first adjustment, which is when the result is furthest away.

  const syringe = SYRINGE_OPTIONS.find((option) => option.capacity === input.syringeCapacity) ?? SYRINGE_OPTIONS[1];
  const syringeLabel = `${formatLocaleNumber(syringe.volumeMl, 1, locale)} mL`;

  /** Switching to reverse carries the current answer over, so the field starts from the truth. */
  const switchMode = (next: CalculatorMode) => {
    if (next === "reverse" && readout) setDrawnUnits(roundToPrecision(readout.units, 2));
    setMode(next);
  };

  const labels: ResultLabels = {
    eyebrowForward: t("tools.peptide-calculator.result.eyebrow_forward"),
    eyebrowReverse: t("tools.peptide-calculator.result.eyebrow_reverse"),
    units: t("tools.peptide-calculator.units"),
    concentration: t("tools.peptide-calculator.result.concentration"),
    volumePerDose: t("tools.peptide-calculator.result.volume_per_dose"),
    dosesPerVial: t("tools.peptide-calculator.result.doses_per_vial"),
    invalid: t("tools.peptide-calculator.result.invalid"),
    vialCaption: t("tools.peptide-calculator.result.vial_caption"),
    overflow: t("tools.peptide-calculator.overflow", {
      units: formatLocaleNumber(readout?.units ?? 0, 2, locale),
      syringe: syringeLabel,
      capacity: syringe.capacity,
    }),
    warnings: {
      EXCEEDS_SYRINGE: t("tools.peptide-calculator.warnings.exceeds_syringe"),
      TOO_SMALL_TO_MEASURE: t("tools.peptide-calculator.warnings.too_small"),
      WATER_EXCEEDS_VIAL: t("tools.peptide-calculator.warnings.water_excess"),
      NOT_A_WHOLE_GRADUATION: t("tools.peptide-calculator.warnings.not_whole_graduation"),
    },
  };

  const dose = readout ? formatDose(readout.doseMcg, locale) : null;
  const recapValues = readout && {
    mg: formatLocaleNumber(input.vialMg, 2, locale),
    ml: formatLocaleNumber(input.waterMl, 2, locale),
    conc: formatLocaleNumber(readout.concentrationMgPerMl, 2, locale),
    doses: formatLocaleNumber(readout.dosesPerVial, 0, locale),
    dose: `${dose?.value} ${dose?.unit}`,
  };

  return (
    <div className="relative" ref={rootRef}>
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-[-0.02em] text-base-content">
            {title}
            <a className="ml-2 whitespace-nowrap text-[13px] font-medium text-primary" href="#how-to">
              {t("tools.peptide-calculator.how_it_works")}
            </a>
          </h1>
          <p className={`mt-1 text-xs ${MUTED}`}>{subtitle}</p>
        </div>

        <div className="">
          <SegmentedControl
            block
            id="mode"
            legend={t("tools.peptide-calculator.mode_legend")}
            onChange={switchMode}
            options={[
              { value: "forward", label: t("tools.peptide-calculator.mode_forward") },
              { value: "reverse", label: t("tools.peptide-calculator.mode_reverse") },
            ]}
            value={mode}
          />
        </div>
      </div>

      <div className="">
        <p className={`hidden text-[11px] uppercase tracking-[0.08em] ${MUTED}`}>{t("tools.peptide-calculator.settings")}</p>

        <SettingRow hint={t("tools.peptide-calculator.step_1_hint")} number="01" title={t("tools.peptide-calculator.step_1_title")}>
          <SyringeChoice
            legend={t("tools.peptide-calculator.step_1_title")}
            locale={locale}
            onChange={(syringeCapacity) => patch({ syringeCapacity })}
            unitsLabel={t("tools.peptide-calculator.units")}
            value={input.syringeCapacity}
          />
        </SettingRow>

        <SettingRow
          hint={t("tools.peptide-calculator.step_2_hint")}
          number="02"
          title={t("tools.peptide-calculator.step_2_title")}
          vial={<Vial className="w-full" variant="powder" />}
        >
          <ValueChips
            legend={t("tools.peptide-calculator.step_2_title")}
            locale={locale}
            onChange={(vialMg) => patch({ vialMg })}
            options={VIAL_MG_OPTIONS}
            otherLabel={t("tools.peptide-calculator.other")}
            step={STEP_VIAL_MG}
            unit="mg"
            value={input.vialMg}
          />
        </SettingRow>

        <SettingRow
          hint={t("tools.peptide-calculator.step_3_hint")}
          number="03"
          title={t("tools.peptide-calculator.step_3_title")}
          vial={<Vial className="w-full" variant="water" waterMl={input.waterMl} />}
        >
          <ValueChips
            legend={t("tools.peptide-calculator.step_3_title")}
            locale={locale}
            onChange={(waterMl) => patch({ waterMl })}
            options={WATER_ML_OPTIONS}
            otherLabel={t("tools.peptide-calculator.other")}
            step={STEP_WATER_ML}
            unit="mL"
            value={input.waterMl}
          />
        </SettingRow>

        <SettingRow
          hint={mode === "forward" ? t("tools.peptide-calculator.step_4_hint") : t("tools.peptide-calculator.step_4_reverse_hint")}
          number="04"
          title={mode === "forward" ? t("tools.peptide-calculator.step_4_title") : t("tools.peptide-calculator.step_4_reverse_title")}
        >
          {mode === "forward" ? (
            <DoseField
              doseMcg={input.doseMcg}
              legend={t("tools.peptide-calculator.step_4_title")}
              locale={locale}
              onChange={(doseMcg) => patch({ doseMcg })}
              otherLabel={t("tools.peptide-calculator.other")}
              unitLabel={t("tools.peptide-calculator.dose_unit")}
            />
          ) : (
            <NumberField
              label={t("tools.peptide-calculator.step_4_reverse_title")}
              onChange={setDrawnUnits}
              step={STEP_UNITS}
              unit={t("tools.peptide-calculator.units")}
              value={drawnUnits}
            />
          )}
        </SettingRow>
      </div>

      {recapValues && (
        <div>
          <RecapHint
            sentence={t("tools.peptide-calculator.recap.sentence", {
              mg: recapValues.mg,
              ml: recapValues.ml,
              conc: recapValues.conc,
              doses: recapValues.doses,
              dose: recapValues.dose,
            })}
            waterMl={input.waterMl}
          />
        </div>
      )}

      <details
        className={`mt-3.5 rounded-lg border border-base-200 bg-gray-200 p-2.5 text-[11px] leading-relaxed dark:border-slate-700 dark:bg-slate-800 ${MUTED}`}
      >
        <summary className="cursor-pointer font-semibold">{t("tools.peptide-calculator.disclaimer_summary")}</summary>
        <p className="mt-2">{disclaimer}</p>
      </details>

      <ResultSheet
        capacity={syringe.capacity}
        labels={labels}
        locale={locale}
        mode={mode}
        onToggle={() => setSheetOpen((open) => !open)}
        open={sheetOpen}
        readout={readout}
        toggleLabel={t("tools.peptide-calculator.result.toggle")}
        visible={calculatorInView}
      />
    </div>
  );
}
