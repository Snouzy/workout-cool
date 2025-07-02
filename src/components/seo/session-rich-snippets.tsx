import { Clock, Dumbbell, Timer } from "lucide-react";

import { useI18n } from "locales/client";

interface SessionRichSnippetsProps {
  duration: number;
  exerciseCount: number;
  totalSets: number;
  className?: string;
}

export function SessionRichSnippets({ duration, exerciseCount, totalSets, className = "" }: SessionRichSnippetsProps) {
  const t = useI18n();

  return (
    <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      {/* Duration */}
      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span>
          ~{duration} {t("programs.min_short")}
        </span>
      </div>

      {/* Exercise Count */}
      <div className="flex items-center gap-1">
        <Dumbbell size={16} />
        <span>
          {exerciseCount} {t("programs.exercises")}
        </span>
      </div>

      {/* Total Sets */}
      <div className="flex items-center gap-1">
        <Timer size={16} />
        <span>
          {totalSets} {t("programs.set", { count: totalSets })}
        </span>
      </div>

      {/* Hidden structured data for SEO */}
      <div className="sr-only">
        <span itemProp="duration">{duration}</span>
        <span itemProp="exerciseCount">{exerciseCount}</span>
        <span itemProp="workoutSets">{totalSets}</span>
      </div>
    </div>
  );
}
