"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, PlayCircle } from "lucide-react";

import { useI18n } from "locales/client";
import { getProgramProgress } from "@/features/programs/actions/get-program-progress.action";

interface ProgramProgressProps {
  programId: string;
}

export function ProgramProgress({ programId }: ProgramProgressProps) {
  const [progress, setProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const t = useI18n();

  useEffect(() => {
    loadProgress();
  }, [programId]);

  // Reload progress when refresh param changes (indicating session completion)
  useEffect(() => {
    const refreshParam = searchParams.get("refresh");
    if (refreshParam) {
      loadProgress();
    }
  }, [searchParams]);

  const loadProgress = async () => {
    try {
      const data = await getProgramProgress(programId);
      setProgress(data);
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded-xl"></div>;
  }

  if (!progress) {
    return null;
  }

  const { stats } = progress;

  return (
    <div className="bg-gradient-to-r from-[#4F8EF7]/10 to-[#25CB78]/10 border-2 border-[#4F8EF7]/20 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-[#4F8EF7]">{t("programs.my_progress")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.completedSessions} / {stats.totalSessions} {t("programs.completed_sets")}
          </p>
        </div>
        <div className="text-3xl font-bold text-[#25CB78]">{stats.completionPercentage}%</div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-[#25CB78]" size={16} />
          <span className="text-gray-600 dark:text-gray-400">{t("programs.completed_feminine")}</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="text-[#4F8EF7]" size={16} />
          <span className="text-gray-600 dark:text-gray-400">
            {t("programs.week")} {stats.currentWeek}, {t("programs.session")} {stats.currentSession}
          </span>
        </div>
      </div>
    </div>
  );
}
