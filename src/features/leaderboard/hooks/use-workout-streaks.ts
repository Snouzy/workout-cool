"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { getWorkoutStreaksAction } from "../actions/get-workout-streaks.action";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface UseWorkoutStreaksOptions {
  limit?: number;
  refetchInterval?: number;
}

export function useWorkoutStreaks(options: UseWorkoutStreaksOptions = {}) {
  const { limit = 10, refetchInterval } = options;

  // Get user's timezone for accurate calculations
  const userTimezone = dayjs.tz.guess();

  return useQuery({
    queryKey: ["workout-streaks", limit, userTimezone],
    queryFn: async () => {
      const result = await getWorkoutStreaksAction({
        limit,
        timeZone: userTimezone,
      });

      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      return result?.userStreaks || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}