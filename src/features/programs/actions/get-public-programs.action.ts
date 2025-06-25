"use server";

import { ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export interface PublicProgram {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
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
      title: program.title,
      titleEn: program.titleEn,
      description: program.description,
      descriptionEn: program.descriptionEn,
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
