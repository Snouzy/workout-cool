"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Target, TrendingUp } from "lucide-react";

import { useI18n } from "locales/client";

import { useTopWorkoutUsers } from "../hooks/use-top-workout-users";
import  LeaderboardSkeleton  from "./leaderboard-skeleton";
import  LeaderboardItem  from "./leaderboard-item";

export default function LeaderboardPage() {
  const t = useI18n();
  const { data: topUsers, isLoading, error } = useTopWorkoutUsers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 dark:from-[#1D1D1D] dark:to-[#151515]">
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header with emoji mascot */}
        <div className="text-center space-y-4 mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] rounded-full opacity-20 blur-xl animate-pulse"></div>
            <Image 
              alt="Workout Cool Mascot"
              className="relative rounded-full"
              height={80}
              src="/images/emojis/WorkoutCoolBiceps.png" 
              width={80}
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] bg-clip-text text-transparent tracking-tight leading-[1.1]">
              {t("leaderboard.title")}
            </h1>
            <p className="text-base md:text-lg text-base-content/70 dark:text-gray-400 max-w-md mx-auto leading-[1.4]">
              {t("leaderboard.description")}
            </p>
          </div>

          {/* Stats badges */}
          {topUsers && topUsers.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="badge badge-lg gap-2 px-4 py-3 bg-[#4F8EF7]/10 border-[#4F8EF7]/30 text-[#4F8EF7]">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{topUsers.length} Athletes</span>
              </div>
              <div className="badge badge-lg gap-2 px-4 py-3 bg-[#25CB78]/10 border-[#25CB78]/30 text-[#25CB78]">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Active Today</span>
              </div>
              <div className="badge badge-lg gap-2 px-4 py-3 bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-500">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">New Records</span>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Card */}
        <div className="card bg-base-100 dark:bg-[#1D1D1D] border border-base-300 dark:border-gray-800">
          {isLoading && <LeaderboardSkeleton />}

          {error && (
            <div className="card-body text-center py-16">
              <Image 
                alt="Error"
                className="mx-auto mb-4"
                height={64}
                src="/images/emojis/WorkoutCoolCry.png" 
                width={64}
              />
              <p className="text-base-content/70 dark:text-gray-400 font-medium">
                {t("leaderboard.unable_to_load")}
              </p>
              <p className="text-sm text-base-content/50 dark:text-gray-500">
                {t("leaderboard.try_again_later")}
              </p>
            </div>
          )}

          {topUsers && topUsers.length === 0 && !isLoading && (
            <div className="card-body text-center py-16">
              <Image 
                alt="Get Started"
                className="mx-auto mb-6"
                height={80}
                src="/images/emojis/WorkoutCoolHappy.png" 
                width={80}
              />
              <p className="text-lg font-semibold text-base-content dark:text-gray-100">
                {t("leaderboard.no_champions_yet")}
              </p>
              <p className="text-sm text-base-content/60 dark:text-gray-400 mt-1">
                {t("leaderboard.complete_first_workout")}
              </p>
              <button className="btn btn-primary mt-6 gap-2 hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
                Start Your Journey
              </button>
            </div>
          )}

          {topUsers && topUsers.length > 0 && (
            <div className="divide-y divide-base-200 dark:divide-gray-800/50">
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
