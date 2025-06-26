"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ExerciseAttributeValueEnum, UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface UpdateSessionData {
  sessionId: string;
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

export async function updateSession(data: UpdateSessionData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("UNAUTHORIZED");
  }

  // Get current session to access weekId for slug uniqueness check
  const currentSession = await prisma.programSession.findUnique({
    where: { id: data.sessionId },
    select: { weekId: true },
  });

  if (!currentSession) {
    throw new Error("SESSION_NOT_FOUND");
  }

  // Check if any of the new slugs already exist in the same week (excluding current session)
  const existingSlugs = await prisma.programSession.findFirst({
    where: {
      weekId: currentSession.weekId,
      id: { not: data.sessionId },
      OR: [
        { slug: data.slug },
        { slugEn: data.slugEn },
        { slugEs: data.slugEs },
        { slugPt: data.slugPt },
        { slugRu: data.slugRu },
        { slugZhCn: data.slugZhCn },
      ],
    },
  });

  if (existingSlugs) {
    throw new Error("SLUG_ALREADY_EXISTS");
  }

  const updatedSession = await prisma.programSession.update({
    where: { id: data.sessionId },
    data: {
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

  return updatedSession;
}
