"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";

import { useI18n } from "locales/client";

import { useTopWorkoutUsers } from "../hooks/use-top-workout-users";
import { LeaderboardPeriod } from "../actions/get-top-workout-users.action";
import LeaderboardSkeleton from "./leaderboard-skeleton";
import LeaderboardItem from "./leaderboard-item";

export default function LeaderboardPage() {
  const t = useI18n();
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>("all-time");

  const { data: topUsers, isLoading, error } = useTopWorkoutUsers({ period: selectedPeriod });

  // Get top 3 for podium display
  const topThree = topUsers?.slice(0, 3) || [];

  const tabs = [
    { id: "all-time" as LeaderboardPeriod, label: "All Time" },
    { id: "monthly" as LeaderboardPeriod, label: "Monthly" },
    { id: "weekly" as LeaderboardPeriod, label: "Weekly" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl mx-auto px-2 py-4 sm:px-4 sm:py-8">
        {/* Period Tabs */}
        <div className="flex justify-center mb-6">
          <div className="tabs tabs-boxed bg-base-200 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                className={`tab ${
                  selectedPeriod === tab.id ? "tab-active bg-[#4F8EF7] text-white" : "text-base-content/70 dark:text-gray-400"
                }`}
                key={tab.id}
                onClick={() => setSelectedPeriod(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium - Only on desktop */}
        {topThree.length === 3 && !isLoading && (
          <div className="flex justify-center items-end gap-4 mb-12 pt-16">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="relative">
                <div className="avatar mb-3">
                  <div className="w-20 rounded-full ring-4 ring-gray-400">
                    <Image
                      alt={topThree[1].userName}
                      height={80}
                      src={topThree[1].userImage || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(topThree[1].userId)}`}
                      width={80}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="font-medium text-sm mt-4">{topThree[1].userName}</h3>
              <p className="text-xs text-base-content/60">{topThree[1].totalWorkouts} séances</p>
            </div>

            {/* 1st Place */}
            <div className="text-center -mt-4">
              <div className="relative">
                <Trophy className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500" />
                <div className="avatar mb-3">
                  <div className="w-24 rounded-full ring-4 ring-yellow-500">
                    <Image
                      alt={topThree[0].userName}
                      height={96}
                      src={topThree[0].userImage || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(topThree[0].userId)}`}
                      width={96}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="font-medium text-base mt-4">{topThree[0].userName}</h3>
              <p className="text-sm text-base-content/60">{topThree[0].totalWorkouts} séances</p>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="relative">
                <div className="avatar mb-3">
                  <div className="w-20 rounded-full ring-4 ring-amber-600">
                    <Image
                      alt={topThree[2].userName}
                      height={80}
                      src={topThree[2].userImage || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(topThree[2].userId)}`}
                      width={80}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="font-medium text-sm mt-4">{topThree[2].userName}</h3>
              <p className="text-xs text-base-content/60">{topThree[2].totalWorkouts} séances</p>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="card bg-white dark:bg-[#1A1A1A] border border-base-300 dark:border-gray-800">
          {isLoading && <LeaderboardSkeleton />}

          {error && (
            <div className="card-body text-center py-12">
              <p className="text-base-content/70 dark:text-gray-400">{t("leaderboard.unable_to_load")}</p>
              <p className="text-sm text-base-content/50 dark:text-gray-500 mt-1">{t("leaderboard.try_again_later")}</p>
            </div>
          )}

          {topUsers && topUsers.length === 0 && !isLoading && (
            <div className="card-body text-center py-12">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-base-content/20" />
              <p className="text-base-content/70 dark:text-gray-400">
                {selectedPeriod === "all-time"
                  ? t("leaderboard.no_champions_yet")
                  : selectedPeriod === "weekly"
                    ? "Aucune séance cette semaine"
                    : "Aucune séance ce mois"}
              </p>
              <p className="text-sm text-base-content/50 dark:text-gray-500 mt-1">{t("leaderboard.complete_first_workout")}</p>
            </div>
          )}

          {topUsers && topUsers.length > 0 && (
            <div className="divide-y divide-base-200 dark:divide-gray-800">
              {topUsers.map((user, index) => (
                <LeaderboardItem key={user.userId} rank={index + 1} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
