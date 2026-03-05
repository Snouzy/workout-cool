import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ExercisesPage } from "@/features/exercises/ui/exercises-page";

// TODO: i18n
export const metadata: Metadata = {
  title: "Exercises",
  description: "Browse our calisthenics exercise library — find the perfect movements for your training.",
};

interface ExercisesRootPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ExercisesRootPage({ params, searchParams }: ExercisesRootPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getI18n();

  const filters = {
    search: typeof sp.search === "string" ? sp.search : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    muscle: typeof sp.muscle === "string" ? sp.muscle : undefined,
    difficulty: typeof sp.difficulty === "string" ? sp.difficulty : undefined,
    page: typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1,
  };

  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${locale}`,
    },
    {
      label: "Exercises", // TODO: i18n
      current: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ExercisesPage filters={filters} locale={locale} />
    </>
  );
}
