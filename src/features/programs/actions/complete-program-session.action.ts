"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function completeProgramSession(sessionProgressId: string, workoutSessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  // Get session progress with enrollment
  const sessionProgress = await prisma.userSessionProgress.findUnique({
    where: { id: sessionProgressId },
    include: {
      enrollment: {
        include: {
          program: {
            include: {
              weeks: {
                include: {
                  sessions: {
                    orderBy: { sessionNumber: "asc" },
                  },
                },
                orderBy: { weekNumber: "asc" },
              },
            },
          },
        },
      },
      session: {
        include: {
          week: true,
        },
      },
    },
  });

  if (!sessionProgress || sessionProgress.enrollment.userId !== userId) {
    throw new Error("Session progress not found");
  }

  // Update session progress
  const updatedProgress = await prisma.userSessionProgress.update({
    where: { id: sessionProgressId },
    data: {
      completedAt: new Date(),
      workoutSessionId,
    },
  });

  // Update enrollment stats
  const enrollment = sessionProgress.enrollment;
  const completedSessionsCount = await prisma.userSessionProgress.count({
    where: {
      enrollmentId: enrollment.id,
      completedAt: { not: null },
    },
  });

  // Find next session
  const currentWeek = sessionProgress.session.week.weekNumber;
  const currentSession = sessionProgress.session.sessionNumber;

  let nextWeek = currentWeek;
  let nextSession = currentSession + 1;

  // Check if we need to move to next week
  const currentWeekSessions = enrollment.program.weeks.find((w) => w.weekNumber === currentWeek)?.sessions.length || 0;

  if (nextSession > currentWeekSessions) {
    nextWeek = currentWeek + 1;
    nextSession = 1;
  }

  // Check if program is completed
  const totalSessions = enrollment.program.weeks.reduce((acc, week) => acc + week.sessions.length, 0);

  const isCompleted = completedSessionsCount >= totalSessions;

  // Update enrollment
  await prisma.userProgramEnrollment.update({
    where: { id: enrollment.id },
    data: {
      completedSessions: completedSessionsCount,
      currentWeek: isCompleted ? currentWeek : nextWeek,
      currentSession: isCompleted ? currentSession : nextSession,
      completedAt: isCompleted ? new Date() : null,
      isActive: !isCompleted,
    },
  });

  revalidatePath(`/programs/${enrollment.program.slug}`);

  return {
    sessionProgress: updatedProgress,
    isCompleted,
    nextWeek: isCompleted ? null : nextWeek,
    nextSession: isCompleted ? null : nextSession,
  };
}
