"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";

import { generateSlug } from "@/shared/lib/slug";
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
  coaches: Array<{
    id: string;
    name: string;
    image: string;
    order: number;
  }>;
}

export async function updateProgram(programId: string, data: UpdateProgramData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  try {
    // Generate new slugs from updated titles
    const slug = generateSlug(data.title);
    const slugEn = generateSlug(data.titleEn);
    const slugEs = generateSlug(data.titleEs);
    const slugPt = generateSlug(data.titlePt);
    const slugRu = generateSlug(data.titleRu);
    const slugZhCn = generateSlug(data.titleZhCn);

    // Check if any slug already exists (excluding current program)
    const existingProgram = await prisma.program.findFirst({
      where: {
        AND: [
          { id: { not: programId } },
          {
            OR: [{ slug }, { slugEn }, { slugEs }, { slugPt }, { slugRu }, { slugZhCn }],
          },
        ],
      },
    });

    if (existingProgram) {
      throw new Error("Un programme avec ce nom existe déjà dans une des langues");
    }

    const updatedProgram = await prisma.$transaction(async (tx) => {
      // Update the program
      const program = await tx.program.update({
        where: {
          id: programId,
        },
        data: {
          slug,
          slugEn,
          slugEs,
          slugPt,
          slugRu,
          slugZhCn,
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
        },
      });

      // Delete existing coaches
      await tx.programCoach.deleteMany({
        where: {
          programId,
        },
      });

      // Create new coaches
      if (data.coaches.length > 0) {
        const coachesToCreate = data.coaches.map((coach, index) => ({
          programId,
          name: coach.name,
          image: coach.image,
          order: index,
        }));

        await tx.programCoach.createMany({
          data: coachesToCreate,
        });
      }

      return program;
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
