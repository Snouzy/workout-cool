"use client";

import React from "react";
import Image from "next/image";
import { Trophy, Medal, Award, Flame, Calendar, Zap } from "lucide-react";

import { useCurrentLocale, useI18n } from "locales/client";
import { formatDateShort, formatRelativeTime } from "@/shared/lib/date";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";

const LeaderboardItem: React.FC<{ user: TopWorkoutUser; rank: number }> = ({ user, rank }) => {
  const t = useI18n();
  const locale = useCurrentLocale();
  const dicebearUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.userId)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl opacity-30 blur animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl p-3">
          <Medal className="w-6 h-6 text-white" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-3">
          <Award className="w-6 h-6 text-white" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-base-200 dark:bg-gray-800">
        <span className="text-lg font-bold text-base-content/50 dark:text-gray-500">{rank}</span>
      </div>
    );
  };

  const getStreakBadge = () => {
    const workoutCount = user.totalWorkouts;
    if (workoutCount >= 100) {
      return (
        <div className="badge badge-sm gap-1 bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400">
          <Flame className="w-3 h-3" />
          <span className="font-semibold">Legend</span>
        </div>
      );
    }
    if (workoutCount >= 50) {
      return (
        <div className="badge badge-sm gap-1 bg-[#25CB78]/10 border-[#25CB78]/30 text-[#25CB78]">
          <Zap className="w-3 h-3" />
          <span className="font-semibold">Elite</span>
        </div>
      );
    }
    if (workoutCount >= 20) {
      return (
        <div className="badge badge-sm gap-1 bg-[#4F8EF7]/10 border-[#4F8EF7]/30 text-[#4F8EF7]">
          <Flame className="w-3 h-3" />
          <span className="font-semibold">Builder</span>
        </div>
      );
    }
    return null;
  };

  const getRowBackground = () => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/5 to-transparent dark:from-yellow-500/10";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/5 to-transparent dark:from-gray-400/10";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/5 to-transparent dark:from-amber-600/10";
    return "";
  };

  return (
    <div className={`relative group ${getRowBackground()}`}>
      <div className="flex items-center gap-4 p-4 md:p-6 hover:bg-base-200/30 dark:hover:bg-gray-800/30 transition-all duration-200">
        {/* Rank Badge */}
        <div className="flex-shrink-0">{getRankDisplay(rank)}</div>

        {/* User Avatar with ring effect for top 3 */}
        <div className="relative">
          {rank <= 3 && (
            <div
              className={`absolute -inset-1 rounded-full opacity-40 blur-sm ${
                rank === 1
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                  : rank === 2
                    ? "bg-gradient-to-r from-gray-400 to-gray-600"
                    : "bg-gradient-to-r from-amber-500 to-amber-700"
              }`}
            ></div>
          )}
          <div
            className={`rounded-full avatar ${rank <= 3 ? "ring ring-offset-2 ring-offset-base-100 dark:ring-offset-[#1D1D1D]" : ""} ${
              rank === 1 ? "ring-yellow-500" : rank === 2 ? "ring-gray-400" : rank === 3 ? "ring-amber-600" : ""
            }`}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full">
              {user.userImage ? (
                <Image alt={user.userName} className="rounded-full" height={56} src={user.userImage} width={56} />
              ) : (
                <Image alt={user.userName} className="rounded-full" height={56} src={dicebearUrl} width={56} />
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base md:text-lg text-base-content dark:text-gray-100 truncate">{user.userName}</h3>
            {rank <= 3 && (
              <div className={`badge badge-sm ${rank === 1 ? "badge-warning" : rank === 2 ? "badge-ghost" : "badge-accent"}`}>
                {rank === 1 ? "👑 Champion" : rank === 2 ? t("leaderboard.second_place") : t("leaderboard.third_place")}
              </div>
            )}
            {getStreakBadge()}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-base-content/60 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>
                {t("leaderboard.member_since")} {formatDateShort(user.memberSince, locale)}
              </span>
            </div>
            {user.lastWorkoutAt && (
              <div className="flex items-center gap-1 text-base-content/50 dark:text-gray-500">
                <Zap className="w-3 h-3" />
                <span>{formatRelativeTime(user.lastWorkoutAt, locale, t("commons.just_now"))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Workout Count with animation */}
        <div className="flex-shrink-0 text-center">
          <div className="relative">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] bg-clip-text text-transparent">
              {user.totalWorkouts}
            </div>
            <div className="text-xs text-base-content/60 dark:text-gray-400 font-medium mt-1">{t("leaderboard.workouts")}</div>
          </div>
        </div>

        {/* Hover effect line */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#4F8EF7] to-[#25CB78] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r"></div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
