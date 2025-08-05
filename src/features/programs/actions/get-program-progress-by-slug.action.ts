"use server";

import { headers } from "next/headers";
import { ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function getProgramProgressBySlug(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = session.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  // First, find the program by slug
  const program = await prisma.program.findFirst({
    where: {
      OR: [{ slug }, { slugEn: slug }, { slugEs: slug }, { slugPt: slug }, { slugRu: slug }, { slugZhCn: slug }],
      visibility: ProgramVisibility.PUBLISHED,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!program) {
    return null;
  }

  const enrollment = await prisma.userProgramEnrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId: program.id,
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
                orderBy: { sessionNumber: "asc" },
              },
            },
            orderBy: { weekNumber: "asc" },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  // Calculate completion stats
  const totalSessions = enrollment.program.weeks.reduce((acc, week) => acc + week.sessions.length, 0);

  const completedSessions = enrollment.sessionProgress.filter((progress) => progress.completedAt !== null).length;

  const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Check if program is completed (all sessions are done)
  const isProgramCompleted = totalSessions > 0 && completedSessions === totalSessions;

  return {
    enrollment,
    stats: {
      totalSessions,
      completedSessions,
      completionPercentage,
      currentWeek: enrollment.currentWeek,
      currentSession: enrollment.currentSession,
      isProgramCompleted,
    },
  };
}