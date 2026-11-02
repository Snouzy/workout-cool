import { buildStoreUrl, detectStorePlatform, normalizeDownloadSource, parseStorePlatform, type StorePlatform } from "./store-links";

// /download with or without a locale prefix (the i18n proxy would strip the prefix right after us anyway).
const DOWNLOAD_PATH = /^(?:\/[a-z]{2}(?:-[A-Z]{2})?)?\/download\/?$/;

export type DownloadRedirect = {
  platform: StorePlatform;
  source: string;
  /** true when `?store=` picked the store instead of the user agent */
  forced: boolean;
  url: string;
};

type ResolveInput = {
  pathname: string;
  searchParams: URLSearchParams;
  userAgent: string | null;
  appStoreProviderToken?: string;
};

/** Decides, from the request alone, whether /download must send this visitor straight to a store. */
export function resolveDownloadRedirect(input: ResolveInput): DownloadRedirect | null {
  const { pathname, searchParams, userAgent, appStoreProviderToken } = input;
  if (!DOWNLOAD_PATH.test(pathname)) return null;

  const forcedPlatform = parseStorePlatform(searchParams.get("store"));
  const platform = forcedPlatform ?? detectStorePlatform(userAgent);
  if (!platform) return null;

  const source = normalizeDownloadSource(searchParams.get("src"));

  return {
    platform,
    source,
    forced: forcedPlatform !== null,
    url: buildStoreUrl(platform, { source, appStoreProviderToken }),
  };
}
