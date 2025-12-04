import { NextRequest, NextResponse } from "next/server";

import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { completeWorkoutSessionAction } from "@/features/workout-session/actions/complete-workout-session.action";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    
    // Check authentication
    const session = await getMobileCompatibleSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    // Use the complete server action
    const result = await completeWorkoutSessionAction({
      id: sessionId,
      endedAt: body.endedAt ? new Date(body.endedAt) : new Date(),
      duration: body.duration,
      rating: body.rating,
      ratingComment: body.ratingComment,
    });

    if (result?.serverError) {
      if (result.serverError === "NOT_AUTHENTICATED") {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      if (result.serverError === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      if (result.serverError === "Session not found") {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      return NextResponse.json({ error: result.serverError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: result.data 
    });
  } catch (error) {
    console.error("Error completing workout session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
