import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import { getSessionTitle, getProgramTitle } from "@/features/programs/lib/translations-mapper";
import { generateSessionMetadata } from "@/features/programs/lib/session-metadata";
import { getSessionBySlug } from "@/features/programs/actions/get-session-by-slug.action";
import { auth } from "@/features/auth/lib/better-auth";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

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

  const sessionMetadata = generateSessionMetadata(response.session, response.program, locale);
  const imageUrl = response.session.exercises[0]?.exercise.fullVideoImageUrl || "/images/default-workout.jpg";

  return {
    title: sessionMetadata.title,
    description: sessionMetadata.description,
    keywords: sessionMetadata.keywords,
    openGraph: {
      title: sessionMetadata.title,
      description: sessionMetadata.description,
      url: `https://www.workout.cool/${locale}/programs/${slug}/session/${sessionSlug}`,
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
      canonical: `https://www.workout.cool/${locale}/programs/${slug}/session/${sessionSlug}`,
      languages: {
        "fr-FR": `https://www.workout.cool/fr/programs/${slug}/session/${sessionSlug}`,
        "en-US": `https://www.workout.cool/en/programs/${slug}/session/${sessionSlug}`,
        "es-ES": `https://www.workout.cool/es/programs/${slug}/session/${sessionSlug}`,
        "pt-PT": `https://www.workout.cool/pt/programs/${slug}/session/${sessionSlug}`,
        "ru-RU": `https://www.workout.cool/ru/programs/${slug}/session/${sessionSlug}`,
        "zh-CN": `https://www.workout.cool/zh-CN/programs/${slug}/session/${sessionSlug}`,
        "x-default": `https://www.workout.cool/programs/${slug}/session/${sessionSlug}`,
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
      href: `/${locale}/programs/${slug}`,
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
    url: `https://www.workout.cool/${locale}/programs/${slug}/session/${sessionSlug}`,
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
