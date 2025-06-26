import { Metadata } from "next";

import { ProgramsPage } from "@/features/programs/ui/programs-page";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Découvrez nos programmes d'entraînement gamifiés pour tous les niveaux - Rejoins la communauté WorkoutCool !",
};

export default async function ProgramsRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return <ProgramsPage locale={locale} />;
}
