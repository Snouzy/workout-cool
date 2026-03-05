#!/usr/bin/env ts-node
import {
  PrismaClient,
  ExerciseCategory,
  DifficultyLevel,
  MeasurementType,
  MuscleGroup,
} from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExerciseDef {
  level: number;
  nameEn: string;
  name: string; // French
  slug: string;
  description: string;
  instructions: string[];
  cues: string[];
  commonMistakes: string[];
  difficultyLevel: DifficultyLevel;
  measurementType: MeasurementType;
  defaultSets: number;
  defaultReps?: number;
  defaultHoldTime?: number;
  restBetweenSets: number;
  category: ExerciseCategory;
  subcategory: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  bandResistance?: boolean;
  equipmentIds: string[];
  unlockCriteria: Record<string, unknown>;
}

interface FamilyDef {
  name: string;
  slug: string;
  description: string;
  category: ExerciseCategory;
  exercises: ExerciseDef[];
}

// ---------------------------------------------------------------------------
// Push-Up Family
// ---------------------------------------------------------------------------

const pushUpFamily: FamilyDef = {
  name: "Push-Up Family",
  slug: "push-up-family",
  description:
    "Progressive calisthenics push-up movements from wall push-ups to one-arm push-ups",
  category: ExerciseCategory.push_horizontal,
  exercises: [
    {
      level: 1,
      nameEn: "Wall Push-Ups",
      name: "Pompes au mur",
      slug: "wall-push-ups",
      description:
        "A beginner-friendly push-up variation performed against a wall, ideal for building foundational pressing strength.",
      instructions: [
        "Stand facing a wall at arm's length with feet shoulder-width apart.",
        "Place your palms flat on the wall at shoulder height and shoulder-width apart.",
        "Bend your elbows to lower your chest toward the wall while keeping your body straight.",
        "Push back to the starting position by extending your arms fully.",
      ],
      cues: [
        "Keep your core tight and body in a straight line from head to heels.",
        "Lower under control; do not let your hips sag.",
        "Exhale as you push away from the wall.",
      ],
      commonMistakes: [
        "Flaring elbows out to 90 degrees instead of keeping them at roughly 45 degrees.",
        "Letting the hips pike or sag, breaking the straight-line body position.",
        "Standing too close to the wall, reducing range of motion.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 10,
      restBetweenSets: 60,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [MuscleGroup.serratus_anterior],
      equipmentIds: ["eq-wall", "eq-floor"],
      unlockCriteria: { minReps: 15, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 2,
      nameEn: "Incline Push-Ups High",
      name: "Pompes inclinées (haut)",
      slug: "incline-push-ups-high",
      description:
        "Push-ups performed on a high surface such as a bench or box, reducing the load compared to floor push-ups.",
      instructions: [
        "Place your hands on a box or bench at about hip height, shoulder-width apart.",
        "Walk your feet back until your body forms a straight line from head to heels.",
        "Lower your chest toward the edge of the surface by bending your elbows.",
        "Press back up to full arm extension.",
      ],
      cues: [
        "Maintain a rigid plank position throughout the movement.",
        "Keep elbows at about 45 degrees from your torso.",
        "Touch your chest to the edge at the bottom of each rep.",
      ],
      commonMistakes: [
        "Rounding the upper back instead of keeping the chest open.",
        "Placing hands too wide, which shifts stress to the shoulders.",
        "Not reaching full range of motion at the bottom.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 10,
      restBetweenSets: 60,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [MuscleGroup.serratus_anterior],
      equipmentIds: ["eq-box", "eq-floor"],
      unlockCriteria: { minReps: 15, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 3,
      nameEn: "Incline Push-Ups Low",
      name: "Pompes inclinées (bas)",
      slug: "incline-push-ups-low",
      description:
        "Push-ups performed on a low surface, bridging the gap between high incline and floor push-ups.",
      instructions: [
        "Place your hands on a low bench or step, shoulder-width apart.",
        "Extend your body into a plank position with feet on the floor.",
        "Lower your chest toward the surface by bending your elbows.",
        "Push back up explosively to full arm extension.",
      ],
      cues: [
        "Squeeze your glutes to keep the hips in line.",
        "Control the eccentric phase for at least 2 seconds.",
        "Drive through your palms as you press up.",
      ],
      commonMistakes: [
        "Letting the lower back arch excessively at the bottom.",
        "Shortening the range of motion as fatigue sets in.",
        "Holding your breath instead of maintaining a steady breathing rhythm.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 10,
      restBetweenSets: 60,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [MuscleGroup.serratus_anterior],
      equipmentIds: ["eq-box", "eq-floor"],
      unlockCriteria: { minReps: 12, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 4,
      nameEn: "Knee Push-Ups",
      name: "Pompes sur les genoux",
      slug: "knee-push-ups",
      description:
        "A modified push-up performed from the knees, reducing bodyweight load while maintaining proper upper-body mechanics.",
      instructions: [
        "Kneel on the floor and place your hands shoulder-width apart in front of you.",
        "Walk your hands forward until your body forms a straight line from knees to shoulders.",
        "Lower your chest to the floor by bending your elbows.",
        "Press back up to full arm extension while keeping your core engaged.",
      ],
      cues: [
        "Keep your hips extended; avoid piking at the waist.",
        "Aim for elbows at about 45 degrees from your body.",
        "Touch your chest to the floor on every rep for full range of motion.",
      ],
      commonMistakes: [
        "Bending at the hips instead of maintaining a straight line from knees to head.",
        "Placing hands too far forward, which overloads the shoulders.",
        "Rushing reps and losing tension in the core.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 12,
      restBetweenSets: 60,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [MuscleGroup.serratus_anterior],
      equipmentIds: ["eq-floor"],
      unlockCriteria: { minReps: 15, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 5,
      nameEn: "Full Push-Ups",
      name: "Pompes classiques",
      slug: "full-push-ups",
      description:
        "The standard push-up performed from the toes, a foundational bodyweight pressing exercise.",
      instructions: [
        "Start in a high plank position with hands shoulder-width apart and arms fully extended.",
        "Engage your core and maintain a straight line from head to heels.",
        "Lower your body until your chest nearly touches the floor.",
        "Press back up to the starting position by fully extending your arms.",
      ],
      cues: [
        "Keep the core braced throughout; imagine a straight plank from head to feet.",
        "Elbows should track at roughly 45 degrees, not flared out.",
        "Protract your shoulder blades at the top for full serratus activation.",
      ],
      commonMistakes: [
        "Letting the hips sag or pike, breaking the plank alignment.",
        "Flaring elbows out to 90 degrees, which stresses the shoulders.",
        "Not achieving full range of motion at the bottom.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 10,
      restBetweenSets: 60,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
        MuscleGroup.serratus_anterior,
      ],
      secondaryMuscles: [MuscleGroup.rectus_abdominis],
      equipmentIds: ["eq-floor"],
      unlockCriteria: { minReps: 20, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 6,
      nameEn: "Diamond Push-Ups",
      name: "Pompes diamant",
      slug: "diamond-push-ups",
      description:
        "A narrow-grip push-up that places greater emphasis on the triceps and inner chest.",
      instructions: [
        "Start in a high plank position and bring your hands together under your chest, forming a diamond shape with thumbs and index fingers.",
        "Keep your body in a straight line from head to heels.",
        "Lower your chest toward your hands by bending your elbows close to your sides.",
        "Press back up to full extension.",
      ],
      cues: [
        "Keep elbows tucked tight to your body throughout the movement.",
        "Lower until your chest touches or nearly touches your hands.",
        "Maintain a tight core to prevent hip sag.",
      ],
      commonMistakes: [
        "Flaring the elbows outward, reducing triceps engagement.",
        "Placing the hands too far forward instead of directly under the chest.",
        "Shortening the range of motion to compensate for difficulty.",
      ],
      difficultyLevel: DifficultyLevel.intermediate,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 8,
      restBetweenSets: 90,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.triceps,
        MuscleGroup.anterior_deltoid,
      ],
      secondaryMuscles: [MuscleGroup.serratus_anterior],
      equipmentIds: ["eq-floor"],
      unlockCriteria: { minReps: 10, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 7,
      nameEn: "Archer Push-Ups",
      name: "Pompes archer",
      slug: "archer-push-ups",
      description:
        "A unilateral push-up variation where one arm does most of the work while the other provides light support, building toward one-arm push-ups.",
      instructions: [
        "Start in a wide push-up position with both arms extended.",
        "Shift your weight toward one hand and bend that elbow to lower your chest.",
        "Keep the opposite arm straight as it slides outward for balance.",
        "Press back up through the working arm and return to center.",
        "Alternate sides each rep or complete all reps on one side before switching.",
      ],
      cues: [
        "Focus the effort on the working arm; the straight arm is only for balance.",
        "Keep your hips square to the floor; resist rotation.",
        "Lower your chest to the level of the working hand.",
      ],
      commonMistakes: [
        "Using the straight arm to push, turning it into a wide push-up.",
        "Rotating the torso instead of keeping hips and shoulders level.",
        "Not going deep enough on the working side.",
      ],
      difficultyLevel: DifficultyLevel.intermediate,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 6,
      restBetweenSets: 90,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [MuscleGroup.serratus_anterior],
      equipmentIds: ["eq-floor"],
      unlockCriteria: { minReps: 8, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 8,
      nameEn: "Pseudo Planche Push-Ups",
      name: "Pompes pseudo planche",
      slug: "pseudo-planche-push-ups",
      description:
        "A push-up variation with hands placed near the waist and fingers pointing outward or backward, heavily loading the anterior deltoids and simulating planche mechanics.",
      instructions: [
        "Start in a push-up position but place your hands beside your hips with fingers pointing sideways or slightly backward.",
        "Lean forward so your shoulders are well in front of your hands.",
        "Lower your body by bending your elbows while maintaining the forward lean.",
        "Press back up to full arm extension without shifting backward.",
      ],
      cues: [
        "Maintain a strong forward lean throughout; shoulders should stay ahead of your wrists.",
        "Keep your body in a straight line; do not pike at the hips.",
        "Protract your shoulder blades at the top for maximum serratus activation.",
      ],
      commonMistakes: [
        "Not leaning forward enough, turning it into a regular push-up.",
        "Piking at the hips to reduce difficulty.",
        "Wrist discomfort from improper hand placement; warm up wrists first.",
      ],
      difficultyLevel: DifficultyLevel.intermediate,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 6,
      restBetweenSets: 90,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.serratus_anterior,
      ],
      secondaryMuscles: [MuscleGroup.triceps],
      equipmentIds: ["eq-floor"],
      unlockCriteria: { minReps: 8, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 9,
      nameEn: "Assisted One-Arm Push-Up",
      name: "Pompes a un bras assistees",
      slug: "assisted-one-arm-push-up",
      description:
        "A one-arm push-up with the non-working hand elevated on a ball or placed on the floor further out for support, bridging the gap to full one-arm push-ups.",
      instructions: [
        "Assume a push-up position with feet wider than shoulder-width for stability.",
        "Place one hand on a basketball, medicine ball, or elevated surface beside you.",
        "Lower your chest toward the floor using primarily the grounded arm.",
        "Press back up to full extension while minimizing assistance from the support hand.",
      ],
      cues: [
        "Keep hips square to the floor; fight rotational forces.",
        "The support hand should provide minimal assistance; most of the work is unilateral.",
        "Widen your feet to improve balance and stability.",
      ],
      commonMistakes: [
        "Relying too heavily on the support hand, defeating the purpose.",
        "Allowing the torso to rotate toward the working arm.",
        "Not using a wide enough stance, causing balance issues.",
      ],
      difficultyLevel: DifficultyLevel.advanced,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 5,
      restBetweenSets: 120,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [
        MuscleGroup.serratus_anterior,
        MuscleGroup.obliques,
      ],
      equipmentIds: ["eq-floor"],
      unlockCriteria: { minReps: 8, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 10,
      nameEn: "One-Arm Push-Up",
      name: "Pompes a un bras",
      slug: "one-arm-push-up",
      description:
        "The ultimate push-up progression: a full push-up performed with one arm, requiring exceptional strength, stability, and control.",
      instructions: [
        "Start in a push-up position with feet wide (at least double shoulder-width) for balance.",
        "Place one hand behind your back or on your hip.",
        "Lower your chest toward the floor by bending the working elbow, keeping your hips as square as possible.",
        "Press back up to full arm extension under control.",
      ],
      cues: [
        "Keep your hips as level as possible; some rotation is natural but minimize it.",
        "Engage your obliques and core maximally to resist rotation.",
        "Lower under control for at least 3 seconds before pressing up.",
      ],
      commonMistakes: [
        "Excessive torso rotation, turning it into a twisting movement instead of a press.",
        "Using a narrow foot stance and losing balance.",
        "Bouncing at the bottom instead of performing a controlled press.",
      ],
      difficultyLevel: DifficultyLevel.advanced,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 3,
      restBetweenSets: 120,
      category: ExerciseCategory.push_horizontal,
      subcategory: "horizontal pushing",
      primaryMuscles: [
        MuscleGroup.chest,
        MuscleGroup.anterior_deltoid,
        MuscleGroup.triceps,
      ],
      secondaryMuscles: [
        MuscleGroup.serratus_anterior,
        MuscleGroup.obliques,
        MuscleGroup.rectus_abdominis,
      ],
      equipmentIds: ["eq-floor"],
      unlockCriteria: {
        minReps: 5,
        minSets: 3,
        minFormQuality: "excellent",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Pull-Up Family
// ---------------------------------------------------------------------------

const pullUpFamily: FamilyDef = {
  name: "Pull-Up Family",
  slug: "pull-up-family",
  description:
    "Progressive calisthenics pull-up movements from dead hang to one-arm pull-up",
  category: ExerciseCategory.pull_vertical,
  exercises: [
    {
      level: 1,
      nameEn: "Dead Hang",
      name: "Suspension passive",
      slug: "dead-hang",
      description:
        "A foundational grip and shoulder exercise where you hang from a bar with arms fully extended, building the grip endurance needed for all pulling movements.",
      instructions: [
        "Grip a pull-up bar with hands shoulder-width apart using an overhand grip.",
        "Step off the box or jump up and hang with arms fully extended.",
        "Relax your shoulders and let your body hang naturally.",
        "Hold the position for the prescribed time, breathing steadily.",
      ],
      cues: [
        "Keep arms fully extended; do not bend the elbows.",
        "Breathe slowly and steadily; avoid holding your breath.",
        "Engage your grip firmly; wrap your thumbs around the bar.",
      ],
      commonMistakes: [
        "Bending the elbows, which engages biceps unnecessarily.",
        "Holding your breath, which reduces hang time.",
        "Using a grip that is too wide, causing premature forearm fatigue.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.time,
      defaultSets: 3,
      defaultHoldTime: 30,
      restBetweenSets: 90,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.forearms,
      ],
      secondaryMuscles: [MuscleGroup.rhomboids],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: {
        minHoldTime: 60,
        minSets: 3,
        minFormQuality: "good",
      },
    },
    {
      level: 2,
      nameEn: "Scapular Pulls",
      name: "Tractions scapulaires",
      slug: "scapular-pulls",
      description:
        "An active hang exercise focusing on scapular retraction and depression, essential for developing proper pulling mechanics.",
      instructions: [
        "Hang from a pull-up bar with a shoulder-width overhand grip.",
        "Without bending your elbows, pull your shoulder blades down and together.",
        "Hold the retracted position briefly, feeling your lats engage.",
        "Slowly release back to a dead hang position and repeat.",
      ],
      cues: [
        "Think about pulling your shoulder blades into your back pockets.",
        "Keep arms completely straight; the movement is only at the shoulders.",
        "You should feel your lats and rhomboids activating, not your biceps.",
      ],
      commonMistakes: [
        "Bending the elbows, which turns it into a partial pull-up.",
        "Using momentum to swing into the retracted position.",
        "Not fully returning to a dead hang between reps, reducing range of motion.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 10,
      restBetweenSets: 90,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.rhomboids,
        MuscleGroup.rear_deltoid,
        MuscleGroup.latissimus_dorsi,
      ],
      secondaryMuscles: [MuscleGroup.forearms],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 15, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 3,
      nameEn: "Negative Pull-Ups",
      name: "Tractions negatives",
      slug: "negative-pull-ups",
      description:
        "An eccentric-focused pull-up where you jump or step to the top position and lower yourself as slowly as possible, building the strength for full pull-ups.",
      instructions: [
        "Use a box to get your chin above the bar in the top pull-up position.",
        "Grip the bar with a shoulder-width overhand grip and step off the box.",
        "Lower yourself as slowly as possible (aim for 5-10 seconds) to a full dead hang.",
        "Step back on the box and repeat.",
      ],
      cues: [
        "Control the descent; aim for at least 5 seconds from top to bottom.",
        "Keep your core engaged to prevent swinging.",
        "Lower all the way to full arm extension on each rep.",
      ],
      commonMistakes: [
        "Dropping too quickly instead of controlling the eccentric phase.",
        "Not starting from a full chin-over-bar position.",
        "Swinging or kipping on the way down.",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 5,
      restBetweenSets: 120,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.brachialis,
      ],
      secondaryMuscles: [MuscleGroup.forearms, MuscleGroup.rhomboids],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 8, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 4,
      nameEn: "Band-Assisted Pull-Ups",
      name: "Tractions assistees avec elastique",
      slug: "band-assisted-pull-ups",
      description:
        "Pull-ups performed with a resistance band providing assistance at the bottom of the movement, allowing you to complete full range-of-motion reps.",
      instructions: [
        "Loop a resistance band over the pull-up bar and let it hang down.",
        "Place one foot or knee in the band loop.",
        "Grip the bar with a shoulder-width overhand grip and hang with arms extended.",
        "Pull yourself up until your chin clears the bar, then lower under control.",
      ],
      cues: [
        "Initiate the pull by depressing and retracting your shoulder blades.",
        "Drive your elbows down toward your hips as you pull.",
        "Lower under control for at least 2-3 seconds on each rep.",
      ],
      commonMistakes: [
        "Using a band that is too heavy, making the movement too easy.",
        "Kipping or using momentum instead of strict pulling.",
        "Not achieving full range of motion (chin over bar and full arm extension).",
      ],
      difficultyLevel: DifficultyLevel.beginner,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 8,
      restBetweenSets: 90,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
      ],
      secondaryMuscles: [
        MuscleGroup.brachialis,
        MuscleGroup.rhomboids,
        MuscleGroup.forearms,
      ],
      bandResistance: true,
      equipmentIds: ["eq-bar-high", "eq-band"],
      unlockCriteria: { minReps: 10, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 5,
      nameEn: "Pull-Ups",
      name: "Tractions pronation",
      slug: "pull-ups",
      description:
        "The classic overhand-grip pull-up, a fundamental upper-body pulling exercise that builds lat and bicep strength.",
      instructions: [
        "Grip a pull-up bar with hands slightly wider than shoulder-width, palms facing away.",
        "Hang with arms fully extended and feet off the ground.",
        "Pull yourself up by driving your elbows down until your chin clears the bar.",
        "Lower yourself under control to a full dead hang and repeat.",
      ],
      cues: [
        "Initiate the movement with scapular depression before bending the elbows.",
        "Pull your elbows toward your hips, not behind you.",
        "Keep your core tight to prevent swinging.",
      ],
      commonMistakes: [
        "Using a kipping motion to generate momentum.",
        "Not achieving full range of motion at the bottom (dead hang) or top (chin over bar).",
        "Craning the neck forward to get the chin over the bar instead of pulling higher.",
      ],
      difficultyLevel: DifficultyLevel.intermediate,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 5,
      restBetweenSets: 90,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.brachialis,
        MuscleGroup.rear_deltoid,
      ],
      secondaryMuscles: [MuscleGroup.forearms, MuscleGroup.rhomboids],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 8, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 6,
      nameEn: "Chin-Ups",
      name: "Tractions supination",
      slug: "chin-ups",
      description:
        "An underhand-grip pull-up that emphasizes the biceps more than the standard pull-up while still heavily working the lats.",
      instructions: [
        "Grip the pull-up bar with hands shoulder-width apart, palms facing you (supinated grip).",
        "Hang with arms fully extended.",
        "Pull yourself up until your chin clears the bar, squeezing your biceps at the top.",
        "Lower under control to a full dead hang.",
      ],
      cues: [
        "Keep your chest up and aim to touch the bar to your upper chest.",
        "Squeeze your biceps at the top of the movement for maximum engagement.",
        "Avoid swinging; if you need to swing, reduce the rep count.",
      ],
      commonMistakes: [
        "Using too narrow a grip, which can strain the wrists.",
        "Not fully extending the arms at the bottom of each rep.",
        "Excessive swinging or kipping to complete reps.",
      ],
      difficultyLevel: DifficultyLevel.intermediate,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 8,
      restBetweenSets: 90,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.brachialis,
      ],
      secondaryMuscles: [MuscleGroup.forearms, MuscleGroup.rear_deltoid],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 10, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 7,
      nameEn: "L-Sit Pull-Ups",
      name: "Tractions en L-sit",
      slug: "l-sit-pull-ups",
      description:
        "A pull-up performed with legs held in an L-sit position (parallel to the floor), adding significant core demand to the pulling movement.",
      instructions: [
        "Hang from the bar with an overhand grip and raise your legs to a 90-degree angle (L-sit position).",
        "Maintain the L-sit while pulling yourself up until your chin clears the bar.",
        "Lower under control while keeping the L-sit position throughout.",
        "If you cannot hold a full L-sit, start with knees bent at 90 degrees.",
      ],
      cues: [
        "Lock your legs in the L-sit before you begin pulling; do not let them drop.",
        "Point your toes forward and squeeze your quads to keep legs straight.",
        "Keep your core maximally engaged to maintain the L-position.",
      ],
      commonMistakes: [
        "Letting the legs drop during the pull, losing the L-sit position.",
        "Using momentum or swinging to compensate for the added difficulty.",
        "Bending the knees significantly, reducing core engagement.",
      ],
      difficultyLevel: DifficultyLevel.intermediate,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 5,
      restBetweenSets: 120,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.rectus_abdominis,
        MuscleGroup.hip_flexors,
      ],
      secondaryMuscles: [
        MuscleGroup.brachialis,
        MuscleGroup.forearms,
        MuscleGroup.quadriceps,
      ],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 5, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 8,
      nameEn: "Wide Grip Pull-Ups",
      name: "Tractions prise large",
      slug: "wide-grip-pull-ups",
      description:
        "A pull-up variation with a wider-than-shoulder-width grip that increases the demand on the lats and rear deltoids.",
      instructions: [
        "Grip the bar with hands about 1.5 times shoulder-width apart, palms facing away.",
        "Hang with arms fully extended.",
        "Pull yourself up by driving your elbows out and down until your chin clears the bar.",
        "Lower under control to a full dead hang.",
      ],
      cues: [
        "Drive your elbows toward your sides as you pull up.",
        "Focus on squeezing the lats at the top rather than pulling with the arms.",
        "Keep your core tight to prevent excessive swinging.",
      ],
      commonMistakes: [
        "Gripping too wide, which reduces range of motion and can strain the shoulders.",
        "Not achieving full range of motion due to the increased difficulty.",
        "Using momentum or body english to complete reps.",
      ],
      difficultyLevel: DifficultyLevel.advanced,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 8,
      restBetweenSets: 120,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.rear_deltoid,
        MuscleGroup.biceps,
      ],
      secondaryMuscles: [
        MuscleGroup.brachialis,
        MuscleGroup.forearms,
        MuscleGroup.rhomboids,
      ],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 10, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 9,
      nameEn: "Archer Pull-Ups",
      name: "Tractions archer",
      slug: "archer-pull-ups",
      description:
        "A unilateral pull-up variation where one arm does the majority of the work while the other arm stays extended for balance, building toward one-arm pull-ups.",
      instructions: [
        "Grip the bar with a very wide overhand grip.",
        "Pull yourself up toward one hand, keeping the opposite arm as straight as possible.",
        "Your chin should clear the bar on the working side.",
        "Lower under control and repeat on the same side or alternate.",
      ],
      cues: [
        "Focus on pulling with one arm; the extended arm provides only light support.",
        "Keep the assisting arm as straight as possible throughout the movement.",
        "Control the descent for at least 3 seconds per rep.",
      ],
      commonMistakes: [
        "Bending the assisting arm too much, turning it into a wide-grip pull-up.",
        "Not pulling high enough on the working side.",
        "Rushing the reps and losing control during the eccentric phase.",
      ],
      difficultyLevel: DifficultyLevel.advanced,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 4,
      restBetweenSets: 120,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.brachialis,
      ],
      secondaryMuscles: [
        MuscleGroup.forearms,
        MuscleGroup.rear_deltoid,
        MuscleGroup.rhomboids,
      ],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: { minReps: 5, minSets: 3, minFormQuality: "good" },
    },
    {
      level: 10,
      nameEn: "One-Arm Pull-Up",
      name: "Traction a un bras",
      slug: "one-arm-pull-up",
      description:
        "The pinnacle of pulling strength: a full pull-up performed with a single arm, requiring elite-level lat, bicep, and grip strength.",
      instructions: [
        "Grip the bar with one hand using an overhand or neutral grip.",
        "Hang with your arm fully extended and the free hand at your side or behind your back.",
        "Pull yourself up until your chin clears the bar.",
        "Lower under control to a full dead hang.",
      ],
      cues: [
        "Engage your lat fully before initiating the pull; think about pulling your elbow to your hip.",
        "Keep your body as straight as possible; minimize rotation.",
        "Control the negative for at least 3-4 seconds.",
      ],
      commonMistakes: [
        "Using excessive body rotation or kipping to generate momentum.",
        "Not achieving full range of motion at top or bottom.",
        "Neglecting grip training, leading to premature grip failure.",
      ],
      difficultyLevel: DifficultyLevel.elite,
      measurementType: MeasurementType.reps,
      defaultSets: 3,
      defaultReps: 2,
      restBetweenSets: 180,
      category: ExerciseCategory.pull_vertical,
      subcategory: "vertical pulling",
      primaryMuscles: [
        MuscleGroup.latissimus_dorsi,
        MuscleGroup.biceps,
        MuscleGroup.brachialis,
        MuscleGroup.forearms,
      ],
      secondaryMuscles: [
        MuscleGroup.rear_deltoid,
        MuscleGroup.rhomboids,
        MuscleGroup.rectus_abdominis,
      ],
      equipmentIds: ["eq-bar-high"],
      unlockCriteria: {
        minReps: 3,
        minSets: 3,
        minFormQuality: "excellent",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function seedFamily(family: FamilyDef) {
  console.log(`\n--- Seeding family: ${family.name} ---`);

  // 1. Upsert the ProgressionFamily
  const fam = await prisma.progressionFamily.upsert({
    where: { slug: family.slug },
    update: {
      name: family.name,
      description: family.description,
      category: family.category,
    },
    create: {
      name: family.name,
      slug: family.slug,
      description: family.description,
      category: family.category,
    },
  });
  console.log(`  Family: ${fam.name} (${fam.id})`);

  // 2. For each exercise level
  for (const ex of family.exercises) {
    // 2a. Upsert Exercise
    const exercise = await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: {
        name: ex.name,
        nameEn: ex.nameEn,
        description: ex.description,
        instructions: ex.instructions,
        cues: ex.cues,
        commonMistakes: ex.commonMistakes,
        difficultyLevel: ex.difficultyLevel,
        measurementType: ex.measurementType,
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps ?? null,
        defaultHoldTime: ex.defaultHoldTime ?? null,
        restBetweenSets: ex.restBetweenSets,
        category: ex.category,
        subcategory: ex.subcategory,
        primaryMuscles: ex.primaryMuscles,
        secondaryMuscles: ex.secondaryMuscles,
        bandResistance: ex.bandResistance ?? false,
      },
      create: {
        name: ex.name,
        nameEn: ex.nameEn,
        slug: ex.slug,
        description: ex.description,
        instructions: ex.instructions,
        cues: ex.cues,
        commonMistakes: ex.commonMistakes,
        difficultyLevel: ex.difficultyLevel,
        measurementType: ex.measurementType,
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps ?? null,
        defaultHoldTime: ex.defaultHoldTime ?? null,
        restBetweenSets: ex.restBetweenSets,
        category: ex.category,
        subcategory: ex.subcategory,
        primaryMuscles: ex.primaryMuscles,
        secondaryMuscles: ex.secondaryMuscles,
        bandResistance: ex.bandResistance ?? false,
      },
    });
    console.log(`  L${ex.level}: ${ex.nameEn} (${exercise.id})`);

    // 2b. Upsert ProgressionLevel
    await prisma.progressionLevel.upsert({
      where: {
        familyId_level: { familyId: fam.id, level: ex.level },
      },
      update: {
        exerciseId: exercise.id,
        unlockCriteria: ex.unlockCriteria as object,
      },
      create: {
        familyId: fam.id,
        exerciseId: exercise.id,
        level: ex.level,
        unlockCriteria: ex.unlockCriteria as object,
      },
    });

    // 2c. Upsert ExerciseEquipment for each equipment ID
    for (const eqId of ex.equipmentIds) {
      const equipment = await prisma.equipment.findUnique({
        where: { id: eqId },
      });
      if (!equipment) {
        console.warn(
          `    WARNING: Equipment "${eqId}" not found. Skipping link for ${ex.slug}.`
        );
        continue;
      }
      await prisma.exerciseEquipment.upsert({
        where: {
          exerciseId_equipmentId: {
            exerciseId: exercise.id,
            equipmentId: eqId,
          },
        },
        update: {},
        create: {
          exerciseId: exercise.id,
          equipmentId: eqId,
        },
      });
    }
  }
}

async function main() {
  console.log("Seeding Push-Up and Pull-Up progression families...\n");

  // Verify equipment exists first
  const eqCount = await prisma.equipment.count();
  if (eqCount === 0) {
    console.error(
      "ERROR: No equipment found in database. Run seed-equipment.ts first."
    );
    process.exit(1);
  }
  console.log(`Found ${eqCount} equipment items in database.`);

  await seedFamily(pushUpFamily);
  await seedFamily(pullUpFamily);

  console.log("\n--- Summary ---");
  console.log(
    `Push-Up Family: ${pushUpFamily.exercises.length} exercises (levels 1-${pushUpFamily.exercises.length})`
  );
  console.log(
    `Pull-Up Family: ${pullUpFamily.exercises.length} exercises (levels 1-${pullUpFamily.exercises.length})`
  );
  console.log("Done.");
}

// Run
if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export default main;
