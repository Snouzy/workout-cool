import { useEffect, useState, useMemo } from "react";
import type { WorkoutSession } from "@/shared/lib/workout-session/types/workout-session";
import { workoutSessionLocal } from "@/shared/lib/workout-session/workout-session.local";
import dayjs from "dayjs";

interface WorkoutSessionProps {
  streakCount?: number;
  className?: string;
}

export default function WorkoutStreakHeader({ streakCount = 5, className }: WorkoutSessionProps) {
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);

  const recentSessions = useMemo(() => {
    const recentSessions =
      sessions?.filter((s) => {
        const endDate = dayjs(s.endedAt).toDate();
        const cutoffDate = dayjs().subtract(streakCount, "day").toDate();
        return endDate > cutoffDate;
      }) ?? [];

    // Sorted from oldest to most recent
    recentSessions.sort((a, b) => dayjs(a.endedAt).diff(dayjs(b.endedAt)));
    return recentSessions;
  }, [sessions, streakCount]);

  const squares = useMemo<(WorkoutSession | null)[]>(() => {
    return [...Array(streakCount)].map((_, i) => {
      const targetDate = dayjs()
        .subtract(streakCount - 1 - i, "day")
        .startOf("day");

      // Choose most recent from that day
      return recentSessions.findLast((session) => dayjs(session.endedAt).isSame(targetDate, "day")) || null;
    });
  }, [recentSessions, streakCount]);

  useEffect(() => {
    const sessions = workoutSessionLocal.getAll();
    setSessions(sessions);
  }, []);

  return (
    <div className={className}>
      {squares.map((session, i) => (
        <div key={i} className={`w-5 h-5 rounded-md ${session ? "bg-green-500" : "bg-gray-300 border border-gray-400"}`} />
      ))}
    </div>
  );
}
