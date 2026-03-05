"use server";

import { prisma } from "@/shared/lib/prisma";

import { EquipmentItem } from "./get-all-equipment.action";

export async function getUserEquipment(userId: string): Promise<EquipmentItem[]> {
  try {
    const userEquipment = await prisma.userEquipment.findMany({
      where: { userId },
      include: { equipment: true },
    });

    return userEquipment.map((ue) => ({
      id: ue.equipment.id,
      name: ue.equipment.name,
      type: ue.equipment.type,
      heightVariant: ue.equipment.heightVariant,
      portable: ue.equipment.portable,
    }));
  } catch (error) {
    console.error("Error fetching user equipment:", error);
    return [];
  }
}
