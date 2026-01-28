import { prisma } from "../src/shared/lib/prisma";
import { BandLevel, FormQuality } from "@prisma/client";

// Configuration
const USER_ID = "bwZuBQO4cJgBX6NiZaXgv81vKfgBQcFe";
const PUSH_UP_ID = "cmbw9xso904p69kv1vwuadhx6"; // This will need to be updated to a real exercise ID after seeding

interface WorkoutPattern {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number;
  exercisePatterns: ExercisePattern[];
}

interface ExercisePattern {
  exerciseId: string;
  sets: SetPattern[];
  progressionRate: number; // % increase per week
}

interface SetPattern {
  repsRange: [number, number];
  holdTimeRange?: [number, number]; // For isometric exercises
  bandLevel: BandLevel;
}

// Realistic calisthenics workout patterns
const workoutPatterns: WorkoutPattern[] = [
  {
    dayOfWeek: 1, // Monday - Push focused
    hour: 10,
    exercisePatterns: [
      {
        exerciseId: PUSH_UP_ID,
        sets: [
          { repsRange: [10, 12], bandLevel: "none" }, // Warm-up
          { repsRange: [15, 20], bandLevel: "none" }, // Working set
          { repsRange: [12, 15], bandLevel: "none" }, // Working set
          { repsRange: [10, 12], bandLevel: "none" }, // Back-off set
        ],
        progressionRate: 5, // 5% more reps per week
      },
    ],
  },
  {
    dayOfWeek: 4, // Thursday - Full body
    hour: 16,
    exercisePatterns: [
      {
        exerciseId: PUSH_UP_ID,
        sets: [
          { repsRange: [8, 10], bandLevel: "none" }, // Warm-up
          { repsRange: [12, 15], bandLevel: "none" }, // Working set
          { repsRange: [12, 15], bandLevel: "none" }, // Working set
          { repsRange: [10, 12], bandLevel: "none" }, // Back-off set
        ],
        progressionRate: 5,
      },
    ],
  },
];

const formQualities: FormQuality[] = ["poor", "acceptable", "good", "excellent"];

function getRandomFormQuality(): FormQuality {
  // Weighted towards good form
  const weights = [0.05, 0.15, 0.5, 0.3]; // poor, acceptable, good, excellent
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return formQualities[i];
    }
  }
  return "good";
}

