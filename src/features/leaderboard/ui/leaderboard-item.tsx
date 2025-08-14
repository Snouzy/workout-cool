"use client";

import React from "react";
import Image from "next/image";
import { ClockIcon } from "lucide-react";

import { useI18n, useCurrentLocale } from "locales/client";
import { formatDateShort, formatRelativeTime } from "@/shared/lib/date";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";

const LeaderboardItem: React.FC<{ user: TopWorkoutUser; rank: number }> = ({ user, rank }) => {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [imageError, setImageError] = React.useState(false);
  const dicebearUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.userId)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-base-200/50 dark:hover:bg-gray-800/30 transition-colors duration-150">
      {/* Rank number */}
      <div className="w-3 sm:w-8 text-center">
        <span
          className={`font-semibold ${rank <= 3 ? "text-lg" : "text-base"} ${
            rank === 1
              ? "text-yellow-600 dark:text-yellow-500"
              : rank === 2
                ? "text-gray-500 dark:text-gray-400"
                : rank === 3
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-gray-600 dark:text-gray-500"
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
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm sm:text-base text-base-content dark:text-gray-100 truncate">{user.userName}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 text-xs text-gray-600 dark:text-gray-500">
          <span className="text-base-content/60 dark:text-gray-400 text-[11px]">
            {t("leaderboard.member_since")} {formatDateShort(user.memberSince, locale)}
          </span>
          {user.lastWorkoutAt && (
            <>
              <span className="hidden sm:flex">-</span>
              <span className="gap-1 text-gray-600 dark:text-gray-600">
                <span className="flex text-[11px] items-center">
                  <ClockIcon className="w-3 h-3 mr-1" /> {formatRelativeTime(user.lastWorkoutAt, locale, t("commons.just_now"))}
                </span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Workout Score - Right aligned on desktop */}
      <div className="flex flex-col items-end">
        <div className="text-xl sm:text-2xl font-bold text-[#4F8EF7] dark:text-[#4F8EF7]">{user.totalWorkouts}</div>
        <div className="text-xs text-gray-600 dark:text-gray-500">{t("leaderboard.workouts").toLowerCase()}</div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
