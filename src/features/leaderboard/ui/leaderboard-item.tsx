"use client";

import React from "react";
import Image from "next/image";

import { useI18n, useCurrentLocale } from "locales/client";
import { formatDateShort, formatRelativeTime } from "@/shared/lib/date";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";

const LeaderboardItem: React.FC<{ user: TopWorkoutUser; rank: number }> = ({ user, rank }) => {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [imageError, setImageError] = React.useState(false);
  const dicebearUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.userId)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">3</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hover:bg-gray-400/50 flex items-center gap-3 sm:gap-4 p-2 sm:p-4 hover:bg-base-200/50 dark:hover:bg-gray-800/30 transition-colors duration-150">
      {/* Rank number */}
      <div className="w-6 sm:w-8 text-center">
        <span
          className={`font-semibold ${rank <= 3 ? "text-lg" : "text-base"} ${
            rank === 1
              ? "text-yellow-600 dark:text-yellow-500"
              : rank === 2
                ? "text-gray-500 dark:text-gray-400"
                : rank === 3
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-base-content/50 dark:text-gray-500"
          }`}
        >
          {rank}
        </span>
      </div>

      {/* User Avatar */}
      <div className="relative flex-shrink-0">
        <div className="avatar">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-base-200 dark:ring-gray-700">
            {user.userImage && !imageError ? (
              <Image
                alt={user.userName}
                className="rounded-full object-cover"
                height={48}
                onError={() => setImageError(true)}
                src={user.userImage}
                unoptimized={user.userImage.includes("googleusercontent")}
                width={48}
              />
            ) : (
              <Image alt={user.userName} className="rounded-full" height={48} src={dicebearUrl} width={48} />
            )}
          </div>
        </div>
        {getRankBadge(rank)}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-sm sm:text-base text-base-content dark:text-gray-100 truncate">{user.userName}</h3>
              <span className="hidden sm:flex items-center gap-1 text-gray-600 dark:text-gray-600">
                <span className="text-xs">{t("commons.registered_on")}</span>
                <span className="text-xs">{formatDateShort(user.memberSince, locale)}</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 text-xs text-base-content/50 dark:text-gray-500">
              <span className="font-medium text-sm text-base-content/70 dark:text-gray-400">
                {user.totalWorkouts} {t("leaderboard.workouts").toLowerCase()}
              </span>
              <span className="flex sm:hidden items-center gap-1 text-gray-600 dark:text-gray-600">
                <span className="text-xs">{t("commons.registered_on")}</span>
                <span className="text-xs">{formatDateShort(user.memberSince, locale)}</span>
              </span>

              <span className="hidden sm:flex text-xs">-</span>
              {user.lastWorkoutAt && (
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-600">
                  <span className="text-xs">{t("commons.last_activity")}</span>
                  {formatRelativeTime(user.lastWorkoutAt, locale, t("commons.just_now"))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
