import { ExerciseAttributeValueEnum, type Prisma } from "@prisma/client";

export interface ExerciseEquipmentSource {
  name?: string | null;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
}

export type InferredEquipmentRequirement =
  | "BENCH"
  | "STEP"
  | "BOX"
  | "DESK"
  | "BANDS"
  | "TRX"
  | "PULLUP_BAR";

function normalizeText(value: string | null | undefined): string {
  return value
    ?.replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase() ?? "";
}

const floorWorkPattern = new RegExp(
  "\\b(?:lie|lay|lying|seated|sit|kneel|kneeling|position yourself|start)\\b" +
    "[^.]{0,12}\\b(?:on|onto)\\s+(?:the floor|a mat|the ground|the carpet)\\b",
);

const benchByTextPattern = new RegExp(
  "\\b(?:on|onto|against|across|over|rest|support|chest against|lying|lie|lay|seated|sit|seat|kneel)\\b" +
    ".{0,40}\\b(?:a|an|the|your|this|that|my|flat|incline|decline|adjustable|preacher|utility|weight|exercise)?\\s*benches?\\b",
);

const optionalTowelPattern =
  /using your hands or a towel|with (?:your|the) hands or a towel|place a towel under|use a towel to (?:pad|cushion|wipe)/;

function hasBenchRequirement(name: string, instructions: string): boolean {
  const floorWork = floorWorkPattern;
  const chairMetaphor = /\bsit(?:ting)? back into a chair\b|\bas if (?:you were |you are )?sitting\b|\bas though sitting\b/;

  if (floorWork.test(instructions) || chairMetaphor.test(instructions)) return false;

  return (
    /\bbench\b/.test(name) ||
    /\b(?:flat|incline|decline|adjustable|preacher|utility|weight|exercise|upright)\s+benches?\b/.test(instructions) ||
    benchByTextPattern.test(instructions) ||
    /\bbench[- ](?:press|row|curl|bridge|dip|fly|pullover|extension|raise|crunch|hip thrust)\b/.test(instructions) ||
    /\b(?:on|onto|against)\b[^.]{0,20}\b(?:sturdy|stable|raised)?\s*(?:chair|bench)\b/.test(instructions)
  );
}

function hasStepRequirement(name: string, instructions: string): boolean {
  if (/\bstep\s+(?:forward|back|backward|aside|to the side|on the band|out to the)\b/.test(instructions)) {
    return false;
  }

  if (/\bstep[- ]?ups?\b/.test(name) || /\bstaircase\b/.test(instructions)) return true;

  const stepPattern = /\b(?:step|staircase|stair step)\b/g;
  let match: RegExpExecArray | null;
  while ((match = stepPattern.exec(instructions))) {
    const context = instructions.slice(Math.max(0, match.index - 35), match.index + match[0].length + 35);
    if (/\b(?:platform|box|raised|elevated|stair|aerobic|bench)\b/.test(context)) return true;
  }

  return false;
}

function hasBoxRequirement(name: string, instructions: string): boolean {
  return (
    /\b(?:box jump|box squat|box step|box dip|plyo box|plyometric box)\b/.test(name) ||
    /\b(?:plyo|jump|plyometric)\s*box\b/.test(instructions) ||
    /\b(?:on|onto)\s+(?:a|the|your)?\s*(?:plyo|jump|plyometric)?\s*box\b/.test(instructions)
  );
}

function hasDeskRequirement(instructions: string): boolean {
  return /\b(?:on|onto|against|under)\s+(?:a|an|the|your|sturdy|stable)?\s*(?:desk|table)\b/.test(instructions);
}

function hasTowelResistanceRequirement(name: string, instructions: string): boolean {
  if (optionalTowelPattern.test(instructions)) {
    return false;
  }

  return (
    /\btowel\b/.test(name) ||
    /\b(?:hold|grab|wrap|loop|clasp|grasp)\b.{0,15}\btowel\b/.test(instructions) ||
    /\b(?:pull|press)\s+the towel\b/.test(instructions) ||
    /\bresist (?:against|with) (?:the |a )?towel\b/.test(instructions) ||
    /\busing a towel\b/.test(instructions)
  );
}

function hasSuspensionRequirement(name: string, instructions: string): boolean {
  return /\b(?:trx|suspension trainer|suspension strap|suspension system|gymnastic rings?)\b/.test(`${name} ${instructions}`);
}

