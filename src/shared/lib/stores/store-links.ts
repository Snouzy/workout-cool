import { SiteConfig } from "@/shared/config/site-config";

export type StorePlatform = "ios" | "android";

export const DEFAULT_DOWNLOAD_SOURCE = "web";

const SOURCE_PATTERN = /^[a-z0-9_-]{1,32}$/;

/** Picks the store from the browser's user agent. Desktop browsers (and iPadOS claiming to be a Mac) return null. */
export function detectStorePlatform(userAgent: string | null | undefined): StorePlatform | null {
  if (!userAgent) return null;
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return null;
}

/** `?store=ios|android` lets a link force a store (tests, targeted links). */
export function parseStorePlatform(value: string | null | undefined): StorePlatform | null {
  if (value === "ios" || value === "android") return value;
  return null;
}

/** `?src=tiktok` → "tiktok"; anything unexpected falls back to the default, so the value is safe to forward to the stores. */
export function normalizeDownloadSource(value: string | null | undefined): string {
  const source = value?.trim().toLowerCase() ?? "";
  return SOURCE_PATTERN.test(source) ? source : DEFAULT_DOWNLOAD_SOURCE;
}

type StoreUrlOptions = {
  source: string;
  /** App Store Connect provider token: without it Apple ignores the `ct` campaign parameter. */
  appStoreProviderToken?: string;
};

export function buildAppStoreUrl({ source, appStoreProviderToken }: StoreUrlOptions): string {
  const url = new URL(SiteConfig.stores.appStoreUrl);
  url.searchParams.set("mt", "8");
  url.searchParams.set("ct", source);
  if (appStoreProviderToken) url.searchParams.set("pt", appStoreProviderToken);
  return url.toString();
}

export function buildPlayStoreUrl({ source }: StoreUrlOptions): string {
  const url = new URL(SiteConfig.stores.playStoreUrl);
  // Google Play Install Referrer: the whole value is one URL-encoded query string.
  url.searchParams.set("referrer", `utm_source=${source}&utm_medium=smart_link&utm_campaign=download_page`);
  return url.toString();
}

export function buildStoreUrl(platform: StorePlatform, options: StoreUrlOptions): string {
  return platform === "ios" ? buildAppStoreUrl(options) : buildPlayStoreUrl(options);
}
