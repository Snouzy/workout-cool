
import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

import { useI18n } from "locales/client";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const getRankBadge = (rank: number, t: any) => {
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


const LeaderboardItem: React.FC<{ user: TopWorkoutUser; rank: number}> = ({ user, rank }) => {
  const t = useI18n();

  const getUserInitials = (name: string, email: string) => {
    if (name && name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
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
        <AvatarImage alt={user.userName} src={user.userImage || undefined} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getUserInitials(user.userName, user.userEmail)}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {user.userName}
          </h3>
          {rank <= 3 && getRankBadge(rank, t)}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {user.userEmail}
        </p>
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
