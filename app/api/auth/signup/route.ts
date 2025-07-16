import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { auth } from "@/features/auth/lib/better-auth";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = parsed.data;
    const name = parsed.data.name || `${firstName} ${lastName}`;

    // Utiliser l'API serveur de Better Auth pour créer l'utilisateur
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        firstName,
        lastName,
        role: UserRole.user,
      },
    });

    // Retourner l'utilisateur et le token
    return NextResponse.json({
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Gérer les erreurs spécifiques
    if (error.message?.includes("already exists")) {
      return NextResponse.json(
        { error: "EMAIL_ALREADY_EXISTS" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}