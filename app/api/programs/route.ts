import { NextResponse } from "next/server";

import { getPublicPrograms } from "@/features/programs/actions/get-public-programs.action";

export async function GET() {
  try {
    const programs = await getPublicPrograms();
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}
