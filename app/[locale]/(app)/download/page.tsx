import { Locale } from "locales/types";

import type { Metadata } from "next";

import { buildStoreUrl, normalizeDownloadSource } from "@/shared/lib/stores/store-links";
import { DownloadHero } from "@/features/download/ui/download-hero";
import { getDownloadCopy } from "@/features/download/copy";
import { env } from "@/env";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDownloadCopy(locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

/**
 * /download?src=<source> is the single link for every bio (TikTok, X, Instagram, GitHub).
 * Phones never reach this page: proxy.ts sends them straight to their store with a real 307.
 * Everyone else gets both official badges and a QR code.
 */
export default async function DownloadPage({ params, searchParams }: PageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);

  const source = normalizeDownloadSource(first(query.src));
  const storeOptions = { source, appStoreProviderToken: env.APP_STORE_PROVIDER_TOKEN };

  return (
    <DownloadHero
      appStoreUrl={buildStoreUrl("ios", storeOptions)}
      copy={getDownloadCopy(locale)}
      locale={locale as Locale}
      playStoreUrl={buildStoreUrl("android", storeOptions)}
      source={source}
    />
  );
}
