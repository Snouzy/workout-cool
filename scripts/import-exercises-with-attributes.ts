import path from "path";
import fs from "fs";

import csv from "csv-parser";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";

import { normalizeExerciseAttributeValue } from "./import-exercise-attribute-values";

const prisma = new PrismaClient();

interface ExerciseAttributeCSVRow {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  full_video_url: string;
  full_video_image_url: string;
  introduction: string;
  introduction_en: string;
  slug: string;
  slug_en: string;
  attribute_name: string;
  attribute_value: string;
}

function cleanValue(value: string): string | null {
  if (!value || value === "NULL" || value.trim() === "") return null;
  return value.trim();
}

function groupExercisesByOriginalId(rows: ExerciseAttributeCSVRow[]) {
  const exercisesMap = new Map();

  for (const row of rows) {
    const exerciseId = row.id;

    if (!exercisesMap.has(exerciseId)) {
      exercisesMap.set(exerciseId, {
        originalId: exerciseId,
        name: row.name,
        nameEn: cleanValue(row.name_en),
        description: cleanValue(row.description),
        descriptionEn: cleanValue(row.description_en),
        fullVideoUrl: cleanValue(row.full_video_url),
        fullVideoImageUrl: cleanValue(row.full_video_image_url),
        introduction: cleanValue(row.introduction),
        introductionEn: cleanValue(row.introduction_en),
        slug: cleanValue(row.slug),
        slugEn: cleanValue(row.slug_en),
        attributes: [],
      });
    }

    const exercise = exercisesMap.get(exerciseId);
    if (row.attribute_name && row.attribute_value) {
      exercise.attributes.push({
        attributeName: row.attribute_name,
        attributeValue: row.attribute_value,
      });
    }
  }

  return Array.from(exercisesMap.values());
}

async function ensureAttributeNameExists(name: ExerciseAttributeNameEnum) {
  let attributeName = await prisma.exerciseAttributeName.findFirst({
    where: { name },
  });

  if (!attributeName) {
    attributeName = await prisma.exerciseAttributeName.create({
      data: { name },
    });
  }

  return attributeName;
}

// Value normalisation is handled by the shared helper module.
// See ./import-exercise-attribute-values.ts for alias definitions and error details.

async function ensureAttributeValueExists(attributeNameId: string, value: ExerciseAttributeValueEnum) {
  let attributeValue = await prisma.exerciseAttributeValue.findFirst({
    where: {
      attributeNameId,
      value,
    },
  });

  if (!attributeValue) {
    attributeValue = await prisma.exerciseAttributeValue.create({
      data: {
        attributeNameId,
        value,
      },
    });
  }

  return attributeValue;
}

async function importExercisesFromCSV(filePath: string) {
  const rows: ExerciseAttributeCSVRow[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: ExerciseAttributeCSVRow) => {
        rows.push(row);
      })
      .on("end", async () => {
        console.log(`📋 ${rows.length} lines found in the CSV`);

        try {
          const exercises = groupExercisesByOriginalId(rows);
          console.log(`🏋️  ${exercises.length} unique exercises found`);

          let imported = 0;
          let errors = 0;

          for (const exercise of exercises) {
            try {
              console.log(`\n🔄 Processing "${exercise.name}"...`);

              // Create or update the exercise (simplified version)
              const createdExercise = await prisma.exercise.upsert({
                where: { slug: exercise.slug || `exercise-${exercise.originalId}` },
                update: {
                  name: exercise.name,
                  nameEn: exercise.nameEn,
                  description: exercise.description,
                  descriptionEn: exercise.descriptionEn,
                  fullVideoUrl: exercise.fullVideoUrl,
                  fullVideoImageUrl: exercise.fullVideoImageUrl,
                  introduction: exercise.introduction,
                  introductionEn: exercise.introductionEn,
                  slugEn: exercise.slugEn,
                },
                create: {
                  name: exercise.name,
                  nameEn: exercise.nameEn,
                  description: exercise.description,
                  descriptionEn: exercise.descriptionEn,
                  fullVideoUrl: exercise.fullVideoUrl,
                  fullVideoImageUrl: exercise.fullVideoImageUrl,
                  introduction: exercise.introduction,
                  introductionEn: exercise.introductionEn,
                  slug: exercise.slug || `exercise-${exercise.originalId}`,
                  slugEn: exercise.slugEn,
                },
              });

              // Remove old attributes
              await prisma.exerciseAttribute.deleteMany({
                where: { exerciseId: createdExercise.id },
              });

              // Create new attributes
              for (const attr of exercise.attributes) {
                try {
                  const normalised = normalizeExerciseAttributeValue(
                    attr.attributeName,
                    attr.attributeValue,
                  );
                  const attributeName = await ensureAttributeNameExists(
                    attr.attributeName as ExerciseAttributeNameEnum,
                  );
                  const attributeValue = await ensureAttributeValueExists(
                    attributeName.id,
                    normalised as ExerciseAttributeValueEnum,
                  );

                  await prisma.exerciseAttribute.create({
                    data: {
                      exerciseId: createdExercise.id,
                      attributeNameId: attributeName.id,
                      attributeValueId: attributeValue.id,
                    },
                  });

                  console.log(
                    `   [OK] Attribute: ${attr.attributeName} = ${attr.attributeValue}` +
                      (normalised !== attr.attributeValue.trim().toUpperCase()
                        ? ` (normalised to ${normalised})`
                        : ""),
                  );
                } catch (attrError) {
                  console.error(
                    `   [ERROR] Attribute ${attr.attributeName}=${attr.attributeValue}:`,
                    attrError instanceof Error ? attrError.message : attrError,
                  );
                }
              }

              console.log(`✅ "${exercise.name}" imported with ${exercise.attributes.length} attributes`);
              imported++;
            } catch (error) {
              console.error(`❌ Error for "${exercise.name}":`, error);
              errors++;
            }
          }

          console.log("\n📊 Summary:");
          console.log(`   ✅ Imported: ${imported}`);
          console.log(`   ❌ Errors: ${errors}`);

          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
}

async function main() {
  try {
    console.log("🚀 Import exercises (simplified version)...\n");

    const csvFilePath = process.argv[2];

    if (!csvFilePath) {
      console.error("❌ Please provide a CSV file path as argument");
      console.log("Usage: npm run import:exercises-full <path-to-csv-file>");
      process.exit(1);
    }

    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ File not found: ${csvFilePath}`);
      process.exit(1);
    }

    if (path.extname(csvFilePath).toLowerCase() !== ".csv") {
      console.error(`❌ File must be a CSV file, got: ${path.extname(csvFilePath)}`);
      process.exit(1);
    }

    console.log(`📁 Importing from: ${csvFilePath}`);

    await importExercisesFromCSV(csvFilePath);

    // Final stats
    const totalExercises = await prisma.exercise.count();
    const totalAttributes = await prisma.exerciseAttribute.count();

    console.log("\n📈 Final database:");
    console.log(`   🏋️  Exercises: ${totalExercises}`);
    console.log(`   🏷️  Attributes: ${totalAttributes}`);

    console.log("\n🎉 Import completed!");
  } catch (error) {
    console.error("💥 Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
