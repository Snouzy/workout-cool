"use server";

import { ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export interface SessionDetail {
  id: string;
  weekId: string;
  sessionNumber: number;
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;
  equipment: string[];
  estimatedMinutes: number;
  isPremium: boolean;
  program: {
    id: string;
    title: string;
    slug: string;
  };
  week: {
    id: string;
    weekNumber: number;
    title: string;
  };
  exercises: Array<{
    id: string;
    order: number;
    instructions: string;
    instructionsEn: string;
    instructionsEs: string;
    instructionsPt: string;
    instructionsRu: string;
    instructionsZhCn: string;
    exercise: {
      id: string;
      name: string;
      nameEn: string;
      nameEs: string;
      namePt: string;
      nameRu: string;
      nameZhCn: string;
      description: string;
      descriptionEn: string;
      descriptionEs: string;
      descriptionPt: string;
      descriptionRu: string;
      descriptionZhCn: string;
      image: string;
      videoUrl: string | null;
      attributes: Array<{
        id: string;
        attributeName: {
          id: string;
          name: string;
        };
        attributeValue: {
          id: string;
          value: string;
        };
      }>;
    };
    suggestedSets: Array<{
      id: string;
      setIndex: number;
      types: string[];
      valuesInt: number[];
      valuesSec: number[];
      units: string[];
    }>;
  }>;
}

export async function getSessionBySlug(programSlug: string, sessionSlug: string, locale: string = "fr"): Promise<SessionDetail | null> {
  try {
    // Determine which slug field to use based on locale
    const slugField = getSlugFieldForLocale(locale);

    const session = await prisma.programSession.findFirst({
      where: {
        [slugField]: sessionSlug,
        week: {
          program: {
            slug: programSlug,
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
                title: true,
                slug: true,
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

    return {
      id: session.id,
      weekId: session.weekId,
      sessionNumber: session.sessionNumber,
      title: session.title,
      titleEn: session.titleEn,
      titleEs: session.titleEs,
      titlePt: session.titlePt,
      titleRu: session.titleRu,
      titleZhCn: session.titleZhCn,
      slug: session.slug,
      slugEn: session.slugEn,
      slugEs: session.slugEs,
      slugPt: session.slugPt,
      slugRu: session.slugRu,
      slugZhCn: session.slugZhCn,
      description: session.description,
      descriptionEn: session.descriptionEn,
      descriptionEs: session.descriptionEs,
      descriptionPt: session.descriptionPt,
      descriptionRu: session.descriptionRu,
      descriptionZhCn: session.descriptionZhCn,
      equipment: session.equipment,
      estimatedMinutes: session.estimatedMinutes,
      isPremium: session.isPremium,
      program: {
        id: session.week.program.id,
        title: session.week.program.title,
        slug: session.week.program.slug,
      },
      week: {
        id: session.week.id,
        weekNumber: session.week.weekNumber,
        title: session.week.title,
      },
      exercises: session.exercises.map((exercise) => ({
        id: exercise.id,
        order: exercise.order,
        instructions: exercise.instructions,
        instructionsEn: exercise.instructionsEn,
        instructionsEs: exercise.instructionsEs,
        instructionsPt: exercise.instructionsPt,
        instructionsRu: exercise.instructionsRu,
        instructionsZhCn: exercise.instructionsZhCn,
        exercise: {
          id: exercise.exercise.id,
          name: exercise.exercise.name,
          nameEn: exercise.exercise.nameEn ?? "",
          nameEs: exercise.exercise.nameEn ?? "",
          namePt: exercise.exercise.nameEn ?? "",
          nameRu: exercise.exercise.nameEn ?? "",
          nameZhCn: exercise.exercise.nameEn ?? "",
          description: exercise.exercise.description ?? "",
          descriptionEn: exercise.exercise.descriptionEn ?? "",
          descriptionEs: exercise.exercise.descriptionEn ?? "",
          descriptionPt: exercise.exercise.descriptionEn ?? "",
          descriptionRu: exercise.exercise.descriptionEn ?? "",
          descriptionZhCn: exercise.exercise.descriptionEn ?? "",
          image: exercise.exercise.fullVideoImageUrl ?? "",
          videoUrl: exercise.exercise.fullVideoUrl ?? "",
          attributes: exercise.exercise.attributes.map((attr) => ({
            id: attr.id,
            attributeName: {
              id: attr.attributeName.id,
              name: attr.attributeName.name,
            },
            attributeValue: {
              id: attr.attributeValue.id,
              value: attr.attributeValue.value,
            },
          })),
        },
        suggestedSets: exercise.suggestedSets.map((set) => ({
          id: set.id,
          setIndex: set.setIndex,
          types: set.types,
          valuesInt: set.valuesInt,
          valuesSec: set.valuesSec,
          units: set.units,
        })),
      })),
    };
  } catch (error) {
    console.error("Error fetching session by slug:", error);
    return null;
  }
}

function getSlugFieldForLocale(locale: string): string {
  switch (locale) {
    case "en":
      return "slugEn";
    case "es":
      return "slugEs";
    case "pt":
      return "slugPt";
    case "ru":
      return "slugRu";
    case "zh-CN":
      return "slugZhCn";
    default:
      return "slug"; // French default
  }
}
