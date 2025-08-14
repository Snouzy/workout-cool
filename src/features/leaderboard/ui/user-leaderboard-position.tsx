"use client";

import React from "react";
import { useQueryState } from "nuqs";
import { usePathname } from "next/navigation";

import { useSession } from "@/features/auth/lib/auth-client";

import { useUserPosition } from "../hooks/use-user-position";
import { LeaderboardPeriod } from "../actions/get-top-workout-users.action";

export default function UserLeaderboardPosition() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userId = session?.user?.id;

  // Get period from URL using nuqs
  const [period] = useQueryState<LeaderboardPeriod>("period", {
    defaultValue: "all-time",
    parse: (value) => {
      if (value === "weekly" || value === "monthly" || value === "all-time") {
        return value as LeaderboardPeriod;
      }
      return "all-time";
    },
  });

  const { data: userPosition, isLoading } = useUserPosition({
    userId,
    period,
    enabled: isAuthenticated,
  });

  const pathnameIncludesLeaderboard = usePathname().includes("/leaderboard");

  if (!isAuthenticated || isLoading || !userPosition || !pathnameIncludesLeaderboard) {
    return null;
  }

  const { position, totalWorkouts, totalUsers } = userPosition;

  // Show motivational message if user has no workouts
  if (totalWorkouts === 0) {
    return (
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-40">
        <div className="bg-base-100 dark:bg-[#1A1A1A] border border-base-300 dark:border-gray-700 rounded-2xl shadow-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Motivational Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-base-300 dark:bg-gray-700">
                <span className="text-2xl">🫵</span>
              </div>

              {/* Motivational Message */}
              <div className="flex-1">
                <p className="text-sm font-medium text-base-content dark:text-gray-100">Pas encore classé</p>
                <p className="text-xs text-base-content/60 dark:text-gray-400">Commencez votre première séance !</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-right">
              <p className="text-2xl">🚀</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-40">
      <div className="bg-base-100 dark:bg-[#1A1A1A] border border-base-300 dark:border-gray-700 rounded-2xl shadow-lg px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                position === 1
                  ? "bg-yellow-500"
                  : position === 2
                    ? "bg-gray-400"
                    : position === 3
                      ? "bg-amber-600"
                      : position <= 10
                        ? "bg-[#4F8EF7]"
                        : "bg-base-300 dark:bg-gray-700 text-base-content dark:text-gray-300"
              }`}
            >
              <span className="text-2xl">🫵</span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-base-content dark:text-gray-100">
                Position #{position} sur {totalUsers}
              </p>
              <p className="text-xs text-base-content/60 dark:text-gray-400">
                {totalWorkouts} séances {period === "weekly" ? "cette semaine" : period === "monthly" ? "ce mois" : "au total"}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="text-right">
            <p className="text-2xl font-medium text-base-content/70 dark:text-gray-400">
              {position === 1 ? "👑" : position <= 3 ? "🏆" : position <= 10 ? "💪" : position <= 20 ? "🎯" : "🚀"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
