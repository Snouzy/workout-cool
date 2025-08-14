"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserPositionAction } from "../actions/get-user-position.action";
import { LeaderboardPeriod } from "../actions/get-top-workout-users.action";

interface UseUserPositionOptions {
  userId: string | undefined;
  period: LeaderboardPeriod;
  enabled?: boolean;
}

export function useUserPosition({ userId, period, enabled = true }: UseUserPositionOptions) {
  return useQuery({
    queryKey: ["user-position", userId, period],
    queryFn: async () => {
      if (!userId) return null;
      const result = await getUserPositionAction({ userId, period });
      return result?.data || null;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
