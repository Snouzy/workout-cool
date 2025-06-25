"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/lib/auth/better-auth";
import { prisma } from "@/shared/lib/db/prisma";
import { headers } from "next/headers";

export async function startProgramSession(enrollmentId: string, sessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Verify enrollment belongs to user
  const enrollment = await prisma.userProgramEnrollment.findFirst({
    where: {
      id: enrollmentId,
      userId,
    },
    include: {
      program: true,
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  // Check if session already started
  const existingProgress = await prisma.userSessionProgress.findUnique({
    where: {
      enrollmentId_sessionId: {
        enrollmentId,
        sessionId,
      },
    },
  });

  if (existingProgress) {
    return { sessionProgress: existingProgress, isNew: false };
  }

  // Get session details to update current week/session
  const programSession = await prisma.programSession.findUnique({
    where: { id: sessionId },
    include: {
      week: true,
      exercises: {
        include: {
          exercise: {
            include: {
              attributes: {
                include: {
                  attributeName: true,
                  attributeValue: true,
                },
              },
            },
          },
          suggestedSets: {
            orderBy: { setIndex: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!programSession) {
    throw new Error("Session not found");
  }

  // Create session progress
  const sessionProgress = await prisma.userSessionProgress.create({
    data: {
      enrollmentId,
      sessionId,
    },
  });

  // Update enrollment current position
  await prisma.userProgramEnrollment.update({
    where: { id: enrollmentId },
    data: {
      currentWeek: programSession.week.weekNumber,
      currentSession: programSession.sessionNumber,
    },
  });

  revalidatePath(`/programs/${enrollment.program.slug}`);

  return { 
    sessionProgress, 
    isNew: true,
    sessionData: programSession,
  };
}