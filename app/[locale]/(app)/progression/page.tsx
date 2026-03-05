import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import { TrendingUp } from "lucide-react";

import { Locale } from "locales/types";
import { auth } from "@/features/auth/lib/better-auth";
import { getUserProgressions } from "@/features/progression-system";
import { ProgressionDashboard } from "@/features/progression-system/ui/progression-dashboard";

export const metadata: Metadata = {
  title: "My Progression",
  description: "Track your calisthenics progression across movement families",
};

export default async function ProgressionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const progressions = await getUserProgressions(session.user.id);

  return (
    <main className="flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F8EF7] via-[#4F8EF7] to-[#25CB78]" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-7 h-7 text-white" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              My Progression
            </h1>
          </div>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-lg">
            Track your calisthenics level across movement families
          </p>
        </div>
      </header>

      <section className="flex-1 p-4 sm:p-6">
        <ProgressionDashboard
          locale={locale}
          progressions={progressions}
        />
      </section>
    </main>
  );
}
