/**
 * import-exercise-attribute-values.ts
 *
 * Normalizes raw CSV attribute values into valid ExerciseAttributeValueEnum
 * strings.  Import this module from the exercise import scripts to keep
 * normalization logic in one place.
 *
 * Usage:
 *   import { normalizeExerciseAttributeValue } from "./import-exercise-attribute-values";
 *   const value = normalizeExerciseAttributeValue("EQUIPMENT", "BODYWEIGHT"); // "BODY_ONLY"
 */

import { ExerciseAttributeValueEnum } from "@prisma/client";

/** Values that mean "not applicable / unknown" in a CSV. */
const NA_LIKE = new Set(["N/A", "NA", "NONE", "NULL", ""]);

/**
 * Per-attribute alias map.
 * Keys are the normalised (trimmed + uppercased) CSV value.
 * Values are the canonical ExerciseAttributeValueEnum string.
 */
const ALIASES: Record<string, Record<string, string>> = {
  PRIMARY_MUSCLE: {
    CORE: "ABDOMINALS",
  },
  SECONDARY_MUSCLE: {
    CORE: "ABDOMINALS",
  },
  EQUIPMENT: {
    BODYWEIGHT: "BODY_ONLY",
    RESISTANCE_BAND: "BANDS",
  },
  TYPE: {
    FLEXIBILITY: "STRETCHING",
  },
};

/** All valid enum values as a Set for O(1) lookup. */
const VALID_VALUES = new Set<string>(Object.values(ExerciseAttributeValueEnum) as string[]);

/**
 * A short list of canonical examples shown in error messages so contributors
 * can quickly pick a supported value.
 */
const ATTRIBUTE_EXAMPLES: Record<string, string> = {
  PRIMARY_MUSCLE: "ABDOMINALS, BICEPS, CHEST, QUADRICEPS, GLUTES",
  SECONDARY_MUSCLE: "ABDOMINALS, TRICEPS, HAMSTRINGS, LATS",
  EQUIPMENT: "BODY_ONLY, BARBELL, DUMBBELL, BANDS, MACHINE, CABLE",
  TYPE: "STRENGTH, CARDIO, STRETCHING, PLYOMETRICS, POWERLIFTING",
  MECHANICS_TYPE: "COMPOUND, ISOLATION",
};

/**
 * Normalises a raw CSV attribute value for the given attribute name.
 *
 * Steps:
 *  1. Trim whitespace and uppercase.
 *  2. If the result is N/A-like (N/A, NA, NONE, NULL, empty) return "NA".
 *  3. Apply attribute-aware aliases (e.g. CORE -> ABDOMINALS for muscles).
 *  4. Accept any value that is already a valid ExerciseAttributeValueEnum.
 *  5. Otherwise throw a descriptive Error.
 *
 * @param attributeName - e.g. "PRIMARY_MUSCLE", "EQUIPMENT", "TYPE"
 * @param value         - raw string from the CSV cell
 * @returns A string that is a valid ExerciseAttributeValueEnum member
 * @throws Error when the value cannot be mapped to a valid enum member
 */
export function normalizeExerciseAttributeValue(
  attributeName: string,
  value: string,
): string {
  const normalised = value.trim().toUpperCase();

  // Step 1: N/A-like values
  if (NA_LIKE.has(normalised)) {
    return "NA" as ExerciseAttributeValueEnum;
  }

  // Step 2: attribute-aware alias lookup
  const attrAliases = ALIASES[attributeName.trim().toUpperCase()] ?? {};
  const aliased = attrAliases[normalised];
  if (aliased !== undefined) {
    return aliased as ExerciseAttributeValueEnum;
  }

  // Step 3: already a valid enum value
  if (VALID_VALUES.has(normalised)) {
    return normalised as ExerciseAttributeValueEnum;
  }

  // Step 4: nothing matched - emit a helpful error
  const examples = ATTRIBUTE_EXAMPLES[attributeName.toUpperCase()];
  const hint = examples
    ? `  Accepted examples for ${attributeName}: ${examples}.`
    : "  Check the ExerciseAttributeValueEnum in prisma/schema.prisma for valid values.";

  // Also mention known aliases for this attribute
  const knownAliases = Object.entries(attrAliases);
  const aliasHint =
    knownAliases.length > 0
      ? `\n  Accepted aliases for ${attributeName}: ${knownAliases.map(([k, v]) => `${k} -> ${v}`).join(", ")}.`
      : "";

  throw new Error(
    `[import-exercises] Unknown value "${normalised}" for attribute "${attributeName}".\n` +
      hint +
      aliasHint +
      "\n  N/A-like values (N/A, NA, NONE, NULL, empty string) are mapped to NA automatically.",
  );
}
