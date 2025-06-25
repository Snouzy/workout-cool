"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ProgramLevel, ExerciseAttributeValueEnum, UserRole, ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface CreateProgramData {
  // Basic info
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
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

  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Check if slug already exists
  const existingProgram = await prisma.program.findUnique({
    where: { slug },
  });

  if (existingProgram) {
    throw new Error("Un programme avec ce nom existe déjà");
  }

  const program = await prisma.program.create({
    data: {
      slug,
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
      emoji: data.emoji,
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
