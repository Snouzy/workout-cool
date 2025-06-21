// middleware.ts
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function detectUserLocale(request: NextRequest): string {
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

  // Map browser locales to supported locales
  const supportedLocales = ["en", "fr", "es", "zh-cn"];

  for (const { locale } of languages) {
    // Exact match
    if (supportedLocales.includes(locale)) {
      return locale === "zh-cn" ? "zh-CN" : locale;
    }

    // Language match (fr-FR -> fr)
    const lang = locale.split("-")[0];
    if (supportedLocales.includes(lang)) {
      return lang;
    }

    // Chinese variants
    if (locale.startsWith("zh")) {
      return "zh-CN";
    }
  }

  return "en"; // fallback
}

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr", "es", "zh-CN"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
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

  // Store detected locale in cookie for future visits
  if (!request.cookies.get("detected-locale")) {
    response.cookies.set("detected-locale", detectedLocale, {
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
    "/((?!api|static|_next|manifest.json|favicon.ico|robots.txt|sw.js|apple-touch-icon.png|android-chrome-.*\\.png|images|icons|sitemap.xml).*)",
  ],
};
