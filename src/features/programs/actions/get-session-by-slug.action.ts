"use server";

import { ProgramVisibility } from "@prisma/client";

import { Locale } from "locales/types";
import { getLocaleSuffix } from "@/shared/types/i18n.types";
import { prisma } from "@/shared/lib/prisma";
import { SessionDetailResponse } from "@/entities/program/types/program.types";

/**
 * Get session details by slug with proper i18n support
 * Uses locale-specific slug fields for search
 */
export async function getSessionBySlug(
  programSlug: string,
  sessionSlug: string,
  locale: Locale = "fr",
): Promise<SessionDetailResponse | null> {
  try {
    // Determine slug field based on locale
    const suffix = getLocaleSuffix(locale);
    const sessionSlugField = suffix ? `slug${suffix}` : "slug";

    // Find session with all related data
    const session = await prisma.programSession.findFirst({
      where: {
        [sessionSlugField]: sessionSlug,
        week: {
          program: {
            OR: [
              { slug: programSlug },
              { slugEn: programSlug },
              { slugEs: programSlug },
              { slugPt: programSlug },
              { slugRu: programSlug },
              { slugZhCn: programSlug },
            ],
            visibility: ProgramVisibility.PUBLISHED,
            isActive: true,
          },
        },
      },
      include: {
        week: {
          include: {
            program: {
              select: {
                id: true,
                description: true,
                descriptionEn: true,
                descriptionEs: true,
                descriptionPt: true,
                descriptionRu: true,
                descriptionZhCn: true,
                title: true,
                titleEn: true,
                titleEs: true,
                titlePt: true,
                titleRu: true,
                titleZhCn: true,
                slug: true,
                slugEn: true,
                slugEs: true,
                slugPt: true,
                slugRu: true,
                slugZhCn: true,
              },
            },
          },
        },
        exercises: {
          include: {
            exercise: {
              include: {
                attributes: {
                  include: {
                    attributeName: true,
                    attributeValue: true,
                  },
                },
              },
            },
            suggestedSets: {
              orderBy: { setIndex: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!session) {
      return null;
    }

    // adapt to response type
    return {
      session: {
        id: session.id,
        weekId: session.weekId,
        sessionNumber: session.sessionNumber,
        title: session.title,
        titleEn: session.titleEn,
        titleEs: session.titleEs,
        titlePt: session.titlePt,
        titleRu: session.titleRu,
        titleZhCn: session.titleZhCn,
        description: session.description,
        descriptionEn: session.descriptionEn,
        descriptionEs: session.descriptionEs,
        descriptionPt: session.descriptionPt,
        descriptionRu: session.descriptionRu,
        descriptionZhCn: session.descriptionZhCn,
        slug: session.slug,
        slugEn: session.slugEn,
        slugEs: session.slugEs,
        slugPt: session.slugPt,
        slugRu: session.slugRu,
        slugZhCn: session.slugZhCn,
        equipment: session.equipment,
        estimatedMinutes: session.estimatedMinutes,
        isPremium: session.isPremium,
        exercises: session.exercises.map((ex) => ({
          id: ex.id,
          sessionId: ex.sessionId,
          exerciseId: ex.exerciseId,
          order: ex.order,
          instructions: ex.instructions,
          instructionsEn: ex.instructionsEn,
          instructionsEs: ex.instructionsEs,
          instructionsPt: ex.instructionsPt,
          instructionsRu: ex.instructionsRu,
          instructionsZhCn: ex.instructionsZhCn,
          exercise: {
            id: ex.exercise.id,
            name: ex.exercise.name,
            nameEn: ex.exercise.nameEn || "",
            nameEs: ex.exercise.nameEn || "", // TODO: Fix when DB has proper values
            namePt: ex.exercise.nameEn || "",
            nameRu: ex.exercise.nameEn || "",
            nameZhCn: ex.exercise.nameEn || "",
            description: ex.exercise.description || "",
            descriptionEn: ex.exercise.descriptionEn || "",
            descriptionEs: ex.exercise.descriptionEn || "", // TODO: Fix when DB has proper values
            descriptionPt: ex.exercise.descriptionEn || "",
            descriptionRu: ex.exercise.descriptionEn || "",
            descriptionZhCn: ex.exercise.descriptionEn || "",
            fullVideoUrl: ex.exercise.fullVideoUrl,
            fullVideoImageUrl: ex.exercise.fullVideoImageUrl,
            introduction: null,
            introductionEn: null,
            slug: null,
            slugEn: null,
            createdAt: ex.exercise.createdAt,
            updatedAt: ex.exercise.updatedAt,
            attributes: ex.exercise.attributes.map((attr) => ({
              id: attr.id,
              exerciseId: attr.exerciseId,
              attributeNameId: attr.attributeNameId,
              attributeValueId: attr.attributeValueId,
              attributeName: attr.attributeName.name,
              attributeValue: attr.attributeValue.value,
            })),
          },
          suggestedSets: ex.suggestedSets.map((set) => ({
            id: set.id,
            programSessionExerciseId: set.programSessionExerciseId,
            programExerciseId: set.programSessionExerciseId,
            setIndex: set.setIndex,
            types: set.types,
            valuesInt: set.valuesInt,
            valuesSec: set.valuesSec,
            units: set.units,
          })),
        })),
      },
      program: {
        id: session.week.program.id,
        title: session.week.program.title,
        titleEn: session.week.program.titleEn,
        titleEs: session.week.program.titleEs,
        titlePt: session.week.program.titlePt,
        titleRu: session.week.program.titleRu,
        titleZhCn: session.week.program.titleZhCn,
        description: session.week.program.description,
        descriptionEn: session.week.program.descriptionEn,
        descriptionEs: session.week.program.descriptionEs,
        descriptionPt: session.week.program.descriptionPt,
        descriptionRu: session.week.program.descriptionRu,
        descriptionZhCn: session.week.program.descriptionZhCn,
        slug: session.week.program.slug,
        slugEn: session.week.program.slugEn,
        slugEs: session.week.program.slugEs,
        slugPt: session.week.program.slugPt,
        slugRu: session.week.program.slugRu,
        slugZhCn: session.week.program.slugZhCn,
      },
      week: {
        id: session.week.id,
        weekNumber: session.week.weekNumber,
        title: session.week.title,
        titleEn: session.week.titleEn,
        titleEs: session.week.titleEs,
        titlePt: session.week.titlePt,
        titleRu: session.week.titleRu,
        titleZhCn: session.week.titleZhCn,
        description: session.week.description,
        descriptionEn: session.week.descriptionEn,
        descriptionEs: session.week.descriptionEs,
        descriptionPt: session.week.descriptionPt,
        descriptionRu: session.week.descriptionRu,
        descriptionZhCn: session.week.descriptionZhCn,
        programId: session.week.programId,
      },
    };
  } catch (error) {
    console.error("Error fetching session by slug:", error);
    return null;
  }
}
