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
  const session = await getSessionBySlug(slug, sessionSlug, locale);

  if (!session) {
    return { title: t("programs.not_found") };
  }

  // Get title in current locale
  const getLocalizedTitle = () => {
    switch (locale) {
      case "en":
        return session.titleEn;
      case "es":
        return session.titleEs;
      case "pt":
        return session.titlePt;
      case "ru":
        return session.titleRu;
      case "zh-CN":
        return session.titleZhCn;
      default:
        return session.title;
    }
  };

  const title = getLocalizedTitle();

  return {
    title: `${title} - ${session.program.title}`,
    description: session.description,
    openGraph: {
      title: `${title} - ${session.program.title}`,
      description: session.description,
      images: [
        {
          url: session.exercises[0]?.exercise.image || "/images/default-workout.jpg",
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${session.program.title}`,
      description: session.description,
      images: [session.exercises[0]?.exercise.image || "/images/default-workout.jpg"],
    },
  };
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { slug, sessionSlug, locale } = await params;
  const session = await getSessionBySlug(slug, sessionSlug, locale);

  if (!session) {
    notFound();
  }

  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  // Transform session data to match the existing ProgramSessionClient interface
  const program = {
    id: session.program.id,
    title: session.program.title,
    slug: session.program.slug,
  };

  const week = {
    id: session.week.id,
    weekNumber: session.week.weekNumber,
    title: session.week.title,
  };

  const sessionData = {
    id: session.id,
    sessionNumber: session.sessionNumber,
    title: session.title,
    description: session.description,
    exercises: session.exercises.map(({ exercise, instructions, order, suggestedSets }) => ({
      id: `session-exercise-${exercise.id}`, // Unique ID for session exercise
      order,
      suggestedSets: suggestedSets.map((set) => ({
        id: set.id,
        setIndex: set.setIndex,
        types: set.types,
        valuesInt: set.valuesInt,
        valuesSec: set.valuesSec,
        units: set.units,
      })),
      exercise: {
        ...exercise,
        createdAt: new Date(), // Mock dates since they're required
        updatedAt: new Date(),
        attributes: exercise.attributes.map((attr) => ({
          id: attr.id,
          exerciseId: exercise.id,
          attributeNameId: attr.attributeName.id,
          attributeValueId: attr.attributeValue.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          attributeName: attr.attributeName,
          attributeValue: attr.attributeValue,
        })),
      },
    })),
  };

  // Always allow access to the page, but pass authentication status
  const isAuthenticated = !!authSession?.user;
  const isPremium = authSession?.user?.isPremium || false;
  const canAccessPremiumContent = !session.isPremium || (isAuthenticated && isPremium);
  console.log("session:", session);

  return (
    <ProgramSessionClient
      canAccessContent={canAccessPremiumContent}
      isAuthenticated={isAuthenticated}
      isPremiumSession={session.isPremium}
      program={session.program}
      session={session}
      week={week}
    />
  );
}
