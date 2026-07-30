# Peptide Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publier `/[locale]/tools/peptide-calculator`, un calculateur qui convertit une dose de peptide en volume et en graduations de seringue U-100, dans les 6 locales, positionné sur le cluster `peptide calculator` (201 000 recherches/mois US).

**Architecture:** Un moteur de calcul pur et testé (`lib/calculate.ts`) sans dépendance React, consommé par un Client Component d'orchestration, lui-même rendu par un Server Component qui porte les metadata, le JSON-LD et le contenu SEO. Le contenu long vit dans `seo/page-content.ts` pour ne pas gonfler les fichiers de locale.

**Tech Stack:** Next.js 16.2.1 (App Router), React 19, TypeScript, TailwindCSS + DaisyUI, next-international (`locales/`), Vitest (introduit par ce plan), pnpm.

## Global Constraints

- **Positionnement éditorial : outil de conversion, jamais conseil de dosage.** Aucune dose recommandée nulle part — ni dans l'UI, ni dans les presets, ni dans le contenu, ni dans le schema. Les presets ne pré-remplissent que la **taille du flacon**, donnée d'étiquette factuelle.
- Aucun lien sortant vers un vendeur de peptides.
- Slug anglais `peptide-calculator` dans les 6 locales.
- Locales exactes : `en`, `es`, `fr`, `pt`, `ru`, `zh-CN`. Toute structure `Record<Locale, …>` doit avoir ces 6 clés.
- Habillage visuel : celui des outils existants (`bg-gradient-to-b from-blue-50 to-white` / `dark:from-gray-900 dark:to-gray-800`, cartes DaisyUI, hero emoji). Pas la palette du mockup.
- Aucun fichier de composant ne dépasse ~150 lignes.
- Images seringues déjà présentes : `public/images/syringes/syringe-30-units.png`, `syringe-50-units.png`, `syringe-100-units.png`.
- Valeurs par défaut : seringue 50 U, flacon 10 mg, eau 5 ml, dose 250 mcg → résultat 12,5 U.
- Chaque commit est proposé à l'utilisateur, jamais exécuté sans go explicite (règle projet).

---

### Task 1: Vitest + moteur de calcul

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)
- Create: `app/[locale]/(app)/tools/peptide-calculator/lib/types.ts`
- Create: `app/[locale]/(app)/tools/peptide-calculator/lib/calculate.ts`
- Test: `app/[locale]/(app)/tools/peptide-calculator/lib/calculate.test.ts`

**Interfaces:**
- Consumes: rien.
- Produces: `SyringeCapacity`, `WarningCode`, `PeptideInput`, `PeptideResult`, `calculatePeptideDose(input: PeptideInput): PeptideResult | null`, `calculateDoseFromUnits(input: ReverseInput): number | null`, constante `UNITS_PER_ML = 100`.

- [ ] **Step 1: Installer Vitest**

```bash
pnpm add -D vitest
```

- [ ] **Step 2: Créer `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["app/**/*.test.ts", "src/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Ajouter les scripts dans `package.json`**

Dans `"scripts"`, ajouter :

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Créer `lib/types.ts`**

```ts
export type SyringeCapacity = 30 | 50 | 100;

export type WarningCode = "EXCEEDS_SYRINGE" | "TOO_SMALL_TO_MEASURE" | "WATER_EXCEEDS_VIAL" | "NOT_A_WHOLE_GRADUATION";

export interface PeptideInput {
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  syringeCapacity: SyringeCapacity;
}

export interface ReverseInput {
  vialMg: number;
  waterMl: number;
  units: number;
}

export interface PeptideResult {
  concentrationMgPerMl: number;
  volumeMl: number;
  units: number;
  dosesPerVial: number;
  warnings: WarningCode[];
}
```

- [ ] **Step 5: Écrire les tests qui échouent**

Créer `lib/calculate.test.ts` :

```ts
import { describe, expect, it } from "vitest";

import { calculateDoseFromUnits, calculatePeptideDose } from "./calculate";

const BASE = { vialMg: 10, waterMl: 5, doseMcg: 250, syringeCapacity: 50 } as const;

describe("calculatePeptideDose", () => {
  it("reproduit l'exemple de référence : 10 mg / 5 ml / 250 mcg", () => {
    const result = calculatePeptideDose(BASE);

    expect(result).not.toBeNull();
    expect(result!.concentrationMgPerMl).toBe(2);
    expect(result!.volumeMl).toBeCloseTo(0.125, 10);
    expect(result!.units).toBeCloseTo(12.5, 10);
    expect(result!.dosesPerVial).toBe(40);
    expect(result!.warnings).toEqual([]);
  });

  it("signale EXCEEDS_SYRINGE quand la dose dépasse la seringue", () => {
    const result = calculatePeptideDose({ vialMg: 5, waterMl: 1, doseMcg: 3000, syringeCapacity: 50 });

    expect(result!.units).toBeCloseTo(60, 10);
    expect(result!.warnings).toContain("EXCEEDS_SYRINGE");
  });

  it("signale TOO_SMALL_TO_MEASURE sous 2 graduations", () => {
    const result = calculatePeptideDose({ vialMg: 10, waterMl: 1, doseMcg: 100, syringeCapacity: 50 });

    expect(result!.units).toBeCloseTo(1, 10);
    expect(result!.warnings).toContain("TOO_SMALL_TO_MEASURE");
  });

  it("signale WATER_EXCEEDS_VIAL au-delà de 10 ml", () => {
    const result = calculatePeptideDose({ vialMg: 10, waterMl: 15, doseMcg: 250, syringeCapacity: 50 });

    expect(result!.warnings).toContain("WATER_EXCEEDS_VIAL");
  });

  it("signale NOT_A_WHOLE_GRADUATION hors multiples de 0,5", () => {
    const result = calculatePeptideDose({ vialMg: 10, waterMl: 5, doseMcg: 246, syringeCapacity: 50 });

    expect(result!.units).toBeCloseTo(12.3, 10);
    expect(result!.warnings).toContain("NOT_A_WHOLE_GRADUATION");
  });

  it("ne signale pas NOT_A_WHOLE_GRADUATION sur un demi-multiple", () => {
    expect(calculatePeptideDose(BASE)!.warnings).not.toContain("NOT_A_WHOLE_GRADUATION");
  });

  it("rend null sur entrée invalide", () => {
    expect(calculatePeptideDose({ ...BASE, vialMg: 0 })).toBeNull();
    expect(calculatePeptideDose({ ...BASE, waterMl: -1 })).toBeNull();
    expect(calculatePeptideDose({ ...BASE, doseMcg: Number.NaN })).toBeNull();
    expect(calculatePeptideDose({ ...BASE, vialMg: 5000 })).toBeNull();
  });
});

describe("calculateDoseFromUnits", () => {
  it("est l'inverse exact de calculatePeptideDose", () => {
    const forward = calculatePeptideDose(BASE)!;
    const back = calculateDoseFromUnits({ vialMg: BASE.vialMg, waterMl: BASE.waterMl, units: forward.units });

    expect(back).toBeCloseTo(BASE.doseMcg, 10);
  });

  it("rend null sur entrée invalide", () => {
    expect(calculateDoseFromUnits({ vialMg: 10, waterMl: 5, units: 0 })).toBeNull();
    expect(calculateDoseFromUnits({ vialMg: 0, waterMl: 5, units: 10 })).toBeNull();
  });
});
```

- [ ] **Step 6: Lancer les tests pour vérifier qu'ils échouent**

Run: `pnpm test`
Expected: FAIL — `Failed to resolve import "./calculate"`

- [ ] **Step 7: Écrire `lib/calculate.ts`**

```ts
import { PeptideInput, PeptideResult, ReverseInput, WarningCode } from "./types";

export const UNITS_PER_ML = 100;

const MAX_VIAL_MG = 1000;
const MAX_WATER_ML = 100;
const MAX_DOSE_MCG = 100_000;
const MAX_UNITS = 100;
const MIN_MEASURABLE_UNITS = 2;
const TYPICAL_MAX_WATER_ML = 10;
const EPSILON = 1e-9;

