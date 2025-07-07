import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { shuffleExerciseAction } from "@/features/workout-builder/actions/shuffle-exercise.action";

const shuffleExerciseSchema = z.object({
  muscle: z.nativeEnum(ExerciseAttributeValueEnum),
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
  excludeExerciseIds: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = shuffleExerciseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    const result = await shuffleExerciseAction(parsed.data);

    if (result?.serverError) {
      if (result.serverError === "No alternative exercises found") {
        return NextResponse.json({ error: "NO_EXERCISES_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ error: "SHUFFLE_FAILED", message: result.serverError }, { status: 500 });
    }

    if (!result?.data?.exercise) {
      return NextResponse.json({ error: "NO_EXERCISE_RETURNED" }, { status: 500 });
    }

    return NextResponse.json({ exercise: result.data.exercise });
  } catch (error) {
    console.error("Shuffle exercise error:", error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
