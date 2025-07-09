"use client";

import { createI18nClient } from "next-international/client";

// NOTE: Also update middleware.ts to support locale
export const languages = ["en", "fr", "es", "zh-CN", "ua", "ru", "pt"];

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, defineLocale, useCurrentLocale } = createI18nClient(
  {
    en: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./en");
    },
    fr: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./fr");
    },
    es: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./es");
    },
    "zh-CN": async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./zh-CN");
    },
    ua: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./ua");
    },
    ru: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./ru");
    },
    pt: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./pt");
    },
  },
  {
    // Uncomment to set base path
    // basePath: '/base',
    // Uncomment to use custom segment name
    // segmentName: 'locale',
    // Uncomment to set fallback locale
    // fallbackLocale: en,
  },
);

export type TFunction = Awaited<ReturnType<typeof useI18n>>;