"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

import { UpdateExerciseData } from "../types/exercise.types";

export async function updateExercise(data: UpdateExerciseData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};

  // Update basic fields
  if (data.name) updateData.name = data.name;
  if (data.nameEn) updateData.nameEn = data.nameEn;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.descriptionEn !== undefined) updateData.descriptionEn = data.descriptionEn;
  if (data.fullVideoUrl !== undefined) updateData.fullVideoUrl = data.fullVideoUrl;
  if (data.fullVideoImageUrl !== undefined) updateData.fullVideoImageUrl = data.fullVideoImageUrl;
  if (data.introduction !== undefined) updateData.introduction = data.introduction;
  if (data.introductionEn !== undefined) updateData.introductionEn = data.introductionEn;

  // Update slugs if name changed
  if (data.name) {
    updateData.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (data.nameEn) {
    updateData.slugEn = data.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  try {
    const exercise = await prisma.exercise.update({
      where: { id: data.id },
      data: updateData,
    });

    // Update attributes if provided
    if (data.attributeIds) {
      // Remove existing attributes
      await prisma.exerciseAttribute.deleteMany({
        where: { exerciseId: data.id },
      });

      // Add new attributes
      if (data.attributeIds.length > 0) {
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
            exerciseId: data.id,
            attributeNameId: attributeValue.attributeNameId,
            attributeValueId: attributeValue.id,
          })),
        });
      }
    }

    revalidatePath("/admin/exercises");
    return exercise;
  } catch (error) {
    console.error("Error updating exercise:", error);
    throw new Error("Erreur lors de la mise à jour de l'exercice");
  }
}