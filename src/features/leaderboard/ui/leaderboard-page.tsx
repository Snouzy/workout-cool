"use client";

import React from "react";
import { Trophy } from "lucide-react";

import { useI18n } from "locales/client";
import { Card, CardContent } from "@/components/ui/card";

import { useTopWorkoutUsers } from "../hooks/use-top-workout-users";
import  LeaderboardSkeleton  from "./leaderboard-skeleton";
import  LeaderboardItem  from "./leaderboard-item";

export default function LeaderboardPage() {
  const t = useI18n();
  const { data: topUsers, isLoading, error } = useTopWorkoutUsers();

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">{t("leaderboard.title")}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t("leaderboard.description")}
        </p>
      </div>

      {/* Leaderboard */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading && <LeaderboardSkeleton />}

          {error && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>{t("leaderboard.unable_to_load")}</p>
              <p className="text-sm mt-1">{t("leaderboard.try_again_later")}</p>
            </div>
          )}

          {topUsers && topUsers.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg">{t("leaderboard.no_champions_yet")}</p>
              <p className="text-sm mt-1">{t("leaderboard.complete_first_workout")}</p>
            </div>
          )}

          {topUsers && topUsers.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {topUsers.map((user, index) => (
                <LeaderboardItem key={user.userId}rank={index + 1} user={user} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
