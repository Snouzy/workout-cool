import { describe, expect, it } from "vitest";

import { formatLocaleNumber, roundToPrecision } from "./formatNumber";

const NARROW_NO_BREAK_SPACE = " ";
const NO_BREAK_SPACE = " ";

describe("formatLocaleNumber", () => {
  it("utilise le point comme séparateur décimal en anglais", () => {
    expect(formatLocaleNumber(12.5, 2, "en")).toBe("12.5");
  });

  it("utilise le point comme séparateur décimal en chinois simplifié", () => {
    expect(formatLocaleNumber(12.5, 2, "zh-CN")).toBe("12.5");
  });

  it("utilise la virgule comme séparateur décimal en français", () => {
    expect(formatLocaleNumber(12.5, 2, "fr")).toBe("12,5");
  });

  it("utilise la virgule comme séparateur décimal en espagnol", () => {
    expect(formatLocaleNumber(12.5, 2, "es")).toBe("12,5");
  });

  it("utilise la virgule comme séparateur décimal en portugais", () => {
    expect(formatLocaleNumber(12.5, 2, "pt")).toBe("12,5");
  });

  it("utilise la virgule comme séparateur décimal en russe", () => {
    expect(formatLocaleNumber(12.5, 2, "ru")).toBe("12,5");
  });

  it("supprime les zéros de fin superflus plutôt que d'afficher une fausse précision", () => {
    expect(formatLocaleNumber(12.5, 2, "en")).toBe("12.5");
    expect(formatLocaleNumber(12.5, 2, "fr")).toBe("12,5");
  });

  it("préserve les 4 décimales utilisées pour le volume en mL", () => {
    expect(formatLocaleNumber(0.125, 4, "en")).toBe("0.125");
    expect(formatLocaleNumber(0.125, 4, "fr")).toBe("0,125");
  });

  it("préserve les 3 décimales utilisées pour la concentration en mg/mL", () => {
    expect(formatLocaleNumber(2.333, 3, "en")).toBe("2.333");
    expect(formatLocaleNumber(2.333, 3, "fr")).toBe("2,333");
  });

  it("préserve les 2 décimales utilisées pour les unités de seringue", () => {
    expect(formatLocaleNumber(60, 2, "en")).toBe("60");
    expect(formatLocaleNumber(1, 2, "fr")).toBe("1");
  });

  it("arrondit une valeur non exacte au lieu de la tronquer (vial 7 mg + eau 3 mL + dose 250 mcg -> 10.714285... unités)", () => {
    // concentration = 7 / 3 mg/mL ; volume = 0.25 / (7/3) mL ; units = volume * 100 = 10.714285714...
    const units = (250 / 1000 / (7 / 3)) * 100;

    expect(formatLocaleNumber(units, 2, "en")).toBe("10.71");
    expect(formatLocaleNumber(units, 2, "fr")).toBe("10,71");
  });

  it("ne produit jamais de séparateur de milliers pour une valeur au-dessus de 999", () => {
    const en = formatLocaleNumber(2000, 2, "en");
    const fr = formatLocaleNumber(2000, 2, "fr");
    const ru = formatLocaleNumber(2000, 2, "ru");

    expect(en).toBe("2000");
    expect(fr).toBe("2000");
    expect(ru).toBe("2000");

    for (const output of [en, fr, ru]) {
      expect(output).not.toContain(NARROW_NO_BREAK_SPACE);
      expect(output).not.toContain(NO_BREAK_SPACE);
    }
  });
});

describe("roundToPrecision", () => {
  it("retourne un nombre (pas une chaîne) arrondi et sans zéros de fin", () => {
    expect(roundToPrecision(12.5, 2)).toBe(12.5);
    expect(roundToPrecision(0.125, 4)).toBe(0.125);
  });

  it("reste indépendant de la locale, puisqu'il n'y a pas de mise en forme", () => {
    expect(Number.isFinite(roundToPrecision(2000, 2))).toBe(true);
    expect(roundToPrecision(2000, 2)).toBe(2000);
  });

  it("arrondit une valeur non exacte plutôt que de la tronquer (vial 7 mg + eau 3 mL + dose 250 mcg -> 10.714285... unités)", () => {
    const units = (250 / 1000 / (7 / 3)) * 100;

    expect(roundToPrecision(units, 2)).toBe(10.71);
  });
});
