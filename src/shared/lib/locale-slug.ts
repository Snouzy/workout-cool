/**
 * Utility functions for getting localized slugs
 */

interface SlugData {
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;
  slugKo: string;
}

/**
 * Gets the appropriate slug for the given locale
 */
export function getSlugForLocale(slugData: SlugData, locale: string): string {
  switch (locale) {
    case "en":
      return slugData.slugEn;
    case "es":
      return slugData.slugEs;
    case "pt":
      return slugData.slugPt;
    case "ru":
      return slugData.slugRu;
    case "zh-CN":
      return slugData.slugZhCn;
    case "ko":
      return slugData.slugKo;
    default:
      return slugData.slug; // French default
  }
}

/**
 * Gets the appropriate title for the given locale
 */
interface TitleData {
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  titleKo: string;
}

export function getTitleForLocale(titleData: TitleData, locale: string): string {
  switch (locale) {
    case "en":
      return titleData.titleEn;
    case "es":
      return titleData.titleEs;
    case "pt":
      return titleData.titlePt;
    case "ru":
      return titleData.titleRu;
    case "zh-CN":
      return titleData.titleZhCn;
    case "ko":
      return titleData.titleKo;
    default:
      return titleData.title; // French default
  }
}
