import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { getSessionBySlug } from "@/features/programs/actions/get-session-by-slug.action";
import { auth } from "@/features/auth/lib/better-auth";

// Import the existing session client component
import { ProgramSessionClient } from "./ProgramSessionClient";

interface SessionDetailPageProps {
  params: Promise<{ slug: string; sessionSlug: string; locale: string }>;
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
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      image: exercise.image,
      videoUrl: exercise.videoUrl,
      order,
      instructions,
      attributes: exercise.attributes.map((attr) => ({
        id: attr.id,
        attributeName: {
          id: attr.attributeName.id,
          name: attr.attributeName.name,
        },
        attributeValue: {
          id: attr.attributeValue.id,
          value: attr.attributeValue.value,
        },
      })),
      slug,
      suggestedSets,
      exercise,
    })),
  };

  if (session.isPremium && !authSession?.user) {
    return <div>TODO: You must be logged in to view this page</div>;
  }

  return <ProgramSessionClient program={program} session={sessionData} week={week} />;
}
