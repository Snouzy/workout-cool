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
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;
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
      titleEs: data.titleEs,
      titlePt: data.titlePt,
      titleRu: data.titleRu,
      titleZhCn: data.titleZhCn,
      slug: data.slug,
      slugEn: data.slugEn,
      slugEs: data.slugEs,
      slugPt: data.slugPt,
      slugRu: data.slugRu,
      slugZhCn: data.slugZhCn,
      description: data.description,
      descriptionEn: data.descriptionEn,
      descriptionEs: data.descriptionEs,
      descriptionPt: data.descriptionPt,
      descriptionRu: data.descriptionRu,
      descriptionZhCn: data.descriptionZhCn,
      equipment: data.equipment,
      estimatedMinutes: data.estimatedMinutes,
      isPremium: data.isPremium,
    },
  });

  revalidatePath("/admin/programs");

  return programSession;
}
