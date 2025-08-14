import { NextResponse } from "next/server";

import { getSessionBySlug } from "@/features/programs/actions/get-session-by-slug.action";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string; sessionSlug: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr";

    const { slug, sessionSlug } = await params;
    const sessionDetail = await getSessionBySlug(slug, sessionSlug, locale as any);

    if (!sessionDetail) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(sessionDetail);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
