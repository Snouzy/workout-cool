import { Inter, Permanent_Marker } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { cn } from "@/shared/lib/utils";
import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { WorkoutSessionsSynchronizer } from "@/features/workout-session/ui/workout-sessions-synchronizer";
import { ThemeSynchronizer } from "@/features/theme/ui/ThemeSynchronizer";
import { Header } from "@/features/layout/Header";
import { Footer } from "@/features/layout/Footer";
import { TailwindIndicator } from "@/components/utils/TailwindIndicator";
import { NextTopLoader } from "@/components/ui/next-top-loader";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

import { Providers } from "./providers";

import type { ReactElement } from "react";
import type { Metadata } from "next";

import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: SiteConfig.title,
    template: `%s | ${SiteConfig.title}`,
  },
  description: SiteConfig.description,
  keywords: SiteConfig.keywords,
  applicationName: SiteConfig.seo.applicationName,
  category: SiteConfig.seo.category,
  classification: SiteConfig.seo.classification,
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
    title: SiteConfig.title,
    description: SiteConfig.description,
    url: getServerUrl(),
    siteName: SiteConfig.title,
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
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: SiteConfig.seo.twitterHandle,
    creator: SiteConfig.seo.twitterHandle,
    title: SiteConfig.title,
    description: SiteConfig.description,
    images: [
      {
        url: `${getServerUrl()}/images/default-og-image_fr.jpg`,
        width: SiteConfig.seo.ogImage.width,
        height: SiteConfig.seo.ogImage.height,
        alt: `${SiteConfig.title} - Plateforme de fitness moderne`,
      },
    ],
  },
  alternates: {
    canonical: "https://www.workout.cool",
    languages: {
      "fr-FR": "https://www.workout.cool/fr",
      "en-US": "https://www.workout.cool/en",
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

          {/* PWA Meta Tags */}
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="default" name="apple-mobile-web-app-status-bar-style" />
          <meta content="Workout Cool" name="apple-mobile-web-app-title" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="#FF5722" name="msapplication-TileColor" />
          <meta content="/android-chrome-192x192.png" name="msapplication-TileImage" />

          {/* PWA Manifest */}
          <link href="/manifest.json" rel="manifest" />

          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="preload" />

          {/* Alternate hreflang for i18n */}
          <link href="https://www.workout.cool/fr" hrefLang="fr" rel="alternate" />
          <link href="https://www.workout.cool/en" hrefLang="en" rel="alternate" />

          {/* Theme color for PWA */}
          <meta content="#FF5722" name="theme-color" />

          {/* Structured Data */}
          <StructuredDataScript data={websiteStructuredData} />
          <StructuredDataScript data={organizationStructuredData} />
          <StructuredDataScript data={webAppStructuredData} />
        </head>

        <body
          className={cn(
            "flex items-center justify-center min-h-screen w-full p-8 max-sm:p-0 max-sm:min-h-full bg-base-200 dark:bg-[#18181b] dark:text-gray-200 antialiased",
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
            <WorkoutSessionsSynchronizer />
            <ThemeSynchronizer />
            <NextTopLoader color="#FF5722" delay={100} showSpinner={false} />

            {/* Main Card Container */}
            <div className="card w-full max-w-3xl min-h-[500px] max-h-[90vh] h-[80vh] bg-white dark:bg-[#232324] shadow-xl border border-base-200 dark:border-slate-700 flex flex-col justify-between overflow-hidden max-sm:rounded-none max-sm:h-full rounded-lg">
              <Header />
              <div className="flex-1 overflow-auto flex flex-col">{children}</div>
              <Footer />
            </div>

            <TailwindIndicator />
          </Providers>
        </body>
      </html>
    </>
  );
}
