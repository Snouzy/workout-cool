import { NextRequest, NextResponse } from "next/server";

import { completeProgramSession } from "@/features/programs/actions/complete-program-session.action";

export async function POST(request: NextRequest, { params }: { params: Promise<{ progressId: string }> }) {
  try {
    const { progressId } = await params;
    const body = await request.json();
    const { workoutSessionId } = body;

    if (!workoutSessionId) {
      return NextResponse.json({ error: "Missing workout session ID" }, { status: 400 });
    }

    // Use the existing server action
    const result = await completeProgramSession(progressId, workoutSessionId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error completing session progress:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (error.message === "Session progress not found") {
      return NextResponse.json({ error: "Session progress not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
