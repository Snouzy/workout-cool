import slugify from "slugify";
import { pinyin } from "pinyin-pro";

/**
 * Utility functions for generating and handling slugs
 */

/**
 * Converts a string to a URL-friendly slug
 * Handles all Unicode characters including Chinese, Russian, Arabic, etc.
 */
export function generateSlug(text: string): string {
  // Check if text contains Chinese characters
  const chineseRegex = /[\u4e00-\u9fa5]/;

  if (chineseRegex.test(text)) {
    // Convert Chinese to pinyin (phonetic representation)
    const pinyinText = pinyin(text, {
      toneType: "none", // Remove tone marks
      separator: "-", // Use hyphens between words
      type: "string",
    });

    // Clean up the pinyin text
    return slugify(pinyinText, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  // For non-Chinese text, use regular slugify
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "en",
    trim: true,
  });
}

/**
 * Generates slugs for all supported languages
 */
export function generateSlugsForAllLanguages(titles: {
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
}) {
  return {
    slug: generateSlug(titles.title),
    slugEn: generateSlug(titles.titleEn),
    slugEs: generateSlug(titles.titleEs),
    slugPt: generateSlug(titles.titlePt),
    slugRu: generateSlug(titles.titleRu),
    slugZhCn: generateSlug(titles.titleZhCn),
  };
}

/**
 * Ensures slug uniqueness by appending a number if needed
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
