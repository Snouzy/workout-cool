#!/usr/bin/env ts-node
import {
  PrismaClient,
  ExerciseCategory,
  DifficultyLevel,
  MeasurementType,
  MuscleGroup,
} from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// L-SIT FAMILY EXERCISES
// ============================================================

const lSitExercises = [
  {
    level: 1,
    nameEn: "Lying Leg Raises",
    name: "Elevations de jambes allonge",
    slug: "lying-leg-raises",
    description:
      "Exercice de base pour renforcer les abdominaux et les flechisseurs de hanche en position allongee.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldTime: null,
    restBetweenSets: 60,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [MuscleGroup.rectus_abdominis, MuscleGroup.hip_flexors],
    secondaryMuscles: [MuscleGroup.obliques, MuscleGroup.quadriceps],
    equipment: ["eq-floor"],
    instructions: [
      "Allongez-vous sur le dos, jambes tendues, bras le long du corps.",
      "Contractez les abdominaux et soulevez les jambes jusqu'a la verticale.",
      "Redescendez lentement sans toucher le sol.",
      "Gardez le bas du dos plaque au sol tout au long du mouvement.",
    ],
    cues: [
      "Bas du dos colle au sol en permanence.",
      "Mouvement lent et controle, pas d'elan.",
      "Expirez en montant les jambes.",
    ],
    commonMistakes: [
      "Arquer le bas du dos en descendant les jambes.",
      "Utiliser l'elan pour soulever les jambes.",
      "Plier les genoux au lieu de garder les jambes tendues.",
    ],
    unlockCriteria: {
      minReps: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 2,
    nameEn: "Seated L-Sit Compression",
    name: "Compression L-Sit assis",
    slug: "seated-l-sit-compression",
    description:
      "Exercice de compression assis pour developper la force des flechisseurs de hanche necessaire au L-sit.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 60,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [MuscleGroup.hip_flexors, MuscleGroup.rectus_abdominis],
    secondaryMuscles: [MuscleGroup.quadriceps, MuscleGroup.obliques],
    equipment: ["eq-floor"],
    instructions: [
      "Asseyez-vous au sol, jambes tendues devant vous.",
      "Placez les mains au sol a cote des hanches.",
      "Contractez les flechisseurs de hanche pour soulever les jambes du sol.",
      "Maintenez la position le plus longtemps possible.",
    ],
    cues: [
      "Poussez fort dans le sol avec les mains.",
      "Gardez les jambes tendues et actives.",
      "Serrez les abdominaux tout au long de l'exercice.",
    ],
    commonMistakes: [
      "Plier les genoux pour faciliter le mouvement.",
      "Arrondir excessivement le dos.",
      "Ne pas engager suffisamment les flechisseurs de hanche.",
    ],
    unlockCriteria: {
      minHoldTime: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 3,
    nameEn: "Tuck L-Sit on Floor",
    name: "L-Sit groupe au sol",
    slug: "tuck-l-sit-floor",
    description:
      "L-sit en position groupee au sol, premiere etape vers le L-sit complet.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 60,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [
      MuscleGroup.hip_flexors,
      MuscleGroup.triceps,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior, MuscleGroup.obliques],
    equipment: ["eq-floor"],
    instructions: [
      "Asseyez-vous au sol, placez les mains a cote des hanches.",
      "Soulevez les fesses du sol en poussant dans les mains.",
      "Ramenez les genoux vers la poitrine en position groupee.",
      "Maintenez la position avec les pieds decolles du sol.",
    ],
    cues: [
      "Poussez les epaules vers le bas, loin des oreilles.",
      "Gardez les genoux serres contre la poitrine.",
      "Engagez les triceps pour rester stable.",
    ],
    commonMistakes: [
      "Ne pas soulever les fesses assez haut.",
      "Laisser les epaules monter vers les oreilles.",
      "Poser les pieds au sol entre les repetitions.",
    ],
    unlockCriteria: {
      minHoldTime: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 4,
    nameEn: "Tuck L-Sit on Parallels",
    name: "L-Sit groupe aux parallettes",
    slug: "tuck-l-sit-parallels",
    description:
      "L-sit groupe sur barres paralleles basses, permettant une plus grande amplitude de mouvement.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 90,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [
      MuscleGroup.hip_flexors,
      MuscleGroup.triceps,
      MuscleGroup.serratus_anterior,
    ],
    secondaryMuscles: [MuscleGroup.rectus_abdominis, MuscleGroup.obliques],
    equipment: ["eq-parallels-low"],
    instructions: [
      "Saisissez les barres paralleles basses, bras tendus.",
      "Soulevez-vous du sol en poussant dans les barres.",
      "Ramenez les genoux vers la poitrine en position groupee.",
      "Maintenez la position, corps suspendu entre les barres.",
    ],
    cues: [
      "Epaules basses et actives, loin des oreilles.",
      "Poussez fort dans les barres pour rester haut.",
      "Gardez les abdominaux engages en permanence.",
    ],
    commonMistakes: [
      "Laisser les epaules remonter vers les oreilles.",
      "Ne pas grouper suffisamment les genoux.",
      "Balancer le corps d'avant en arriere.",
    ],
    unlockCriteria: {
      minHoldTime: 30,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 5,
    nameEn: "Advanced Tuck L-Sit",
    name: "L-Sit groupe avance",
    slug: "advanced-tuck-l-sit",
    description:
      "L-sit groupe avance avec les genoux legerement eloignes de la poitrine pour augmenter la difficulte.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 90,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [
      MuscleGroup.hip_flexors,
      MuscleGroup.rectus_abdominis,
      MuscleGroup.triceps,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior, MuscleGroup.obliques],
    equipment: ["eq-parallels-low"],
    instructions: [
      "Prenez la position du L-sit groupe sur les parallettes.",
      "Eloignez progressivement les genoux de la poitrine.",
      "Les cuisses doivent etre paralleles au sol.",
      "Maintenez la position avec un gainage maximal.",
    ],
    cues: [
      "Cuisses paralleles au sol, tibias verticaux.",
      "Poussez dans les barres pour garder la hauteur.",
      "Contractez les abdominaux et les flechisseurs de hanche.",
    ],
    commonMistakes: [
      "Ramener les genoux trop pres de la poitrine.",
      "Perdre la hauteur en s'affaissant.",
      "Oublier de contracter les abdominaux.",
    ],
    unlockCriteria: {
      minHoldTime: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 6,
    nameEn: "Half L-Sit",
    name: "Demi L-Sit",
    slug: "half-l-sit",
    description:
      "Position intermediaire ou les jambes sont partiellement tendues, transition vers le L-sit complet.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 90,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [
      MuscleGroup.hip_flexors,
      MuscleGroup.rectus_abdominis,
      MuscleGroup.quadriceps,
    ],
    secondaryMuscles: [MuscleGroup.triceps, MuscleGroup.serratus_anterior],
    equipment: ["eq-parallels-low"],
    instructions: [
      "Depuis la position de L-sit groupe, etendez les jambes a mi-chemin.",
      "Les genoux restent legerement flechis.",
      "Maintenez les jambes a environ 45 degres.",
      "Gardez le buste droit et les epaules basses.",
    ],
    cues: [
      "Etendez les jambes progressivement sans perdre la hauteur.",
      "Engagez les quadriceps pour stabiliser les genoux.",
      "Respirez calmement et maintenez la contraction.",
    ],
    commonMistakes: [
      "Tendre completement les jambes trop tot.",
      "Laisser les jambes descendre sous l'horizontale.",
      "Arrondir le dos pour compenser le manque de force.",
    ],
    unlockCriteria: {
      minHoldTime: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 7,
    nameEn: "L-Sit Hold",
    name: "L-Sit complet",
    slug: "l-sit-hold",
    description:
      "Le L-sit complet avec les jambes tendues horizontalement, exercice fondamental de gymnastique.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 120,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [
      MuscleGroup.hip_flexors,
      MuscleGroup.rectus_abdominis,
      MuscleGroup.triceps,
      MuscleGroup.quadriceps,
    ],
    secondaryMuscles: [MuscleGroup.serratus_anterior, MuscleGroup.obliques],
    equipment: ["eq-parallels-low"],
    instructions: [
      "Saisissez les parallettes, bras tendus.",
      "Soulevez-vous et tendez les jambes devant vous.",
      "Les jambes doivent etre paralleles au sol, genoux verrouilles.",
      "Maintenez la position avec les orteils pointes.",
      "Gardez les epaules basses et le buste droit.",
    ],
    cues: [
      "Jambes tendues et paralleles au sol.",
      "Poussez fort dans les barres, epaules basses.",
      "Pointez les orteils et serrez les quadriceps.",
    ],
    commonMistakes: [
      "Plier les genoux legerement.",
      "Laisser les jambes descendre sous l'horizontale.",
      "Hausser les epaules vers les oreilles.",
    ],
    unlockCriteria: {
      minHoldTime: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 8,
    nameEn: "V-Sit",
    name: "V-Sit",
    slug: "v-sit",
    description:
      "Position avancee de L-sit avec les jambes levees au-dessus de l'horizontale, formant un V avec le corps.",
    difficultyLevel: DifficultyLevel.elite,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 5,
    restBetweenSets: 150,
    category: ExerciseCategory.core_anterior,
    subcategory: "core skill",
    primaryMuscles: [
      MuscleGroup.hip_flexors,
      MuscleGroup.rectus_abdominis,
      MuscleGroup.transverse_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.triceps,
      MuscleGroup.quadriceps,
      MuscleGroup.serratus_anterior,
    ],
    equipment: ["eq-parallels-low"],
    instructions: [
      "Depuis la position de L-sit, montez les jambes au-dessus de l'horizontale.",
      "Visez un angle de 45 degres ou plus au-dessus de l'horizontale.",
      "Le corps forme un V avec les jambes vers le haut.",
      "Maintenez la compression maximale des flechisseurs de hanche.",
    ],
    cues: [
      "Comprimez fort les flechisseurs de hanche.",
      "Gardez les jambes tendues et les orteils pointes.",
      "Poussez les epaules vers le bas pour gagner de la hauteur.",
    ],
    commonMistakes: [
      "Ne pas monter les jambes assez haut au-dessus de l'horizontale.",
      "Perdre la tension dans les abdominaux profonds.",
      "S'affaisser dans les epaules sous l'effort.",
    ],
    unlockCriteria: {
      minHoldTime: 10,
      minSets: 3,
      minFormQuality: "excellent",
    },
  },
];

// ============================================================
// FRONT LEVER FAMILY EXERCISES
// ============================================================

const frontLeverExercises = [
  {
    level: 1,
    nameEn: "Dead Hang (FL)",
    name: "Suspension passive (FL)",
    slug: "dead-hang-fl",
    description:
      "Suspension passive a la barre pour developper la force de prehension et la stabilite des epaules.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 30,
    restBetweenSets: 90,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.biceps,
      MuscleGroup.forearms,
    ],
    secondaryMuscles: [MuscleGroup.rhomboids, MuscleGroup.rear_deltoid],
    equipment: ["eq-bar-high"],
    instructions: [
      "Saisissez la barre en pronation, mains a largeur d'epaules.",
      "Laissez-vous pendre bras tendus, pieds decolles du sol.",
      "Engagez legerement les epaules en les tirant vers le bas.",
      "Maintenez la position le plus longtemps possible.",
    ],
    cues: [
      "Epaules actives, tirees vers le bas et l'arriere.",
      "Prise ferme, poignets neutres.",
      "Corps aligne et detendu, sans balancement.",
    ],
    commonMistakes: [
      "Laisser les epaules remonter passivement vers les oreilles.",
      "Se balancer d'avant en arriere.",
      "Plier les bras au lieu de rester en extension complete.",
    ],
    unlockCriteria: {
      minHoldTime: 60,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 2,
    nameEn: "Tuck Front Lever Hold",
    name: "Front lever groupe",
    slug: "tuck-front-lever-hold",
    description:
      "Front lever en position groupee, premiere etape de la progression vers le front lever complet.",
    difficultyLevel: DifficultyLevel.beginner,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 120,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.rear_deltoid,
      MuscleGroup.transverse_abdominis,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Suspendez-vous a la barre, bras tendus.",
      "Ramenez les genoux vers la poitrine en position groupee.",
      "Tirez les epaules vers l'arriere et le bas pour amener le dos a l'horizontale.",
      "Maintenez le corps horizontal avec les genoux groupes.",
    ],
    cues: [
      "Tirez la barre vers les hanches, pas vers la poitrine.",
      "Dos parallele au sol, regard vers le plafond.",
      "Serrez les genoux contre la poitrine.",
    ],
    commonMistakes: [
      "Ne pas atteindre l'horizontale avec le dos.",
      "Oublier de retracter les omoplates.",
      "Laisser les hanches tomber sous le niveau du dos.",
    ],
    unlockCriteria: {
      minHoldTime: 20,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 3,
    nameEn: "Advanced Tuck Front Lever",
    name: "Front lever groupe avance",
    slug: "advanced-tuck-front-lever",
    description:
      "Front lever groupe avance avec les cuisses eloignees de la poitrine pour augmenter le bras de levier.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 10,
    restBetweenSets: 120,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.rear_deltoid,
      MuscleGroup.transverse_abdominis,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Depuis la position de front lever groupe, eloignez les genoux de la poitrine.",
      "Les cuisses doivent etre perpendiculaires au buste.",
      "Maintenez le dos parallele au sol.",
      "Gardez les omoplates retractees et les bras tendus.",
    ],
    cues: [
      "Dos plat et parallele au sol.",
      "Tirez fort avec les dorsaux.",
      "Cuisses a 90 degres par rapport au buste.",
    ],
    commonMistakes: [
      "Laisser les hanches descendre.",
      "Ne pas engager suffisamment les dorsaux.",
      "Plier les bras pour compenser.",
    ],
    unlockCriteria: {
      minHoldTime: 15,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 4,
    nameEn: "One-Leg Front Lever",
    name: "Front lever une jambe",
    slug: "one-leg-front-lever",
    description:
      "Front lever avec une jambe tendue et l'autre groupee pour une transition progressive.",
    difficultyLevel: DifficultyLevel.intermediate,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 5,
    restBetweenSets: 120,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.obliques,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.rectus_abdominis,
      MuscleGroup.rear_deltoid,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Depuis la position de front lever groupe avance, tendez une jambe.",
      "L'autre jambe reste groupee contre la poitrine.",
      "Maintenez le dos parallele au sol.",
      "Alternez les jambes entre les series.",
    ],
    cues: [
      "Jambe tendue dans l'alignement du corps.",
      "Gardez les hanches a niveau, sans rotation.",
      "Engagez les obliques pour la stabilite.",
    ],
    commonMistakes: [
      "Laisser la hanche du cote de la jambe tendue descendre.",
      "Tourner le bassin au lieu de rester droit.",
      "Ne pas tendre completement la jambe.",
    ],
    unlockCriteria: {
      minHoldTime: 10,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 5,
    nameEn: "Straddle Front Lever",
    name: "Front lever ecarte",
    slug: "straddle-front-lever",
    description:
      "Front lever en position ecartee, reduisant le bras de levier par rapport au front lever complet.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 5,
    restBetweenSets: 150,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.hip_adductors,
      MuscleGroup.transverse_abdominis,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Suspendez-vous a la barre et amenez le corps a l'horizontale.",
      "Ecartez les jambes en straddle, pointes de pieds actives.",
      "Maintenez le dos parallele au sol.",
      "Gardez les bras tendus et les omoplates retractees.",
    ],
    cues: [
      "Corps plat de la tete aux pieds.",
      "Jambes ecartees mais actives et tendues.",
      "Tirez la barre vers les hanches avec les dorsaux.",
    ],
    commonMistakes: [
      "Ne pas ecarter suffisamment les jambes.",
      "Laisser les hanches descendre sous le niveau des epaules.",
      "Relacher la tension dans les dorsaux.",
    ],
    unlockCriteria: {
      minHoldTime: 10,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 6,
    nameEn: "Front Lever Negative",
    name: "Front lever negatif",
    slug: "front-lever-negative",
    description:
      "Descente controlee depuis la position de front lever pour developper la force excentrique.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 150,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.transverse_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.rectus_abdominis,
      MuscleGroup.rear_deltoid,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Commencez en position inversee, pieds vers le plafond.",
      "Descendez lentement le corps vers l'horizontale en gardant les bras tendus.",
      "Controlez la descente sur 3 a 5 secondes.",
      "Une fois a l'horizontale, maintenez brievement puis revenez en position inversee.",
    ],
    cues: [
      "Descente lente et controlee, jamais en chute libre.",
      "Gardez les bras tendus tout au long du mouvement.",
      "Engagez les dorsaux et les abdominaux en permanence.",
    ],
    commonMistakes: [
      "Descendre trop vite sans controle.",
      "Plier les bras pendant la descente.",
      "Ne pas atteindre la position horizontale complete.",
    ],
    unlockCriteria: {
      minReps: 8,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 7,
    nameEn: "Front Lever Hold",
    name: "Front lever complet",
    slug: "front-lever-hold",
    description:
      "Le front lever complet, position horizontale avec le corps entierement tendu suspendu a la barre.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.time,
    defaultSets: 3,
    defaultReps: null,
    defaultHoldTime: 3,
    restBetweenSets: 180,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.transverse_abdominis,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.rear_deltoid,
      MuscleGroup.glutes,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Suspendez-vous a la barre, bras tendus.",
      "Amenez le corps entier a l'horizontale, jambes jointes et tendues.",
      "Le corps doit former une ligne droite de la tete aux pieds.",
      "Maintenez la position avec une tension maximale dans tout le corps.",
      "Gardez les omoplates retractees et deprimees.",
    ],
    cues: [
      "Ligne droite parfaite de la tete aux orteils.",
      "Tirez la barre vers les hanches, pas vers vous.",
      "Serrez les fessiers et pointez les orteils.",
    ],
    commonMistakes: [
      "Laisser les hanches descendre, creant un arc dans le corps.",
      "Plier les bras pour faciliter la position.",
      "Ne pas engager les fessiers et les abdominaux profonds.",
    ],
    unlockCriteria: {
      minHoldTime: 5,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 8,
    nameEn: "Front Lever Raises",
    name: "Elevations en front lever",
    slug: "front-lever-raises",
    description:
      "Mouvement dynamique de montee en front lever depuis la position suspendue.",
    difficultyLevel: DifficultyLevel.advanced,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 5,
    defaultHoldTime: null,
    restBetweenSets: 180,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.rhomboids,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.biceps,
      MuscleGroup.transverse_abdominis,
      MuscleGroup.rear_deltoid,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Suspendez-vous a la barre, bras tendus.",
      "En gardant les bras et les jambes tendus, montez le corps a l'horizontale.",
      "Maintenez brievement la position de front lever en haut.",
      "Redescendez de maniere controlee a la position suspendue.",
    ],
    cues: [
      "Mouvement initie par les dorsaux, pas par les bras.",
      "Gardez le corps rigide comme une planche.",
      "Controlez autant la montee que la descente.",
    ],
    commonMistakes: [
      "Utiliser l'elan pour monter.",
      "Plier les genoux pendant le mouvement.",
      "Ne pas atteindre l'horizontale complete en haut.",
    ],
    unlockCriteria: {
      minReps: 5,
      minSets: 3,
      minFormQuality: "good",
    },
  },
  {
    level: 9,
    nameEn: "Front Lever Pulls",
    name: "Tirages en front lever",
    slug: "front-lever-pulls",
    description:
      "Tirages horizontaux depuis la position de front lever, exercice de force supreme.",
    difficultyLevel: DifficultyLevel.elite,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 3,
    defaultHoldTime: null,
    restBetweenSets: 180,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.biceps,
      MuscleGroup.rhomboids,
      MuscleGroup.rectus_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.transverse_abdominis,
      MuscleGroup.rear_deltoid,
      MuscleGroup.brachialis,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Adoptez la position de front lever, corps horizontal.",
      "Tirez la barre vers les hanches en pliant les bras.",
      "Maintenez le corps horizontal tout au long du mouvement.",
      "Revenez bras tendus de maniere controlee.",
    ],
    cues: [
      "Corps horizontal en permanence, pas de balancement.",
      "Tirez la barre vers les hanches, pas vers la poitrine.",
      "Serrez les omoplates en haut du mouvement.",
    ],
    commonMistakes: [
      "Laisser les hanches descendre pendant le tirage.",
      "Tirer vers la poitrine au lieu des hanches.",
      "Perdre l'horizontalite du corps.",
    ],
    unlockCriteria: {
      minReps: 5,
      minSets: 3,
      minFormQuality: "excellent",
    },
  },
  {
    level: 10,
    nameEn: "Front Lever Pull-Ups",
    name: "Tractions en front lever",
    slug: "front-lever-pull-ups",
    description:
      "Tractions completes en maintenant la position de front lever, le summum de la force de tirage horizontale.",
    difficultyLevel: DifficultyLevel.elite,
    measurementType: MeasurementType.reps,
    defaultSets: 3,
    defaultReps: 3,
    defaultHoldTime: null,
    restBetweenSets: 180,
    category: ExerciseCategory.pull_horizontal,
    subcategory: "horizontal pulling",
    primaryMuscles: [
      MuscleGroup.latissimus_dorsi,
      MuscleGroup.biceps,
      MuscleGroup.rhomboids,
      MuscleGroup.transverse_abdominis,
    ],
    secondaryMuscles: [
      MuscleGroup.rectus_abdominis,
      MuscleGroup.rear_deltoid,
      MuscleGroup.brachialis,
    ],
    equipment: ["eq-bar-high"],
    instructions: [
      "Adoptez la position de front lever complet.",
      "Effectuez une traction complete en tirant la barre vers le corps.",
      "Gardez le corps parfaitement horizontal pendant toute la traction.",
      "Revenez a la position bras tendus de maniere controlee.",
      "Chaque repetition doit avoir une amplitude complete.",
    ],
    cues: [
      "Amplitude complete a chaque repetition.",
      "Corps rigide et horizontal en permanence.",
      "Engagez tout le corps : dorsaux, abdos, fessiers.",
    ],
    commonMistakes: [
      "Perdre l'horizontalite pendant la traction.",
      "Reduire l'amplitude pour faciliter le mouvement.",
      "Utiliser l'elan au lieu de la force pure.",
    ],
    unlockCriteria: {
      minReps: 3,
      minSets: 3,
      minFormQuality: "excellent",
    },
  },
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seedLSitFrontLeverFamilies() {
  console.log(
    "Seeding L-Sit and Front Lever progression families..."
  );

  try {
    // ---- L-SIT FAMILY ----
    console.log("\n--- L-Sit Family ---");
    const lSitFamily = await prisma.progressionFamily.upsert({
      where: { slug: "l-sit-family" },
      update: {
        name: "L-Sit Family",
        description:
          "Progressive L-sit movements building hip flexor and core strength",
        category: ExerciseCategory.core_anterior,
      },
      create: {
        name: "L-Sit Family",
        slug: "l-sit-family",
        description:
          "Progressive L-sit movements building hip flexor and core strength",
        category: ExerciseCategory.core_anterior,
      },
    });
    console.log(`  Family: ${lSitFamily.name} (${lSitFamily.id})`);

    for (const ex of lSitExercises) {
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
        },
      });
      console.log(`  Exercise L${ex.level}: ${ex.nameEn} (${exercise.id})`);

      // ProgressionLevel
      await prisma.progressionLevel.upsert({
        where: {
          familyId_level: {
            familyId: lSitFamily.id,
            level: ex.level,
          },
        },
        update: {
          exerciseId: exercise.id,
          unlockCriteria: ex.unlockCriteria,
        },
        create: {
          familyId: lSitFamily.id,
          exerciseId: exercise.id,
          level: ex.level,
          unlockCriteria: ex.unlockCriteria,
        },
      });

      // ExerciseEquipment
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

    // ---- FRONT LEVER FAMILY ----
    console.log("\n--- Front Lever Family ---");
    const flFamily = await prisma.progressionFamily.upsert({
      where: { slug: "front-lever-family" },
      update: {
        name: "Front Lever Family",
        description:
          "Progressive front lever movements building incredible pulling and core strength",
        category: ExerciseCategory.pull_horizontal,
      },
      create: {
        name: "Front Lever Family",
        slug: "front-lever-family",
        description:
          "Progressive front lever movements building incredible pulling and core strength",
        category: ExerciseCategory.pull_horizontal,
      },
    });
    console.log(`  Family: ${flFamily.name} (${flFamily.id})`);

    for (const ex of frontLeverExercises) {
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
        },
      });
      console.log(`  Exercise L${ex.level}: ${ex.nameEn} (${exercise.id})`);

      // ProgressionLevel
      await prisma.progressionLevel.upsert({
        where: {
          familyId_level: {
            familyId: flFamily.id,
            level: ex.level,
          },
        },
        update: {
          exerciseId: exercise.id,
          unlockCriteria: ex.unlockCriteria,
        },
        create: {
          familyId: flFamily.id,
          exerciseId: exercise.id,
          level: ex.level,
          unlockCriteria: ex.unlockCriteria,
        },
      });

      // ExerciseEquipment
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
- L-Sit Family: ${lSitExercises.length} exercises (levels 1-${lSitExercises.length})
- Front Lever Family: ${frontLeverExercises.length} exercises (levels 1-${frontLeverExercises.length})
- Total exercises seeded: ${lSitExercises.length + frontLeverExercises.length}
    `);
  } catch (error) {
    console.error("Error seeding L-Sit / Front Lever families:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedLSitFrontLeverFamilies()
    .then(() => {
      console.log(
        "L-Sit and Front Lever families seeded successfully!\n"
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export default seedLSitFrontLeverFamilies;
