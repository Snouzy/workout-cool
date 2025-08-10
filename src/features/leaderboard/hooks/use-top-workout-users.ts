"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopWorkoutUsersAction } from "../actions/get-top-workout-users.action";

export interface UseTopWorkoutUsersOptions {
  refetchInterval?: number;
}

export function useTopWorkoutUsers(options: UseTopWorkoutUsersOptions = {}) {
  const { refetchInterval } = options;

  return useQuery({
    queryKey: ["top-workout-users"],
    queryFn: async () => {
      const result = await getTopWorkoutUsersAction();
      return result?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
