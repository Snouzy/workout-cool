import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { ProgramsPage } from "@/features/programs/ui/programs-page";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez nos programmes d'entraînement gamifiés pour tous les niveaux - Rejoins la communauté WorkoutCool !",
};

export default async function ProgramsRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = await getI18n();

  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${locale}`,
    },
    {
      label: t("programs.workout_programs"),
      current: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <ProgramsPage locale={locale} />
    </>
  );
}
