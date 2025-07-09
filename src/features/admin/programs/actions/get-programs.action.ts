"use server";

import { headers } from "next/headers";
import { UserRole, ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

import { ProgramWithStats, ProgramWithFullDetails } from "../types/program.types";

export async function getPrograms(visibility?: ProgramVisibility): Promise<ProgramWithStats[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  const programs = await prisma.program.findMany({
    where: visibility ? { visibility } : undefined,
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
                  exercise: true,
                  suggestedSets: true,
                },
                orderBy: { order: "asc" },
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
    orderBy: { createdAt: "desc" },
  });

  return programs.map((program) => ({
    ...program,
    totalEnrollments: program.enrollments.length,
    totalWeeks: program.weeks.length,
    totalSessions: program.weeks.reduce((acc, week) => acc + week.sessions.length, 0),
    totalExercises: program.weeks.reduce(
      (acc, week) => acc + week.sessions.reduce((sessAcc, session) => sessAcc + session.exercises.length, 0),
      0,
    ),
  }));
}

export async function getProgramById(id: string): Promise<ProgramWithFullDetails | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  const program = await prisma.program.findUnique({
    where: { id },
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
            orderBy: { sessionNumber: "asc" },
          },
        },
        orderBy: { weekNumber: "asc" },
      },
    },
  });

  return program;
}
