"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";
import { getProgramProgress } from "@/features/programs/actions/get-program-progress.action";

interface ProgramProgressProps {
  programId: string;
}

export function ProgramProgress({ programId }: ProgramProgressProps) {
  const [progress, setProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [programId]);

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
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded-xl"></div>
    );
  }

  if (!progress) {
    return null;
  }

  const { stats } = progress;

  return (
    <div className="bg-gradient-to-r from-[#4F8EF7]/10 to-[#25CB78]/10 border-2 border-[#4F8EF7]/20 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-[#4F8EF7]">Ma progression</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.completedSessions} / {stats.totalSessions} séances complétées
          </p>
        </div>
        <div className="text-3xl font-bold text-[#25CB78]">
          {stats.completionPercentage}%
        </div>
      </div>
      
      <Progress value={stats.completionPercentage} className="h-3 mb-3" />
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-[#25CB78]" />
          <span className="text-gray-600 dark:text-gray-400">Complétées</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle size={16} className="text-[#4F8EF7]" />
          <span className="text-gray-600 dark:text-gray-400">
            Semaine {stats.currentWeek}, Séance {stats.currentSession}
          </span>
        </div>
      </div>
    </div>
  );
}