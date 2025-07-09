"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/prisma";
import { setupAnalytics } from "@/shared/lib/analytics/server";
import { LogEvents } from "@/shared/lib/analytics/events";
import { auth } from "@/features/auth/lib/better-auth";
import { env } from "@/env";

export async function enrollInProgram(programId: string) {
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

  // Check if already enrolled
  const existingEnrollment = await prisma.userProgramEnrollment.findUnique({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
  });

  if (existingEnrollment) {
    return { enrollment: existingEnrollment, isNew: false };
  }

  // Create new enrollment
  const enrollment = await prisma.userProgramEnrollment.create({
    data: {
      userId,
      programId,
    },
    include: {
      program: true,
    },
  });

  // Update participant count
  await prisma.program.update({
    where: { id: programId },
    data: {
      participantCount: {
        increment: 1,
      },
    },
  });

  revalidatePath(`/programs/${enrollment.program.slug}`);

  if (env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID) {
    const analytics = await setupAnalytics({
      userId,
      fullName: `${session.user?.firstName} ${session.user?.lastName}`,
      email: session.user?.email,
    });

    analytics.track({
      event: LogEvents.EnrolledInProgram.name,
      channel: LogEvents.EnrolledInProgram.channel,
      properties: { programId },
    });
  }

  return { enrollment, isNew: true };
}
