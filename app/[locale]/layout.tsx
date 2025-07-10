import { Inter, Permanent_Marker } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "app/[locale]/providers";
import { cn } from "@/shared/lib/utils";
import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";
import { WorkoutSessionsSynchronizer } from "@/features/workout-session/ui/workout-sessions-synchronizer";
import { FavoriteExercisesSynchronizer } from "@/features/workout-builder/model/favorite-exercises-synchronizer";
import { ThemeSynchronizer } from "@/features/theme/ui/ThemeSynchronizer";
import { env } from "@/env";
import { Version } from "@/components/version";
import { TailwindIndicator } from "@/components/utils/TailwindIndicator";
import { NextTopLoader } from "@/components/ui/next-top-loader";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { VerticalLeftBanner, VerticalRightBanner, AdBlockerForPremium } from "@/components/ads";

import type { ReactElement } from "react";
import type { Metadata } from "next";

import "@/shared/styles/globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const localizedData = getLocalizedMetadata(locale);

  return {
    title: {
      default: localizedData.title,
      template: `%s | ${localizedData.title}`,
    },
    description: localizedData.description,
    keywords: localizedData.keywords as unknown as string[],
    applicationName: localizedData.applicationName,
    category: localizedData.category,
    classification: localizedData.classification,
    metadataBase: new URL(getServerUrl()),
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    openGraph: {
      title: localizedData.title,
      description: localizedData.description,
      url: getServerUrl(),
      siteName: SiteConfig.title,
      locale:
        locale === "en"
          ? "en_US"
          : locale === "es"
            ? "es_ES"
            : locale === "pt"
              ? "pt_PT"
              : locale === "ru"
                ? "ru_RU"
                : locale === "zh-CN"
                  ? "zh_CN"
                  : "fr_FR",
      alternateLocale: [
        "fr_FR",
        "fr_CA",
        "fr_CH",
        "fr_BE",
        "en_US",
        "en_GB",
        "en_CA",
        "en_AU",
        "es_ES",
        "es_MX",
        "es_AR",
        "es_CL",
        "pt_PT",
        "pt_BR",
        "ru_RU",
        "ru_BY",
        "ru_KZ",
        "zh_CN",
        "zh_TW",
        "zh_HK",
      ].filter(
        (alt) =>
          alt !==
          (locale === "en"
            ? "en_US"
            : locale === "es"
              ? "es_ES"
              : locale === "pt"
                ? "pt_PT"
                : locale === "ru"
                  ? "ru_RU"
                  : locale === "zh-CN"
                    ? "zh_CN"
                    : "fr_FR"),
      ),
      images: [
        {
          url: `${getServerUrl()}/images/default-og-image_fr.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: `${SiteConfig.title} - Plateforme de fitness moderne`,
        },
        {
          url: `${getServerUrl()}/images/default-og-image_en.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: `${SiteConfig.title} - Modern fitness platform`,
        },
        {
          url: `${getServerUrl()}/images/default-og-image_es.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: `${SiteConfig.title} - Plataforma de fitness moderna`,
        },
        {
          url: `${getServerUrl()}/images/default-og-image_pt.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: `${SiteConfig.title} - Plataforma de fitness moderna`,
        },
        {
          url: `${getServerUrl()}/images/default-og-image_ru.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: `${SiteConfig.title} - Современная фитнес платформа`,
        },
        {
          url: `${getServerUrl()}/images/default-og-image_zh.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: `${SiteConfig.title} - 现代健身平台`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: SiteConfig.seo.twitterHandle,
      creator: SiteConfig.seo.twitterHandle,
      title: localizedData.title,
      description: localizedData.description,
      images: [
        {
          url: `${getServerUrl()}/images/default-og-image_${locale === "zh-CN" ? "zh" : locale}.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: localizedData.ogAlt,
        },
      ],
    },
    alternates: {
      canonical: "https://www.workout.cool",
      languages: {
        "fr-FR": "https://www.workout.cool/fr",
        "en-US": "https://www.workout.cool/en",
        "es-ES": "https://www.workout.cool/es",
        "pt-PT": "https://www.workout.cool/pt",
        "ru-RU": "https://www.workout.cool/ru",
        "zh-CN": "https://www.workout.cool/zh-CN",
        "x-default": "https://www.workout.cool",
      },
    },
    authors: [{ name: SiteConfig.company.name, url: getServerUrl() }],
    creator: SiteConfig.company.name,
    publisher: SiteConfig.company.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: SiteConfig.title,
    },
    icons: {
      icon: [
        { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/images/favicon.ico", type: "image/x-icon" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/images/favicon.ico",
    },
    other: {
      "msapplication-TileColor": "#FF5722",
      "msapplication-TileImage": "/android-chrome-192x192.png",
    },
  };
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

export const preferredRegion = ["fra1", "sfo1", "iad1"];

interface RootLayoutProps {
  params: Promise<{ locale: string }>;
  children: ReactElement;
}

export default async function RootLayout({ params, children }: RootLayoutProps) {
  const { locale } = await params;
  // Generate structured data
  const websiteStructuredData = generateStructuredData({
    type: "WebSite",
    locale,
  });

  const organizationStructuredData = generateStructuredData({
    type: "Organization",
    locale,
  });

  const webAppStructuredData = generateStructuredData({
    type: "WebApplication",
    locale,
  });

  return (
    <>
      <html className="h-full" dir="ltr" lang={locale} suppressHydrationWarning>
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1, maximum-scale=1 viewport-fit=cover" name="viewport" />
          <meta content={env.NEXT_PUBLIC_AD_CLIENT} name="google-adsense-account" />

          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_AD_CLIENT}`}
          />

          {/* PWA Meta Tags */}
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="default" name="apple-mobile-web-app-status-bar-style" />
          <meta content="Workout Cool" name="apple-mobile-web-app-title" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="#FF5722" name="msapplication-TileColor" />
          <meta content="/android-chrome-192x192.png" name="msapplication-TileImage" />

          {/* PWA Manifest */}
          <link href={`/${locale}/manifest.json`} rel="manifest" />

          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="preload" />

          {/* Alternate hreflang for i18n */}
          <link href="https://www.workout.cool/fr" hrefLang="fr" rel="alternate" />
          <link href="https://www.workout.cool/en" hrefLang="en" rel="alternate" />
          <link href="https://www.workout.cool/es" hrefLang="es" rel="alternate" />
          <link href="https://www.workout.cool/pt" hrefLang="pt" rel="alternate" />
          <link href="https://www.workout.cool/ru" hrefLang="ru" rel="alternate" />
          <link href="https://www.workout.cool/zh-CN" hrefLang="zh-CN" rel="alternate" />
          <link href="https://www.workout.cool" hrefLang="x-default" rel="alternate" />

          {/* Theme color for PWA */}
          <meta content="#FF5722" name="theme-color" />

          {/* Structured Data */}
          <StructuredDataScript data={websiteStructuredData} />
          <StructuredDataScript data={organizationStructuredData} />
          <StructuredDataScript data={webAppStructuredData} />
        </head>

        <body
          className={cn(
            "flex items-center justify-center min-h-screen w-full max-sm:p-0 max-sm:min-h-full bg-base-200 dark:bg-[#18181b] dark:text-gray-200 antialiased",
            "bg-hero-light dark:bg-hero-dark",
            GeistMono.variable,
            GeistSans.variable,
            inter.variable,
            permanentMarker.variable,
          )}
          suppressHydrationWarning
        >
          <Providers locale={locale}>
            <ServiceWorkerRegistration />
            <FavoriteExercisesSynchronizer />
            <WorkoutSessionsSynchronizer />
            <ThemeSynchronizer />
            {/* <AdSenseAutoAds /> */}
            <AdBlockerForPremium />
            <NextTopLoader color="#FF5722" delay={100} showSpinner={false} />

            <div className="flex flex-col w-full">
              <div className="flex justify-center items-start gap-4 w-full">
                <VerticalLeftBanner />
                {children}
                <VerticalRightBanner />
              </div>
            </div>
            <Version />

            <TailwindIndicator />
          </Providers>
        </body>
      </html>
    </>
  );
}
