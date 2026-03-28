import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ progressId: string }> }) {
  try {
    const session = await getMobileCompatibleSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { progressId } = await params;
    const body = await request.json();
    const { workoutSessionId } = body;

    if (!workoutSessionId) {
      return NextResponse.json({ error: "Missing workout session ID" }, { status: 400 });
    }

    // Get session progress with enrollment and program structure
    const sessionProgress = await prisma.userSessionProgress.findUnique({
      where: { id: progressId },
      include: {
        enrollment: {
          include: {
            program: {
              include: {
                weeks: {
                  include: { sessions: { orderBy: { sessionNumber: "asc" } } },
                  orderBy: { weekNumber: "asc" },
                },
              },
            },
          },
        },
        session: { include: { week: true } },
      },
    });

    if (!sessionProgress || sessionProgress.enrollment.userId !== userId) {
      return NextResponse.json({ error: "Session progress not found" }, { status: 404 });
    }

    // Mark session as completed
    const updatedProgress = await prisma.userSessionProgress.update({
      where: { id: progressId },
      data: { completedAt: new Date(), workoutSessionId },
    });

    // Count completed sessions
    const completedSessionsCount = await prisma.userSessionProgress.count({
      where: { enrollmentId: sessionProgress.enrollment.id, completedAt: { not: null } },
    });

    // Find next session
    const currentWeek = sessionProgress.session.week.weekNumber;
    const currentSession = sessionProgress.session.sessionNumber;
    let nextWeek = currentWeek;
    let nextSession = currentSession + 1;

    const currentWeekSessions =
      sessionProgress.enrollment.program.weeks.find((w) => w.weekNumber === currentWeek)?.sessions.length || 0;

    if (nextSession > currentWeekSessions) {
      nextWeek = currentWeek + 1;
      nextSession = 1;
    }

    // Check if program is completed
    const totalSessions = sessionProgress.enrollment.program.weeks.reduce((acc, week) => acc + week.sessions.length, 0);
    const isCompleted = completedSessionsCount >= totalSessions;

    // Update enrollment
    await prisma.userProgramEnrollment.update({
      where: { id: sessionProgress.enrollment.id },
      data: {
        completedSessions: completedSessionsCount,
        currentWeek: isCompleted ? currentWeek : nextWeek,
        currentSession: isCompleted ? currentSession : nextSession,
        completedAt: isCompleted ? new Date() : null,
        isActive: !isCompleted,
      },
    });

    return NextResponse.json({
      sessionProgress: updatedProgress,
      isCompleted,
      nextWeek: isCompleted ? null : nextWeek,
      nextSession: isCompleted ? null : nextSession,
    });
  } catch (error) {
    console.error("Error completing session progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
