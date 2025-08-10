"use server";

import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";
import { TopWorkoutUser } from "@/features/leaderboard/models/types";

const getTopWorkoutUsersSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
});


export const getTopWorkoutUsersAction = actionClient.schema(getTopWorkoutUsersSchema).action(async ({ parsedInput }) => {
  try {
    const { limit } = parsedInput;

    // Get top users by workout count using efficient aggregation
    const topUsers = await prisma.user.findMany({
      where: {
        WorkoutSession: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        _count: {
          select: {
            WorkoutSession: true,
          },
        },
        WorkoutSession: {
          select: {
            endedAt: true,
          },
          orderBy: {
            startedAt: "desc",
          },
          take: 1, // Just get the most recent session for lastWorkoutAt
        },
      },
      orderBy: {
        WorkoutSession: {
          _count: "desc",
        },
      },
      take: limit,
    });

    const users: TopWorkoutUser[] = topUsers.map((user) => ({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      totalWorkouts: user._count.WorkoutSession,
      lastWorkoutAt: user.WorkoutSession[0]?.endedAt || null,
    }));

    return users;
  } catch (error) {
    console.error("Error fetching top workout users:", error);
    throw new Error("Failed to fetch top workout users");
  }
});
