import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineTooltip } from "@/components/ui/tooltip";
import { ProgressionFamilyDetail } from "../actions/get-progression-family.action";

interface ProgressionFamilyDetailPageProps {
  family: ProgressionFamilyDetail;
  currentLevel: number;
  locale: string;
}

function formatUnlockCriteria(criteria: Record<string, unknown>): string {
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

  return parts.length > 0 ? parts.join(" x ") : "";
}

function getDifficultyBadgeVariant(
  difficulty: string
): "green" | "orange" | "red" | "purple" | "outline" {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "green";
    case "intermediate":
      return "orange";
    case "advanced":
      return "red";
    case "elite":
      return "purple";
    default:
      return "outline";
  }
}

type LevelState = "unlocked" | "current" | "locked";

function getLevelState(level: number, currentLevel: number): LevelState {
  if (level < currentLevel) return "unlocked";
  if (level === currentLevel) return "current";
  return "locked";
}

export function ProgressionFamilyDetailPage({
  family,
  currentLevel,
  locale,
}: ProgressionFamilyDetailPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors mb-6"
        href={`/${locale}/progression`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Progression
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {family.name}
      </h1>
      {family.description && (
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {family.description}
        </p>
      )}

      {/* Level timeline */}
      <div className="space-y-3">
        {family.levels.map((level) => {
          const state = getLevelState(level.level, currentLevel);

          return (
            <Card
              className={`overflow-hidden transition-all duration-200 ${
                state === "current"
                  ? "ring-2 ring-primary shadow-md"
                  : state === "locked"
                    ? "opacity-60"
                    : ""
              }`}
              key={level.level}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Level indicator */}
                  <div className="shrink-0 mt-0.5">
                    {state === "unlocked" && (
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    {state === "current" && (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    {state === "locked" && (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Level {level.level}
                      </span>
                      <Badge
                        size="small"
                        variant={getDifficultyBadgeVariant(
                          level.exercise.difficultyLevel
                        )}
                      >
                        {level.exercise.difficultyLevel}
                      </Badge>
                      {state === "current" && (
                        <Badge size="small" variant="primary">
                          Current
                        </Badge>
                      )}
                    </div>

                    {state !== "locked" ? (
                      <Link
                        className="text-lg font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors"
                        href={`/${locale}/exercises/${level.exercise.slug}`}
                      >
                        {level.exercise.nameEn || level.exercise.name}
                      </Link>
                    ) : (
                      <p className="text-lg font-semibold text-slate-400 dark:text-slate-500">
                        {level.exercise.nameEn || level.exercise.name}
                      </p>
                    )}

                    {level.unlockCriteria &&
                      Object.keys(level.unlockCriteria).length > 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Unlock: {formatUnlockCriteria(level.unlockCriteria)}
                        </p>
                      )}

                    {state === "current" && (
                      <div className="mt-3">
                        <InlineTooltip title="Coming soon">
                          <Button disabled size="small" variant="outline">
                            Test My Level
                          </Button>
                        </InlineTooltip>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
