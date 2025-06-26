/**
 * Utility functions for generating and handling slugs
 */

/**
 * Converts a string to a URL-friendly slug
 * Removes accents, converts to lowercase, replaces spaces with hyphens
 */
export function generateSlug(text: string): string {
  return text
    .normalize("NFD") // Normalize unicode
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
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
