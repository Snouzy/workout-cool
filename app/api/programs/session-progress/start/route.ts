import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { enrollmentId, sessionId } = body;

    if (!enrollmentId || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.userProgramEnrollment.findFirst({
      where: { id: enrollmentId, userId },
      include: { program: true },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    // Check if session already started
    const existingProgress = await prisma.userSessionProgress.findUnique({
      where: { enrollmentId_sessionId: { enrollmentId, sessionId } },
    });

    if (existingProgress) {
      return NextResponse.json({ sessionProgress: existingProgress, isNew: false });
    }

    // Get session details
    const programSession = await prisma.programSession.findUnique({
      where: { id: sessionId },
      include: {
        week: true,
        exercises: {
          include: {
            exercise: {
              include: {
                attributes: {
                  include: { attributeName: true, attributeValue: true },
                },
              },
            },
            suggestedSets: { orderBy: { setIndex: "asc" } },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!programSession || programSession.week.programId !== enrollment.program.id) {
      // Reject a sessionId that doesn't belong to the program the enrollment is
      // for; otherwise we'd create a UserSessionProgress pointing at a session
      // from another program and overwrite the user's currentWeek/currentSession
      // with that program's values.
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Create session progress
    const sessionProgress = await prisma.userSessionProgress.create({
      data: { enrollmentId, sessionId },
    });

    // Update enrollment current position
    await prisma.userProgramEnrollment.update({
      where: { id: enrollmentId },
      data: {
        currentWeek: programSession.week.weekNumber,
        currentSession: programSession.sessionNumber,
      },
    });

    return NextResponse.json({
      sessionProgress,
      isNew: true,
      sessionData: programSession,
    });
  } catch (error) {
    console.error("Error starting session progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
