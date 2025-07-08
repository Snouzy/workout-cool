import { NextRequest, NextResponse } from "next/server";

import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { deleteWorkoutSessionAction } from "@/features/workout-session/actions/delete-workout-session.action";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    // Check authentication
    const session = await getMobileCompatibleSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Use the existing server action for deletion
    const result = await deleteWorkoutSessionAction({
      id: sessionId,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workout session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
