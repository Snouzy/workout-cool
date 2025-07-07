import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/features/auth/lib/better-auth";
import { updateUserAction } from "@/entities/user/model/update-user.action";

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  image: z.string().url().optional(),
});

// GET current user profile
export async function GET(req: NextRequest) {
  console.log("req:", req);
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    console.log("session:", session);

    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        name: session.user.name,
        image: session.user.image,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

// PUT update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    // Use the existing server action
    const result = await updateUserAction(parsed.data);

    if (result?.serverError) {
      return NextResponse.json({ error: result.serverError }, { status: 400 });
    }

    // Get updated user data
    const updatedSession = await auth.api.getSession({
      headers: req.headers,
    });

    return NextResponse.json({
      success: true,
      user: updatedSession?.user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
