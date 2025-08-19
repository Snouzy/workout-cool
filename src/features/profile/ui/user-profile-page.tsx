"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Copy, Share2, Target, TrendingUp } from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { copyWorkoutAction } from "@/features/profile/actions/copy-workout.action";
import { Header } from "@/features/layout/Header";
import { BottomNavigation } from "@/features/layout/BottomNavigation";
import { brandedToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface UserProfileProps {
  profile: {
    id: string;
    name: string;
    username: string | null;
    email: string;
    image: string | null;
    isProfilePublic: boolean;
    joinDate: Date;
    isOwnProfile: boolean;
    stats: {
      totalWorkouts: number;
      totalExercises: number;
      totalSets: number;
    };
    recentWorkouts: Array<{
      id: string;
      startedAt: Date;
      endedAt: Date | null;
      duration: number | null;
      muscles: string[];
      exercises: Array<{
        exercise: {
          id: string;
          name: string;
          nameEn: string | null;
        };
        sets: Array<{
          completed: boolean;
        }>;
      }>;
    }>;
  };
}

// Enable dayjs relative time plugin
dayjs.extend(relativeTime);

export const UserProfilePage = ({ profile }: UserProfileProps) => {
  const router = useRouter();

  const displayName = profile.name || profile.username || profile.email.split("@")[0];
  const username = profile.username || profile.email;

  const dicebearUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(profile.id)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${username}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName}'s Workout Profile`,
          text: `Check out ${displayName}'s fitness journey on Workout.cool`,
          url: url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        brandedToast({ title: "Profile link copied to clipboard!", variant: "success" });
      } catch (error) {
        brandedToast({ title: "Failed to copy link", variant: "error" });
      }
    }
  };

  const handleCopyWorkout = async (workoutId: string) => {
    try {
      const result = await copyWorkoutAction(workoutId);

      if (result.error) {
        brandedToast({ title: result.error, variant: "error" });
        return;
      }

      if (result.success && result.workoutId) {
        // Navigate to the new workout session
        router.push(`/workout/${result.workoutId}`);
        brandedToast({ title: "Workout copied! Ready to start.", variant: "success" });
      }
    } catch (error) {
      brandedToast({ title: "Failed to copy workout", variant: "error" });
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card w-full max-w-3xl min-h-[500px] max-h-[90vh] bg-white dark:bg-[#232324] shadow-xl border border-base-200 dark:border-slate-700 flex flex-col justify-between overflow-hidden max-sm:rounded-none max-sm:h-full rounded-lg">
      <Header />
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="px-2 sm:px-6 py-4 flex-1">
          {/* Profile Header */}
          <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              {profile.image ? (
                <Image
                  alt={displayName}
                  className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  height={80}
                  src={profile.image}
                  width={80}
                />
              ) : (
                <Image alt={profile.username as string} className="rounded-full" height={80} src={dicebearUrl} width={80} />
              )}
            </div>

            {/* Profile Info */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{displayName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-3">@{username}</p>

            {/* Join Date */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Calendar className="size-4" />
              <span>Joined {dayjs(profile.joinDate).format("M/D/YYYY")}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700/50">
              <div className="text-center py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.stats.totalWorkouts}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Workouts</div>
              </div>
              <div className="text-center py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.stats.totalExercises}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Exercises</div>
              </div>
              <div className="text-center py-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Days Active</div>
              </div>
            </div>

            {/* Share Button */}
            {!profile.isOwnProfile && (
              <Button
                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                onClick={handleShare}
                variant="outline"
              >
                <Share2 className="size-4" />
                Share
              </Button>
            )}
          </div>

          {/* Recent Workouts Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              <TrendingUp className="size-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Workouts</h2>
            </div>

            {profile.recentWorkouts.length === 0 ? (
              <div className="text-center py-12 border border-gray-100 dark:border-gray-700/50 rounded-lg bg-gray-50/30 dark:bg-gray-800/20">
                <Target className="size-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts completed yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {profile.isOwnProfile
                    ? "Start your fitness journey by creating your first workout!"
                    : "Check back when they start their fitness journey!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.recentWorkouts.map((workout) => (
                  <div
                    className="p-4 bg-gray-50/70 dark:bg-gray-800/50 rounded-lg border border-gray-200/70 dark:border-gray-700/70 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    key={workout.id}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">Workout Session</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {dayjs(workout.endedAt || workout.startedAt).fromNow()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Duration</span>
                            <div className="font-medium text-gray-900 dark:text-white">{formatDuration(workout.duration)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Exercises</span>
                            <div className="font-medium text-gray-900 dark:text-white">{workout.exercises.length}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Sets</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Muscles</span>
                            <div className="font-medium text-gray-900 dark:text-white">{workout.muscles.length || "N/A"}</div>
                          </div>
                        </div>

                        {workout.exercises.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Exercises:</div>
                            <div className="flex flex-wrap gap-2">
                              {workout.exercises.slice(0, 3).map((exercise, idx) => (
                                <span
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-lg"
                                  key={idx}
                                >
                                  {exercise.exercise.nameEn || exercise.exercise.name}
                                </span>
                              ))}
                              {workout.exercises.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg">
                                  +{workout.exercises.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {!profile.isOwnProfile && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            className="px-3 py-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors flex items-center gap-2 text-sm"
                            onClick={() => handleCopyWorkout(workout.id)}
                            variant="outline"
                          >
                            <Copy className="size-4" />
                            Copy Workout
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};
