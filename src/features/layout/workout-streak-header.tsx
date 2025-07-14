import { useMemo } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

import { useCurrentLocale } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/date";
import { useWorkoutSessions } from "@/features/workout-session/model/use-workout-sessions";

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

import type { WorkoutSession } from "@/shared/lib/workout-session/types/workout-session";

const DEFAULT_STREAK_COUNT = 5;

/**
 * Props for WorkoutStreakHeader component
 */
export interface WorkoutStreakHeaderProps {
  className?: string;
  /** Number of days to display in the streak (default: 5) */
  streakCount?: number;
}

/**
 * Represents the streak data for a given day
 */
export interface DayStreakData {
  /** The date for this day */
  date: string;
  /** Whether the user worked out on this day */
  hasWorkout: boolean;
  /** The workout session for this day (if any, maybe we could redirect to the session page in the future) */
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
export default function WorkoutStreakHeader({ className, streakCount = DEFAULT_STREAK_COUNT }: WorkoutStreakHeaderProps) {
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useWorkoutSessions();
  const locale = useCurrentLocale();
  // Get user's timezone for accurate date calculations (memoized for performance)
  const userTimezone = useMemo(() => {
    try {
      return dayjs.tz.guess();
    } catch (error) {
      console.warn("Failed to detect timezone, falling back to UTC:", error);
      return "UTC";
    }
  }, []);

  // Calculate recent sessions within the streak period
  const recentSessions = useMemo(() => {
    if (!sessions) return [];

    const recentSessions = sessions.filter((s) => {
      // Only include sessions that have ended (completed workouts)
      if (!s.endedAt) return false;

      try {
        // Convert session end time to user's timezone for accurate day comparison
        const endDate = dayjs(s.endedAt).tz(userTimezone);
        const cutoffDate = dayjs().tz(userTimezone).subtract(streakCount, "day").startOf("day");

        return endDate.isAfter(cutoffDate);
      } catch (error) {
        console.warn("Error processing session date:", error, s);
        return false;
      }
    });

    // Sort from oldest to most recent
    recentSessions.sort((a, b) => dayjs(a.endedAt).diff(dayjs(b.endedAt)));
    return recentSessions;
  }, [sessions, streakCount, userTimezone]);

  // Generate streak data for each day in the period
  const streakData = useMemo<StreakData>(() => {
    const days: DayStreakData[] = [...Array(streakCount)].map((_, i) => {
      try {
        // Calculate target date in user's timezone
        const targetDate = dayjs()
          .tz(userTimezone)
          .subtract(streakCount - 1 - i, "day")
          .startOf("day");

        // Find the most recent session for this day in user's timezone
        const session = recentSessions.findLast((session) => {
          try {
            const sessionDate = dayjs(session.endedAt).tz(userTimezone);
            return sessionDate.isSame(targetDate, "day");
          } catch (error) {
            console.warn("Error comparing session date:", error, session);
            return false;
          }
        });

        const date = formatDate(targetDate.toDate(), locale);
        return {
          date,
          hasWorkout: !!session,
          session: session || undefined,
        };
      } catch (error) {
        console.warn("Error calculating streak data for day:", error, i);
        // Return fallback data for this day
        const fallbackDate = dayjs()
          .subtract(streakCount - 1 - i, "day")
          .format("YYYY-MM-DD");
        return {
          date: fallbackDate,
          hasWorkout: false,
          session: undefined,
        };
      }
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
  }, [recentSessions, streakCount, userTimezone]);

  // Handle loading state
  if (sessionsLoading) {
    return (
      <div aria-label="Loading workout streak" className={`flex gap-1 ${className}`} role="status">
        {[...Array(streakCount)].map((_, i) => (
          <div
            aria-hidden="true"
            className="w-4 h-4 sm:w-6 sm:h-6 rounded-sm sm:rounded-md bg-base-300 animate-pulse transition-colors duration-200"
            key={i}
          />
        ))}
      </div>
    );
  }

  // Handle error state
  if (sessionsError) {
    return (
      <div aria-label="Error loading workout streak" className={`flex gap-1 ${className}`} role="alert">
        {[...Array(streakCount)].map((_, i) => (
          <div
            aria-hidden="true"
            className="w-4 h-4 sm:w-6 sm:h-6 rounded-sm sm:rounded-md bg-error/20 border border-error/30 transition-colors duration-200"
            key={i}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-label={`Workout streak: ${streakData.currentStreak} day${streakData.currentStreak !== 1 ? "s" : ""}, ${streakData.totalWorkouts} workouts in last ${streakCount} days`}
      className={cn("flex gap-1 sm:mr-2", className)}
      role="img"
    >
      {streakData.days.map((day) => {
        const title = `${day.date}: ${day.hasWorkout ? "✅️" : "❌️"}`;

        return (
          <div
            aria-label={`${day.date}: ${day.hasWorkout ? "Workout completed" : "No workout"}`}
            className={`w-4 h-4 sm:w-6 sm:h-6 rounded-sm sm:rounded-md transition-all duration-200 ease-in-out tooltip tooltip-bottom hover:scale-110 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none ${
              day.hasWorkout
                ? "bg-emerald-400 dark:bg-emerald-500 shadow-sm hover:shadow-md hover:brightness-110 focus:ring-emerald-300"
                : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 hover:bg-gray-400 dark:hover:bg-gray-500 focus:ring-gray-300 dark:focus:ring-gray-400"
            }`}
            data-tip={title}
            key={day.date}
            role="button"
            tabIndex={0}
            title={title}
          />
        );
      })}
    </div>
  );
}
