#!/usr/bin/env ts-node
import {
  PrismaClient,
  ExerciseCategory,
  DifficultyLevel,
  MeasurementType,
  MuscleGroup,
} from "@prisma/client";

const prisma = new PrismaClient();

// ========================================
// DIP FAMILY EXERCISES
// ========================================

const dipExercises = [
  {
    level: 1,
    nameEn: "Bench Dips",
    name: "Dips sur banc",
    slug: "bench-dips",
    description:
      "A beginner-friendly dip variation performed with hands on a bench behind you, targeting triceps and shoulders.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.chest,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-box"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Sit on the edge of a bench and place your hands next to your hips, fingers gripping the edge.",
      "Slide your hips forward off the bench with legs extended or bent at 90 degrees.",
      "Lower your body by bending your elbows to about 90 degrees.",
      "Press back up through your palms to the starting position.",
      "Keep your back close to the bench throughout the movement.",
    ],
    cues: [
      "Elbows point straight back, not flared out.",
      "Keep your shoulders down and away from your ears.",
      "Engage your core to avoid swinging.",
    ],
    commonMistakes: [
      "Flaring elbows out to the sides instead of keeping them back.",
      "Shrugging shoulders up toward the ears.",
      "Going too deep and straining the shoulder joint.",
    ],
    unlockCriteria: {
      minReps: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 2,
    nameEn: "Box Dips",
    name: "Dips sur box",
    slug: "box-dips",
    description:
      "An elevated bench dip variation using a box, increasing range of motion and triceps engagement.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.chest,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-box"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Place your hands on the edge of a box behind you, fingers facing forward.",
      "Extend your legs out in front with heels on the ground or on a second box.",
      "Lower yourself by bending your elbows until your upper arms are parallel to the floor.",
      "Push through your palms to return to the top position.",
      "Maintain a controlled tempo throughout the movement.",
    ],
    cues: [
      "Keep your chest up and open.",
      "Press evenly through both palms.",
      "Control the descent for 2-3 seconds.",
    ],
    commonMistakes: [
      "Letting the hips drift too far from the box.",
      "Bouncing at the bottom of the movement.",
      "Using momentum rather than controlled strength.",
    ],
    unlockCriteria: {
      minReps: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 3,
    nameEn: "Chair Dips",
    name: "Dips sur chaise",
    slug: "chair-dips",
    description:
      "A dip variation using a chair for support, emphasizing triceps strength before progressing to parallel bars.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [MuscleGroup.triceps, MuscleGroup.anterior_deltoid],
    secondaryMuscles: [MuscleGroup.chest, MuscleGroup.serratus_anterior],
    equipment: ["eq-box"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand in front of a sturdy chair and place your hands on the seat edge.",
      "Walk your feet forward until your hips are in front of the seat.",
      "Lower your body by bending the elbows to 90 degrees while keeping your back close to the chair.",
      "Push back up to full arm extension.",
      "For added difficulty, straighten your legs fully.",
    ],
    cues: [
      "Squeeze your triceps at the top of the movement.",
      "Keep your core braced the entire time.",
      "Lower slowly to build time under tension.",
    ],
    commonMistakes: [
      "Using a wobbly or unstable chair.",
      "Descending too fast and losing control.",
      "Rounding the shoulders forward at the top.",
    ],
    unlockCriteria: {
      minReps: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 4,
    nameEn: "Band-Assisted Dips",
    name: "Dips avec bande de resistance",
    slug: "band-assisted-dips",
    description:
      "Parallel bar dips with a resistance band for assistance, bridging the gap between bench dips and full dips.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 8,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.chest,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-parallels-low", "eq-band"],
    bandAssistance: true,
    bandResistance: false,
    instructions: [
      "Loop a resistance band over the parallel bars and step or kneel into the band.",
      "Grip the bars and lift yourself to a locked-out support position.",
      "Lower your body by bending your elbows until your upper arms are parallel to the floor.",
      "Press back up to the starting position with the band assisting your push.",
      "Gradually use thinner bands as you get stronger.",
    ],
    cues: [
      "Keep your body slightly leaning forward to engage the chest.",
      "Elbows track at roughly 45 degrees behind you.",
      "Exhale as you press up.",
    ],
    commonMistakes: [
      "Relying too much on the band and not engaging muscles.",
      "Swinging the legs to create momentum.",
      "Not going deep enough on the dip.",
    ],
    unlockCriteria: {
      minReps: 10,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 5,
    nameEn: "Parallel Bar Dips",
    name: "Dips aux barres paralleles",
    slug: "parallel-bar-dips",
    description:
      "The standard parallel bar dip, a foundational upper body pushing exercise targeting chest, triceps, and shoulders.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 8,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.chest,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-parallels-low"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Grip the parallel bars and jump or press up to a locked-out support position.",
      "Lean slightly forward to emphasize the chest or stay upright for more triceps.",
      "Lower yourself in a controlled manner until your elbows reach about 90 degrees.",
      "Press back up to full lockout by extending your arms.",
      "Keep your legs still and core engaged throughout.",
    ],
    cues: [
      "Depress your shoulders away from your ears at the top.",
      "Control the negative for at least 2 seconds.",
      "Lock out fully at the top of each rep.",
    ],
    commonMistakes: [
      "Kipping or swinging the legs to assist the push.",
      "Not reaching full depth for proper muscle activation.",
      "Letting the shoulders shrug up at the top.",
    ],
    unlockCriteria: {
      minReps: 10,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 6,
    nameEn: "Deep Dips",
    name: "Dips profonds",
    slug: "deep-dips",
    description:
      "An extended range-of-motion dip that increases chest stretch and shoulder mobility demand.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 8,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.chest,
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-parallels-low"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Start at the top of a standard dip position on parallel bars.",
      "Lean forward slightly and lower your body well past 90 degrees at the elbow.",
      "Descend until you feel a deep stretch across the chest and front delts.",
      "Press back up explosively while maintaining control.",
      "Only go as deep as your shoulder mobility safely allows.",
    ],
    cues: [
      "Think about pulling yourself down, not just dropping.",
      "Keep your shoulders retracted and stable.",
      "Pause briefly at the bottom to eliminate momentum.",
    ],
    commonMistakes: [
      "Going deeper than shoulder mobility allows, risking injury.",
      "Losing control at the bottom and bouncing.",
      "Excessive forward lean putting too much stress on the shoulder.",
    ],
    unlockCriteria: {
      minReps: 12,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 7,
    nameEn: "Korean Dips",
    name: "Dips coreens",
    slug: "korean-dips",
    description:
      "A behind-the-body dip variation that places significant demand on rear deltoids and shoulder extension.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 6,
    defaultHoldTime: null,
    restBetweenSets: 120,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.rear_deltoid,
      MuscleGroup.rhomboids,
      MuscleGroup.triceps,
    ],
    secondaryMuscles: [MuscleGroup.chest, MuscleGroup.anterior_deltoid],
    equipment: ["eq-parallels-low"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand with your back to the parallel bars and grip them behind you.",
      "Lift yourself up so your arms support your weight with the bar behind your body.",
      "Lower yourself by bending the elbows, allowing your body to move forward.",
      "Press back up by extending your arms while maintaining shoulder extension.",
      "Start with partial range of motion and increase depth over time.",
    ],
    cues: [
      "Keep your elbows pointing backwards, not outwards.",
      "Engage your rear delts and upper back throughout.",
      "Move slowly to maintain control in this unusual position.",
    ],
    commonMistakes: [
      "Insufficient shoulder flexibility leading to forced range of motion.",
      "Letting the shoulders roll forward during the dip.",
      "Using too much range of motion before building adequate strength.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 8,
    nameEn: "Ring Support Hold",
    name: "Maintien en appui aux anneaux",
    slug: "ring-support-hold",
    description:
      "An isometric hold at the top of a ring dip position, developing stabilizer strength necessary for ring dips.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 30,
    restBetweenSets: 90,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.serratus_anterior,
    ],
    secondaryMuscles: [MuscleGroup.chest],
    equipment: ["eq-rings"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Grip the gymnastic rings and jump or press into a support position with arms locked out.",
      "Turn the rings outward (RTO) so your palms face forward for maximum stability.",
      "Hold this position with your arms fully extended and shoulders depressed.",
      "Keep the rings as still as possible, engaging all stabilizer muscles.",
      "Aim to accumulate time gradually, starting from 10 seconds.",
    ],
    cues: [
      "Push the rings away from your body to stay stable.",
      "Lock your elbows and depress your shoulders.",
      "Breathe steadily and keep your core tight.",
    ],
    commonMistakes: [
      "Allowing the rings to wobble excessively without correcting.",
      "Shrugging the shoulders up instead of pressing them down.",
      "Bending the elbows and not maintaining a full lockout.",
    ],
    unlockCriteria: {
      minHoldTime: 60,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 9,
    nameEn: "Ring Dips",
    name: "Dips aux anneaux",
    slug: "ring-dips",
    description:
      "A challenging dip variation on gymnastic rings requiring significant stabilizer strength in addition to pushing power.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 120,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.chest,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-rings"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Start in a ring support hold with arms locked out and rings turned out.",
      "Slowly lower yourself by bending your elbows, keeping the rings close to your body.",
      "Descend until your shoulders are below your elbows or as deep as control allows.",
      "Press back up to full lockout while stabilizing the rings.",
      "Turn the rings out at the top of each rep for full activation.",
    ],
    cues: [
      "Keep the rings as close to your torso as possible.",
      "Focus on stabilizing before adding depth.",
      "Exhale forcefully as you press out of the bottom.",
    ],
    commonMistakes: [
      "Letting the rings flare out wide during the descent.",
      "Not achieving full lockout at the top.",
      "Descending too fast and losing stability.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 10,
    nameEn: "Weighted Ring Dips",
    name: "Dips aux anneaux lestes",
    slug: "weighted-ring-dips",
    description:
      "The pinnacle of the dip progression: ring dips with added weight for maximum strength and hypertrophy.",
    difficultyLevel: DifficultyLevel.elite,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 150,
    category: ExerciseCategory.push_vertical,
    subcategory: "dips",
    primaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.anterior_deltoid,
      MuscleGroup.chest,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior],
    equipment: ["eq-rings"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Attach a dip belt with weight or use a weighted vest.",
      "Start in a ring support hold with arms locked out.",
      "Lower yourself in a controlled manner to full depth.",
      "Press back up to lockout while managing the extra weight and ring instability.",
      "Start with light weight and increase gradually over weeks.",
    ],
    cues: [
      "Keep your body tight and minimize swinging from the added weight.",
      "Control the descent even more than bodyweight ring dips.",
      "Focus on form over ego; reduce weight if form breaks.",
    ],
    commonMistakes: [
      "Adding too much weight before mastering bodyweight ring dips.",
      "Losing ring stability due to excess load.",
      "Shortening the range of motion to compensate for the weight.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "excellent",
    },
  },
];

