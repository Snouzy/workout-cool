import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import LeaderboardPage from "@/features/leaderboard/ui/leaderboard-page";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "🏆 Workout Streak Leaderboard",
  description: "See who's dominating their fitness journey with the longest workout streaks! Join the leaderboard and track your progress.",
};

export default async function LeaderboardRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = await getI18n();

  const breadcrumbItems = [
    {
      label: t("breadcrumbs.home"),
      href: `/${locale}`,
    },
    {
      label: t("bottom_navigation.leaderboard"),
      current: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <LeaderboardPage />
    </>
  );
}
