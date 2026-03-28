import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

const preferencesSchema = z.object({
  goals: z.array(z.string()),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).nullable(),
  equipment: z.array(z.string()),
  muscles: z.array(z.string()),
  duration: z.number().nullable(),
  weeklyFrequency: z.number().min(1).max(7),
  notificationDays: z.array(z.number()).optional(),
  notificationTime: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardingPreferences: true },
    });

    return NextResponse.json({
      preferences: user?.onboardingPreferences ?? null,
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = preferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingPreferences: parsed.data },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
