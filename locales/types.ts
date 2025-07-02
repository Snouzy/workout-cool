export const locales = ["en", "fr", "es", "zh-CN", "ru", "pt", "ko"] as const;
export type Locale = (typeof locales)[number];