function hasPullUpBarRequirement(name: string, instructions: string): boolean {
  if (/\bbarbell\b/.test(name)) return false;

  return (
    /\b(?:pull|chin|muscle)[-\s]?ups?\b|\bfront lever\b|\bhanging\b/.test(name) ||
    /\b(?:pull|chin)[-\s]?up bar\b/.test(instructions) ||
    /\bhanging (?:from|on) (?:a |the )?bar\b/.test(instructions) ||
    /\bhang(?:ing)? from (?:a |the )?(?:pull|chin)[-\s]?up bar\b/.test(instructions) ||
    /\bgrab (?:a |the )?bar (?:overhead|above)\b/.test(instructions) ||
    /\bhang from (?:a |the )?bar\b/.test(instructions)
  );
}

export function inferAdditionalEquipmentRequirements(
  exercise: ExerciseEquipmentSource,
): InferredEquipmentRequirement[] {
  const name = normalizeText(exercise.nameEn || exercise.name);
  const localizedName = normalizeText(exercise.name);
  const instructions = [
    normalizeText(exercise.nameEn),
    normalizeText(exercise.descriptionEn),
    normalizeText(exercise.name),
    normalizeText(exercise.description),
  ].join(" ");

  const requirements: InferredEquipmentRequirement[] = [];
  const add = (requirement: InferredEquipmentRequirement) => {
    if (!requirements.includes(requirement)) requirements.push(requirement);
  };

  if (hasBenchRequirement(`${name} ${localizedName}`, instructions)) add(ExerciseAttributeValueEnum.BENCH);
  if (hasStepRequirement(name || localizedName, instructions)) add(ExerciseAttributeValueEnum.STEP);
  if (hasBoxRequirement(name || localizedName, instructions)) add(ExerciseAttributeValueEnum.BOX);
  if (hasDeskRequirement(instructions)) add(ExerciseAttributeValueEnum.DESK);
  if (hasTowelResistanceRequirement(name || localizedName, instructions)) add(ExerciseAttributeValueEnum.BANDS);
  if (hasSuspensionRequirement(name || localizedName, instructions)) add(ExerciseAttributeValueEnum.TRX);
  if (hasPullUpBarRequirement(name || localizedName, instructions)) add(ExerciseAttributeValueEnum.PULLUP_BAR);

  return requirements;
}

export function equipmentRequirementsAreSelected(
  selectedEquipment: readonly ExerciseAttributeValueEnum[],
  requiredEquipment: readonly ExerciseAttributeValueEnum[],
): boolean {
  const selected = new Set(selectedEquipment);
  const materialRequirements = requiredEquipment.filter((value) => value !== ExerciseAttributeValueEnum.BODY_ONLY);

  if (materialRequirements.some((requirement) => !selected.has(requirement))) return false;
  if (materialRequirements.length > 0) return true;

  return requiredEquipment.includes(ExerciseAttributeValueEnum.BODY_ONLY)
    ? selected.has(ExerciseAttributeValueEnum.BODY_ONLY)
    : true;
}

export function buildEquipmentRequirementsFilter(
  selectedEquipment: readonly ExerciseAttributeValueEnum[],
  equipmentAttributeNameId: string,
): Prisma.ExerciseWhereInput[] {
  if (selectedEquipment.length === 0) return [];

  const selectedMaterialEquipment = selectedEquipment.filter((value) => value !== ExerciseAttributeValueEnum.BODY_ONLY);

  if (selectedMaterialEquipment.length === 0) {
    return [
      {
        attributes: {
          some: {
            attributeNameId: equipmentAttributeNameId,
            attributeValue: { value: ExerciseAttributeValueEnum.BODY_ONLY },
          },
        },
      },
      {
        NOT: {
          attributes: {
            some: {
              attributeNameId: equipmentAttributeNameId,
              attributeValue: { value: { notIn: [ExerciseAttributeValueEnum.BODY_ONLY] } },
            },
          },
        },
      },
    ];
  }

  const acceptedValues = [...selectedEquipment, ExerciseAttributeValueEnum.BODY_ONLY];

  return [
    {
      NOT: {
        attributes: {
          some: {
            attributeNameId: equipmentAttributeNameId,
            attributeValue: { value: { notIn: acceptedValues } },
          },
        },
      },
    },
    {
      attributes: {
        some: {
          attributeNameId: equipmentAttributeNameId,
          attributeValue: { value: { in: selectedMaterialEquipment } },
        },
      },
    },
  ];
}
