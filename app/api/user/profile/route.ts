import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  image: z.string().url().optional(),
});

// GET current user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

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

// Helper function to clean malformed cookies
function cleanCookieHeader(cookieHeader: string): string {
  if (!cookieHeader) return "";

  // Fix malformed cookie separators (comma without space/semicolon)
  const cleaned = cookieHeader.replace(/,better-auth\./g, "; better-auth.");

  // Parse cookies to deduplicate
  const cookieMap = new Map<string, string>();

  cleaned.split(";").forEach((cookie) => {
    const trimmed = cookie.trim();
    if (trimmed && trimmed.includes("=")) {
      const [name, ...valueParts] = trimmed.split("=");
      if (name && valueParts.length > 0) {
        const cleanName = name.trim();
        const value = valueParts.join("=").replace(/,\s*$/, ""); // Remove trailing comma

        // For better-auth cookies, keep the last occurrence
        if (cleanName.startsWith("better-auth.")) {
          cookieMap.set(cleanName, value);
        } else if (!cookieMap.has(cleanName)) {
          cookieMap.set(cleanName, value);
        }
      }
    }
  });

  // Reconstruct clean cookie string
  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

// PUT update user profile
export async function PUT(req: NextRequest) {
  try {
    // Debug: Log incoming headers
    const rawCookieHeader = req.headers.get("cookie");
    console.log("[API Profile] Raw cookie header:", rawCookieHeader);

    // Clean the cookie header
    const cleanedCookieHeader = cleanCookieHeader(rawCookieHeader || "");
    console.log("[API Profile] Cleaned cookie header:", cleanedCookieHeader);

    // Create new headers with cleaned cookies
    const cleanHeaders = new Headers(req.headers);
    if (cleanedCookieHeader) {
      cleanHeaders.set("cookie", cleanedCookieHeader);
    }

    // Parse cookies to see what we're getting
    if (cleanedCookieHeader) {
      const cookies = cleanedCookieHeader.split(";").map((c) => c.trim());
      const sessionTokens = cookies.filter((c) => c.startsWith("better-auth.session_token"));
      const sessionData = cookies.filter((c) => c.startsWith("better-auth.session_data"));

      console.log("[API Profile] Parsed cleaned cookies:", {
        totalCookies: cookies.length,
        sessionTokens: sessionTokens.length,
        sessionDataCookies: sessionData.length,
        tokens: sessionTokens.map((t) => t.substring(0, 80) + "..."),
        data: sessionData.map((d) => d.substring(0, 80) + "..."),
      });
    }

    const session = await auth.api.getSession({
      headers: cleanHeaders,
    });

    console.log("[API Profile] Session result:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      sessionDetails: session
        ? {
            sessionId: session.session?.id,
            token: session.session?.token?.substring(0, 20) + "...",
            expiresAt: session.session?.expiresAt,
          }
        : null,
    });

    if (!session?.user) {
      console.log("[API Profile] No session found - returning 401");
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    // Update user directly since we already have the authenticated session
    const { firstName, lastName, image } = parsed.data;

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (image !== undefined) updateData.image = image;

    // Only perform update if there are fields to update
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
      });
    }

    // Get updated user data
    const updatedSession = await auth.api.getSession({
      headers: cleanHeaders,
    });
    console.log("updatedSession:", updatedSession);

    return NextResponse.json({
      success: true,
      user: updatedSession?.user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
