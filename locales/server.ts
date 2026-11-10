import { createI18nServer } from "next-international/server";

import type { TypedLocales } from "./types";

const serverLocales = {
  en: () => import("./en"),
  fr: () => import("./fr"),
  es: () => import("./es"),
  "zh-CN": () => import("./zh-CN"),
  ru: () => import("./ru"),
  pt: () => import("./pt"),
  sv: () => import("./sv"),
};

// TypedLocales hands next-international a pre-flattened locale type: see locales/types.ts.
export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer<typeof serverLocales, TypedLocales>(serverLocales);
