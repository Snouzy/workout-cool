import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const session = await getMobileCompatibleSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = session.user.id;

    const program = await prisma.program.findUnique({
      where: { slug },
      select: { id: true, participantCount: true },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found", code: "NOT_FOUND" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.userProgramEnrollment.findUnique({
      where: { userId_programId: { userId, programId: program.id } },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        enrollment: existingEnrollment,
        isNew: false,
        totalEnrollments: program.participantCount,
      });
    }

    // Create enrollment + increment participant count
    const enrollment = await prisma.userProgramEnrollment.create({
      data: { userId, programId: program.id },
    });

    const updatedProgram = await prisma.program.update({
      where: { id: program.id },
      data: { participantCount: { increment: 1 } },
      select: { participantCount: true },
    });

    return NextResponse.json({
      enrollment,
      isNew: true,
      totalEnrollments: updatedProgram.participantCount,
    });
  } catch (error) {
    console.error("Error enrolling in program:", error);

    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: "User not found", code: "USER_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to enroll in program", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getMobileCompatibleSession(req);

    const { slug } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = session.user.id;

    const program = await prisma.program.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const enrollment = await prisma.userProgramEnrollment.findUnique({
      where: {
        userId_programId: {
          userId,
          programId: program.id,
        },
      },
    });

    return NextResponse.json({
      isEnrolled: !!enrollment,
      enrollment,
    });
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return NextResponse.json({ error: "Failed to check enrollment status", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
