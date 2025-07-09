"use server";

import { ExerciseAttributeValueEnum, ProgramLevel, ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export interface ProgramDetail {
  id: string;
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugUa: string;
  slugRu: string;
  slugZhCn: string;
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleUa: string;
  titleRu: string;
  titleZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionUa: string;
  descriptionRu: string;
  descriptionZhCn: string;
  category: string;
  image: string;
  level: ProgramLevel;
  type: ExerciseAttributeValueEnum;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  equipment: ExerciseAttributeValueEnum[];
  isPremium: boolean;
  emoji?: string;
  participantCount: number;
  totalEnrollments: number;
  coaches: Array<{
    id: string;
    name: string;
    image: string;
    order: number;
  }>;
  weeks: Array<{
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    sessions: Array<{
      id: string;
      sessionNumber: number;
      title: string;
      titleEn: string;
      titleEs: string;
      titlePt: string;
      titleUa: string;
      titleRu: string;
      titleZhCn: string;
      description: string;
      descriptionEn: string;
      descriptionEs: string;
      descriptionPt: string;
      descriptionUa: string;
      descriptionRu: string;
      descriptionZhCn: string;
      slug: string;
      slugEn: string;
      slugEs: string;
      slugPt: string;
      slugUa: string;
      slugRu: string;
      slugZhCn: string;
      equipment: ExerciseAttributeValueEnum[];
      estimatedMinutes: number;
      isPremium: boolean;
      totalExercises: number;
    }>;
  }>;
}

export async function getProgramBySlug(slug: string): Promise<ProgramDetail | null> {
  try {
    const program = await prisma.program.findFirst({
      where: {
        OR: [{ slug }, { slugEn: slug }, { slugEs: slug }, { slugPt: slug }, { slugUa: slug }, { slugRu: slug }, { slugZhCn: slug }],
        visibility: ProgramVisibility.PUBLISHED,
        isActive: true,
      },
      include: {
        coaches: {
          orderBy: { order: "asc" },
        },
        weeks: {
          include: {
            sessions: {
              include: {
                exercises: {
                  include: {
                    suggestedSets: true,
                  },
                },
              },
              orderBy: { sessionNumber: "asc" },
            },
          },
          orderBy: { weekNumber: "asc" },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!program) {
      return null;
    }

    return {
      id: program.id,
      slug: program.slug,
      slugEn: program.slugEn,
      slugEs: program.slugEs,
      slugPt: program.slugPt,
      slugUa: program.slugUa,
      slugRu: program.slugRu,
      slugZhCn: program.slugZhCn,
      title: program.title,
      titleEn: program.titleEn,
      titleEs: program.titleEs,
      titlePt: program.titlePt,
      titleUa: program.titleUa,
      titleRu: program.titleRu,
      titleZhCn: program.titleZhCn,
      description: program.description,
      descriptionEn: program.descriptionEn,
      descriptionEs: program.descriptionEs,
      descriptionPt: program.descriptionPt,
      descriptionUa: program.descriptionUa,
      descriptionRu: program.descriptionRu,
      descriptionZhCn: program.descriptionZhCn,
      category: program.category,
      image: program.image,
      level: program.level,
      type: program.type,
      durationWeeks: program.durationWeeks,
      sessionsPerWeek: program.sessionsPerWeek,
      sessionDurationMin: program.sessionDurationMin,
      equipment: program.equipment,
      isPremium: program.isPremium,
      participantCount: program.participantCount,
      totalEnrollments: program.enrollments.length,
      coaches: program.coaches.map((coach) => ({
        id: coach.id,
        name: coach.name,
        image: coach.image,
        order: coach.order,
      })),
      weeks: program.weeks.map((week) => ({
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        titleEn: week.titleEn,
        titleEs: week.titleEs,
        titlePt: week.titlePt,
        titleUa: week.titleUa,
        titleRu: week.titleRu,
        titleZhCn: week.titleZhCn,
        description: week.description,
        descriptionEn: week.descriptionEn,
        descriptionEs: week.descriptionEs,
        descriptionPt: week.descriptionPt,
        descriptionUa: week.descriptionUa,
        descriptionRu: week.descriptionRu,
        descriptionZhCn: week.descriptionZhCn,
        sessions: week.sessions.map((session) => ({
          id: session.id,
          sessionNumber: session.sessionNumber,
          title: session.title,
          titleEn: session.titleEn,
          titleEs: session.titleEs,
          titlePt: session.titlePt,
          titleUa: session.titleUa,
          titleRu: session.titleRu,
          titleZhCn: session.titleZhCn,
          description: session.description,
          descriptionEn: session.descriptionEn,
          descriptionEs: session.descriptionEs,
          descriptionPt: session.descriptionPt,
          descriptionUa: session.descriptionUa,
          descriptionRu: session.descriptionRu,
          descriptionZhCn: session.descriptionZhCn,
          slug: session.slug,
          slugEn: session.slugEn,
          slugEs: session.slugEs,
          slugPt: session.slugPt,
          slugUa: session.slugUa,
          slugRu: session.slugRu,
          slugZhCn: session.slugZhCn,
          equipment: session.equipment,
          estimatedMinutes: session.estimatedMinutes,
          isPremium: session.isPremium,
          totalExercises: session.exercises.length,
        })),
      })),
    };
  } catch (error) {
    console.error("Error fetching program by slug:", error);
    return null;
  }
}
