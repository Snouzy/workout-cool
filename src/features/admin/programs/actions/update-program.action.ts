"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface UpdateProgramData {
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;
  category: string;
  image: string;
  level: ProgramLevel;
  type: ExerciseAttributeValueEnum;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  equipment: ExerciseAttributeValueEnum[];
  isPremium: boolean;
  emoji?: string;
}

export async function updateProgram(programId: string, data: UpdateProgramData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedProgram = await prisma.program.update({
      where: {
        id: programId,
      },
      data: {
        title: data.title,
        titleEn: data.titleEn,
        titleEs: data.titleEs,
        titlePt: data.titlePt,
        titleRu: data.titleRu,
        titleZhCn: data.titleZhCn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        descriptionEs: data.descriptionEs,
        descriptionPt: data.descriptionPt,
        descriptionRu: data.descriptionRu,
        descriptionZhCn: data.descriptionZhCn,
        category: data.category,
        image: data.image,
        level: data.level,
        type: data.type,
        durationWeeks: data.durationWeeks,
        sessionsPerWeek: data.sessionsPerWeek,
        sessionDurationMin: data.sessionDurationMin,
        equipment: data.equipment,
        isPremium: data.isPremium,
        emoji: data.emoji,
      },
    });

    // Revalider les caches
    revalidatePath("/admin/programs");
    revalidatePath(`/admin/programs/${programId}/edit`);

    return updatedProgram;
  } catch (error) {
    console.error("Error updating program:", error);
    throw new Error("Erreur lors de la mise à jour du programme");
  }
}
