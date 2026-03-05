"use server";

import { prisma } from "@/shared/lib/prisma";

export async function initializeUserProgressions(
  userId: string
): Promise<void> {
  try {
    const families = await prisma.progressionFamily.findMany({
      select: { id: true },
    });

    await Promise.all(
      families.map((family) =>
        prisma.userProgression.upsert({
          where: {
            userId_progressionFamilyId: {
              userId,
              progressionFamilyId: family.id,
            },
          },
          update: {},
          create: {
            userId,
            progressionFamilyId: family.id,
            currentLevel: 1,
          },
        })
      )
    );
  } catch (error) {
    console.error("Error initializing user progressions:", error);
  }
}
