"use client";

import React from "react";
import { Trophy, Medal, Award, Flame, Calendar, Dumbbell } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeading from "@/features/layout/page-heading";

import { useWorkoutStreaks } from "../hooks/use-workout-streaks";
import type { UserWorkoutStreak } from "../actions/get-workout-streaks.action";

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

const LeaderboardItem: React.FC<{ user: UserWorkoutStreak; rank: number }> = ({ user, rank }) => {
  const getUserInitials = (name: string, email: string) => {
    if (name && name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const isTopThree = rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 hover:shadow-md",
        isTopThree
          ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800/30"
          : "bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50",
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">{getRankIcon(rank)}</div>

      {/* User Avatar */}
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.userImage || undefined} alt={user.userName} />
        <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials(user.userName, user.userEmail)}</AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.userName}</h3>
          {getRankBadge(rank)}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.userEmail}</p>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 text-right space-y-1">
        <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-bold">{user.currentStreak}</span>
          <span className="text-xs text-gray-500">current</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{user.longestStreak} max</span>
          <span>•</span>
          <Dumbbell className="w-3 h-3" />
          <span>{user.totalWorkouts} total</span>
        </div>
      </div>
    </div>
  );
};

const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="space-y-1 text-right">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export default function LeaderboardPage() {
  const t = useI18n();
  const { data: userStreaks, isLoading, error } = useWorkoutStreaks({ limit: 20 });

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <PageHeading
        title="🏆 Workout Streak Leaderboard"
        description="See who's dominating their fitness journey with the longest workout streaks!"
      />

      {/* Stats Cards */}
      {userStreaks && userStreaks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Top Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStreaks[0]?.currentStreak || 0} days</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">by {userStreaks[0]?.userName || "No one yet"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Flame className="w-5 h-5 text-red-500" />
                <span>All-Time Best</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.max(...(userStreaks.map((u) => u.longestStreak) || [0]))} days
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">longest streak ever</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Dumbbell className="w-5 h-5 text-blue-500" />
                <span>Total Workouts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userStreaks.reduce((sum, user) => sum + user.totalWorkouts, 0)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">by all users combined</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Leaderboard Rankings</span>
          </CardTitle>
          <CardDescription>Users are ranked by their current workout streak. Keep it up! 💪</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LeaderboardSkeleton />}

          {error && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Failed to load leaderboard data</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          )}

          {userStreaks && userStreaks.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No workout streaks found</p>
              <p className="text-sm mt-2">Start your first workout to appear on the leaderboard!</p>
            </div>
          )}

          {userStreaks && userStreaks.length > 0 && (
            <div className="space-y-3">
              {userStreaks.map((user, index) => (
                <LeaderboardItem key={user.userId} user={user} rank={index + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivation Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800/30">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">💪 Keep Your Streak Alive!</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Consistency is key to building lasting fitness habits. Every workout counts towards your streak!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
