import { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { getI18n } from "locales/server";
import { SponsorOnboardingForm } from "@/features/sponsor/onboarding/SponsorOnboardingForm";

export const metadata: Metadata = {
  title: "Sponsor Onboarding | Workout Cool",
  description: "Complete your sponsorship setup on Workout.cool",
  robots: { index: false, follow: false },
};

export default async function SponsorOnboardingPage() {
  const t = await getI18n();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-[#4F8EF7]" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("ads.onboarding_title")}</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("ads.onboarding_description")}</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <SponsorOnboardingForm />
        </div>
      </div>
    </div>
  );
}
