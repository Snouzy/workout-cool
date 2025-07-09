import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";
import { ProgramDetailPage } from "@/features/programs/ui/program-detail-page";
import { getProgramDescription, getProgramTitle } from "@/features/programs/lib/translations-mapper";
import { generateProgramSEOKeywords } from "@/features/programs/lib/program-metadata";
import { getProgramBySlug } from "@/features/programs/actions/get-program-by-slug.action";
import { auth } from "@/features/auth/lib/better-auth";

interface ProgramDetailPageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getI18n();
  const program = await getProgramBySlug(slug);
  const localizedData = getLocalizedMetadata(locale);

  if (!program) {
    return { title: t("programs.not_found") };
  }

  const localizedTitle = getProgramTitle(program, locale);
  const localizedDescription = getProgramDescription(program, locale);
  const seoKeywords = generateProgramSEOKeywords(program, locale, t);

  return {
    title: `${localizedTitle} - ${localizedData.title}`,
    description: localizedDescription,
    keywords: seoKeywords,
    openGraph: {
      title: `${localizedTitle} - ${localizedData.title}`,
      description: localizedDescription,
      images: [
        {
          url: program.image, // TODO: specific opengraph image for each program (upload admin side)
          width: 400,
          height: 600,
          alt: localizedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${localizedTitle} - ${localizedData.title}`,
      description: localizedDescription,
      images: [program.image],
    },
  };
}

export default async function ProgramDetailPageRoute({ params }: ProgramDetailPageProps) {
  const { slug, locale } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Generate Course structured data
  const localizedTitle = getProgramTitle(program, locale);
  const localizedDescription = getProgramDescription(program, locale);

  const courseStructuredData = generateStructuredData({
    type: "Course",
    locale,
    title: localizedTitle,
    description: localizedDescription,
    courseData: {
      id: program.id,
      level: program.level,
      category: program.category,
      durationWeeks: program.durationWeeks,
      sessionsPerWeek: program.sessionsPerWeek,
      sessionDurationMin: program.sessionDurationMin,
      equipment: program.equipment,
      isPremium: program.isPremium,
      participantCount: program.participantCount,
      totalSessions: program.weeks.reduce((acc, week) => acc + week.sessions.length, 0),
      totalExercises: program.weeks.reduce(
        (acc, week) => acc + week.sessions.reduce((sessAcc, session) => sessAcc + session.totalExercises, 0),
        0,
      ),
      coaches: program.coaches,
    },
  });

  // Breadcrumbs

  return (
    <>
      <StructuredDataScript data={courseStructuredData} />
      <ProgramDetailPage isAuthenticated={!!session} program={program} />
    </>
  );
}
