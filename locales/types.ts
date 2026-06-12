export const locales = ["en", "fr", "es", "zh-CN", "zh-TW", "ru", "pt"] as const;
export type Locale = (typeof locales)[number];
