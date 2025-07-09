"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ProgramLevel, ExerciseAttributeValueEnum, UserRole, ProgramVisibility } from "@prisma/client";

import { generateSlug } from "@/shared/lib/slug";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface CreateProgramData {
  // Basic info
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

  // Program details
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  equipment: ExerciseAttributeValueEnum[];
  isPremium: boolean;
  emoji?: string;

  // Coaches
  coaches?: Array<{
    name: string;
    image: string;
    order: number;
  }>;
}

export async function createProgram(data: CreateProgramData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Generate slugs for all languages
  const slug = generateSlug(data.title);
  const slugEn = generateSlug(data.titleEn);
  const slugEs = generateSlug(data.titleEs);
  const slugPt = generateSlug(data.titlePt);
  const slugRu = generateSlug(data.titleRu);
  const slugZhCn = generateSlug(data.titleZhCn);

  // Check if any slug already exists
  const existingProgram = await prisma.program.findFirst({
    where: {
      OR: [{ slug }, { slugEn }, { slugEs }, { slugPt }, { slugRu }, { slugZhCn }],
    },
  });

  if (existingProgram) {
    throw new Error("Un programme avec ce nom existe déjà dans une des langues");
  }

  const program = await prisma.program.create({
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
      visibility: ProgramVisibility.DRAFT, // Always start as draft
      coaches: {
        create: data.coaches || [],
      },
    },
    include: {
      coaches: true,
    },
  });

  revalidatePath("/admin/programs");

  return program;
}
