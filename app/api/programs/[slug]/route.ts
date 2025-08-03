import { NextResponse } from "next/server";

import { getProgramBySlug } from "@/features/programs/actions/get-program-by-slug.action";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const program = await getProgramBySlug(params.slug);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}
