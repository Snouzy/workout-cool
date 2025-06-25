"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface AddWeekData {
  programId: string;
  weekNumber: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export async function addWeekToProgram(data: AddWeekData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Check if week number already exists
  const existingWeek = await prisma.programWeek.findUnique({
    where: {
      programId_weekNumber: {
        programId: data.programId,
        weekNumber: data.weekNumber,
      },
    },
  });

  if (existingWeek) {
    throw new Error(`La semaine ${data.weekNumber} existe déjà`);
  }

  const week = await prisma.programWeek.create({
    data: {
      programId: data.programId,
      weekNumber: data.weekNumber,
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
    },
  });

  revalidatePath("/admin/programs");

  return week;
}
