"use client";

import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

import { useI18n } from "locales/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useTopWorkoutUsers } from "../hooks/use-top-workout-users";

import type { TopWorkoutUser } from "../actions/get-top-workout-users.action";

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
      return <Badge className="bg-yellow-500 text-white border-yellow-600">🏆 Champion</Badge>;
    case 2:
      return <Badge className="bg-gray-400 text-white border-gray-500">🥈 Runner-up</Badge>;
    case 3:
      return <Badge className="bg-amber-600 text-white border-amber-700">🥉 Third Place</Badge>;
    default:
      return null;
  }
};

const LeaderboardItem: React.FC<{ user: TopWorkoutUser; rank: number }> = ({ user, rank }) => {
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
          {rank <= 3 && getRankBadge(rank)}
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
          workouts
        </div>
      </div>
    </div>
  );
};

const LeaderboardSkeleton: React.FC = () => (
  <div className="divide-y divide-gray-200 dark:divide-gray-700">
    {[...Array(5)].map((_, i) => (
      <div className="flex items-center gap-4 p-6" key={i}>
        <Skeleton className="w-8 h-6" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-8 w-12 ml-auto" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default function LeaderboardPage() {
  const t = useI18n();
  const { data: topUsers, isLoading, error } = useTopWorkoutUsers({ limit: 10 });

  console.log("UI: topUsers", topUsers);
  console.log("UI: isLoading", isLoading);
  console.log("UI: error", error);

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Top workout champions
        </p>
      </div>

      {/* Leaderboard */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading && <LeaderboardSkeleton />}

          {error && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Unable to load leaderboard</p>
              <p className="text-sm mt-1">Please try again later</p>
            </div>
          )}

          {topUsers && topUsers.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg">No champions yet</p>
              <p className="text-sm mt-1">Complete your first workout to claim the throne!</p>
            </div>
          )}

          {topUsers && topUsers.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {topUsers.map((user, index) => (
                <LeaderboardItem key={user.userId} rank={index + 1} user={user} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
