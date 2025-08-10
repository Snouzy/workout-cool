"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopWorkoutUsersAction } from "../actions/get-top-workout-users.action";

export interface UseTopWorkoutUsersOptions {
  limit?: number;
  refetchInterval?: number;
}

export function useTopWorkoutUsers(options: UseTopWorkoutUsersOptions = {}) {
  const { limit = 10, refetchInterval } = options;

  return useQuery({
    queryKey: ["top-workout-users", limit],
    queryFn: async () => {
      console.log("Hook: Calling getTopWorkoutUsersAction with limit:", limit);
      const result = await getTopWorkoutUsersAction({
        limit,
      });

      console.log("Hook: Raw result from action:", result);

      const users = result?.data || [];
      console.log("Hook: Returning users:", users);
      return users;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