async function seedAdvancedWorkoutData(weeksToGenerate: number = 12, startingReps: number = 10) {
  console.log(`Starting to seed ${weeksToGenerate} weeks of calisthenics workout data...`);
  console.log(`Starting reps: ${startingReps}`);

  try {
    const today = new Date();
    let totalSessionsCreated = 0;
    let totalSetsCreated = 0;

    // Generate data week by week
    for (let week = weeksToGenerate - 1; week >= 0; week--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - week * 7);

      // Calculate current working reps with progression
      const weeksCompleted = weeksToGenerate - 1 - week;
      const progressionMultiplier = Math.pow(1 + workoutPatterns[0].exercisePatterns[0].progressionRate / 100, weeksCompleted);
      const currentWorkingReps = Math.round(startingReps * progressionMultiplier);

      console.log(`\nWeek ${weeksCompleted + 1}: Target reps = ${currentWorkingReps}`);

      // Generate sessions for each pattern in the week
      for (const pattern of workoutPatterns) {
        // Calculate the date for this workout
        const sessionDate = new Date(weekStart);
        const daysUntilWorkout = (pattern.dayOfWeek - weekStart.getDay() + 7) % 7;
        sessionDate.setDate(weekStart.getDate() + daysUntilWorkout);
        sessionDate.setHours(pattern.hour, 0, 0, 0);

        // Skip if the date is in the future
        if (sessionDate > today) continue;

        // Add some randomness to simulate real life (10% chance to skip a workout)
        if (Math.random() < 0.1 && week > 0) {
          console.log(`  Skipped workout on ${sessionDate.toLocaleDateString()} (simulating missed session)`);
          continue;
        }

        // Create workout session
        const duration = 30 + Math.floor(Math.random() * 30); // 30-60 minutes
        const workoutSession = await prisma.workoutSession.create({
          data: {
            userId: USER_ID,
            startedAt: sessionDate,
            endedAt: new Date(sessionDate.getTime() + duration * 60 * 1000),
            duration: duration * 60,
          },
        });

        totalSessionsCreated++;
        console.log(`  Created session on ${sessionDate.toLocaleDateString()}`);

        // Create exercises and sets for this session
        for (let exerciseIndex = 0; exerciseIndex < pattern.exercisePatterns.length; exerciseIndex++) {
          const exercisePattern = pattern.exercisePatterns[exerciseIndex];

          const workoutSessionExercise = await prisma.workoutSessionExercise.create({
            data: {
              workoutSessionId: workoutSession.id,
              exerciseId: exercisePattern.exerciseId,
              order: exerciseIndex,
            },
          });

          // Create sets according to the pattern
          for (let setIndex = 0; setIndex < exercisePattern.sets.length; setIndex++) {
            const setPattern = exercisePattern.sets[setIndex];

            // Calculate reps with some variation
            const repsRange = setPattern.repsRange;
            const baseReps = Math.round((currentWorkingReps * (repsRange[0] + repsRange[1])) / 2 / startingReps);
            const reps = baseReps + Math.floor(Math.random() * 3) - 1; // ±1 variation

            // Random RPE between 6-9
            const rpe = 6 + Math.floor(Math.random() * 4);

            await prisma.workoutSet.create({
              data: {
                workoutSessionExerciseId: workoutSessionExercise.id,
                setIndex: setIndex,
                reps: Math.max(1, reps),
                holdTimeSeconds: setPattern.holdTimeRange
                  ? setPattern.holdTimeRange[0] + Math.floor(Math.random() * (setPattern.holdTimeRange[1] - setPattern.holdTimeRange[0]))
                  : null,
                formQuality: getRandomFormQuality(),
                bandUsed: setPattern.bandLevel,
                rpe: rpe,
                completed: true,
              },
            });

            totalSetsCreated++;
          }

          console.log(
            `    Added ${exercisePattern.sets.length} sets (${exercisePattern.sets[0].repsRange[0]}-${exercisePattern.sets[exercisePattern.sets.length - 1].repsRange[1]} reps)`,
          );
        }
      }
    }

    // Add some recent incomplete sessions
    console.log("\nAdding recent incomplete/planned sessions...");

    for (let i = 0; i < 2; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i + 1);
      futureDate.setHours(18, 0, 0, 0);

      const workoutSession = await prisma.workoutSession.create({
        data: {
          userId: USER_ID,
          startedAt: futureDate,
        },
      });

      await prisma.workoutSessionExercise.create({
        data: {
          workoutSessionId: workoutSession.id,
          exerciseId: PUSH_UP_ID,
          order: 0,
        },
      });

      console.log(`  Created planned session for ${futureDate.toLocaleDateString()}`);
    }

    console.log("\n✅ Successfully seeded calisthenics workout data!");
    console.log("\nSummary:");
    console.log(`- Total sessions created: ${totalSessionsCreated}`);
    console.log(`- Total sets created: ${totalSetsCreated}`);
    console.log(`- Average sets per session: ${(totalSetsCreated / totalSessionsCreated).toFixed(1)}`);
    console.log(`- Final target reps: ${Math.round(startingReps * Math.pow(1.05, weeksToGenerate - 1))}`);
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const weeks = args[0] ? parseInt(args[0]) : 12;
const startReps = args[1] ? parseInt(args[1]) : 10;

if (isNaN(weeks) || isNaN(startReps)) {
  console.error("Usage: tsx seed-workout-data-advanced.ts [weeks] [startingReps]");
  console.error("Example: tsx seed-workout-data-advanced.ts 12 10");
  process.exit(1);
}

// Run the seed script
seedAdvancedWorkoutData(weeks, startReps).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
