import { useMemo } from "react";
import dayjs from "dayjs";

import { useWorkoutSessions } from "@/features/workout-session/model/use-workout-sessions";

import type { WorkoutSession } from "@/shared/lib/workout-session/types/workout-session";

/**
 * Props for WorkoutStreakHeader component
 */
export interface WorkoutStreakHeaderProps {
  /** Additional CSS classes to apply to the component */
  className?: string;
  /** Number of days to display in the streak (default: 5) */
  streakCount?: number;
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Whether to show error state */
  hasError?: boolean;
  /** Optional callback when streak data changes */
  onStreakChange?: (streakData: StreakData) => void;
}

/**
 * Represents the streak data for a given day
 */
export interface DayStreakData {
  /** The date for this day */
  date: string;
  /** Whether the user worked out on this day */
  hasWorkout: boolean;
  /** The workout session for this day (if any) */
  session?: WorkoutSession;
}

/**
 * Complete streak data for the component
 */
export interface StreakData {
  /** Array of daily streak data */
  days: DayStreakData[];
  /** Current streak count */
  currentStreak: number;
  /** Total workouts in the displayed period */
  totalWorkouts: number;
}

/**
 * WorkoutStreakHeader component displays a visual representation of the user's
 * workout streak over the last N days (default 5).
 *
 * @param props - Component props
 * @returns JSX element representing the workout streak
 */
export default function WorkoutStreakHeader({
  className,
  streakCount = 5,
  isLoading = false,
  hasError = false,
  onStreakChange,
}: WorkoutStreakHeaderProps) {
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useWorkoutSessions();

  // Calculate recent sessions within the streak period
  const recentSessions = useMemo(() => {
    if (!sessions) return [];

    const recentSessions = sessions.filter((s) => {
      // Only include sessions that have ended (completed workouts)
      if (!s.endedAt) return false;

      const endDate = dayjs(s.endedAt).toDate();
      const cutoffDate = dayjs().subtract(streakCount, "day").toDate();
      return endDate > cutoffDate;
    });

    // Sort from oldest to most recent
    recentSessions.sort((a, b) => dayjs(a.endedAt).diff(dayjs(b.endedAt)));
    return recentSessions;
  }, [sessions, streakCount]);

  // Generate streak data for each day in the period
  const streakData = useMemo<StreakData>(() => {
    const days: DayStreakData[] = [...Array(streakCount)].map((_, i) => {
      const targetDate = dayjs()
        .subtract(streakCount - 1 - i, "day")
        .startOf("day");

      // Find the most recent session for this day
      const session = recentSessions.findLast((session) => dayjs(session.endedAt).isSame(targetDate, "day"));

      return {
        date: targetDate.format("YYYY-MM-DD"),
        hasWorkout: !!session,
        session: session || undefined,
      };
    });

    // Calculate current streak (consecutive days from the end)
    let currentStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].hasWorkout) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate total workouts in the period
    const totalWorkouts = days.filter((day) => day.hasWorkout).length;

    return {
      days,
      currentStreak,
      totalWorkouts,
    };
  }, [recentSessions, streakCount]);

  // Notify parent component when streak data changes
  useMemo(() => {
    if (onStreakChange) {
      onStreakChange(streakData);
    }
  }, [streakData, onStreakChange]);

  // Handle loading state
  if (isLoading || sessionsLoading) {
    return (
      <div aria-label="Loading workout streak" className={className} role="status">
        {[...Array(streakCount)].map((_, i) => (
          <div aria-hidden="true" className="w-5 h-5 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse" key={i} />
        ))}
      </div>
    );
  }

  // Handle error state
  if (hasError || sessionsError) {
    return (
      <div aria-label="Error loading workout streak" className={className} role="alert">
        {[...Array(streakCount)].map((_, i) => (
          <div
            aria-hidden="true"
            className="w-5 h-5 rounded-sm bg-red-200 dark:bg-red-800 border border-red-300 dark:border-red-700"
            key={i}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-label={`Workout streak: ${streakData.currentStreak} day${streakData.currentStreak !== 1 ? "s" : ""}, ${streakData.totalWorkouts} workouts in last ${streakCount} days`}
      className={className}
      role="img"
    >
      {streakData.days.map((day) => (
        <div
          aria-label={`${day.date}: ${day.hasWorkout ? "Workout completed" : "No workout"}`}
          className={`w-5 h-5 rounded-sm transition-colors duration-200 tooltip tooltip-bottom ${
            day.hasWorkout ? "bg-success dark:bg-success" : "bg-gray-400 dark:bg-slate-600 border border-gray-500/20 dark:border-slate-500"
          }`}
          data-tip={`${day.date}: ${day.hasWorkout ? "✅️" : "❌️"}`}
          key={day.date}
          title={`${day.date}: ${day.hasWorkout ? "✅️" : "❌️"}`}
        />
      ))}
    </div>
  );
}
