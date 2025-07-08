import { NextRequest, NextResponse } from "next/server";

import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { getWorkoutSessionsAction } from "@/features/workout-session/actions/get-workout-sessions.action";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getMobileCompatibleSession(request);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch workout sessions
    const result = await getWorkoutSessionsAction({ userId: session.user.id });

    // Transform to match the expected response format
    const formattedSessions = result?.data?.sessions?.map((session) => ({
      id: session.id,
      userId: session.userId,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString() || null,
      duration: session.duration || null,
      muscles: session.muscles || [],
      rating: session.rating || null,
      ratingComment: session.ratingComment || null,
      exercises: session.exercises.map((sessionExercise) => ({
        id: sessionExercise.exerciseId,
        order: sessionExercise.order,
        exercise: {
          ...sessionExercise.exercise,
          createdAt: sessionExercise.exercise.createdAt.toISOString(),
          updatedAt: sessionExercise.exercise.updatedAt.toISOString(),
          attributes: sessionExercise.exercise.attributes.map((attr) => ({
            id: attr.id,
            exerciseId: attr.exerciseId,
            attributeNameId: attr.attributeNameId,
            attributeValueId: attr.attributeValueId,
            createdAt: attr.createdAt.toISOString(),
            updatedAt: attr.updatedAt.toISOString(),
            attributeName: {
              id: attr.attributeName.id,
              name: attr.attributeName.name,
              createdAt: attr.attributeName.createdAt.toISOString(),
              updatedAt: attr.attributeName.updatedAt.toISOString(),
            },
            attributeValue: {
              id: attr.attributeValue.id,
              attributeNameId: attr.attributeValue.attributeNameId,
              value: attr.attributeValue.value,
              createdAt: attr.attributeValue.createdAt.toISOString(),
              updatedAt: attr.attributeValue.updatedAt.toISOString(),
            },
          })),
        },
        sets: sessionExercise.sets.map((set) => ({
          id: set.id,
          workoutSessionExerciseId: set.workoutSessionExerciseId,
          setIndex: set.setIndex,
          type: set.type,
          types: set.types || [],
          valuesInt: set.valuesInt || [],
          valuesSec: set.valuesSec || [],
          units: set.units || [],
          completed: set.completed,
        })),
      })),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
