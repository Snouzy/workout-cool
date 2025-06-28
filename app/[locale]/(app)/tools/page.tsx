import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { CalculatorIcon, ScaleIcon, HeartIcon, TimerIcon, DumbbellIcon, RepeatIcon } from "lucide-react";

import { getI18n } from "locales/server";

interface FitnessTool {
  id: string;
  icon: React.ReactNode;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  href: string;
}

const fitnessTools: FitnessTool[] = [
  {
    id: "calorie-calculator",
    icon: <CalculatorIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolHappy.png",
    gradientFrom: "from-[#4F8EF7]",
    gradientTo: "to-[#238BE6]",
    href: "/tools/calorie-calculator",
  },
  {
    id: "macro-calculator",
    icon: <ScaleIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolBiceps.png",
    gradientFrom: "from-[#25CB78]",
    gradientTo: "to-[#22C55E]",
    href: "/tools/macro-calculator",
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
    id: "heart-rate-calculator",
    icon: <HeartIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolSwag.png",
    gradientFrom: "from-[#8B5CF6]",
    gradientTo: "to-[#7C3AED]",
    href: "/tools/heart-rate-calculator",
  },
  {
    id: "one-rep-max",
    icon: <DumbbellIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolRich.png",
    gradientFrom: "from-[#F59E0B]",
    gradientTo: "to-[#EF4444]",
    href: "/tools/one-rep-max",
  },
  {
    id: "rest-timer",
    icon: <TimerIcon className="w-8 h-8" />,
    emoji: "WorkoutCoolYeahOk.png",
    gradientFrom: "from-[#06B6D4]",
    gradientTo: "to-[#3B82F6]",
    href: "/tools/rest-timer",
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
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] bg-clip-text text-transparent">
            {t("tools.title")}
          </h1>
          <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto">{t("tools.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fitnessTools.map((tool) => (
            <Link
              className="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
              href={tool.href}
              key={tool.id}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              />

              <div className="relative p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} text-white`}>{tool.icon}</div>
                  <div className="relative w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      alt="Workout Cool Emoji"
                      className="object-contain"
                      height={48}
                      src={`/images/emojis/${tool.emoji}`}
                      width={48}
                    />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-base-content">{t(`tools.${tool.id}.title`)}</h3>
                <p className="text-base-content/70 text-sm sm:text-base">{t(`tools.${tool.id}.description`)}</p>

                <div className="mt-4 flex items-center gap-2 text-primary">
                  <span className="text-sm font-medium">{t("tools.tryNow")}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 backdrop-blur-sm border border-base-content/10">
            <RepeatIcon className="w-5 h-5 text-primary" />
            <span className="text-sm text-base-content/70">{t("tools.moreComingSoon")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