function isPositiveFinite(value: number, max: number): boolean {
  return Number.isFinite(value) && value > 0 && value <= max;
}

function isWholeGraduation(units: number): boolean {
  return Math.abs(units * 2 - Math.round(units * 2)) < EPSILON;
}

export function calculatePeptideDose(input: PeptideInput): PeptideResult | null {
  const { vialMg, waterMl, doseMcg, syringeCapacity } = input;

  if (!isPositiveFinite(vialMg, MAX_VIAL_MG)) return null;
  if (!isPositiveFinite(waterMl, MAX_WATER_ML)) return null;
  if (!isPositiveFinite(doseMcg, MAX_DOSE_MCG)) return null;

  const concentrationMgPerMl = vialMg / waterMl;
  const volumeMl = doseMcg / 1000 / concentrationMgPerMl;
  const units = volumeMl * UNITS_PER_ML;
  const dosesPerVial = Math.floor((vialMg * 1000) / doseMcg);

  const warnings: WarningCode[] = [];

  if (units > syringeCapacity) warnings.push("EXCEEDS_SYRINGE");
  if (units < MIN_MEASURABLE_UNITS) warnings.push("TOO_SMALL_TO_MEASURE");
  if (waterMl > TYPICAL_MAX_WATER_ML) warnings.push("WATER_EXCEEDS_VIAL");
  if (!isWholeGraduation(units)) warnings.push("NOT_A_WHOLE_GRADUATION");

  return { concentrationMgPerMl, volumeMl, units, dosesPerVial, warnings };
}

export function calculateDoseFromUnits(input: ReverseInput): number | null {
  const { vialMg, waterMl, units } = input;

  if (!isPositiveFinite(vialMg, MAX_VIAL_MG)) return null;
  if (!isPositiveFinite(waterMl, MAX_WATER_ML)) return null;
  if (!isPositiveFinite(units, MAX_UNITS)) return null;

  const concentrationMgPerMl = vialMg / waterMl;

  return (units / UNITS_PER_ML) * concentrationMgPerMl * 1000;
}
```

- [ ] **Step 8: Lancer les tests pour vérifier qu'ils passent**

Run: `pnpm test`
Expected: PASS — 9 tests.

- [ ] **Step 9: Proposer le commit**

Résumer le diff et proposer, sans exécuter :

```bash
git add vitest.config.ts package.json pnpm-lock.yaml "app/[locale]/(app)/tools/peptide-calculator/lib"
git commit -m "feat(tools): add peptide dose calculation engine with vitest"
```

---

### Task 2: Presets de flacons

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/lib/presets.ts`
- Test: `app/[locale]/(app)/tools/peptide-calculator/lib/presets.test.ts`

**Interfaces:**
- Consumes: rien.
- Produces: `PeptidePreset { id: string; label: string; vialSizesMg: number[] }`, `PEPTIDE_PRESETS: PeptidePreset[]`, `VIAL_MG_OPTIONS`, `WATER_ML_OPTIONS`, `DOSE_MCG_OPTIONS`, `SYRINGE_OPTIONS`.

Les `label` sont des noms propres de molécules : jamais traduits, jamais passés par i18n.

- [ ] **Step 1: Écrire le test qui échoue**

```ts
import { describe, expect, it } from "vitest";

import { PEPTIDE_PRESETS, SYRINGE_OPTIONS } from "./presets";

describe("PEPTIDE_PRESETS", () => {
  it("expose des identifiants uniques", () => {
    const ids = PEPTIDE_PRESETS.map((preset) => preset.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("n'expose que des tailles de flacon positives et finies", () => {
    for (const preset of PEPTIDE_PRESETS) {
      expect(preset.vialSizesMg.length).toBeGreaterThan(0);

      for (const size of preset.vialSizesMg) {
        expect(Number.isFinite(size)).toBe(true);
        expect(size).toBeGreaterThan(0);
      }
    }
  });

  it("expose trois seringues U-100 standard", () => {
    expect(SYRINGE_OPTIONS.map((option) => option.capacity)).toEqual([30, 50, 100]);
  });
});
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `pnpm test presets`
Expected: FAIL — `Failed to resolve import "./presets"`

- [ ] **Step 3: Écrire `lib/presets.ts`**

```ts
import { SyringeCapacity } from "./types";

export interface PeptidePreset {
  id: string;
  label: string;
  vialSizesMg: number[];
}

export interface SyringeOption {
  capacity: SyringeCapacity;
  volumeMl: number;
  image: string;
}

/**
 * Tailles de flacon couramment vendues. Donnée d'étiquette factuelle :
 * un preset ne pré-remplit jamais une dose.
 */
export const PEPTIDE_PRESETS: PeptidePreset[] = [
  { id: "bpc-157", label: "BPC-157", vialSizesMg: [5, 10] },
  { id: "tb-500", label: "TB-500", vialSizesMg: [5, 10] },
  { id: "ipamorelin", label: "Ipamorelin", vialSizesMg: [5, 10] },
  { id: "cjc-1295", label: "CJC-1295", vialSizesMg: [2, 5] },
  { id: "tirzepatide", label: "Tirzepatide", vialSizesMg: [10, 20, 30, 60] },
  { id: "retatrutide", label: "Retatrutide", vialSizesMg: [10, 20] },
  { id: "semaglutide", label: "Semaglutide", vialSizesMg: [5, 10] },
  { id: "ghk-cu", label: "GHK-Cu", vialSizesMg: [50, 100] },
];

export const SYRINGE_OPTIONS: SyringeOption[] = [
  { capacity: 30, volumeMl: 0.3, image: "/images/syringes/syringe-30-units.png" },
  { capacity: 50, volumeMl: 0.5, image: "/images/syringes/syringe-50-units.png" },
  { capacity: 100, volumeMl: 1, image: "/images/syringes/syringe-100-units.png" },
];

export const VIAL_MG_OPTIONS = [5, 10, 20, 50, 100];
export const WATER_ML_OPTIONS = [1, 2, 3, 5];
export const DOSE_MCG_OPTIONS = [50, 100, 250, 500];

export const DEFAULT_INPUT = {
  vialMg: 10,
  waterMl: 5,
  doseMcg: 250,
  syringeCapacity: 50 as SyringeCapacity,
};
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `pnpm test`
Expected: PASS — 12 tests.

- [ ] **Step 5: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/lib"
git commit -m "feat(tools): add peptide vial size presets"
```

---

### Task 3: Chips d'options et sélecteur de seringue

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/OptionChips.tsx`
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/SyringeSelector.tsx`

**Interfaces:**
- Consumes: `SYRINGE_OPTIONS` (Task 2), `SyringeCapacity` (Task 1).
- Produces: `<OptionChips name options value onChange suffix legend otherLabel />`, `<SyringeSelector value onChange unitsLabel />`.

Les deux composants utilisent des `<input type="radio">` natifs masqués visuellement : la navigation aux flèches et les annonces lecteur d'écran sont acquises sans JavaScript de gestion du focus.

- [ ] **Step 1: Créer `OptionChips.tsx`**

```tsx
"use client";

import { useState } from "react";

interface OptionChipsProps {
  name: string;
  legend: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  otherLabel: string;
}

function chipClassName(selected: boolean): string {
  return [
    "cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
    selected
      ? "border-primary bg-primary/10 text-primary"
      : "border-base-content/15 bg-base-100 text-base-content/70 hover:border-primary/40",
  ].join(" ");
}

export function OptionChips({ name, legend, options, value, onChange, suffix, otherLabel }: OptionChipsProps) {
  const [customMode, setCustomMode] = useState(!options.includes(value));
  const isCustom = customMode || !options.includes(value);

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{legend}</legend>

      {options.map((option) => (
        <label className={chipClassName(!isCustom && option === value)} key={option}>
          <input
            checked={!isCustom && option === value}
            className="sr-only"
            name={name}
            onChange={() => {
              setCustomMode(false);
              onChange(option);
            }}
            type="radio"
            value={option}
          />
          {option} {suffix}
        </label>
      ))}

      {isCustom ? (
        <input
          aria-label={otherLabel}
          className="input input-bordered w-28 rounded-xl"
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          step="any"
          type="number"
          value={value}
        />
      ) : (
        <label className={chipClassName(false)}>
          <input className="sr-only" name={name} onChange={() => setCustomMode(true)} type="radio" />
          {otherLabel}
        </label>
      )}
    </fieldset>
  );
}
```

- [ ] **Step 2: Créer `SyringeSelector.tsx`**

```tsx
"use client";

