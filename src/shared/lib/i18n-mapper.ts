import { Locale } from "locales/types";
import { getLocaleSuffix } from "@/shared/types/i18n.types";

/**
 * Generic mapper for i18n fields
 * Gets the correct field value based on locale
 */
export function getI18nField<T extends Record<string, any>>(
  obj: T | null | undefined,
  fieldName: string,
  locale: Locale,
  defaultValue: string = ""
): string {
  if (!obj) return defaultValue;
  
  const suffix = getLocaleSuffix(locale);
  const fieldKey = suffix ? `${fieldName}${suffix}` : fieldName;
  
  return (obj[fieldKey] as string) || defaultValue;
}

/**
 * Maps common i18n fields for an object
 */
export function mapI18nFields<T extends Record<string, any>>(
  obj: T | null | undefined,
  locale: Locale
) {
  if (!obj) return null;
  
  return {
    title: getI18nField(obj, "title", locale),
    description: getI18nField(obj, "description", locale),
    slug: getI18nField(obj, "slug", locale),
    name: getI18nField(obj, "name", locale),
  };
}