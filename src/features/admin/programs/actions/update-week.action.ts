"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface UpdateWeekData {
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  description?: string;
  descriptionEn?: string;
  descriptionEs?: string;
  descriptionPt?: string;
  descriptionRu?: string;
  descriptionZhCn?: string;
}

export async function updateWeek(weekId: string, data: UpdateWeekData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedWeek = await prisma.programWeek.update({
      where: {
        id: weekId,
      },
      data: {
        title: data.title,
        titleEn: data.titleEn,
        titleEs: data.titleEs,
        titlePt: data.titlePt,
        titleRu: data.titleRu,
        titleZhCn: data.titleZhCn,
        description: data.description || "",
        descriptionEn: data.descriptionEn || "",
        descriptionEs: data.descriptionEs || "",
        descriptionPt: data.descriptionPt || "",
        descriptionRu: data.descriptionRu || "",
        descriptionZhCn: data.descriptionZhCn || "",
      },
    });

    // Revalider les caches
    revalidatePath("/admin/programs");

    return updatedWeek;
  } catch (error) {
    console.error("Error updating week:", error);
    throw new Error("Erreur lors de la mise à jour de la semaine");
  }
}
