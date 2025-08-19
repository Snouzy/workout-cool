"use server";

import { headers } from "next/headers";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function getUserProfileAction(username: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }, // fallback to email if no username set
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        isProfilePublic: true,
        createdAt: true,
        WorkoutSession: {
          where: {
            endedAt: { not: null }, // only completed workouts
          },
          orderBy: {
            endedAt: "desc",
          },
          take: 10,
          select: {
            id: true,
            startedAt: true,
            endedAt: true,
            duration: true,
            muscles: true,
            exercises: {
              select: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    nameEn: true,
                  },
                },
                sets: {
                  select: {
                    completed: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            WorkoutSession: {
              where: {
                endedAt: { not: null },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Check if profile is private and user is not the owner
    if (!user.isProfilePublic && session?.user?.id !== user.id) {
      return { error: "Profile is private" };
    }

    // Calculate stats
    const totalWorkouts = user._count.WorkoutSession;
    const totalExercises = user.WorkoutSession.reduce((acc, workout) => {
      return acc + workout.exercises.length;
    }, 0);
    const totalSets = user.WorkoutSession.reduce((acc, workout) => {
      return acc + workout.exercises.reduce((exerciseAcc, exercise) => {
        return exerciseAcc + exercise.sets.filter(set => set.completed).length;
      }, 0);
    }, 0);

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      isProfilePublic: user.isProfilePublic,
      joinDate: user.createdAt,
      isOwnProfile: session?.user?.id === user.id,
      stats: {
        totalWorkouts,
        totalExercises,
        totalSets,
      },
      recentWorkouts: user.WorkoutSession,
    };
    
  } catch (error) {
    console.error("Get user profile error:", error);
    return { error: "Failed to get user profile" };
  }
}