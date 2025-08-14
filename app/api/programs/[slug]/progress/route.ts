import { NextResponse } from "next/server";

import { getProgramProgressBySlug } from "@/features/programs/actions/get-program-progress-by-slug.action";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const progress = await getProgramProgressBySlug(slug);

    if (!progress) {
      return NextResponse.json({ error: "Program progress not found" }, { status: 404 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching program progress:", error);
    return NextResponse.json({ error: "Failed to fetch program progress" }, { status: 500 });
  }
}
