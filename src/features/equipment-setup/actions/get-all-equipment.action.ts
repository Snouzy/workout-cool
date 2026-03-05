"use server";

import { prisma } from "@/shared/lib/prisma";

export interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  heightVariant: string | null;
  portable: boolean;
}

export async function getAllEquipment(): Promise<EquipmentItem[]> {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: { name: "asc" },
    });

    return equipment.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      heightVariant: item.heightVariant,
      portable: item.portable,
    }));
  } catch (error) {
    console.error("Error fetching all equipment:", error);
    return [];
  }
}
