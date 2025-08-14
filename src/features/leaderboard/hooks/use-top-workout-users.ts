"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopWorkoutUsersAction, LeaderboardPeriod } from "../actions/get-top-workout-users.action";

export interface UseTopWorkoutUsersOptions {
  refetchInterval?: number;
  period?: LeaderboardPeriod;
}

export function useTopWorkoutUsers(options: UseTopWorkoutUsersOptions = {}) {
  const { refetchInterval, period = "all-time" } = options;

  return useQuery({
    queryKey: ["top-workout-users", period],
    queryFn: async () => {
      const result = await getTopWorkoutUsersAction({ period });
      return result?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