// ========================================
// SQUAT FAMILY EXERCISES
// ========================================

const squatExercises = [
  {
    level: 1,
    nameEn: "Assisted Squat",
    name: "Squat assiste",
    slug: "assisted-squat",
    description:
      "A wall or support-assisted squat to learn proper squat mechanics and build baseline leg strength.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
    ],
    secondaryMuscles: [MuscleGroup.calves, MuscleGroup.hip_adductors],
    equipment: ["eq-wall"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand facing a wall or sturdy support and hold it lightly for balance.",
      "Place your feet shoulder-width apart with toes slightly turned out.",
      "Lower your hips by bending your knees and pushing them out over your toes.",
      "Descend until your thighs are parallel to the floor or deeper if possible.",
      "Push through your heels to stand back up to the starting position.",
    ],
    cues: [
      "Keep your chest up and spine neutral throughout.",
      "Push your knees outward in line with your toes.",
      "Use the support as little as possible over time.",
    ],
    commonMistakes: [
      "Relying too much on the support rather than using leg muscles.",
      "Letting the knees cave inward during the descent.",
      "Rising onto the toes instead of pushing through the heels.",
    ],
    unlockCriteria: {
      minReps: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 2,
    nameEn: "Air Squat",
    name: "Squat au poids du corps",
    slug: "air-squat",
    description:
      "The fundamental bodyweight squat, building leg strength, mobility, and movement quality.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
    ],
    secondaryMuscles: [MuscleGroup.calves, MuscleGroup.hip_adductors],
    equipment: ["eq-floor"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand with feet shoulder-width apart and arms extended in front or at your sides.",
      "Initiate the squat by pushing your hips back and bending your knees.",
      "Lower until your thighs are at least parallel to the ground.",
      "Drive through your heels and midfoot to return to standing.",
      "Maintain an upright torso throughout the movement.",
    ],
    cues: [
      "Sit back as if sitting into a chair.",
      "Keep your weight distributed across your whole foot.",
      "Squeeze your glutes at the top of each rep.",
    ],
    commonMistakes: [
      "Rounding the lower back at the bottom of the squat.",
      "Not hitting adequate depth below parallel.",
      "Shifting weight too far forward onto the toes.",
    ],
    unlockCriteria: {
      minReps: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 3,
    nameEn: "Pause Squat",
    name: "Squat avec pause",
    slug: "pause-squat",
    description:
      "A squat with a deliberate pause at the bottom position, building strength and control in the weakest part of the movement.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
    ],
    secondaryMuscles: [MuscleGroup.calves, MuscleGroup.hip_adductors],
    equipment: ["eq-floor"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Perform a standard air squat, lowering to the bottom position.",
      "Hold the bottom position for 2-3 seconds without relaxing your muscles.",
      "Maintain tension throughout your legs and core during the pause.",
      "Drive explosively out of the bottom position to standing.",
      "Focus on maintaining perfect form during the pause.",
    ],
    cues: [
      "Stay tight at the bottom; do not relax and sink.",
      "Count a full 2-3 seconds before driving up.",
      "Keep your chest up during the entire pause.",
    ],
    commonMistakes: [
      "Relaxing muscle tension during the pause and losing posture.",
      "Not pausing long enough to eliminate the stretch reflex.",
      "Rounding the back as fatigue sets in during the hold.",
    ],
    unlockCriteria: {
      minReps: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 4,
    nameEn: "Jump Squat",
    name: "Squat saute",
    slug: "jump-squat",
    description:
      "An explosive squat variation that builds power and calf strength alongside standard squat muscles.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.calves,
    ],
    secondaryMuscles: [MuscleGroup.hamstrings, MuscleGroup.hip_adductors],
    equipment: ["eq-floor"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Start in a standard squat stance with feet shoulder-width apart.",
      "Lower into a squat position, loading your legs.",
      "Explode upward, jumping as high as you can off the ground.",
      "Land softly by bending your knees to absorb the impact.",
      "Immediately descend into the next squat to maintain flow.",
    ],
    cues: [
      "Land quietly; soft knees absorb the impact.",
      "Swing your arms for momentum on the jump.",
      "Keep your core engaged throughout the landing.",
    ],
    commonMistakes: [
      "Landing with stiff, locked-out knees creating joint stress.",
      "Not squatting deep enough before the jump.",
      "Landing with feet in a different position than the starting stance.",
    ],
    unlockCriteria: {
      minReps: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 5,
    nameEn: "Bulgarian Split Squat",
    name: "Squat bulgare",
    slug: "bulgarian-split-squat",
    description:
      "A single-leg dominant squat with the rear foot elevated on a box, developing unilateral leg strength and balance.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 8,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
    ],
    secondaryMuscles: [MuscleGroup.hip_adductors, MuscleGroup.calves],
    equipment: ["eq-box"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand about two feet in front of a box or bench.",
      "Place the top of your rear foot on the box behind you.",
      "Lower your body by bending the front knee until your thigh is parallel to the floor.",
      "Keep the front knee tracking over your toes and your torso upright.",
      "Push through the front heel to return to the starting position.",
    ],
    cues: [
      "Most of your weight should be on the front leg.",
      "Keep your front shin as vertical as possible.",
      "Engage your glutes to drive out of the bottom.",
    ],
    commonMistakes: [
      "Placing the front foot too close to the bench, restricting range of motion.",
      "Leaning the torso excessively forward.",
      "Letting the front knee collapse inward.",
    ],
    unlockCriteria: {
      minReps: 10,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 6,
    nameEn: "Shrimp Squat Assisted",
    name: "Squat crevette assiste",
    slug: "shrimp-squat-assisted",
    description:
      "An assisted version of the shrimp squat using a wall for balance, preparing for the full single-leg movement.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 6,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hip_flexors,
    ],
    secondaryMuscles: [MuscleGroup.hamstrings, MuscleGroup.calves],
    equipment: ["eq-wall"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand on one leg next to a wall and lightly touch the wall for balance.",
      "Bend the non-working leg behind you, holding your foot near your glute.",
      "Slowly lower yourself by bending the standing leg while keeping the rear knee tracking behind you.",
      "Lower until the rear knee lightly touches the ground or as deep as you can control.",
      "Push through the standing foot to return to the top position.",
    ],
    cues: [
      "Keep the rear knee pointing straight down, not flaring out.",
      "Use the wall only for balance, not to push yourself up.",
      "Maintain an upright posture throughout.",
    ],
    commonMistakes: [
      "Pulling too hard on the wall to assist the movement.",
      "Letting the standing knee cave inward.",
      "Not controlling the descent and dropping too fast.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 7,
    nameEn: "Single Leg Squat to Box",
    name: "Squat une jambe sur box",
    slug: "single-leg-squat-to-box",
    description:
      "A single-leg squat lowering to a box target, building strength and confidence for unsupported pistol squats.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 8,
    defaultHoldTime: null,
    restBetweenSets: 90,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
    ],
    secondaryMuscles: [MuscleGroup.hip_flexors, MuscleGroup.calves],
    equipment: ["eq-box"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand on one leg in front of a box or bench at about knee height.",
      "Extend the non-working leg in front of you.",
      "Slowly lower yourself by bending the standing leg until you sit on the box.",
      "Lightly tap the box without fully resting your weight on it.",
      "Push through the standing leg to return to the top position.",
    ],
    cues: [
      "Control the descent all the way to the box.",
      "Keep the extended leg off the ground the entire time.",
      "Drive through the heel of the working leg.",
    ],
    commonMistakes: [
      "Plopping down onto the box instead of controlling the descent.",
      "Placing the non-working foot on the ground for assistance.",
      "Rocking forward excessively to stand back up.",
    ],
    unlockCriteria: {
      minReps: 10,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 8,
    nameEn: "Shrimp Squat",
    name: "Squat crevette",
    slug: "shrimp-squat",
    description:
      "A full unsupported shrimp squat demanding significant single-leg strength, balance, and quad mobility.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 120,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hip_flexors,
    ],
    secondaryMuscles: [MuscleGroup.hamstrings, MuscleGroup.calves],
    equipment: ["eq-floor"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand on one leg and bend the other leg behind you, holding the foot near your glute.",
      "Extend your free arm forward for counterbalance.",
      "Lower yourself by bending the standing leg until the rear knee touches the ground.",
      "Maintain an upright torso throughout the descent.",
      "Push through the standing foot to return to standing without assistance.",
    ],
    cues: [
      "Think about sitting straight down, not forward.",
      "Keep your core braced for balance.",
      "Touch the rear knee lightly; do not rest on it.",
    ],
    commonMistakes: [
      "Falling forward because of insufficient quad strength.",
      "Using momentum or bouncing off the rear knee.",
      "Not achieving full depth to the ground.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 9,
    nameEn: "Assisted Pistol Squat",
    name: "Pistol squat assiste",
    slug: "assisted-pistol-squat",
    description:
      "A wall or support-assisted pistol squat for building the strength and mobility needed for the full movement.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 120,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
    ],
    secondaryMuscles: [MuscleGroup.hip_flexors, MuscleGroup.calves],
    equipment: ["eq-wall"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand on one leg next to a wall or door frame and hold it lightly for balance.",
      "Extend the non-working leg straight in front of you.",
      "Lower yourself slowly on the standing leg into a full deep squat.",
      "Keep the extended leg elevated and parallel to the ground at the bottom.",
      "Push through the standing leg to return to standing using minimal support.",
    ],
    cues: [
      "Use the wall only for balance, not as a crutch.",
      "Keep your heel planted on the ground throughout.",
      "Engage your hip flexors to keep the extended leg up.",
    ],
    commonMistakes: [
      "Leaning heavily on the support to pull yourself up.",
      "Letting the heel rise off the ground due to tight calves.",
      "Not extending the free leg fully, causing it to touch the floor.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 10,
    nameEn: "Pistol Squat",
    name: "Pistol squat",
    slug: "pistol-squat",
    description:
      "The full pistol squat: a demanding single-leg squat requiring exceptional strength, balance, and mobility.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 120,
    category: ExerciseCategory.legs,
    subcategory: "squats",
    primaryMuscles: [
      MuscleGroup.quadriceps,
      MuscleGroup.glutes,
      MuscleGroup.hamstrings,
      MuscleGroup.calves,
    ],
    secondaryMuscles: [MuscleGroup.hip_flexors, MuscleGroup.hip_adductors],
    equipment: ["eq-floor"],
    bandAssistance: false,
    bandResistance: false,
    instructions: [
      "Stand on one leg with arms extended forward for counterbalance.",
      "Extend the non-working leg straight in front of you.",
      "Lower yourself slowly by bending the standing leg into a full deep squat.",
      "At the bottom, your hamstring should touch your calf with the free leg elevated.",
      "Drive through the standing foot to rise back to the top without any assistance.",
    ],
    cues: [
      "Keep your weight centered over the middle of your foot.",
      "Use your arms as a counterbalance by reaching forward.",
      "Engage your hip flexors actively to keep the free leg elevated.",
    ],
    commonMistakes: [
      "Falling backward at the bottom due to poor ankle mobility.",
      "Allowing the free leg to drop and touch the floor.",
      "Rounding the lower back excessively at the bottom position.",
    ],
    unlockCriteria: {
      minReps: 5,
      minSets: 3,
      minFormQuality: "excellent",
    },
  },
];

