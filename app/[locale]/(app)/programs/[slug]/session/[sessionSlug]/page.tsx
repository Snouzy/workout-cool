import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { Locale, locales } from "locales/types";
import { getI18n } from "locales/server";
import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import {
  getProgramSlug,
  getProgramTitle,
  getSessionSlug,
  getSessionTitle,
} from "@/features/programs/lib/translations-mapper";
import { generateSessionMetadata } from "@/features/programs/lib/session-metadata";
import { getSessionBySlug } from "@/features/programs/actions/get-session-by-slug.action";
import { auth } from "@/features/auth/lib/better-auth";
import type { ProgramI18nReference } from "@/entities/program/types/program.types";
import type { ProgramSessionWithExercises } from "@/entities/program-session/types/program-session.types";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

// Import the existing session client component
import { ProgramSessionClient } from "./ProgramSessionClient";

interface SessionDetailPageProps {
  params: Promise<{ slug: string; sessionSlug: string; locale: Locale }>;
}

const getHrefLang = (locale: Locale): string => {
  switch (locale) {
    case "en":
      return "en-US";
    case "fr":
      return "fr-FR";
    case "es":
      return "es-ES";
    case "pt":
      return "pt-PT";
    case "ru":
      return "ru-RU";
    default:
      return locale;
  }
};

const buildSessionUrl = (locale: Locale, programSlug: string, sessionSlug: string, includeLocalePrefix = true): string => {
  const localePrefix = includeLocalePrefix ? `/${locale}` : "";

  return `https://www.workout.cool${localePrefix}/programs/${programSlug}/session/${sessionSlug}`;
};

const getAlternateSessionUrl = (
  locale: Locale,
  program: ProgramI18nReference,
  session: ProgramSessionWithExercises,
  includeLocalePrefix = true,
): string | null => {
  const programSlug = getProgramSlug(program, locale) || program.slug;
  const sessionSlug = getSessionSlug(session, locale);

  return sessionSlug ? buildSessionUrl(locale, programSlug, sessionSlug, includeLocalePrefix) : null;
};

const getCanonicalSessionUrl = (
  locale: Locale,
  program: ProgramI18nReference,
  session: ProgramSessionWithExercises,
  includeLocalePrefix = true,
): string => {
  const programSlug = getProgramSlug(program, locale) || program.slug;
  const sessionSlug = getSessionSlug(session, locale) || session.slug;

  return buildSessionUrl(locale, programSlug, sessionSlug, includeLocalePrefix);
};

export async function generateMetadata({ params }: SessionDetailPageProps): Promise<Metadata> {
  const { slug, sessionSlug, locale } = await params;
  const t = await getI18n();
  const response = await getSessionBySlug(slug, sessionSlug, locale);

  if (!response) {
    return { title: t("programs.not_found") };
  }

  const sessionMetadata = generateSessionMetadata(response.session, response.program, locale);
  const imageUrl = response.session.exercises[0]?.exercise.fullVideoImageUrl || "/images/default-workout.jpg";
  const canonicalUrl = getCanonicalSessionUrl(locale, response.program, response.session);
  const xDefaultUrl = getAlternateSessionUrl("en", response.program, response.session, false);

  return {
    title: sessionMetadata.title,
    description: sessionMetadata.description,
    keywords: sessionMetadata.keywords,
    openGraph: {
      title: sessionMetadata.title,
      description: sessionMetadata.description,
      url: canonicalUrl,
      siteName: "Workout Cool",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: sessionMetadata.title,
        },
      ],
      locale: locale === "zh-CN" ? "zh_CN" : locale.replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: sessionMetadata.title,
      description: sessionMetadata.description,
      images: [imageUrl],
      creator: "@WorkoutCool",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(
          locales.flatMap((targetLocale) => {
            const sessionUrl = getAlternateSessionUrl(targetLocale, response.program, response.session);

            return sessionUrl ? [[getHrefLang(targetLocale), sessionUrl]] : [];
          }),
        ),
        ...(xDefaultUrl ? { "x-default": xDefaultUrl } : {}),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
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

  const t = await getI18n();
  const sessionTitle = getSessionTitle(response.session, locale);
  const programTitle = getProgramTitle(response.program, locale);
  const programSlug = getProgramSlug(response.program, locale) || response.program.slug;
  const canonicalUrl = getCanonicalSessionUrl(locale, response.program, response.session);

  // Generate breadcrumb items
  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${locale}`,
    },
    {
      label: t("programs.workout_programs"),
      href: `/${locale}/programs`,
    },
    {
      label: programTitle,
      href: `/${locale}/programs/${programSlug}`,
    },
    {
      label: sessionTitle,
      current: true,
    },
  ];

  // Generate VideoObject structured data
  const sessionStructuredData = generateStructuredData({
    type: "VideoObject",
    locale,
    title: `${sessionTitle} - ${programTitle}`,
    description: response.session.description || `${sessionTitle} workout session`,
    url: canonicalUrl,
    image: response.session.exercises[0]?.exercise.fullVideoImageUrl || undefined,
    sessionData: {
      duration: Math.round(response.session.exercises.length * 3), // Estimate 3 min per exercise
      exercises: response.session.exercises.map((ex) => ({
        name: ex.exercise.name,
        sets: ex.suggestedSets.length,
      })),
      thumbnailUrl: response.session.exercises[0]?.exercise.fullVideoImageUrl || undefined,
      videoUrl: response.session.exercises[0]?.exercise.fullVideoUrl || undefined,
    },
  });

  return (
    <>
      <StructuredDataScript data={sessionStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <ProgramSessionClient
        isAuthenticated={isAuthenticated}
        isPremium={isPremium}
        program={response.program}
        session={response.session}
        week={response.week}
      />
    </>
  );
}
