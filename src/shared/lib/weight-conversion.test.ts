import {
  convertWeight,
  formatWeight,
  convertVolumeToUnit,
} from "./weight-conversion";

describe("convertWeight", () => {
  it("converts lbs to kg", () => {
    expect(
      convertWeight(100, "lbs", "kg")
    ).toBeCloseTo(45.3592);
  });

  it("converts kg to lbs", () => {
    expect(
      convertWeight(100, "kg", "lbs")
    ).toBeCloseTo(220.462);
  });

  it("returns same value when units are equal", () => {
    expect(
      convertWeight(50, "kg", "kg")
    ).toBe(50);
  });
});

describe("formatWeight", () => {
  it("formats weight with default decimals", () => {
    expect(
      formatWeight(80.567, "kg")
    ).toBe("80.6 kg");
  });

  it("formats weight with custom decimals", () => {
    expect(
      formatWeight(80.567, "kg", 2)
    ).toBe("80.57 kg");
  });
});

describe("convertVolumeToUnit", () => {
  it("calculates volume in kg", () => {
    const exercises = [
      {
        sets: [
          {
            completed: true,
            types: ["REPS", "WEIGHT"],
            valuesInt: [10, 50],
            units: ["", "kg"],
          },
        ],
      },
    ];

    expect(
      convertVolumeToUnit(exercises, "kg")
    ).toBe(500);
  });

  it("ignores incomplete sets", () => {
    const exercises = [
      {
        sets: [
          {
            completed: false,
            types: ["REPS", "WEIGHT"],
            valuesInt: [10, 50],
            units: ["", "kg"],
          },
        ],
      },
    ];

    expect(
      convertVolumeToUnit(exercises, "kg")
    ).toBe(0);
  });

  it("converts lbs volume to kg", () => {
    const exercises = [
      {
        sets: [
          {
            completed: true,
            types: ["REPS", "WEIGHT"],
            valuesInt: [10, 100],
            units: ["", "lbs"],
          },
        ],
      },
    ];

    expect(
      convertVolumeToUnit(exercises, "kg")
    ).toBeCloseTo(453.6);
  });
});