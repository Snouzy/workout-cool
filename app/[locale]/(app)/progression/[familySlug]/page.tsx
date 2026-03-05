import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { auth } from "@/features/auth/lib/better-auth";
import {
  getProgressionFamily,
  getUserProgressions,
} from "@/features/progression-system";
import { ProgressionFamilyDetailPage } from "@/features/progression-system/ui/progression-family-detail";

interface FamilyDetailPageProps {
  params: Promise<{ familySlug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: FamilyDetailPageProps): Promise<Metadata> {
  const { familySlug } = await params;
  const family = await getProgressionFamily(familySlug);

  if (!family) {
    return { title: "Not Found" };
  }

  return {
    title: `${family.name} - Progression`,
    description: family.description || `${family.name} progression levels`,
  };
}

export default async function FamilyDetailRoute({
  params,
}: FamilyDetailPageProps) {
  const { familySlug, locale } = (await params) as {
    familySlug: string;
    locale: Locale;
  };

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const [family, progressions] = await Promise.all([
    getProgressionFamily(familySlug),
    getUserProgressions(session.user.id),
  ]);

  if (!family) {
    notFound();
  }

  const familyProgression = progressions.find(
    (p) => p.familySlug === family.slug
  );
  const currentLevel = familyProgression?.currentLevel ?? 1;

  return (
    <main className="flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full">
      <section className="flex-1 p-4 sm:p-6">
        <ProgressionFamilyDetailPage
          currentLevel={currentLevel}
          family={family}
          locale={locale}
        />
      </section>
    </main>
  );
}
