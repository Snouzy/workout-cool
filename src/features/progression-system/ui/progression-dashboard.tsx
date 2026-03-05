import Link from "next/link";
import { ChevronRight, Rocket } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProgressionStatus } from "../actions/get-user-progressions.action";

interface ProgressionDashboardProps {
  progressions: UserProgressionStatus[];
  locale: string;
  onInitialize?: boolean;
}

function formatUnlockCriteria(criteria: Record<string, unknown> | null): string {
  if (!criteria) return "";

  const parts: string[] = [];

  if (criteria.minReps) {
    parts.push(`${criteria.minReps} reps`);
  }
  if (criteria.minHoldTime) {
    parts.push(`${criteria.minHoldTime}s hold`);
  }
  if (criteria.minSets) {
    parts.push(`${criteria.minSets} sets`);
  }
  if (criteria.minFormQuality) {
    parts.push(`${String(criteria.minFormQuality)} form`);
  }

  return parts.length > 0 ? `Requires: ${parts.join(" x ")}` : "";
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    push: "from-red-500 to-orange-500",
    pull: "from-blue-500 to-cyan-500",
    legs: "from-green-500 to-emerald-500",
    core: "from-purple-500 to-violet-500",
    balance: "from-yellow-500 to-amber-500",
    hold: "from-pink-500 to-rose-500",
  };
  return colors[category.toLowerCase()] || "from-slate-500 to-slate-600";
}

export function ProgressionDashboard({
  progressions,
  locale,
  onInitialize,
}: ProgressionDashboardProps) {
  if (progressions.length === 0 || onInitialize) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Rocket className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200">
          Start your progression journey
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
          Initialize your calisthenics progressions to track your level across 6
          movement families.
        </p>
        <form action={`/${locale}/progression/initialize`} method="POST">
          <Button size="large" variant="default">
            Initialize Progressions
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {progressions.map((prog) => {
        const progressPercent = Math.round(
          (prog.currentLevel / prog.totalLevels) * 100
        );
        const categoryColor = getCategoryColor(prog.familyCategory);

        return (
          <Link
            href={`/${locale}/progression/${prog.familySlug}`}
            key={prog.familyId}
          >
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden h-full">
              <div
                className={`h-1.5 bg-gradient-to-r ${categoryColor}`}
              />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {prog.familyName}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>

                <div className="mb-3">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    Level {prog.currentLevel}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">
                    / {prog.totalLevels}
                  </span>
                </div>

                {prog.currentExercise && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    {prog.currentExercise.nameEn || prog.currentExercise.name}
                  </p>
                )}

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${categoryColor} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {prog.nextExercise && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Next:{" "}
                    {prog.nextExercise.nameEn || prog.nextExercise.name}
                  </p>
                )}

                {prog.nextUnlockCriteria && (
                  <Badge variant="outline" size="small">
                    {formatUnlockCriteria(prog.nextUnlockCriteria)}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
