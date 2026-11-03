import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";

import {
  inferAdditionalEquipmentRequirements,
  type InferredEquipmentRequirement,
} from "../src/shared/lib/exercise-equipment";

const prisma = new PrismaClient();

const REQUIREMENTS: readonly InferredEquipmentRequirement[] = [
  ExerciseAttributeValueEnum.BENCH,
  ExerciseAttributeValueEnum.STEP,
  ExerciseAttributeValueEnum.BOX,
  ExerciseAttributeValueEnum.DESK,
  ExerciseAttributeValueEnum.BANDS,
  ExerciseAttributeValueEnum.TRX,
  ExerciseAttributeValueEnum.PULLUP_BAR,
];

async function main() {
  const apply = process.argv.includes("--apply");
  const equipmentAttributeName = await prisma.exerciseAttributeName.findUnique({
    where: { name: ExerciseAttributeNameEnum.EQUIPMENT },
  });

  if (!equipmentAttributeName) {
    throw new Error("EQUIPMENT attribute name is missing");
  }

  const attributeValues = new Map<InferredEquipmentRequirement, string>();
  for (const value of REQUIREMENTS) {
    const attributeValue = await prisma.exerciseAttributeValue.upsert({
      where: {
        attributeNameId_value: {
          attributeNameId: equipmentAttributeName.id,
          value,
        },
      },
      update: {},
      create: {
        attributeNameId: equipmentAttributeName.id,
        value,
      },
    });
    attributeValues.set(value, attributeValue.id);
  }

  const exercises = await prisma.exercise.findMany({
    include: {
      attributes: {
        where: { attributeNameId: equipmentAttributeName.id },
        include: { attributeValue: true },
      },
    },
    orderBy: { nameEn: "asc" },
  });

  let changedCount = 0;
  const addedCounts = new Map<InferredEquipmentRequirement, number>();
  const samples: string[] = [];

  for (const exercise of exercises) {
    const required = inferAdditionalEquipmentRequirements(exercise);
    const existing = new Set(exercise.attributes.map((attribute) => attribute.attributeValue.value));
    const missing = required.filter((value) => !existing.has(value));

    if (missing.length === 0) continue;

    if (apply) {
      await prisma.$transaction(
        missing.map((value) =>
          prisma.exerciseAttribute.create({
            data: {
              exerciseId: exercise.id,
              attributeNameId: equipmentAttributeName.id,
              attributeValueId: attributeValues.get(value)!,
            },
          }),
        ),
      );
    }

    changedCount += 1;
    for (const value of missing) {
      addedCounts.set(value, (addedCounts.get(value) ?? 0) + 1);
    }
    if (samples.length < 30) {
      samples.push(`${exercise.nameEn ?? exercise.name}: +${missing.join(", ")}`);
    }
  }

  console.log(apply ? "Applied equipment tag changes" : "Dry run; no database changes were written");
  console.log(`Exercises with missing tags: ${changedCount}`);
  const summary = REQUIREMENTS.map((value) => `${value}: ${addedCounts.get(value) ?? 0}`);
  console.log(`Tags added: ${summary.join(", ")}`);
  if (samples.length > 0) {
    console.log("Samples:");
    for (const sample of samples) console.log(`  ${sample}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
