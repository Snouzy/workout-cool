import { describe, expect, it } from "vitest";

import { bottomAdOffset, type FixedBox } from "./bottom-ad-offset";

const PHONE = { width: 390, height: 844 };

const anchor = (overrides: Partial<FixedBox> = {}): FixedBox => ({
  position: "fixed",
  hidden: false,
  width: 390,
  height: 124,
  bottom: 844,
  holdsAd: true,
  ...overrides,
});

describe("bottomAdOffset", () => {
  it("is zero when nothing is docked to the bottom", () => {
    expect(bottomAdOffset([], PHONE)).toBe(0);
  });

  it("is the height of the anchor ad docked to the bottom of the viewport", () => {
    expect(bottomAdOffset([anchor()], PHONE)).toBe(124);
    expect(bottomAdOffset([anchor({ height: 55.4 })], PHONE)).toBe(55);
  });

  it("ignores an anchor ad docked to the top", () => {
    expect(bottomAdOffset([anchor({ bottom: 124 })], PHONE)).toBe(0);
  });

  it("ignores a hidden anchor", () => {
    expect(bottomAdOffset([anchor({ hidden: true })], PHONE)).toBe(0);
  });

  it("ignores a floating video, which does not span the viewport", () => {
    expect(bottomAdOffset([anchor({ width: 200, height: 113, bottom: 720 })], PHONE)).toBe(0);
  });

  it("ignores an interstitial, which covers the whole screen", () => {
    expect(bottomAdOffset([anchor({ height: 844 })], PHONE)).toBe(0);
  });

  it("ignores the app\u0027s own fixed elements", () => {
    expect(bottomAdOffset([anchor({ holdsAd: false })], PHONE)).toBe(0);
    expect(bottomAdOffset([anchor({ position: "static" })], PHONE)).toBe(0);
  });

  it("keeps the tallest when several qualify", () => {
    expect(bottomAdOffset([anchor({ height: 60 }), anchor({ height: 110 })], PHONE)).toBe(110);
  });
});
