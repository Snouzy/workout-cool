import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { prisma } from "@/shared/lib/prisma";
import { enrollInProgram } from "@/features/programs/actions/enroll-program.action";
import { auth } from "@/features/auth/lib/better-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const program = await prisma.program.findUnique({
      where: { slug },
      select: { id: true, participantCount: true },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const result = await enrollInProgram(program.id);

    const updatedProgram = await prisma.program.findUnique({
      where: { id: program.id },
      select: { participantCount: true },
    });

    return NextResponse.json({
      enrollment: result.enrollment,
      isNew: result.isNew,
      totalEnrollments: updatedProgram?.participantCount || program.participantCount,
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { slug } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User not found", code: "USER_NOT_FOUND" }, { status: 404 });
    }

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
