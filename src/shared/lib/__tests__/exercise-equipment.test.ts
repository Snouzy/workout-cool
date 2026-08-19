import { describe, expect, it } from "vitest";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import {
  equipmentRequirementsAreSelected,
  inferAdditionalEquipmentRequirements,
} from "../exercise-equipment";

describe("inferAdditionalEquipmentRequirements", () => {
  it("requires a bench for a dumbbell bench press", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "dumbbell bench press",
        descriptionEn: "Lie on a flat bench and press the dumbbells overhead.",
      }),
    ).toEqual([ExerciseAttributeValueEnum.BENCH]);
  });

  it("does not turn a forward stepping cue into step equipment", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "forward lunge",
        descriptionEn: "Step forward with your right foot and lower your hips.",
      }),
    ).toEqual([]);
  });

  it("treats towel resistance as band equipment", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "standing one arm row",
        descriptionEn: "Hold a towel and pull it tightly with your other hand.",
      }),
    ).toEqual([ExerciseAttributeValueEnum.BANDS]);
  });

  it("requires a pull-up bar for hanging and front lever work", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "front lever",
        descriptionEn: "Start hanging from a bar and raise your body to horizontal.",
      }),
    ).toEqual([ExerciseAttributeValueEnum.PULLUP_BAR]);
  });

  it("keeps pure floor movements bodyweight-only", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "glute bridge",
        descriptionEn: "Lie on the floor with your knees bent and lift your hips.",
      }),
    ).toEqual([]);
  });

  it("does not infer a pull-up bar from limbs hanging toward the floor", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "dumbbell lying one arm rear lateral raise",
        descriptionEn:
          "Lie face down on a flat bench with a dumbbell in one hand, hanging towards the floor.",
      }),
    ).toEqual([ExerciseAttributeValueEnum.BENCH]);
  });

  it("does not infer a pull-up bar when wrists hang off a bench edge", () => {
    expect(
      inferAdditionalEquipmentRequirements({
        nameEn: "cable wrist curl",
        descriptionEn: "Rest your forearms on a bench, with your wrists hanging off the edge.",
      }),
    ).toEqual([ExerciseAttributeValueEnum.BENCH]);
  });
});

describe("equipmentRequirementsAreSelected", () => {
  it("requires every tag in a multiple-equipment exercise such as dumbbell and bench", () => {
    expect(
      equipmentRequirementsAreSelected(
        [ExerciseAttributeValueEnum.DUMBBELL, ExerciseAttributeValueEnum.BENCH],
        [ExerciseAttributeValueEnum.DUMBBELL, ExerciseAttributeValueEnum.BENCH],
      ),
    ).toBe(true);
    expect(
      equipmentRequirementsAreSelected(
        [ExerciseAttributeValueEnum.DUMBBELL],
        [ExerciseAttributeValueEnum.DUMBBELL, ExerciseAttributeValueEnum.BENCH],
      ),
    ).toBe(false);
  });

  it("ignores stale body-only tags on material-equipment exercises", () => {
    expect(
      equipmentRequirementsAreSelected(
        [ExerciseAttributeValueEnum.DUMBBELL, ExerciseAttributeValueEnum.BENCH],
        [ExerciseAttributeValueEnum.DUMBBELL, ExerciseAttributeValueEnum.BENCH, ExerciseAttributeValueEnum.BODY_ONLY],
      ),
    ).toBe(true);
  });

  it("keeps pure bodyweight exercises tied to body-only selection", () => {
    expect(
      equipmentRequirementsAreSelected(
        [ExerciseAttributeValueEnum.BODY_ONLY],
        [ExerciseAttributeValueEnum.BODY_ONLY],
      ),
    ).toBe(true);
    expect(
      equipmentRequirementsAreSelected(
        [ExerciseAttributeValueEnum.DUMBBELL],
        [ExerciseAttributeValueEnum.BODY_ONLY],
      ),
    ).toBe(false);
  });
});
