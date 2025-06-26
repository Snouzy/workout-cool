import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { getSessionBySlug } from "@/features/programs/actions/get-session-by-slug.action";
import { auth } from "@/features/auth/lib/better-auth";

// Import the existing session client component
import { ProgramSessionClient } from "./ProgramSessionClient";

interface SessionDetailPageProps {
  params: Promise<{ slug: string; sessionSlug: string; locale: Locale }>;
}

export async function generateMetadata({ params }: SessionDetailPageProps): Promise<Metadata> {
  const { slug, sessionSlug, locale } = await params;
  const t = await getI18n();
  const response = await getSessionBySlug(slug, sessionSlug, locale);

  if (!response) {
    return { title: t("programs.not_found") };
  }

  // Get title in current locale
  const getLocalizedTitle = () => {
    switch (locale) {
      case "en":
        return response.session.titleEn;
      case "es":
        return response.session.titleEs;
      case "pt":
        return response.session.titlePt;
      case "ru":
        return response.session.titleRu;
      case "zh-CN":
        return response.session.titleZhCn;
      default:
        return response.session.title;
    }
  };

  const title = getLocalizedTitle();

  return {
    title: `${title} - ${response.program.title}`,
    description: response.session.description,
    openGraph: {
      title: `${title} - ${response.program.title}`,
      description: response.session.description,
      images: [
        {
          url: response.session.exercises[0]?.exercise.fullVideoImageUrl || "/images/default-workout.jpg",
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${response.program.title}`,
      description: response.session.description,
      images: [response.session.exercises[0]?.exercise.fullVideoImageUrl || "/images/default-workout.jpg"],
    },
  };
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { slug, sessionSlug, locale } = await params;
  const response = await getSessionBySlug(slug, sessionSlug, locale);

  if (!response) {
    notFound();
  }

  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  // Pass authentication and premium status
  const isAuthenticated = !!authSession?.user;
  const isPremium = authSession?.user?.isPremium || false;

  return (
    <ProgramSessionClient
      isAuthenticated={isAuthenticated}
      isPremium={isPremium}
      program={response.program}
      session={response.session}
      week={response.week}
    />
  );
}
