#!/usr/bin/env ts-node
import { PrismaClient, EquipmentType, EquipmentHeight } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Seed equipment data for calisthenics exercises.
 * Uses fixed IDs so the seed is idempotent and can be referenced by other seeds.
 */
async function seedEquipment() {
  console.log("🌱 Seeding equipment data...");

  try {
    const equipmentItems: {
      id: string;
      name: string;
      type: EquipmentType;
      heightVariant: EquipmentHeight | null;
      portable: boolean;
    }[] = [
      {
        id: "eq-bar-high",
        name: "Pull-Up Bar",
        type: EquipmentType.bar,
        heightVariant: EquipmentHeight.high,
        portable: false,
      },
      {
        id: "eq-parallels-low",
        name: "Parallel Bars Low",
        type: EquipmentType.parallels,
        heightVariant: EquipmentHeight.low,
        portable: false,
      },
      {
        id: "eq-parallels-med",
        name: "Parallel Bars Medium",
        type: EquipmentType.parallels,
        heightVariant: EquipmentHeight.medium,
        portable: false,
      },
      {
        id: "eq-parallels-high",
        name: "Parallel Bars High",
        type: EquipmentType.parallels,
        heightVariant: EquipmentHeight.high,
        portable: false,
      },
      {
        id: "eq-rings",
        name: "Gymnastic Rings",
        type: EquipmentType.rings,
        heightVariant: null,
        portable: true,
      },
      {
        id: "eq-band",
        name: "Resistance Bands",
        type: EquipmentType.band,
        heightVariant: null,
        portable: true,
      },
      {
        id: "eq-wall",
        name: "Wall",
        type: EquipmentType.wall,
        heightVariant: null,
        portable: false,
      },
      {
        id: "eq-floor",
        name: "Floor",
        type: EquipmentType.floor,
        heightVariant: null,
        portable: false,
      },
      {
        id: "eq-box",
        name: "Box / Bench",
        type: EquipmentType.box,
        heightVariant: null,
        portable: false,
      },
    ];

    for (const item of equipmentItems) {
      await prisma.equipment.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          type: item.type,
          heightVariant: item.heightVariant,
          portable: item.portable,
        },
        create: {
          id: item.id,
          name: item.name,
          type: item.type,
          heightVariant: item.heightVariant,
          portable: item.portable,
        },
      });
      console.log(`  ✅ ${item.name} (${item.id})`);
    }

    console.log(`\n📊 Summary: Seeded ${equipmentItems.length} equipment items.`);
  } catch (error) {
    console.error("❌ Error seeding equipment data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedEquipment()
    .then(() => {
      console.log("🎉 Equipment data seeded successfully!\n");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Equipment seeding failed:", error);
      process.exit(1);
    });
}

export default seedEquipment;
