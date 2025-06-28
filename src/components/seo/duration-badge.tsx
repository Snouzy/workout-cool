import { Clock } from "lucide-react";

interface DurationBadgeProps {
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  locale: string;
  className?: string;
}

export function DurationBadge({ 
  durationWeeks, 
  sessionsPerWeek, 
  sessionDurationMin, 
  locale,
  className = "" 
}: DurationBadgeProps) {
  const totalMinutes = durationWeeks * sessionsPerWeek * sessionDurationMin;
  const totalHours = Math.round(totalMinutes / 60);

  const formatDuration = () => {
    if (locale === "en") {
      return `${durationWeeks} weeks • ${totalHours}h total`;
    } else if (locale === "es") {
      return `${durationWeeks} semanas • ${totalHours}h total`;
    } else if (locale === "pt") {
      return `${durationWeeks} semanas • ${totalHours}h total`;
    } else if (locale === "ru") {
      return `${durationWeeks} недель • ${totalHours}ч всего`;
    } else if (locale === "zh-CN") {
      return `${durationWeeks} 周 • 总共${totalHours}小时`;
    } else {
      return `${durationWeeks} semaines • ${totalHours}h total`;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <Clock className="h-4 w-4" />
      <span>{formatDuration()}</span>
      
      {/* Hidden structured data for SEO */}
      <div className="sr-only">
        <span itemProp="timeRequired">PT{totalMinutes}M</span>
        <span itemProp="duration">P{durationWeeks}W</span>
      </div>
    </div>
  );
}