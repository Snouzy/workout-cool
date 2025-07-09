export const locales = ["en", "fr", "es", "zh-CN", "ua", "ru", "pt"] as const;
export type Locale = (typeof locales)[number];
