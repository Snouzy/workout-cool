import { NextRequest, NextResponse } from "next/server";

import { startProgramSession } from "@/features/programs/actions/start-program-session.action";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enrollmentId, sessionId } = body;

    if (!enrollmentId || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use the existing server action
    const result = await startProgramSession(enrollmentId, sessionId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error starting session progress:", error);
    
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (error.message === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    
    if (error.message === "Enrollment not found") {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }
    
    if (error.message === "Session not found") {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
