"use server";

import { prisma } from "@/shared/lib/prisma";

export async function updateUserEquipment(userId: string, equipmentIds: string[]): Promise<void> {
  try {
    await prisma.$transaction([
      prisma.userEquipment.deleteMany({
        where: { userId },
      }),
      prisma.userEquipment.createMany({
        data: equipmentIds.map((equipmentId) => ({
          userId,
          equipmentId,
        })),
      }),
    ]);
  } catch (error) {
    console.error("Error updating user equipment:", error);
  }
}
