import { NextRequest, NextResponse } from "next/server";
import { ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getMobileCompatibleSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { slug } = await params;

    const program = await prisma.program.findFirst({
      where: {
        OR: [{ slug }, { slugEn: slug }, { slugEs: slug }, { slugPt: slug }, { slugRu: slug }, { slugZhCn: slug }],
        visibility: ProgramVisibility.PUBLISHED,
        isActive: true,
      },
      select: { id: true },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const enrollment = await prisma.userProgramEnrollment.findUnique({
      where: { userId_programId: { userId, programId: program.id } },
      include: {
        sessionProgress: {
          include: { session: true, workoutSession: true },
        },
        program: {
          include: {
            weeks: {
              include: { sessions: { orderBy: { sessionNumber: "asc" } } },
              orderBy: { weekNumber: "asc" },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(null);
    }

    const totalSessions = enrollment.program.weeks.reduce((acc, week) => acc + week.sessions.length, 0);
    const completedSessions = enrollment.sessionProgress.filter((p) => p.completedAt !== null).length;
    const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    const isProgramCompleted = totalSessions > 0 && completedSessions === totalSessions;

    return NextResponse.json({
      enrollment,
      stats: {
        totalSessions,
        completedSessions,
        completionPercentage,
        currentWeek: enrollment.currentWeek,
        currentSession: enrollment.currentSession,
        isProgramCompleted,
      },
    });
  } catch (error) {
    console.error("Error fetching program progress:", error);
    return NextResponse.json({ error: "Failed to fetch program progress" }, { status: 500 });
  }
}
