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

  // Helper function to ensure slug uniqueness
  async function ensureUniqueSessionSlug(baseSlug: string, field: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.programSession.findFirst({
        where: {
          weekId: currentSession?.weekId,
          id: { not: data.sessionId },
          [field]: slug,
        },
      });

      if (!existing) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  // Ensure all slugs are unique
  const uniqueSlugs = {
    slug: await ensureUniqueSessionSlug(data.slug, "slug"),
    slugEn: await ensureUniqueSessionSlug(data.slugEn, "slugEn"),
    slugEs: await ensureUniqueSessionSlug(data.slugEs, "slugEs"),
    slugPt: await ensureUniqueSessionSlug(data.slugPt, "slugPt"),
    slugRu: await ensureUniqueSessionSlug(data.slugRu, "slugRu"),
    slugZhCn: await ensureUniqueSessionSlug(data.slugZhCn, "slugZhCn"),
  };

  const updatedSession = await prisma.programSession.update({
    where: { id: data.sessionId },
    data: {
      title: data.title,
      titleEn: data.titleEn,
      titleEs: data.titleEs,
      titlePt: data.titlePt,
      titleRu: data.titleRu,
      titleZhCn: data.titleZhCn,
      slug: uniqueSlugs.slug,
      slugEn: uniqueSlugs.slugEn,
      slugEs: uniqueSlugs.slugEs,
      slugPt: uniqueSlugs.slugPt,
      slugRu: uniqueSlugs.slugRu,
      slugZhCn: uniqueSlugs.slugZhCn,
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
