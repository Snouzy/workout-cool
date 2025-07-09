"use server";

import { ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export interface PublicProgram {
  id: string;

  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;

  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;

  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;

  category: string;
  image: string;
  level: string;
  type: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  equipment: string[];
  isPremium: boolean;
  participantCount: number;
  totalWeeks: number;
  totalSessions: number;
  totalExercises: number;
  totalEnrollments: number;
}

export async function getPublicPrograms(): Promise<PublicProgram[]> {
  try {
    const programs = await prisma.program.findMany({
      where: {
        visibility: ProgramVisibility.PUBLISHED,
        isActive: true,
      },
      include: {
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
            },
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        { isPremium: "desc" }, // Premium d'abord
        { createdAt: "desc" }, // Plus récents ensuite
      ],
    });

    return programs.map((program) => ({
      id: program.id,

      slug: program.slug,
      slugEn: program.slugEn,
      slugEs: program.slugEs,
      slugPt: program.slugPt,
      slugRu: program.slugRu,
      slugZhCn: program.slugZhCn,

      title: program.title,
      titleEn: program.titleEn,
      titleEs: program.titleEs,
      titlePt: program.titlePt,
      titleRu: program.titleRu,
      titleZhCn: program.titleZhCn,

      description: program.description,
      descriptionEn: program.descriptionEn,
      descriptionEs: program.descriptionEs,
      descriptionPt: program.descriptionPt,
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
      totalWeeks: program.weeks.length,
      totalSessions: program.weeks.reduce((acc, week) => acc + week.sessions.length, 0),
      totalExercises: program.weeks.reduce(
        (acc, week) => acc + week.sessions.reduce((sessAcc, session) => sessAcc + session.exercises.length, 0),
        0,
      ),
      totalEnrollments: program.enrollments.length,
    }));
  } catch (error) {
    console.error("Error fetching public programs:", error);
    return [];
  }
}
