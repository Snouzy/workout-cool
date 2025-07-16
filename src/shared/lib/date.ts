import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/en";

/**
 * Default date formats for different locales
 */
const DEFAULT_FORMATS = {
  en: "MMMM D, YYYY", // January 15, 2024
  fr: "D MMMM YYYY", // 15 janvier 2024,
  es: "D MMMM YYYY", // 15 de enero de 2024,
  "zh-CN": "YYYY年M月D日", // 2024年1月15日,
  ru: "D MMMM YYYY", // 15 января 2024,
  pt: "D MMMM YYYY", // 15 de janeiro de 2024,
} as const;

/**
 * Date utility abstraction that properly handles locales
 * Abstracts dayjs usage according to FSD architecture
 */
export const formatDate = (date: string | Date, locale: string = "en", format?: string): string => {
  const defaultFormat = DEFAULT_FORMATS[locale as keyof typeof DEFAULT_FORMATS] || DEFAULT_FORMATS.en;
  return dayjs(date)
    .locale(locale)
    .format(format || defaultFormat);
};

/**
 * Get current date in specified locale
 */
export const getCurrentDate = (locale: string = "en"): dayjs.Dayjs => {
  return dayjs().locale(locale);
};

/**
 * Parse date and set locale
 */
export const parseDate = (date: string | Date, locale: string = "en"): dayjs.Dayjs => {
  return dayjs(date).locale(locale);
};
