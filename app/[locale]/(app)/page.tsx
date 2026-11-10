import type { Metadata } from "next";

import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { getDefaultOgImagePath } from "@/shared/config/localized-metadata";
import { WorkoutStepper } from "@/features/workout-builder";

const homeMetadata = {
  en: {
    title: "Build Your Perfect Workout",
    description: "Create free workout routines with our comprehensive exercise database. Track your progress and achieve your fitness goals. 🏋️",
    keywords: ["workout builder", "exercise planner", "fitness routine", "personalized training", "muscle targeting", "free workout"],
  },
  fr: {
    title: "Créez Votre Entraînement Parfait",
    description:
      "Créez des routines d'entraînement gratuites avec notre base de données d'exercices complète. Suivez vos progrès et atteignez vos objectifs fitness. 🏋️",
    keywords: ["créateur d'entraînement", "planificateur d'exercices", "routine fitness", "entraînement personnalisé", "ciblage musculaire", "entraînement gratuit"],
  },
  sv: {
    title: "Skapa ditt träningspass",
    description: "Skapa egna träningspass med övningar från vår övningsbank. Följ dina framsteg på vägen mot dina träningsmål. 🏋️",
    keywords: ["planera träningspass", "övningsbank", "träningsprogram", "styrketräning", "muskelgrupper", "gratis träning"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { title, description, keywords } = homeMetadata[locale === "en" || locale === "sv" ? locale : "fr"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | ${SiteConfig.title}`,
      description,
      images: [
        {
          url: `${getServerUrl()}${getDefaultOgImagePath(locale)}`,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: title,
        },
      ],
    },
    twitter: {
      title: `${title} | ${SiteConfig.title}`,
      description,
      images: [`${getServerUrl()}${getDefaultOgImagePath(locale)}`],
    },
  };
}

export default async function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex flex-col h-full">
      <WorkoutStepper />
    </div>
  );
}
