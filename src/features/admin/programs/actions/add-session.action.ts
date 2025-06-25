"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ExerciseAttributeValueEnum, UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface AddSessionData {
  weekId: string;
  sessionNumber: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  equipment: ExerciseAttributeValueEnum[];
  estimatedMinutes: number;
  isPremium: boolean;
}

export async function addSessionToWeek(data: AddSessionData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Check if session number already exists in this week
  const existingSession = await prisma.programSession.findUnique({
    where: {
      weekId_sessionNumber: {
        weekId: data.weekId,
        sessionNumber: data.sessionNumber,
      },
    },
  });

  if (existingSession) {
    throw new Error(`La séance ${data.sessionNumber} existe déjà dans cette semaine`);
  }

  const programSession = await prisma.programSession.create({
    data: {
      weekId: data.weekId,
      sessionNumber: data.sessionNumber,
      title: data.title,
      titleEn: data.titleEn,
      titleEs: data.titleEn, // Default fallback
      titlePt: data.titleEn,
      titleRu: data.titleEn,
      titleZhCn: data.titleEn,
      description: data.description,
      descriptionEn: data.descriptionEn,
      descriptionEs: data.descriptionEn, // Default fallback
      descriptionPt: data.descriptionEn,
      descriptionRu: data.descriptionEn,
      descriptionZhCn: data.descriptionEn,
      equipment: data.equipment,
      estimatedMinutes: data.estimatedMinutes,
      isPremium: data.isPremium,
    },
  });

  revalidatePath("/admin/programs");

  return programSession;
}
