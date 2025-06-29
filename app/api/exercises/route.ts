
import { NextRequest, NextResponse } from "next/server";


import { getExercisesSchema } from "@/features/workout-builder/schema/get-exercises.schema";
import { getExercisesAction } from "@/features/workout-builder/model/get-exercises.action";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = getExercisesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.format() }, { status: 400 });
    }

    const result = await getExercisesAction(parsed.data);

    if (result?.data && result.data.length === 0) {
      return NextResponse.json({ error: "No exercises found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