// ========================================
// SEED FUNCTION
// ========================================

async function seedDipSquatFamilies() {
  console.log(
    "Seeding Dip Family and Squat Family progression families..."
  );

  try {
    // ---- DIP FAMILY ----
    console.log("\n--- Dip Family ---");
    const dipFamily = await prisma.progressionFamily.upsert({
      where: { slug: "dip-family" },
      update: {
        name: "Dip Family",
        description:
          "Progressive dip movements from bench dips to ring dips",
        category: ExerciseCategory.push_vertical,
      },
      create: {
        name: "Dip Family",
        slug: "dip-family",
        description:
          "Progressive dip movements from bench dips to ring dips",
        category: ExerciseCategory.push_vertical,
      },
    });
    console.log(`  ProgressionFamily: ${dipFamily.name} (${dipFamily.id})`);

    for (const ex of dipExercises) {
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
          defaultReps: ex.defaultReps,
          defaultHoldTime: ex.defaultHoldTime,
          restBetweenSets: ex.restBetweenSets,
          category: ex.category,
          subcategory: ex.subcategory,
          primaryMuscles: ex.primaryMuscles,
          secondaryMuscles: ex.secondaryMuscles,
          bandAssistance: ex.bandAssistance,
          bandResistance: ex.bandResistance,
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
          defaultReps: ex.defaultReps,
          defaultHoldTime: ex.defaultHoldTime,
          restBetweenSets: ex.restBetweenSets,
          category: ex.category,
          subcategory: ex.subcategory,
          primaryMuscles: ex.primaryMuscles,
          secondaryMuscles: ex.secondaryMuscles,
          bandAssistance: ex.bandAssistance,
          bandResistance: ex.bandResistance,
        },
      });
      console.log(`  Exercise L${ex.level}: ${ex.nameEn} (${exercise.id})`);

      // Upsert ProgressionLevel
      await prisma.progressionLevel.upsert({
        where: {
          familyId_level: { familyId: dipFamily.id, level: ex.level },
        },
        update: {
          exerciseId: exercise.id,
          unlockCriteria: ex.unlockCriteria,
        },
        create: {
          familyId: dipFamily.id,
          exerciseId: exercise.id,
          level: ex.level,
          unlockCriteria: ex.unlockCriteria,
        },
      });

      // Upsert ExerciseEquipment
      for (const eqId of ex.equipment) {
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

    // ---- SQUAT FAMILY ----
    console.log("\n--- Squat Family ---");
    const squatFamily = await prisma.progressionFamily.upsert({
      where: { slug: "squat-family" },
      update: {
        name: "Squat Family",
        description:
          "Progressive single-leg squat movements from assisted squats to pistol squats",
        category: ExerciseCategory.legs,
      },
      create: {
        name: "Squat Family",
        slug: "squat-family",
        description:
          "Progressive single-leg squat movements from assisted squats to pistol squats",
        category: ExerciseCategory.legs,
      },
    });
    console.log(
      `  ProgressionFamily: ${squatFamily.name} (${squatFamily.id})`
    );

    for (const ex of squatExercises) {
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
          defaultReps: ex.defaultReps,
          defaultHoldTime: ex.defaultHoldTime,
          restBetweenSets: ex.restBetweenSets,
          category: ex.category,
          subcategory: ex.subcategory,
          primaryMuscles: ex.primaryMuscles,
          secondaryMuscles: ex.secondaryMuscles,
          bandAssistance: ex.bandAssistance,
          bandResistance: ex.bandResistance,
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
          defaultReps: ex.defaultReps,
          defaultHoldTime: ex.defaultHoldTime,
          restBetweenSets: ex.restBetweenSets,
          category: ex.category,
          subcategory: ex.subcategory,
          primaryMuscles: ex.primaryMuscles,
          secondaryMuscles: ex.secondaryMuscles,
          bandAssistance: ex.bandAssistance,
          bandResistance: ex.bandResistance,
        },
      });
      console.log(`  Exercise L${ex.level}: ${ex.nameEn} (${exercise.id})`);

      // Upsert ProgressionLevel
      await prisma.progressionLevel.upsert({
        where: {
          familyId_level: { familyId: squatFamily.id, level: ex.level },
        },
        update: {
          exerciseId: exercise.id,
          unlockCriteria: ex.unlockCriteria,
        },
        create: {
          familyId: squatFamily.id,
          exerciseId: exercise.id,
          level: ex.level,
          unlockCriteria: ex.unlockCriteria,
        },
      });

      // Upsert ExerciseEquipment
      for (const eqId of ex.equipment) {
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

    console.log(`
Summary:
- Dip Family: 10 exercises (L1 Bench Dips -> L10 Weighted Ring Dips)
- Squat Family: 10 exercises (L1 Assisted Squat -> L10 Pistol Squat)
- Total: 20 exercises, 2 progression families, 20 progression levels
`);
  } catch (error) {
    console.error("Error seeding dip/squat families:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedDipSquatFamilies()
    .then(() => {
      console.log("Dip & Squat families seeded successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Dip & Squat seeding failed:", error);
      process.exit(1);
    });
}

export default seedDipSquatFamilies;
