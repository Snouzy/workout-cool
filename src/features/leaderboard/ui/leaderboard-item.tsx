"use client"

import React from "react";
import Image from "next/image";
import {Trophy, Medal, Award} from "lucide-react"

import { useCurrentLocale, useI18n } from "locales/client";
import { formatDateShort, formatRelativeTime } from "@/shared/lib/date";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const LeaderboardItem: React.FC<{ user: TopWorkoutUser; rank: number }> = ({ user, rank }) => {
  const t = useI18n();
  const locale = useCurrentLocale();
  const dicebearUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.userId)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 text-white border-yellow-600">{t("leaderboard.champion_badge")}</Badge>;
      case 2:
        return <Badge className="bg-slate-500 text-white border-slate-600">{t("leaderboard.runner_up_badge")}</Badge>;
      case 3:
        return <Badge className="bg-amber-600 text-white border-amber-700">{t("leaderboard.third_place_badge")}</Badge>;
      default:
        return null;
    }
  };


  return (
    <div className="flex items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-center">
        {rank <= 3 ? (
          getRankIcon(rank)
        ) : (
          <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
            {rank}
          </span>
        )}
      </div>

      {/* User Avatar */}
      <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700">
        <AvatarImage alt={user.userName} src={user.userImage || dicebearUrl} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
          <Image
              alt={user.userName}
              className="w-full h-full"
              height={48}
              src={dicebearUrl}
              width={48}
            />
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {user.userName}
          </h3>
          {rank <= 3 && getRankBadge(rank)}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-slate-400 dark:text-gray-300 truncate">
            {t("leaderboard.member_since")} {formatDateShort(user.memberSince, locale)}
          </p>
          {user.lastWorkoutAt && (
            <p className="text-xs text-slate-300 dark:text-gray-400 truncate">
              {t("leaderboard.last_workout")} {formatRelativeTime(user.lastWorkoutAt, locale, t("commons.just_now"))}
            </p>
          )}
        </div>
      </div>

      {/* Workout Count */}
      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {user.totalWorkouts}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t("leaderboard.workouts")}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
