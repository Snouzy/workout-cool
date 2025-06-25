"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface UpdateWeekData {
  title: string;
  description: string;
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
        titleEn: data.title, // Pour l'instant, on utilise le même titre
        titleEs: data.title,
        titlePt: data.title,
        titleRu: data.title,
        titleZhCn: data.title,
        description: data.description,
        descriptionEn: data.description, // Pour l'instant, on utilise la même description
        descriptionEs: data.description,
        descriptionPt: data.description,
        descriptionRu: data.description,
        descriptionZhCn: data.description,
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