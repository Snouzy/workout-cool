import React from "react";

import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const isEnglish = locale === "en";
  const title = isEnglish ? "CaliGym - Calisthenics Training" : "CaliGym - Entraînement Calisthenics";
  const description = isEnglish
    ? "Progress through calisthenics exercises with structured progression families. Track your training and level up."
    : "Progressez dans les exercices de calisthenics avec des familles de progression structurées. Suivez votre entraînement et montez en niveau.";

  return {
    title,
    description,
    keywords: isEnglish
      ? ["calisthenics", "bodyweight training", "progression", "workout tracker", "pull-ups", "push-ups"]
      : [
          "calisthenics",
          "entraînement au poids du corps",
          "progression",
          "suivi d'entraînement",
          "tractions",
          "pompes",
        ],
    openGraph: {
      title: `${title} | ${SiteConfig.title}`,
      description,
      images: [
        {
          url: `${getServerUrl()}/images/default-og-image_${locale}.jpg`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: title,
        },
      ],
    },
    twitter: {
      title: `${title} | ${SiteConfig.title}`,
      description,
      images: [`${getServerUrl()}/images/default-og-image_${locale}.jpg`],
    },
  };
}

export default async function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex flex-col h-full items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to CaliGym</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Your calisthenics progression training platform. Dashboard coming soon.
      </p>
    </div>
  );
}
