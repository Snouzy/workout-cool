import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { ActionError } from "@/shared/api/safe-actions";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { updateUserPassword } from "@/features/update-password/model/update-password.action";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    // Use the core password update function directly
    await updateUserPassword(session.user.id, parsed.data.currentPassword, parsed.data.newPassword, parsed.data.confirmPassword);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Update password error:", error);

    // Handle ActionError instances
    if (error instanceof ActionError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
