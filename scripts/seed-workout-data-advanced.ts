import { prisma } from "../src/shared/lib/prisma";

// Configuration
const USER_ID = "bwZuBQO4cJgBX6NiZaXgv81vKfgBQcFe";
const BENCH_PRESS_ID = "cmbw9xso904p69kv1vwuadhx6"; // Développé couché à la barre prise large

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
  weightPercentage: number; // Percentage of working weight
}

// Realistic workout patterns
const workoutPatterns: WorkoutPattern[] = [
  {
    dayOfWeek: 1, // Monday - Chest day
    hour: 10,
    exercisePatterns: [
      {
        exerciseId: BENCH_PRESS_ID,
        sets: [
          { repsRange: [12, 15], weightPercentage: 60 }, // Warm-up
          { repsRange: [10, 12], weightPercentage: 70 }, // Warm-up
          { repsRange: [8, 10], weightPercentage: 85 }, // Working set
          { repsRange: [6, 8], weightPercentage: 100 }, // Working set
          { repsRange: [6, 8], weightPercentage: 100 }, // Working set
          { repsRange: [8, 10], weightPercentage: 90 }, // Back-off set
        ],
        progressionRate: 2.5, // 2.5% per week
      },
    ],
  },
  {
    dayOfWeek: 4, // Thursday - Upper body
    hour: 16,
    exercisePatterns: [
      {
        exerciseId: BENCH_PRESS_ID,
        sets: [
          { repsRange: [12, 15], weightPercentage: 50 }, // Warm-up
          { repsRange: [10, 12], weightPercentage: 65 }, // Warm-up
          { repsRange: [8, 10], weightPercentage: 80 }, // Lighter day
          { repsRange: [8, 10], weightPercentage: 80 },
          { repsRange: [10, 12], weightPercentage: 75 },
        ],
        progressionRate: 2.5,
      },
    ],
  },
];

async function seedAdvancedWorkoutData(weeksToGenerate: number = 12, startingWeight: number = 60) {
  console.log(`Starting to seed ${weeksToGenerate} weeks of workout data...`);
  console.log(`Starting bench press weight: ${startingWeight}kg`);

  try {
    const today = new Date();
    let totalSessionsCreated = 0;
    let totalSetsCreated = 0;

    // Generate data week by week
    for (let week = weeksToGenerate - 1; week >= 0; week--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - week * 7);

      // Calculate current working weight with progression
      const weeksCompleted = weeksToGenerate - 1 - week;
      const progressionMultiplier = Math.pow(1 + workoutPatterns[0].exercisePatterns[0].progressionRate / 100, weeksCompleted);
      const currentWorkingWeight = startingWeight * progressionMultiplier;

      console.log(`\nWeek ${weeksCompleted + 1}: Working weight = ${currentWorkingWeight.toFixed(1)}kg`);

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
        const duration = 45 + Math.floor(Math.random() * 30); // 45-75 minutes
        const workoutSession = await prisma.workoutSession.create({
          data: {
            userId: USER_ID,
            startedAt: sessionDate,
            endedAt: new Date(sessionDate.getTime() + duration * 60 * 1000),
            duration: duration * 60,
          },
        });

        totalSessionsCreated++;
        console.log(`  Created session on ${sessionDate.toLocaleDateString()} (${pattern.dayOfWeek === 1 ? "Heavy" : "Light"} day)`);

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

            // Calculate actual weight for this set
            let setWeight = (currentWorkingWeight * setPattern.weightPercentage) / 100;

            // Add small random variation (±2.5%)
            setWeight *= 0.975 + Math.random() * 0.05;

            // Round to nearest 2.5kg
            setWeight = Math.round(setWeight / 2.5) * 2.5;
            setWeight = Math.max(20, setWeight); // Minimum 20kg (empty barbell)

            // Calculate reps with some variation
            const repsRange = setPattern.repsRange;
            const reps = repsRange[0] + Math.floor(Math.random() * (repsRange[1] - repsRange[0] + 1));

            // Occasionally fail a rep on heavy sets
            const failedRep = setPattern.weightPercentage >= 95 && Math.random() < 0.15;
            const actualReps = failedRep ? Math.max(1, reps - 1) : reps;

            await prisma.workoutSet.create({
              data: {
                workoutSessionExerciseId: workoutSessionExercise.id,
                setIndex: setIndex,
                types: ["REPS", "WEIGHT"],
                type: "WEIGHT",
                valuesInt: [actualReps, Math.round(setWeight)],
                valuesSec: [],
                units: ["kg"],
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
          exerciseId: BENCH_PRESS_ID,
          order: 0,
        },
      });

      console.log(`  Created planned session for ${futureDate.toLocaleDateString()}`);
    }

    console.log("\n✅ Successfully seeded workout data!");
    console.log("\nSummary:");
    console.log(`- Total sessions created: ${totalSessionsCreated}`);
    console.log(`- Total sets created: ${totalSetsCreated}`);
    console.log(`- Average sets per session: ${(totalSetsCreated / totalSessionsCreated).toFixed(1)}`);
    console.log(`- Final working weight: ${(startingWeight * Math.pow(1.025, weeksToGenerate - 1)).toFixed(1)}kg`);
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
const startWeight = args[1] ? parseInt(args[1]) : 60;

if (isNaN(weeks) || isNaN(startWeight)) {
  console.error("Usage: tsx seed-workout-data-advanced.ts [weeks] [startingWeight]");
  console.error("Example: tsx seed-workout-data-advanced.ts 12 60");
  process.exit(1);
}

// Run the seed script
seedAdvancedWorkoutData(weeks, startWeight).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
