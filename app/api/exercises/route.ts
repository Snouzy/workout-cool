import { NextRequest, NextResponse } from "next/server";

import { getExercisesSchema } from "@/features/workout-builder/schema/get-exercises.schema";
import { getExercisesAction } from "@/features/workout-builder/actions/get-exercises.action";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params = {
      equipment: searchParams.get("equipment")?.split(",").filter(Boolean) || [],
      muscles: searchParams.get("muscles")?.split(",").filter(Boolean) || [],
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 3,
    };

    const parsed = getExercisesSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT", details: parsed.error.format() }, { status: 400 });
    }

    const result = await getExercisesAction(parsed.data);

    if (result?.data && result.data.length === 0) {
      return NextResponse.json({ error: "NO_EXERCISES_FOUND" }, { status: 404 });
    }

    if (!result?.data) {
      return NextResponse.json({ error: "NO_EXERCISES_FOUND" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
