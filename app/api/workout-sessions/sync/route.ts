import { NextRequest, NextResponse } from "next/server";

import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { syncWorkoutSessionAction } from "@/features/workout-session/actions/sync-workout-sessions.action";

export async function POST(request: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(request);
    console.log("session:", session);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.session) {
      return NextResponse.json({ error: "Session data is required" }, { status: 400 });
    }

    // Use the existing server action
    // Override the client-supplied userId with the authenticated user so a
    // logged-in caller cannot sync (create/overwrite) a session under another
    // user's account.
    const result = await syncWorkoutSessionAction({
      session: { ...body.session, userId: session.user.id },
    });

    if (result?.serverError) {
      return NextResponse.json({ error: result.serverError }, { status: 500 });
    }

    if (result?.data) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }

    console.error("Failed to sync session", JSON.stringify(result, null, 2));
    return NextResponse.json({ error: "Failed to sync session" }, { status: 500 });
  } catch (error) {
    console.error("Error in workout session sync:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
