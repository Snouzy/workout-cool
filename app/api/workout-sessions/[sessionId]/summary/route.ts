import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    // Check authentication
    const session = await getMobileCompatibleSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Await params
    const { sessionId } = await params;

    // Get the workout session with all related data
    const workoutSession = await prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                name: true,
                nameEn: true,
                attributes: {
                  include: {
                    attributeName: true,
                    attributeValue: true,
                  },
                },
              },
            },
            sets: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!workoutSession) {
      return NextResponse.json({ error: "Workout session not found or unauthorized" }, { status: 404 });
    }

    // Calculate summary metrics
    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0; // weight × reps
    let totalWeightLifted = 0;
    const exerciseCount = workoutSession.exercises.length;

    workoutSession.exercises.forEach((sessionExercise) => {
      sessionExercise.sets.forEach((set) => {
        if (set.completed) {
          totalSets++;

          // Calculate reps
          if (set.types.includes("REPS") && set.valuesInt.length > 0) {
            const reps = set.valuesInt[0];
            totalReps += reps;

            // Calculate volume if weight is present
            if (set.types.includes("WEIGHT") && set.valuesInt.length > 1) {
              const weight = set.valuesInt[1];
              totalVolume += weight * reps;
              totalWeightLifted += weight;
            }
          }
        }
      });
    });

    // Calculate calories burned (simplified estimation)
    // Using MET (Metabolic Equivalent of Task) values
    // Strength training: ~6 METs
    // Formula: METs × weight in kg × hours
    const durationHours = (workoutSession.duration || 0) / 3600;
    const assumedWeightKg = 70; // Default weight, could be user-specific
    const metValue = 6; // Strength training MET
    const caloriesBurned = Math.round(metValue * assumedWeightKg * durationHours);

    return NextResponse.json({
      success: true,
      data: {
        id: workoutSession.id,
        startedAt: workoutSession.startedAt,
        endedAt: workoutSession.endedAt,
        duration: workoutSession.duration,

        // Summary metrics
        totalSets,
        totalReps,
        totalVolume,
        totalWeightLifted,
        exerciseCount,
        caloriesBurned,

        // Target muscles
        muscles: workoutSession.muscles,

        rating: workoutSession.rating,
        ratingComment: workoutSession.ratingComment,

        // Exercise details
        exercises: workoutSession.exercises.map((sessionExercise) => ({
          name: sessionExercise.exercise.name,
          nameEn: sessionExercise.exercise.nameEn,
          completedSets: sessionExercise.sets.filter((s) => s.completed).length,
          totalSets: sessionExercise.sets.length,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching workout session summary:", error);
    return NextResponse.json({ error: "Failed to fetch session summary" }, { status: 500 });
  }
}
