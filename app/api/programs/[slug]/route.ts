import { NextResponse } from "next/server";

import { getProgramBySlug } from "@/features/programs/actions/get-program-by-slug.action";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const program = await getProgramBySlug(slug);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}
