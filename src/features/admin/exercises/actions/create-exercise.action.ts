"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

import { CreateExerciseData } from "../types/exercise.types";

export async function createExercise(data: CreateExerciseData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Generate slugs
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const slugEn = data.nameEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Check if slugs already exist
  const existingExercise = await prisma.exercise.findFirst({
    where: {
      OR: [{ slug }, { slugEn }],
    },
  });

  if (existingExercise) {
    throw new Error("Un exercice avec ce nom existe déjà");
  }

  // Create exercise
  const exercise = await prisma.exercise.create({
    data: {
      name: data.name,
      nameEn: data.nameEn,
      description: data.description,
      descriptionEn: data.descriptionEn,
      fullVideoUrl: data.fullVideoUrl,
      fullVideoImageUrl: data.fullVideoImageUrl,
      introduction: data.introduction,
      introductionEn: data.introductionEn,
      slug,
      slugEn,
    },
  });

  // Add attributes if provided
  if (data.attributeIds && data.attributeIds.length > 0) {
    // Get the attribute values with their names to create proper relationships
    const attributeValues = await prisma.exerciseAttributeValue.findMany({
      where: {
        id: {
          in: data.attributeIds,
        },
      },
      include: {
        attributeName: true,
      },
    });

    // Create exercise attributes with proper name/value relationships
    await prisma.exerciseAttribute.createMany({
      data: attributeValues.map((attributeValue) => ({
        exerciseId: exercise.id,
        attributeNameId: attributeValue.attributeNameId,
        attributeValueId: attributeValue.id,
      })),
    });
  }

  revalidatePath("/admin/exercises");
  return exercise;
}