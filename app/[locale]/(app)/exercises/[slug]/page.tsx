import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ExerciseDetailPage } from "@/features/exercises/ui/exercise-detail";
import { getExerciseBySlug } from "@/entities/exercise/actions/get-exercise-by-slug.action";

interface ExerciseDetailPageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateMetadata({ params }: ExerciseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exercise = await getExerciseBySlug(slug);

  if (!exercise) {
    return { title: "Exercise not found" }; // TODO: i18n
  }

  const displayName = exercise.nameEn ?? exercise.name;

  return {
    title: `${displayName} — CaliGym`,
    description: exercise.description?.slice(0, 160) ?? `Learn how to perform ${displayName} with proper form.`,
  };
}

export default async function ExerciseDetailRoute({ params }: ExerciseDetailPageProps) {
  const { slug, locale } = await params;
  const exercise = await getExerciseBySlug(slug);

  if (!exercise) {
    notFound();
  }

  const t = await getI18n();
  const displayName = exercise.nameEn ?? exercise.name;

  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${locale}`,
    },
    {
      label: "Exercises", // TODO: i18n
      href: `/${locale}/exercises`,
    },
    {
      label: displayName,
      current: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ExerciseDetailPage exercise={exercise} locale={locale} />
    </>
  );
}
