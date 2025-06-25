"use server";

import { auth } from "@/shared/lib/auth/better-auth";
import { prisma } from "@/shared/lib/db/prisma";
import { headers } from "next/headers";

export async function getProgramProgress(programId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = session.user.id;

  const enrollment = await prisma.userProgramEnrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
    include: {
      sessionProgress: {
        include: {
          session: true,
          workoutSession: true,
        },
      },
      program: {
        include: {
          weeks: {
            include: {
              sessions: {
                orderBy: { sessionNumber: 'asc' },
              },
            },
            orderBy: { weekNumber: 'asc' },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  // Calculate completion stats
  const totalSessions = enrollment.program.weeks.reduce(
    (acc, week) => acc + week.sessions.length,
    0
  );

  const completedSessions = enrollment.sessionProgress.filter(
    (progress) => progress.completedAt !== null
  ).length;

  const completionPercentage = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  return {
    enrollment,
    stats: {
      totalSessions,
      completedSessions,
      completionPercentage,
      currentWeek: enrollment.currentWeek,
      currentSession: enrollment.currentSession,
    },
  };
}