import Image from "next/image";

import { SYRINGE_OPTIONS } from "../../lib/presets";
import { SyringeCapacity } from "../../lib/types";

interface SyringeSelectorProps {
  legend: string;
  value: SyringeCapacity;
  onChange: (value: SyringeCapacity) => void;
  unitsLabel: string;
}

export function SyringeSelector({ legend, value, onChange, unitsLabel }: SyringeSelectorProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">{legend}</legend>

      {SYRINGE_OPTIONS.map((option, index) => (
        <label
          className={[
            "flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors",
            "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
            option.capacity === value
              ? "border-primary bg-primary/5"
              : "border-base-content/15 bg-base-100 hover:border-primary/40",
          ].join(" ")}
          key={option.capacity}
        >
          <input
            checked={option.capacity === value}
            className="sr-only"
            name="syringe"
            onChange={() => onChange(option.capacity)}
            type="radio"
            value={option.capacity}
          />

          <div className="min-w-[4.5rem]">
            <div className="text-lg font-bold text-base-content">{option.volumeMl} ml</div>
            <div className="text-sm text-base-content/60">
              {option.capacity} {unitsLabel}
            </div>
          </div>

          <Image
            alt=""
            className="h-auto w-full max-w-[13rem] object-contain"
            height={80}
            priority={index === 0}
            src={option.image}
            width={320}
          />
        </label>
      ))}
    </fieldset>
  );
}
```

- [ ] **Step 3: Vérifier la compilation et le lint**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: aucune erreur sur les deux nouveaux fichiers.

- [ ] **Step 4: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/ui/components"
git commit -m "feat(tools): add peptide calculator option chips and syringe selector"
```

---

### Task 4: Règle graduée et carte de résultat

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/SyringeRuler.tsx`
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/ResultCard.tsx`

**Interfaces:**
- Consumes: `PeptideResult`, `SyringeCapacity` (Task 1).
- Produces: `<SyringeRuler units capacity unitsLabel />`, `<ResultCard result capacity labels />` où `labels` est un objet plat de chaînes déjà traduites.

**Écart assumé par rapport au spec :** la règle est construite en `div` positionnés plutôt qu'en SVG. Le texte des graduations reste ainsi à taille lisible quelle que soit la largeur, ce qu'un `viewBox` SVG proportionnel ne permet pas.

- [ ] **Step 1: Créer `SyringeRuler.tsx`**

```tsx
interface SyringeRulerProps {
  units: number;
  capacity: number;
  unitsLabel: string;
}

const LABEL_EVERY = 5;

export function SyringeRuler({ units, capacity, unitsLabel }: SyringeRulerProps) {
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
          className="absolute -translate-x-1/2 rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-content"
          style={{ left: `${fillPercent}%` }}
        >
          {units} {unitsLabel}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Créer `ResultCard.tsx`**

```tsx
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
```

- [ ] **Step 3: Vérifier la compilation et le lint**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 4: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/ui/components"
git commit -m "feat(tools): add peptide syringe ruler and result card"
```

---

### Task 5: Client d'orchestration et état dans l'URL

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/PeptideCalculatorClient.tsx`

**Interfaces:**
- Consumes: `calculatePeptideDose` (Task 1), `PEPTIDE_PRESETS`/`VIAL_MG_OPTIONS`/`WATER_ML_OPTIONS`/`DOSE_MCG_OPTIONS`/`DEFAULT_INPUT` (Task 2), `OptionChips`/`SyringeSelector` (Task 3), `ResultCard`/`ResultLabels` (Task 4), `useI18n` de `locales/client`.
- Produces: `<PeptideCalculatorClient defaultInput />`.

Clés i18n consommées, toutes sous `tools.peptide-calculator.*` (définies en Task 9) : `presets_legend`, `step_1_eyebrow`, `step_1_title`, `step_2_eyebrow`, `step_2_title`, `step_3_eyebrow`, `step_3_title`, `step_4_eyebrow`, `step_4_title`, `other`, `units`, `result.eyebrow`, `result.draw_to`, `result.concentration`, `result.doses_per_vial`, `result.invalid`, `warnings.exceeds_syringe`, `warnings.too_small`, `warnings.water_excess`, `warnings.not_whole_graduation`.

- [ ] **Step 1: Créer `PeptideCalculatorClient.tsx`**

```tsx
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { useI18n } from "locales/client";

import { calculatePeptideDose } from "../lib/calculate";
import { DEFAULT_INPUT, DOSE_MCG_OPTIONS, PEPTIDE_PRESETS, VIAL_MG_OPTIONS, WATER_ML_OPTIONS } from "../lib/presets";
import { PeptideInput, SyringeCapacity } from "../lib/types";
import { OptionChips } from "./components/OptionChips";
import { ResultCard } from "./components/ResultCard";
import { SyringeSelector } from "./components/SyringeSelector";

function readFromUrl(fallback: PeptideInput): PeptideInput {
  if (typeof window === "undefined") return fallback;

  const params = new URLSearchParams(window.location.search);
  const read = (key: string, value: number) => {
    const parsed = Number(params.get(key));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : value;
  };
  const syringe = read("syringe", fallback.syringeCapacity);

  return {
    vialMg: read("vial", fallback.vialMg),
    waterMl: read("water", fallback.waterMl),
    doseMcg: read("dose", fallback.doseMcg),
    syringeCapacity: ([30, 50, 100] as const).includes(syringe as SyringeCapacity)
      ? (syringe as SyringeCapacity)
      : fallback.syringeCapacity,
  };
}

interface PeptideCalculatorClientProps {
  defaultInput?: PeptideInput;
}

