import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

// Validation schema for feedback
const feedbackSchema = z.object({
  feedbackEmoji: z.enum(["😃", "🙂", "😐", "🙁", "😢"]).optional(),
  feedbackText: z.string().max(200).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    // Check authentication
    const session = await getMobileCompatibleSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    const { feedbackEmoji, feedbackText } = parsed.data;

    // Await params
    const { sessionId } = await params;

    // Verify the workout session exists and belongs to the user
    const workoutSession = await prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!workoutSession) {
      return NextResponse.json({ error: "Workout session not found or unauthorized" }, { status: 404 });
    }

    // Update the workout session with feedback (map to existing fields)
    const updatedSession = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        ratingComment: feedbackText || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        feedbackEmoji: feedbackEmoji || null,
        feedbackText: updatedSession.ratingComment,
      },
    });
  } catch (error) {
    console.error("Error updating workout session feedback:", error);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}
