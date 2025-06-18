import Image from "next/image";
import { Inter, Permanent_Marker } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { cn } from "@/shared/lib/utils";
import { getServerUrl } from "@/shared/lib/server-url";
import { FB_PIXEL_ID } from "@/shared/lib/facebook/fb-pixel";
import { SiteConfig } from "@/shared/config/site-config";
import { WorkoutSessionsSynchronizer } from "@/features/workout-session/ui/workout-sessions-synchronizer";
import { ThemeSynchronizer } from "@/features/theme/ui/ThemeSynchronizer";
import { Header } from "@/features/layout/Header";
import { Footer } from "@/features/layout/Footer";
import { TailwindIndicator } from "@/components/utils/TailwindIndicator";
import { NextTopLoader } from "@/components/ui/next-top-loader";

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
  metadataBase: new URL(getServerUrl()),
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
  openGraph: {
    title: SiteConfig.title,
    description: SiteConfig.description,
    url: getServerUrl(),
    siteName: SiteConfig.title,
    images: [
      {
        url: `${getServerUrl()}/images/default-og-image_fr.png`,
        width: 1200,
        height: 630,
        alt: SiteConfig.title,
      },
      {
        url: `${getServerUrl()}/images/default-og-image_en.png`,
        width: 1200,
        height: 630,
        alt: SiteConfig.title,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@workout_cool",
    title: SiteConfig.title,
    description: SiteConfig.description,
    images: [`${getServerUrl()}/images/default-og-image_fr.png`],
  },
  alternates: {
    canonical: "https://www.workout.cool",
    languages: {
      fr: "https://www.workout.cool/fr",
      en: "https://www.workout.cool/en",
    },
  },
  authors: [{ name: "Workout Cool", url: "https://www.workout.cool" }],
  icons: {
    icon: [
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
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

  return (
    <>
      <html className="h-full" dir="ltr" lang={locale} suppressHydrationWarning>
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1, maximum-scale=1 viewport-fit=cover" name="viewport" />

          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="preload" />

          {/* Alternate hreflang for i18n */}
          <link href="https://www.workout.cool/fr" hrefLang="fr" rel="alternate" />
          <link href="https://www.workout.cool/en" hrefLang="en" rel="alternate" />

          {/* Balise theme-color unique, synchronisée dynamiquement */}
          <meta content="#f3f4f6" name="theme-color" />

          {/* TODO: maybe add some ads ? */}
          <noscript>
            <Image
              alt="Facebook Pixel"
              height="1"
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              style={{ display: "none" }}
              width="1"
            />
          </noscript>
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
