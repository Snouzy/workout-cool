"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function deleteProgram(programId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Check if program has enrollments
  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      enrollments: {
        take: 1,
      },
    },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  if (program.enrollments.length > 0) {
    throw new Error("Cannot delete program with active enrollments");
  }

  // Delete program (cascade will handle weeks, sessions, exercises, etc.)
  await prisma.program.delete({
    where: { id: programId },
  });

  revalidatePath("/admin/programs");
  
  return { success: true };
}