export const locales = ["en", "fr", "es", "zh-CN", "ru", "pt", "kr"] as const;
export type Locale = (typeof locales)[number];
