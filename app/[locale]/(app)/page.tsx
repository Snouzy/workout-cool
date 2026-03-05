import React from "react";

import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { serverAuth } from "@/entities/user/model/get-server-session-user";
import { getDashboardStats } from "@/features/dashboard/actions/get-dashboard-stats.action";
import { getUserProgressions } from "@/features/progression-system/actions/get-user-progressions.action";
import { DashboardPage } from "@/features/dashboard/ui/dashboard-page";
import { WelcomePage } from "@/features/dashboard/ui/welcome-page";

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await serverAuth();

  if (!user) {
    return <WelcomePage locale={locale} />;
  }

  const [stats, progressions] = await Promise.all([
    getDashboardStats(user.id),
    getUserProgressions(user.id),
  ]);

  return <DashboardPage locale={locale} progressions={progressions} stats={stats} />;
}
