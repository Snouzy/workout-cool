"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function updateProgramVisibility(programId: string, visibility: ProgramVisibility) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Check if program exists
  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { 
      id: true, 
      title: true,
      visibility: true,
      enrollments: {
        select: { id: true },
        take: 1,
      }
    },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  // Prevent archiving a program with active enrollments
  if (visibility === ProgramVisibility.ARCHIVED && program.enrollments.length > 0) {
    throw new Error("Cannot archive a program with active enrollments");
  }

  // Update program visibility
  const updatedProgram = await prisma.program.update({
    where: { id: programId },
    data: { visibility },
  });

  revalidatePath("/admin/programs");
  revalidatePath(`/admin/programs/${programId}`);
  
  return updatedProgram;
}