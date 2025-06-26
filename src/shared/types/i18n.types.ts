import { Locale } from "locales/types";

// Base type for any field that needs internationalization
export type I18nField<T extends string> = {
  [K in T]: string;
} & {
  [K in T as `${K}En`]: string;
} & {
  [K in T as `${K}Es`]: string;
} & {
  [K in T as `${K}Pt`]: string;
} & {
  [K in T as `${K}Ru`]: string;
} & {
  [K in T as `${K}ZhCn`]: string;
};

// Common i18n fields used across entities
export type I18nText = I18nField<"title"> & I18nField<"description">;
export type I18nSlug = I18nField<"slug">;
export type I18nName = I18nField<"name">;

// Utility type to extract a specific locale field
export type ExtractLocaleField<T extends Record<string, any>, Field extends keyof T, L extends Locale> = L extends "fr"
  ? T[Field]
  : L extends "en"
    ? T[`${string & Field}En`]
    : L extends "es"
      ? T[`${string & Field}Es`]
      : L extends "pt"
        ? T[`${string & Field}Pt`]
        : L extends "ru"
          ? T[`${string & Field}Ru`]
          : L extends "zh-CN"
            ? T[`${string & Field}ZhCn`]
            : never;

// Helper to get field suffix for a locale
export function getLocaleSuffix(locale: Locale): "En" | "Es" | "Pt" | "Ru" | "ZhCn" | "" {
  switch (locale) {
    case "en":
      return "En";
    case "es":
      return "Es";
    case "pt":
      return "Pt";
    case "ru":
      return "Ru";
    case "zh-CN":
      return "ZhCn";
    default:
      return "";
  }
}
