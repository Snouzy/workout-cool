import { NextResponse } from "next/server";

import { getSessionBySlug } from "@/features/programs/actions/get-session-by-slug.action";

export async function GET(request: Request, { params }: { params: { slug: string; sessionSlug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr";

    const sessionDetail = await getSessionBySlug(params.slug, params.sessionSlug, locale as any);

    if (!sessionDetail) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(sessionDetail);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
