import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { updatePasswordAction } from "@/features/update-password/model/update-password.action";

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

    // Use the existing server action
    const result = await updatePasswordAction(parsed.data);

    if (result?.serverError) {
      // Handle specific error messages
      let errorMessage = "PASSWORD_UPDATE_FAILED";
      if (result.serverError.includes("do not match")) {
        errorMessage = "PASSWORDS_DO_NOT_MATCH";
      } else if (result.serverError.includes("current password")) {
        errorMessage = "INVALID_CURRENT_PASSWORD";
      } else if (result.serverError.includes("new password")) {
        errorMessage = "INVALID_NEW_PASSWORD";
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Update password error:", error);

    // Handle specific errors
    if (error.message?.includes("account")) {
      return NextResponse.json({ error: "NO_PASSWORD_ACCOUNT" }, { status: 400 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
