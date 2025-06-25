"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/lib/auth/better-auth";
import { prisma } from "@/shared/lib/db/prisma";
import { headers } from "next/headers";

export async function enrollInProgram(programId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Check if user is premium
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user?.isPremium) {
    throw new Error("Premium subscription required");
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
  
  return { enrollment, isNew: true };
}