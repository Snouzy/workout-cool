import { describe, expect, it } from "vitest";

import { adOverlayPolicyKey, getAdOverlayPolicy, parseAdOverlayPolicyKey, removesAnOverlay } from "./overlay-policy";

const PHONE = 390;
const DESKTOP = 1440;
const NONE = { anchor: false, video: false, interstitial: false };

describe("getAdOverlayPolicy", () => {
  it.each([
    "/",
    "/fr",
    "/en",
    "/zh-CN",
    "/fr/programs",
    "/fr/programs/full-body",
    "/en/statistics",
    "/fr/leaderboard",
    "/fr/profile",
    "/fr/premium",
  ])("allows no overlay ad on the app screen %s, whatever the screen width", (pathname) => {
    expect(getAdOverlayPolicy(pathname, PHONE)).toEqual(NONE);
    expect(getAdOverlayPolicy(pathname, DESKTOP)).toEqual(NONE);
  });

  it.each(["/tools", "/fr/tools", "/fr/tools/bmi-calculator", "/zh-CN/tools/calorie-calculator/oxford-calculator"])(
    "keeps the anchor and the interstitial on the tool page %s, and the floating video on a wide screen only",
    (pathname) => {
      expect(getAdOverlayPolicy(pathname, PHONE)).toEqual({ anchor: true, video: false, interstitial: true });
      expect(getAdOverlayPolicy(pathname, DESKTOP)).toEqual({ anchor: true, video: true, interstitial: true });
    },
  );

  it("does not take a page whose name merely starts with tools for a tool page", () => {
    expect(getAdOverlayPolicy("/fr/toolshed", DESKTOP)).toEqual(NONE);
    expect(getAdOverlayPolicy("/fr/programs/tools", DESKTOP)).toEqual(NONE);
  });

  it("gives the same answers once serialised into the page", () => {
    const inPage = new Function(`return (${getAdOverlayPolicy.toString()});`)() as typeof getAdOverlayPolicy;

    for (const pathname of ["/fr", "/fr/programs", "/fr/tools", "/en/tools/bmi-calculator"]) {
      for (const width of [PHONE, 1023, 1024, DESKTOP]) {
        expect(inPage(pathname, width)).toEqual(getAdOverlayPolicy(pathname, width));
      }
    }
  });
});

describe("policy keys", () => {
  it("round-trips a policy through its key", () => {
    const policy = { anchor: true, video: false, interstitial: true };

    expect(parseAdOverlayPolicyKey(adOverlayPolicyKey(policy))).toEqual(policy);
  });

  it("reads a missing or malformed key as unknown", () => {
    expect(parseAdOverlayPolicyKey(undefined)).toBeNull();
    expect(parseAdOverlayPolicyKey("true|false")).toBeNull();
  });
});

describe("removesAnOverlay", () => {
  const toolPageOnDesktop = { anchor: true, video: true, interstitial: true };

  it("is true when leaving a tool page for an app screen", () => {
    expect(removesAnOverlay(toolPageOnDesktop, NONE)).toBe(true);
  });

  it("is false when the new page allows at least as much", () => {
    expect(removesAnOverlay(NONE, toolPageOnDesktop)).toBe(false);
    expect(removesAnOverlay(NONE, NONE)).toBe(false);
  });

  it("is false when the previous policy is unknown", () => {
    expect(removesAnOverlay(null, NONE)).toBe(false);
  });
});
