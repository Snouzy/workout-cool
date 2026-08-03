/**
 * Tests for normalizeExerciseAttributeValue.
 *
 * Run with:
 *   pnpm exec tsx scripts/import-exercise-attribute-values.test.ts
 */

import assert from "node:assert/strict";

import { normalizeExerciseAttributeValue } from "./import-exercise-attribute-values";

// -- PRIMARY_MUSCLE -----------------------------------------------------------

assert.equal(
  normalizeExerciseAttributeValue("PRIMARY_MUSCLE", "CORE"),
  "ABDOMINALS",
  "PRIMARY_MUSCLE CORE -> ABDOMINALS"
);

// -- SECONDARY_MUSCLE (lowercase input) ---------------------------------------

assert.equal(
  normalizeExerciseAttributeValue("SECONDARY_MUSCLE", "core"),
  "ABDOMINALS",
  "SECONDARY_MUSCLE core -> ABDOMINALS"
);

// -- EQUIPMENT ----------------------------------------------------------------

assert.equal(
  normalizeExerciseAttributeValue("EQUIPMENT", "BODYWEIGHT"),
  "BODY_ONLY",
  "EQUIPMENT BODYWEIGHT -> BODY_ONLY"
);

assert.equal(
  normalizeExerciseAttributeValue("EQUIPMENT", "RESISTANCE_BAND"),
  "BANDS",
  "EQUIPMENT RESISTANCE_BAND -> BANDS"
);

// -- TYPE ---------------------------------------------------------------------

assert.equal(
  normalizeExerciseAttributeValue("TYPE", "FLEXIBILITY"),
  "STRETCHING",
  "TYPE FLEXIBILITY -> STRETCHING"
);

// -- N/A-like values ----------------------------------------------------------

for (const naLike of ["N/A", "n/a", "NA", "na", "", "none", "None", "NONE"]) {
  assert.equal(
    normalizeExerciseAttributeValue("PRIMARY_MUSCLE", naLike),
    "NA",
    `N/A-like value "${naLike}" -> NA`
  );
}

// -- Unknown values must throw ------------------------------------------------

assert.throws(
  () => normalizeExerciseAttributeValue("EQUIPMENT", "MAGIC_CARPET"),
  (err: unknown) => {
    assert(err instanceof Error, "should throw an Error");
    assert(
      err.message.includes("EQUIPMENT"),
      `error message should include attribute name "EQUIPMENT", got: ${err.message}`
    );
    assert(
      err.message.includes("MAGIC_CARPET"),
      `error message should include bad value "MAGIC_CARPET", got: ${err.message}`
    );
    return true;
  },
  "unknown EQUIPMENT value should throw with attribute name and bad value"
);

assert.throws(
  () => normalizeExerciseAttributeValue("TYPE", "DANCE_PARTY"),
  (err: unknown) => {
    assert(err instanceof Error, "should throw an Error");
    assert(err.message.includes("TYPE"), `error should mention "TYPE", got: ${err.message}`);
    assert(err.message.includes("DANCE_PARTY"), `error should mention "DANCE_PARTY", got: ${err.message}`);
    return true;
  },
  "unknown TYPE value should throw with attribute name and bad value"
);

console.log("All assertions passed.");
