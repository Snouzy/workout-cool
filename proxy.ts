// middleware.ts
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { locales, type Locale } from "./locales/types";

import { resolveDownloadRedirect } from "@/shared/lib/stores/download-redirect";
import { trackFromProxy } from "@/shared/lib/analytics/proxy";

function detectUserLocale(request: NextRequest): Locale {
  const preference = request.cookies.get("detected-locale")?.value;
  const savedLocale = locales.find((locale) => locale === preference);
  if (savedLocale) return savedLocale;

  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) return "en";

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [locale, quality = "1"] = lang.trim().split(";q=");
      return { locale: locale.toLowerCase(), quality: parseFloat(quality) };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { locale } of languages) {
    const language = locale.split("-")[0];
    const supportedLocale = locales.find((supported) => supported.toLowerCase() === locale || supported === language);
    if (supportedLocale) return supportedLocale;

    // Chinese variants
    if (locale.startsWith("zh")) {
      return "zh-CN";
    }
  }

  return "en"; // fallback
}

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
  resolveLocaleFromRequest: detectUserLocale,
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /download is the one link in every bio: phones go straight to their store, before anything is rendered.
  const storeRedirect = resolveDownloadRedirect({
    pathname,
    searchParams: request.nextUrl.searchParams,
    userAgent: request.headers.get("user-agent"),
    appStoreProviderToken: process.env.APP_STORE_PROVIDER_TOKEN,
  });

  if (storeRedirect) {
    trackFromProxy({ event: "download_redirect", store: storeRedirect.platform, source: storeRedirect.source, forced: storeRedirect.forced });

    return NextResponse.redirect(storeRedirect.url, 307);
  }
  const detectedLocale = detectUserLocale(request);

  // If on root path and no locale detected yet, redirect to detected locale
  if (pathname === "/" && !request.cookies.get("detected-locale")) {
    const url = new URL(`/${detectedLocale}`, request.url);
    const response = NextResponse.redirect(url);

    response.cookies.set("detected-locale", detectedLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }

  // Normal i18n middleware processing
  const response = I18nMiddleware(request);

  const currentLocale = response.headers.get("X-Next-Locale") || detectedLocale;
  response.headers.set("Content-Language", currentLocale);

  // Keep the client preference in sync when a visitor follows a localized link.
  if (request.cookies.get("detected-locale")?.value !== currentLocale) {
    response.cookies.set("detected-locale", currentLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  const searchParams = request.nextUrl.searchParams.toString();
  response.headers.set("searchParams", searchParams);

  if (request.nextUrl.pathname.includes("/dashboard")) {
    const session = getSessionCookie(request);

    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|static|_next|manifest.json|favicon.ico|robots.txt|sw.js|apple-touch-icon.png|android-chrome-.*\\.png|images|logo|icons|sitemap.xml|ads.txt).*)",
  ],
};
