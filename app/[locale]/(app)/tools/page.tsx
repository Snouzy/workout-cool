import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { CalculatorIcon, ScaleIcon, HeartIcon, DumbbellIcon, RepeatIcon } from "lucide-react";

import { getI18n } from "locales/server";
import { env } from "@/env";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

interface FitnessTool {
  id: string;
  icon: React.ReactNode;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  href: string;
  coming_soon?: boolean;
}

const fitnessTools: FitnessTool[] = [
  {
    id: "calorie-calculator",
    icon: <CalculatorIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolChief.png",
    gradientFrom: "from-[#4F8EF7]",
    gradientTo: "to-[#238BE6]",
    href: "/tools/calorie-calculator",
  },
  {
    id: "bmi-calculator",
    icon: <HeartIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolLove.png",
    gradientFrom: "from-[#FF5722]",
    gradientTo: "to-[#EF4444]",
    href: "/tools/bmi-calculator",
  },
  {
    id: "macro-calculator",
    icon: <ScaleIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolBiceps.png",
    gradientFrom: "from-[#25CB78]",
    gradientTo: "to-[#22C55E]",
    href: "/tools/macro-calculator",
    coming_soon: true,
  },
  {
    id: "heart-rate-calculator",
    icon: <HeartIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolMedical.png",
    gradientFrom: "from-[#8B5CF6]",
    gradientTo: "to-[#7C3AED]",
    href: "/tools/heart-rate-zones",
  },
  {
    id: "one-rep-max",
    icon: <DumbbellIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolRich.png",
    gradientFrom: "from-[#F59E0B]",
    gradientTo: "to-[#EF4444]",
    href: "/tools/one-rep-max",
    coming_soon: true,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n();

  return {
    title: t("tools.meta.title"),
    description: t("tools.meta.description"),
    keywords: t("tools.meta.keywords"),
  };
}

export default async function ToolsPage() {
  const t = await getI18n();

  return (
    <div className="light:bg-white dark:bg-base-200">
      {env.NEXT_PUBLIC_TOP_TOOLS_BANNER_AD_SLOT && <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_TOOLS_BANNER_AD_SLOT} />}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] bg-clip-text text-transparent">
            {t("tools.title")}
          </h1>
          <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto">{t("tools.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fitnessTools.map((tool) => {
            const sharedClassName = `group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
              tool.coming_soon
                ? "border-base-content/20 bg-base-200/30 cursor-not-allowed opacity-60 dark:border-base-content/10 dark:bg-base-200/20"
                : "border-base-content bg-base-200/50 hover:scale-[1.02] hover:border-primary/50 dark:border-base-content/10 dark:bg-base-200/50"
            }`;

            if (tool.coming_soon) {
              return (
                <div className={sharedClassName} key={tool.id}>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} ${
                      tool.coming_soon ? "opacity-5" : "opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                    }`}
                  />

                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} text-white ${
                          tool.coming_soon ? "opacity-50" : ""
                        }`}
                      >
                        {tool.icon}
                      </div>
                      <div
                        className={`relative w-12 h-12 transition-opacity ${
                          tool.coming_soon ? "opacity-30" : "opacity-80 group-hover:opacity-100"
                        }`}
                      >
                        <Image
                          alt="Workout Cool Emoji"
                          className="object-contain"
                          height={48}
                          src={`/images/emojis/${tool.emoji}`}
                          width={48}
                        />
                      </div>
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${tool.coming_soon ? "text-base-content/50" : "text-base-content"}`}>
                      {t(`tools.${tool.id}.title` as keyof typeof t)}
                    </h3>
                    <p className={`text-sm sm:text-base ${tool.coming_soon ? "text-base-content/40" : "text-base-content/70"}`}>
                      {t(`tools.${tool.id}.description` as keyof typeof t)}
                    </p>

                    {tool.coming_soon && (
                      <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-base-content/10 text-xs font-medium text-base-content/60">
                        {t("commons.coming_soon")}
                      </div>
                    )}

                    {!tool.coming_soon && (
                      <div className="mt-4 flex items-center gap-2 text-primary">
                        <span className="text-sm font-medium">{t("tools.try_now")}</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <Link className={sharedClassName} href={tool.href} key={tool.id}>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} ${
                    tool.coming_soon ? "opacity-5" : "opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                  }`}
                />

                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} text-white ${
                        tool.coming_soon ? "opacity-50" : ""
                      }`}
                    >
                      {tool.icon}
                    </div>
                    <div
                      className={`relative w-12 h-12 transition-opacity ${
                        tool.coming_soon ? "opacity-30" : "opacity-80 group-hover:opacity-100"
                      }`}
                    >
                      <Image
                        alt="Workout Cool Emoji"
                        className="object-contain"
                        height={48}
                        src={`/images/emojis/${tool.emoji}`}
                        width={48}
                      />
                    </div>
                  </div>

                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${tool.coming_soon ? "text-base-content/50" : "text-base-content"}`}>
                    {t(`tools.${tool.id}.title` as keyof typeof t)}
                  </h3>
                  <p className={`text-sm sm:text-base ${tool.coming_soon ? "text-base-content/40" : "text-base-content/70"}`}>
                    {t(`tools.${tool.id}.description` as keyof typeof t)}
                  </p>

                  {tool.coming_soon && (
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-base-content/10 text-xs font-medium text-base-content/60">
                      {t("commons.coming_soon")}
                    </div>
                  )}

                  {!tool.coming_soon && (
                    <div className="mt-4 flex items-center gap-2 text-primary">
                      <span className="text-sm font-medium">{t("tools.try_now")}</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {env.NEXT_PUBLIC_BOTTOM_TOOLS_BANNER_AD_SLOT && (
          <div className="mt-12">
            <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_TOOLS_BANNER_AD_SLOT} />
          </div>
        )}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 backdrop-blur-sm border border-base-content/10">
            <RepeatIcon className="w-5 h-5 text-primary" />
            <span className="text-sm text-base-content/70">{t("tools.moreComingSoon")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