export function PeptideCalculatorClient({ defaultInput = DEFAULT_INPUT }: PeptideCalculatorClientProps) {
  const t = useI18n();
  const [input, setInput] = useState<PeptideInput>(defaultInput);

  useEffect(() => {
    setInput(readFromUrl(defaultInput));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      vial: String(input.vialMg),
      water: String(input.waterMl),
      dose: String(input.doseMcg),
      syringe: String(input.syringeCapacity),
    });

    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
  }, [input]);

  const result = useMemo(() => calculatePeptideDose(input), [input]);
  const patch = (partial: Partial<PeptideInput>) => setInput((current) => ({ ...current, ...partial }));

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/50">
          {t("tools.peptide-calculator.presets_legend")}
        </p>
        <div className="flex flex-wrap gap-2">
          {PEPTIDE_PRESETS.map((preset) => (
            <button
              className="rounded-full border border-base-content/15 bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content/80 transition-colors hover:border-primary/50 hover:text-primary"
              key={preset.id}
              onClick={() => patch({ vialMg: preset.vialSizesMg[0] })}
              type="button"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Step eyebrow={t("tools.peptide-calculator.step_1_eyebrow")} number="01" title={t("tools.peptide-calculator.step_1_title")}>
          <SyringeSelector
            legend={t("tools.peptide-calculator.step_1_title")}
            onChange={(syringeCapacity) => patch({ syringeCapacity })}
            unitsLabel={t("tools.peptide-calculator.units")}
            value={input.syringeCapacity}
          />
        </Step>

        <div className="flex flex-col gap-8">
          <Step eyebrow={t("tools.peptide-calculator.step_2_eyebrow")} number="02" title={t("tools.peptide-calculator.step_2_title")}>
            <OptionChips
              legend={t("tools.peptide-calculator.step_2_title")}
              name="vial"
              onChange={(vialMg) => patch({ vialMg })}
              options={VIAL_MG_OPTIONS}
              otherLabel={t("tools.peptide-calculator.other")}
              suffix="mg"
              value={input.vialMg}
            />
          </Step>

          <Step eyebrow={t("tools.peptide-calculator.step_3_eyebrow")} number="03" title={t("tools.peptide-calculator.step_3_title")}>
            <OptionChips
              legend={t("tools.peptide-calculator.step_3_title")}
              name="water"
              onChange={(waterMl) => patch({ waterMl })}
              options={WATER_ML_OPTIONS}
              otherLabel={t("tools.peptide-calculator.other")}
              suffix="ml"
              value={input.waterMl}
            />
          </Step>

          <Step eyebrow={t("tools.peptide-calculator.step_4_eyebrow")} number="04" title={t("tools.peptide-calculator.step_4_title")}>
            <OptionChips
              legend={t("tools.peptide-calculator.step_4_title")}
              name="dose"
              onChange={(doseMcg) => patch({ doseMcg })}
              options={DOSE_MCG_OPTIONS}
              otherLabel={t("tools.peptide-calculator.other")}
              suffix="mcg"
              value={input.doseMcg}
            />
          </Step>
        </div>
      </div>

      <ResultCard
        capacity={input.syringeCapacity}
        doseMcg={input.doseMcg}
        labels={{
          eyebrow: t("tools.peptide-calculator.result.eyebrow"),
          drawTo: t("tools.peptide-calculator.result.draw_to"),
          units: t("tools.peptide-calculator.units"),
          concentration: t("tools.peptide-calculator.result.concentration"),
          dosesPerVial: t("tools.peptide-calculator.result.doses_per_vial"),
          invalid: t("tools.peptide-calculator.result.invalid"),
          warnings: {
            EXCEEDS_SYRINGE: t("tools.peptide-calculator.warnings.exceeds_syringe"),
            TOO_SMALL_TO_MEASURE: t("tools.peptide-calculator.warnings.too_small"),
            WATER_EXCEEDS_VIAL: t("tools.peptide-calculator.warnings.water_excess"),
            NOT_A_WHOLE_GRADUATION: t("tools.peptide-calculator.warnings.not_whole_graduation"),
          },
        }}
        result={result}
      />
    </div>
  );
}

function Step({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
          {number}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">{eyebrow}</p>
          <h2 className="text-lg font-bold text-base-content">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Vérifier la compilation et le lint**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: aucune erreur. Les clés i18n consommées ici existent déjà — Task 9 s'exécute avant cette tâche.

- [ ] **Step 3: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/ui"
git commit -m "feat(tools): add peptide calculator client with shareable url state"
```

---

### Task 5b: Mode inverse (unités → dose)

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/ReverseResultCard.tsx`
- Modify: `app/[locale]/(app)/tools/peptide-calculator/lib/presets.ts` (ajout de `UNITS_OPTIONS`)
- Modify: `app/[locale]/(app)/tools/peptide-calculator/ui/PeptideCalculatorClient.tsx`

**Interfaces:**
- Consumes: `calculateDoseFromUnits` (Task 1), `OptionChips` (Task 3), `ResultCard` (Task 4).
- Produces: `<ReverseResultCard units doseMcg concentrationMgPerMl labels />`, `UNITS_OPTIONS`.

Cible `reverse peptide calculator` (210/mois) et `how many units is 250 mcg` (170/mois). Le moteur est déjà réversible et testé : cette tâche n'ajoute que l'interface.

Clés i18n supplémentaires, à créer en Task 9 : `mode_legend`, `mode_forward`, `mode_reverse`, `step_4_reverse_eyebrow`, `step_4_reverse_title`, `result.dose_is`.

- [ ] **Step 1: Ajouter `UNITS_OPTIONS` dans `lib/presets.ts`**

```ts
export const UNITS_OPTIONS = [5, 10, 25, 50];
```

- [ ] **Step 2: Créer `ReverseResultCard.tsx`**

```tsx
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
}

function round(value: number, decimals: number): string {
  return Number(value.toFixed(decimals)).toString();
}

export function ReverseResultCard({ doseMcg, concentrationMgPerMl, units, labels }: ReverseResultCardProps) {
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
            {labels.doseIs} <span className="text-primary">{round(doseMcg, 2)} mcg</span>
            <span className="ml-3 block text-base font-normal text-base-content/60 sm:inline">
              {units} {labels.units} = {round(doseMcg / 1000, 4)} mg
            </span>
          </h2>

          <div className="mt-6 rounded-xl bg-base-200 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-base-content/50">{labels.concentration}</div>
            <div className="text-lg font-bold text-base-content">{round(concentrationMgPerMl, 3)} mg/ml</div>
          </div>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Câbler le mode dans `PeptideCalculatorClient.tsx`**

Ajouter aux imports :

```tsx
import { calculateDoseFromUnits, calculatePeptideDose } from "../lib/calculate";
import { UNITS_OPTIONS } from "../lib/presets";
import { ReverseResultCard } from "./components/ReverseResultCard";
```

Ajouter l'état, juste après `const [input, setInput] = useState<PeptideInput>(defaultInput);` :

```tsx
const [mode, setMode] = useState<"forward" | "reverse">("forward");
const [units, setUnits] = useState(10);

const reverseDose = useMemo(
  () => calculateDoseFromUnits({ vialMg: input.vialMg, waterMl: input.waterMl, units }),
  [input.vialMg, input.waterMl, units],
);
```

Insérer le sélecteur de mode juste avant le bloc des presets :

```tsx
<fieldset className="mb-6 flex flex-wrap gap-2">
  <legend className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/50">
    {t("tools.peptide-calculator.mode_legend")}
  </legend>

  {(["forward", "reverse"] as const).map((value) => (
    <label
      className={[
        "cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
        mode === value
          ? "border-primary bg-primary/10 text-primary"
          : "border-base-content/15 bg-base-100 text-base-content/70 hover:border-primary/40",
      ].join(" ")}
      key={value}
    >
      <input checked={mode === value} className="sr-only" name="mode" onChange={() => setMode(value)} type="radio" />
      {value === "forward" ? t("tools.peptide-calculator.mode_forward") : t("tools.peptide-calculator.mode_reverse")}
    </label>
  ))}
</fieldset>
```

Remplacer l'étape 04 par un rendu conditionnel :

```tsx
{mode === "forward" ? (
  <Step eyebrow={t("tools.peptide-calculator.step_4_eyebrow")} number="04" title={t("tools.peptide-calculator.step_4_title")}>
    <OptionChips
      legend={t("tools.peptide-calculator.step_4_title")}
      name="dose"
      onChange={(doseMcg) => patch({ doseMcg })}
      options={DOSE_MCG_OPTIONS}
      otherLabel={t("tools.peptide-calculator.other")}
      suffix="mcg"
      value={input.doseMcg}
    />
  </Step>
) : (
  <Step
    eyebrow={t("tools.peptide-calculator.step_4_reverse_eyebrow")}
    number="04"
    title={t("tools.peptide-calculator.step_4_reverse_title")}
  >
    <OptionChips
      legend={t("tools.peptide-calculator.step_4_reverse_title")}
      name="units"
      onChange={setUnits}
      options={UNITS_OPTIONS}
      otherLabel={t("tools.peptide-calculator.other")}
      suffix={t("tools.peptide-calculator.units")}
      value={units}
    />
  </Step>
)}
```

Remplacer le rendu de `<ResultCard … />` par :

```tsx
{mode === "forward" ? (
  <ResultCard /* props inchangées */ />
) : (
  <ReverseResultCard
    concentrationMgPerMl={input.vialMg / input.waterMl}
    doseMcg={reverseDose}
    labels={{
      eyebrow: t("tools.peptide-calculator.result.eyebrow"),
      doseIs: t("tools.peptide-calculator.result.dose_is"),
      units: t("tools.peptide-calculator.units"),
      concentration: t("tools.peptide-calculator.result.concentration"),
      invalid: t("tools.peptide-calculator.result.invalid"),
    }}
    units={units}
  />
)}
```

- [ ] **Step 4: Vérifier dans le navigateur**

Run: `pnpm dev`, ouvrir `/en/tools/peptide-calculator`, basculer en mode inverse.
Expected: flacon 10 mg, eau 5 ml, 10 unités → **200 mcg**. Rebasculer en mode direct avec 250 mcg redonne 12,5 U.

- [ ] **Step 5: Vérifier le lint et le typage**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 6: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator"
git commit -m "feat(tools): add reverse mode to peptide calculator"
```

---

### Task 6: Métadonnées SEO des 6 locales

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/seo/config.ts`

**Interfaces:**
- Consumes: `Locale` de `locales/types`.
- Produces: `PEPTIDE_CALCULATOR_SEO: Record<Locale, { title: string; description: string; keywords: string[] }>`.

Les mots-clés de chaque locale viennent de la recherche, pas d'une traduction littérale de l'anglais.

- [ ] **Step 1: Créer `seo/config.ts`**

```ts
import { Locale } from "locales/types";

export const PEPTIDE_CALCULATOR_SEO: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "Peptide Calculator — Reconstitution, Dosage & Syringe Units",
    description:
      "Free peptide calculator: enter vial size, bacteriostatic water and dose to get the exact units to draw on a U-100 insulin syringe.",
    keywords: [
      "peptide calculator",
      "peptide dosage calculator",
      "peptide reconstitution calculator",
      "peptide dose calculator",
      "peptide mixing calculator",
      "peptide bac water calculator",
      "reconstitution calculator",
      "mcg to units calculator",
      "peptide dosing chart",
      "peptide reconstitution chart",
      "insulin syringe units",
      "U-100 syringe calculator",
      "bacteriostatic water calculator",
    ],
  },
  es: {
    title: "Calculadora de Péptidos — Reconstitución, Dosis y Unidades",
    description:
      "Calculadora de péptidos gratuita: introduce los mg del vial, el agua bacteriostática y la dosis para saber cuántas unidades cargar en una jeringa U-100.",
    keywords: [
      "calculadora de péptidos",
      "calculadora dosis péptidos",
      "reconstitución de péptidos",
      "agua bacteriostática calculadora",
      "unidades jeringa insulina",
      "jeringa U-100",
      "conversión mcg a unidades",
      "calculadora de reconstitución",
    ],
  },
  fr: {
    title: "Calculateur de Peptides — Reconstitution, Dose et Unités",
    description:
      "Calculateur de peptides gratuit : indiquez les mg du flacon, l'eau bactériostatique et la dose pour obtenir les unités exactes à prélever sur une seringue U-100.",
    keywords: [
      "calculateur peptide",
      "calculateur de peptides",
      "calcul dose peptide",
      "reconstitution peptide",
      "eau bactériostatique calcul",
      "unités seringue insuline",
      "seringue U-100",
      "conversion mcg unités",
      "calculateur de reconstitution",
    ],
  },
  pt: {
    title: "Calculadora de Peptídeos — Reconstituição, Dose e Unidades",
    description:
      "Calculadora de peptídeos gratuita: informe os mg do frasco, a água bacteriostática e a dose para saber quantas unidades puxar em uma seringa U-100.",
    keywords: [
      "calculadora de peptídeos",
      "calculadora dose peptídeo",
      "reconstituição de peptídeos",
      "água bacteriostática calculadora",
      "unidades seringa insulina",
      "seringa U-100",
      "conversão mcg para unidades",
      "calculadora de reconstituição",
    ],
  },
  ru: {
    title: "Калькулятор пептидов — разведение, доза и единицы шприца",
    description:
      "Бесплатный калькулятор пептидов: укажите мг во флаконе, объём воды и дозу, чтобы узнать точное количество единиц на инсулиновом шприце U-100.",
    keywords: [
      "калькулятор пептидов",
      "разведение пептидов калькулятор",
      "калькулятор дозировки пептидов",
      "бактериостатическая вода",
      "единицы инсулинового шприца",
      "шприц U-100",
      "перевод мкг в единицы",
    ],
  },
  "zh-CN": {
    title: "多肽计算器 — 复溶、剂量与注射器单位换算",
    description: "免费多肽计算器：输入西林瓶毫克数、抑菌水体积和目标剂量，即可得出 U-100 胰岛素注射器上需要抽取的精确刻度。",
    keywords: [
      "多肽计算器",
      "多肽剂量计算器",
      "多肽复溶计算器",
      "抑菌水计算",
      "胰岛素注射器单位",
      "U-100 注射器",
      "微克换算单位",
    ],
  },
};
```

- [ ] **Step 2: Vérifier le typage**

Run: `pnpm exec tsc --noEmit`
Expected: aucune erreur — si une locale manque, `Record<Locale, …>` la signale.

- [ ] **Step 3: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/seo/config.ts"
git commit -m "feat(tools): add peptide calculator seo metadata for 6 locales"
```

---

### Task 7: Structure du contenu SEO et composants d'affichage

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/seo/page-content.ts` (structure + locale `en` remplie)
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/SEOContentServer.tsx`
- Create: `app/[locale]/(app)/tools/peptide-calculator/ui/components/FAQAccordion.tsx`

**Interfaces:**
- Consumes: `Locale`.
- Produces: types `PeptideSection { id: SectionId; heading: string; lead: string; body: string[] }`, `PeptideTable { caption: string; headers: string[]; rows: string[][] }`, `PeptideFAQ { question: string; answer: string }`, `PeptidePageContent { heroSubtitle: string; sections: PeptideSection[]; reconstitutionTable: PeptideTable; conversionTable: PeptideTable; faq: PeptideFAQ[]; disclaimer: string }`, et `PEPTIDE_CALCULATOR_CONTENT: Partial<Record<Locale, PeptidePageContent>>`.

`PEPTIDE_CALCULATOR_CONTENT` est volontairement `Partial` : ce plan livre la locale `en` ici, et les 5 autres en Tasks 11 à 15. `page.tsx` replie déjà sur `en` via `PEPTIDE_CALCULATOR_CONTENT[locale] || PEPTIDE_CALCULATOR_CONTENT.en`. Aucune locale n'est aliasée sur une autre : une locale est soit rédigée, soit absente. Task 15 resserre le type en `Record<Locale, …>` une fois les 6 présentes.

**Brief de rédaction EN — contraintes non négociables :**

- ~1 800 mots au total.
- Chaque `lead` de section fait 40 à 60 mots, se suffit à lui-même, ne commence pas par un pronom ou un connecteur renvoyant au paragraphe précédent. C'est le bloc que les AI Overviews citent.
- Aucune dose recommandée. Le vocabulaire est celui de la conversion : *vial size*, *concentration*, *volume*, *units*, jamais *recommended dose* ni *typical protocol*.
- Les 8 sections, dans l'ordre, avec leur `id` exact — c'est l'`id` qui pilote l'insertion des tableaux, jamais la position :

  | `id` | `heading` (EN) |
  |---|---|
  | `how-to` | `How to use this peptide calculator` |
  | `formula` | `The reconstitution formula, explained` |
  | `chart` | `Peptide reconstitution chart` |
  | `conversion` | `Converting mcg to insulin syringe units` |
  | `u100` | `Why a U-100 syringe reads 100 units per millilitre` |
  | `water` | `Bacteriostatic water vs sterile water` |
  | `mistakes` | `Common peptide calculation mistakes` |
  | `faq` | `Frequently asked questions` |

  Les `id` sont identiques dans les 6 locales ; seuls les `heading` sont rédigés par langue.

**`reconstitutionTable` — contenu exact** (format calqué sur celui qui détient le PAA aujourd'hui) :

| Peptide amount | Bacteriostatic water added | Final concentration |
|---|---|---|
| 5 mg | 1 mL | 5 mg/mL |
| 5 mg | 2 mL | 2.5 mg/mL |
| 10 mg | 2 mL | 5 mg/mL |
| 10 mg | 5 mL | 2 mg/mL |
| 15 mg | 3 mL | 5 mg/mL |
| 20 mg | 4 mL | 5 mg/mL |
| 30 mg | 3 mL | 10 mg/mL |

**`conversionTable` — contenu exact**, vérifié contre le moteur (`units = doseMcg / (concentration × 10)`) :

| Dose | at 2 mg/mL | at 5 mg/mL | at 10 mg/mL |
|---|---|---|---|
| 250 mcg | 12.5 U | 5 U | 2.5 U |
| 500 mcg | 25 U | 10 U | 5 U |
| 1000 mcg | 50 U | 20 U | 10 U |
| 2000 mcg | 100 U | 40 U | 20 U |

**`faq` — les 8 questions exactes** (les 6 premières sont les PAA relevés le 2026-07-29) :

1. How to calculate peptide reconstitution?
2. How many mL of bacteriostatic water to mix with peptides?
3. How many mL to reconstitute 10 mg?
4. How to reconstitute 30 mg of peptides?
5. How much water to reconstitute 10 mg of peptide?
6. How to figure out reconstitution?
7. How many units is 250 mcg on an insulin syringe?
8. What does U-100 mean on an insulin syringe?

Chaque `answer` fait 40 à 60 mots et répond directement dès la première phrase.

- [ ] **Step 1: Créer `seo/page-content.ts` avec les types et la locale `en`**

Squelette à remplir avec la prose rédigée selon le brief ci-dessus. Les 5 autres locales sont ajoutées en Tasks 11 à 15 ; d'ici là, elles pointent temporairement sur l'objet `en` pour que `Record<Locale, …>` compile.

```ts
import { Locale } from "locales/types";

export type SectionId = "how-to" | "formula" | "chart" | "conversion" | "u100" | "water" | "mistakes" | "faq";

export interface PeptideSection {
  id: SectionId;
  heading: string;
  lead: string;
  body: string[];
}

export interface PeptideTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface PeptideFAQ {
  question: string;
  answer: string;
}

export interface PeptidePageContent {
  heroSubtitle: string;
  sections: PeptideSection[];
  reconstitutionTable: PeptideTable;
  conversionTable: PeptideTable;
  faq: PeptideFAQ[];
  disclaimer: string;
}

const en: PeptidePageContent = {
  heroSubtitle: "Convert any dose into millilitres and U-100 syringe units.",
  sections: [
    /* 8 sections rédigées selon le brief */
  ],
  reconstitutionTable: {
    caption: "Peptide reconstitution chart",
    headers: ["Peptide amount", "Bacteriostatic water added", "Final concentration"],
    rows: [
      ["5 mg", "1 mL", "5 mg/mL"],
      ["5 mg", "2 mL", "2.5 mg/mL"],
      ["10 mg", "2 mL", "5 mg/mL"],
      ["10 mg", "5 mL", "2 mg/mL"],
      ["15 mg", "3 mL", "5 mg/mL"],
      ["20 mg", "4 mL", "5 mg/mL"],
      ["30 mg", "3 mL", "10 mg/mL"],
    ],
  },
  conversionTable: {
    caption: "Dose to insulin syringe units",
    headers: ["Dose", "at 2 mg/mL", "at 5 mg/mL", "at 10 mg/mL"],
    rows: [
      ["250 mcg", "12.5 U", "5 U", "2.5 U"],
      ["500 mcg", "25 U", "10 U", "5 U"],
      ["1000 mcg", "50 U", "20 U", "10 U"],
      ["2000 mcg", "100 U", "40 U", "20 U"],
    ],
  },
  faq: [
    /* 8 questions rédigées selon le brief */
  ],
  disclaimer:
    "Conversion tool only. Always verify concentration, syringe unit scale and any prescription with a qualified healthcare professional. This calculator does not provide medical advice.",
};

export const PEPTIDE_CALCULATOR_CONTENT: Partial<Record<Locale, PeptidePageContent>> = { en };

/** Repli utilisé tant qu'une locale n'a pas son contenu rédigé. */
export const PEPTIDE_CALCULATOR_CONTENT_FALLBACK = en;
```

- [ ] **Step 2: Créer `FAQAccordion.tsx`**

```tsx
import { PeptideFAQ } from "../../seo/page-content";

export function FAQAccordion({ items, title }: { items: PeptideFAQ[]; title: string }) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-base-content">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details className="rounded-2xl border border-base-content/10 bg-base-100 p-5" key={item.question}>
            <summary className="cursor-pointer text-base font-semibold text-base-content">{item.question}</summary>
            <p className="mt-3 text-base-content/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

Le contenu des `<details>` est présent dans le HTML même replié : il reste indexable.

- [ ] **Step 3: Créer `SEOContentServer.tsx`**

```tsx
import { PeptidePageContent, PeptideTable } from "../../seo/page-content";
import { FAQAccordion } from "./FAQAccordion";

function ContentTable({ table }: { table: PeptideTable }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="table w-full">
        <caption className="mb-2 text-left text-sm font-semibold text-base-content/70">{table.caption}</caption>
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SEOContentServer({ content }: { content: PeptidePageContent }) {
  return (
    <article className="prose prose-lg mt-16 max-w-none dark:prose-invert">
      {content.sections.map((section) => {
        if (section.id === "faq") {
          return <FAQAccordion items={content.faq} key={section.id} title={section.heading} />;
        }

        return (
          <div key={section.id}>
            <Section section={section} />
            {section.id === "chart" && <ContentTable table={content.reconstitutionTable} />}
            {section.id === "conversion" && <ContentTable table={content.conversionTable} />}
          </div>
        );
      })}

      <p className="mt-10 rounded-2xl bg-base-200 p-5 text-sm text-base-content/70">{content.disclaimer}</p>
    </article>
  );
}

function Section({ section }: { section: PeptidePageContent["sections"][number] }) {
  return (
    <section>
      <h2>{section.heading}</h2>
      <p className="font-medium">{section.lead}</p>
      {section.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Vérifier la compilation et le lint**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 5: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/seo" "app/[locale]/(app)/tools/peptide-calculator/ui/components"
git commit -m "feat(tools): add peptide calculator seo content structure and english copy"
```

---

### Task 8: Page serveur, JSON-LD et emplacements publicitaires

**Files:**
- Create: `app/[locale]/(app)/tools/peptide-calculator/page.tsx`
- Modify: `src/env.ts` (bloc `client` du schéma + bloc `runtimeEnv`)

**Interfaces:**
- Consumes: `PEPTIDE_CALCULATOR_SEO` (Task 6), `PEPTIDE_CALCULATOR_CONTENT` (Task 7), `PeptideCalculatorClient` (Task 5), `SEOContentServer` (Task 7), `DEFAULT_INPUT` (Task 2), `generateSEOMetadata`/`SEOScripts` de `@/components/seo/SEOHead`, `getServerUrl` de `@/shared/lib/server-url`.
- Produces: la route `/[locale]/tools/peptide-calculator`.

- [ ] **Step 1: Déclarer les variables d'environnement publicitaires**

Dans `src/env.ts`, ajouter au bloc `client` du schéma, à côté des entrées `HEART_ZONES` existantes :

```ts
NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT: z.string().optional(),
NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT: z.string().optional(),
NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID: z.string().optional(),
NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID: z.string().optional(),
```

Puis, dans le bloc `runtimeEnv`, les quatre lignes miroir :

```ts
NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT,
NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT,
NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID: process.env.NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID,
NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID: process.env.NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID,
```

Attention : la ligne `NEXT_PUBLIC_BOTTOM_BMI_BANNER_AD_SLOT` existante du bloc `runtimeEnv` pointe par erreur sur la variable `TOP`. Ne pas reproduire ce copier-coller ici.

- [ ] **Step 2: Créer `page.tsx`**

```tsx
import React from "react";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { getServerUrl } from "@/shared/lib/server-url";
import { env } from "@/env";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

import { PEPTIDE_CALCULATOR_SEO } from "./seo/config";
import { PEPTIDE_CALCULATOR_CONTENT, PEPTIDE_CALCULATOR_CONTENT_FALLBACK } from "./seo/page-content";
import { PeptideCalculatorClient } from "./ui/PeptideCalculatorClient";
import { SEOContentServer } from "./ui/components/SEOContentServer";
import { DEFAULT_INPUT } from "./lib/presets";

const PATH = "/tools/peptide-calculator";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = PEPTIDE_CALCULATOR_SEO[locale] || PEPTIDE_CALCULATOR_SEO.en;

  return generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    locale,
    canonical: `${getServerUrl()}/${locale}${PATH}`,
    structuredData: {
      type: "Calculator",
      calculatorData: {
        calculatorType: "peptide-calculator",
        inputFields: ["syringe size", "vial amount in mg", "bacteriostatic water in ml", "dose in mcg"],
        outputFields: ["units to draw on a U-100 syringe", "volume in ml", "concentration in mg/ml", "doses per vial"],
        formula: "units = (doseMcg / 1000) / (vialMg / waterMl) x 100",
        accuracy: "Exact unit conversion for U-100 insulin syringes",
        targetAudience: ["fitness enthusiasts", "athletes"],
        relatedCalculators: ["bmi-calculator", "calorie-calculator", "heart-rate-zones"],
      },
    },
  });
}

export default async function PeptideCalculatorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getI18n();
  const seo = PEPTIDE_CALCULATOR_SEO[locale] || PEPTIDE_CALCULATOR_SEO.en;
  const content = PEPTIDE_CALCULATOR_CONTENT[locale] ?? PEPTIDE_CALCULATOR_CONTENT_FALLBACK;
  const url = `${getServerUrl()}/${locale}${PATH}`;

  return (
    <>
      <SEOScripts
        canonical={url}
        description={seo.description}
        hreflangPath={PATH}
        locale={locale}
        ogImage={`${getServerUrl()}/images/screenshots/peptide-calculator/og.jpg`}
        title={seo.title}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: seo.title,
              applicationCategory: "HealthApplication",
              operatingSystem: "Any",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "WorkoutCool", url: getServerUrl() },
              description: seo.description,
              inLanguage: locale,
              dateModified: new Date().toISOString().split("T")[0],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: content.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: seo.title,
              description: content.heroSubtitle,
              step: content.sections.slice(0, 4).map((section, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: section.heading,
                text: section.lead,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Tools", item: `${getServerUrl()}/${locale}/tools` },
                { "@type": "ListItem", position: 2, name: seo.title, item: url },
              ],
            },
          ]),
        }}
        type="application/ld+json"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        {(env.NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT || env.NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID) && (
          <HorizontalTopBanner
            adSlot={env.NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT}
            ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID}
          />
        )}

        <div className="container relative z-10 mx-auto max-w-5xl px-2 py-6 sm:px-4">
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">💉</div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              {t("tools.peptide-calculator.title")}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">{content.heroSubtitle}</p>
          </div>

          <PeptideCalculatorClient defaultInput={DEFAULT_INPUT} />

          <SEOContentServer content={content} />
        </div>

        {(env.NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT || env.NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID) && (
          <HorizontalBottomBanner
            adSlot={env.NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT}
            ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID}
          />
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Vérifier le rendu**

Run: `pnpm dev`, puis ouvrir `http://localhost:3000/en/tools/peptide-calculator`.
Expected: la page rend le résultat **12,5 U** sans aucune interaction, le curseur de la règle est positionné à 25 % de la largeur (12,5 sur 50).

Visiter ensuite les 5 autres locales : `/es`, `/fr`, `/pt`, `/ru`, `/zh-CN` + `/tools/peptide-calculator`.
Expected: interface entièrement traduite, aucune clé i18n brute à l'écran, résultat 12,5 U partout. Le contenu long est en anglais sur ces 5 locales à ce stade — c'est attendu, il est rédigé en Tasks 11 à 15.

- [ ] **Step 4: Vérifier le JSON-LD**

Dans la console du navigateur :

```js
[...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent));
```

Expected: on trouve bien les types `WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`.

- [ ] **Step 5: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/page.tsx" src/env.ts
git commit -m "feat(tools): add peptide calculator page with faq and howto schema"
```

---

### Task 9: Chaînes d'interface dans les 6 locales

**Files:**
- Modify: `locales/en.ts`, `locales/es.ts`, `locales/fr.ts`, `locales/pt.ts`, `locales/ru.ts`, `locales/zh-CN.ts` (dans l'objet `tools`, à côté de `"heart-rate-zones"`)

**Interfaces:**
- Consumes: rien.
- Produces: la clé `tools["peptide-calculator"]` consommée par Tasks 5, 5b et 8, et la clé `tools.related_title` consommée par Task 10.

**Cette tâche s'exécute avant les tâches d'interface** (3, 4, 5, 5b), pour que les clés existent avant d'être consommées. Ses étapes de vérification en navigateur sont reportées à la Task 8, première tâche où la page est rendue.

- [ ] **Step 1: Ajouter le bloc anglais dans `locales/en.ts`**

```ts
"peptide-calculator": {
  title: "Peptide Calculator",
  description: "Convert a peptide dose into millilitres and U-100 insulin syringe units",
  presets_legend: "Quick vial sizes",
  step_1_eyebrow: "Equipment",
  step_1_title: "Which syringe are you using?",
  step_2_eyebrow: "Reconstitution",
  step_2_title: "Amount in the vial",
  step_3_eyebrow: "Dilution",
  step_3_title: "Bacteriostatic water added",
  step_4_eyebrow: "Injection",
  step_4_title: "Target dose",
  other: "Other",
  units: "units",
  mode_legend: "Calculation direction",
  mode_forward: "Dose → units",
  mode_reverse: "Units → dose",
  step_4_reverse_eyebrow: "Injection",
  step_4_reverse_title: "Units drawn",
  result: {
    eyebrow: "Your result",
    draw_to: "Draw up to",
    dose_is: "That is",
    concentration: "Concentration",
    doses_per_vial: "Doses per vial",
    invalid: "Enter a vial amount, a water volume and a dose to see your result.",
  },
  warnings: {
    exceeds_syringe: "This dose is larger than the selected syringe. Pick a bigger syringe or add less water.",
    too_small: "Under 2 graduations, the draw is hard to measure accurately. Add less water to raise the volume.",
    water_excess: "That is an unusually large water volume for a standard vial. Double-check the figure.",
    not_whole_graduation: "This lands between graduations. Read the nearest mark on your syringe.",
  },
},
```

Ajouter également, directement dans l'objet `tools` (pas dans `peptide-calculator`), la clé consommée par le bloc de liens croisés de la Task 10 :

```ts
related_title: "Other free calculators",
```

- [ ] **Step 2: Ajouter le même bloc traduit dans les 5 autres fichiers**

Mêmes clés, exactement, dans `es.ts`, `fr.ts`, `pt.ts`, `ru.ts`, `zh-CN.ts`. Le `title` de chaque locale reprend celui de `seo/config.ts` sans le suffixe après le tiret : `Calculadora de Péptidos`, `Calculateur de Peptides`, `Calculadora de Peptídeos`, `Калькулятор пептидов`, `多肽计算器`.

- [ ] **Step 3: Vérifier que les 6 locales ont la même forme**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: aucune erreur. `locales/types.ts` dérive le type des clés du fichier `en.ts` : toute clé manquante dans une autre locale ressort ici.

- [ ] **Step 4: Vérifier la parité des clés entre les 6 locales**

Run:

```bash
for f in en es fr pt ru zh-CN; do
  echo "== $f"
  node -e "const l=require('./locales/$f.ts');" 2>/dev/null || true
  grep -c "step_1_eyebrow\|step_4_reverse_title\|not_whole_graduation\|related_title" "locales/$f.ts"
done
```

Expected: chacun des 6 fichiers remonte le même compte (4). La vérification en navigateur des 6 locales a lieu en Task 8, quand la page existe.

- [ ] **Step 5: Proposer le commit**

```bash
git add locales
git commit -m "feat(i18n): add peptide calculator ui strings for 6 locales"
```

---

### Task 10: Carte sur le hub et maillage interne

**Files:**
- Modify: `app/[locale]/(app)/tools/page.tsx` (tableau `fitnessTools`)
- Modify: `locales/en.ts`, `locales/es.ts`, `locales/fr.ts`, `locales/pt.ts`, `locales/ru.ts`, `locales/zh-CN.ts` (si le hub attend une clé distincte de celle de Task 9)

**Interfaces:**
- Consumes: `tools["peptide-calculator"].title` et `.description` (Task 9).
- Produces: le lien entrant depuis `/tools`.

Le hub lit `t("tools.<id>.title")` et `t("tools.<id>.description")` à partir de `tool.id` : en nommant l'entrée `peptide-calculator`, les clés de Task 9 suffisent, aucune clé supplémentaire n'est nécessaire.

- [ ] **Step 1: Ajouter l'import de l'icône**

Dans `app/[locale]/(app)/tools/page.tsx`, ajouter `SyringeIcon` à l'import existant de `lucide-react` :

```tsx
import { CalculatorIcon, ScaleIcon, HeartIcon, DumbbellIcon, RepeatIcon, SyringeIcon } from "lucide-react";
```

- [ ] **Step 2: Ajouter l'entrée dans `fitnessTools`**

Après l'entrée `heart-rate-calculator` :

```tsx
{
  id: "peptide-calculator",
  icon: <SyringeIcon className="w-8 h-8" />,
  emoji: "WorkoutCoolMedical.png",
  gradientFrom: "from-[#06B6D4]",
  gradientTo: "to-[#0891B2]",
  href: "/tools/peptide-calculator",
},
```

- [ ] **Step 3: Créer le composant de liens croisés**

Créer `src/components/tools/RelatedTools.tsx` :

```tsx
import Link from "next/link";

export interface RelatedTool {
  href: string;
  label: string;
}

export function RelatedTools({ heading, tools }: { heading: string; tools: RelatedTool[] }) {
  return (
    <nav aria-label={heading} className="mt-12 rounded-2xl border border-base-content/10 bg-base-100 p-6">
      <h2 className="mb-4 text-lg font-bold text-base-content">{heading}</h2>
      <ul className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link className="link link-primary text-sm font-medium" href={tool.href}>
              {tool.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Poser les liens sortants sur la page peptide**

Dans `app/[locale]/(app)/tools/peptide-calculator/page.tsx`, juste après `<SEOContentServer content={content} />` :

```tsx
<RelatedTools
  heading={t("tools.related_title")}
  tools={[
    { href: `/${locale}/tools/bmi-calculator`, label: t("tools.bmi-calculator.title") },
    { href: `/${locale}/tools/calorie-calculator`, label: t("tools.calorie-calculator.title") },
    { href: `/${locale}/tools/heart-rate-zones`, label: t("tools.heart-rate-calculator.title") },
  ]}
/>
```

La clé `tools.related_title` a déjà été créée dans les 6 locales en Task 9 : ne pas la redéfinir.

- [ ] **Step 5: Poser les liens entrants sur bmi-calculator et calorie-calculator**

Dans `app/[locale]/(app)/tools/bmi-calculator/page.tsx` puis `app/[locale]/(app)/tools/calorie-calculator/page.tsx` : lire d'abord le fichier, puis insérer le même composant `RelatedTools` juste avant le bloc `HorizontalBottomBanner` de fin de page, avec dans chaque cas une entrée pointant sur `/${locale}/tools/peptide-calculator`.

Ce sont ces deux liens entrants qui transmettent l'autorité interne à la nouvelle page : sans eux, elle ne serait liée que depuis le hub.

- [ ] **Step 6: Vérifier le hub et les liens**

Run: `pnpm dev`, puis ouvrir `http://localhost:3000/en/tools`.
Expected: la carte apparaît avec son titre et sa description traduits, et mène à la page.

Ouvrir ensuite `/en/tools/bmi-calculator` et `/en/tools/calorie-calculator`.
Expected: chacune affiche un lien vers le calculateur de peptides.

- [ ] **Step 7: Vérifier le lint**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 8: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools" src/components/tools locales
git commit -m "feat(tools): link peptide calculator from hub and sibling calculators"
```

---

### Tasks 11 à 15 : contenu long des 5 locales restantes

Ces cinq tâches sont identiques dans leur forme et ne diffèrent que par la locale. Elles s'exécutent **une langue à la fois**, chacune relue avant la suivante. Ordre : **11 = `pt`**, **12 = `fr`**, **13 = `es`**, **14 = `ru`**, **15 = `zh-CN`**.

L'ordre suit la donnée : `pt` d'abord parce que sa courbe passe de 0 à 100 sur 12 mois avec une concurrence quasi nulle, `fr` ensuite (90–210/mois, +50 % par trimestre), puis `es`, `ru`, `zh-CN` qui sont des marchés de couverture.

**Files (pour chaque tâche, `<locale>` étant la locale concernée) :**
- Modify: `app/[locale]/(app)/tools/peptide-calculator/seo/page-content.ts` — ajouter un objet `PeptidePageContent` complet pour la locale et l'enregistrer dans `PEPTIDE_CALCULATOR_CONTENT`.

**Interfaces:**
- Consumes: les types `PeptidePageContent`, `PeptideSection`, `PeptideTable`, `PeptideFAQ` (Task 7).
- Produces: rien de nouveau ; complète `PEPTIDE_CALCULATOR_CONTENT`.

- [ ] **Step 1: Rédiger le contenu de la locale**

Mêmes contraintes que le brief EN de Task 7 : ~1 800 mots, 8 sections dans le même ordre, `lead` de 40 à 60 mots autonomes, 8 entrées de FAQ, aucune dose recommandée.

Le contenu est **rédigé dans la langue**, pas traduit mot à mot de l'anglais : les `heading` reprennent les tournures réellement recherchées sur le marché, telles que listées dans les `keywords` de `seo/config.ts` pour cette locale.

Les deux tableaux gardent des valeurs numériques identiques à l'anglais. Seuls `caption` et `headers` sont traduits. Le séparateur décimal suit la locale : `12.5 U` en `en`/`zh-CN`, `12,5 U` en `fr`/`es`/`pt`/`ru`.

- [ ] **Step 2: Enregistrer la locale**

Ajouter l'entrée dans `PEPTIDE_CALCULATOR_CONTENT`, par exemple pour `pt` :

```ts
export const PEPTIDE_CALCULATOR_CONTENT: Partial<Record<Locale, PeptidePageContent>> = { en, pt };
```

**Uniquement dans la dernière de ces cinq tâches (Task 15, `zh-CN`)**, une fois les 6 locales présentes, resserrer le type pour que TypeScript garantisse désormais la complétude :

```ts
export const PEPTIDE_CALCULATOR_CONTENT: Record<Locale, PeptidePageContent> = { en, es, fr, pt, ru, "zh-CN": zhCN };
```

- [ ] **Step 3: Vérifier le typage**

Run: `pnpm exec tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 4: Vérifier dans le navigateur**

Run: `pnpm dev`, puis ouvrir `/{locale}/tools/peptide-calculator`.
Expected: contenu entièrement dans la langue, les deux tableaux rendus, la FAQ dépliable, le `FAQPage` JSON-LD reprenant les questions de cette locale.

- [ ] **Step 5: Proposer le commit**

```bash
git add "app/[locale]/(app)/tools/peptide-calculator/seo/page-content.ts"
git commit -m "feat(tools): add peptide calculator long-form content for <locale>"
```

---

## Vérification finale

- [ ] `pnpm test` — 12 tests au vert.
- [ ] `pnpm lint` — aucune erreur.
- [ ] `pnpm exec tsc --noEmit` — aucune erreur.
- [ ] `pnpm build` — build de production réussi.
- [ ] Les 6 URLs rendent un résultat de 12,5 U sans interaction, avec le contenu de leur langue.
- [ ] Aucune clé i18n brute visible sur les 6 pages.
- [ ] `PEPTIDE_CALCULATOR_CONTENT` est typé `Record<Locale, PeptidePageContent>` (plus `Partial`) et les 6 locales ont leur contenu rédigé.
- [ ] `?vial=20&water=2&dose=500&syringe=100` rend 5 U, concentration 10 mg/ml, 40 doses.
- [ ] Le mode inverse rend 200 mcg pour 10 unités à 10 mg / 5 ml.
- [ ] `/en/tools/bmi-calculator` et `/en/tools/calorie-calculator` pointent bien vers la page peptide.
- [ ] Le `body` ne défile pas horizontalement à 320 px de large.
- [ ] Le `FAQPage` et le `HowTo` passent le test des résultats enrichis de Google.
- [ ] Aucune dose recommandée nulle part : `grep -ri "recommended dose\|typical dose\|dose recommandée" app/\[locale\]/\(app\)/tools/peptide-calculator` ne remonte rien.
