// Swedish uses the existing English URLs.
export function getProgramSlugFilter(slug: string) {
  return { OR: [{ slug }, { slugEn: slug }, { slugEs: slug }, { slugPt: slug }, { slugRu: slug }, { slugZhCn: slug }] };
}
