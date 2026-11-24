import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { AdScripts } from "./AdScripts";

const serverAuth = vi.hoisted(() => vi.fn());

vi.mock("@/env", () => ({ env: { NEXT_PUBLIC_SHOW_ADS: true, NEXT_PUBLIC_AD_CLIENT: "ca-pub-test" } }));
vi.mock("@/entities/user/model/get-server-session-user", () => ({ serverAuth }));

const renderAdScripts = async () => {
  const element = await AdScripts();
  return element ? renderToStaticMarkup(element) : "";
};

describe("AdScripts", () => {
  beforeEach(() => {
    serverAuth.mockReset();
  });

  it("loads the ad scripts for an anonymous visitor", async () => {
    serverAuth.mockResolvedValue(null);

    const html = await renderAdScripts();

    expect(html).toContain("ezoic/sa.min.js");
    expect(html).toContain("adsbygoogle.js?client=ca-pub-test");
  });

  describe("Ezoic bootstrap", () => {
    // Runs the inline script the way the browser does, against a recording Ezoic object.
    const bootEzoicOn = async (pathname: string, innerWidth: number, options: { breakPolicy?: boolean } = {}) => {
      serverAuth.mockResolvedValue(null);

      const html = await renderAdScripts();
      const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
      const bootstrap = inlineScripts.find((script) => script.includes("ezstandalone.enable"));
      if (!bootstrap) throw new Error("Ezoic bootstrap script not found");

      const calls: Array<[string, ...unknown[]]> = [];
      const record =
        (name: string) =>
        (...args: unknown[]) => {
          calls.push([name, ...args.filter((arg) => arg !== undefined)]);
        };
      const ezstandalone: Record<string, unknown> = { cmd: [] as Array<() => void> };
      for (const name of ["config", "setEzoicAnchorAd", "setOutstreamAllowed", "setInterstitialAllowed", "enable", "initRewardedAds"]) {
        ezstandalone[name] = record(name);
      }
      const window: Record<string, unknown> = { ezstandalone, location: { pathname }, innerWidth };

      new Function("window", "ezstandalone", bootstrap)(window, ezstandalone);
      if (options.breakPolicy) {
        window.__wcAdOverlayPolicy = () => {
          throw new Error("policy unavailable");
        };
      }
      (ezstandalone.cmd as Array<() => void>).forEach((command) => command());

      return { calls, window };
    };

    it("starts Ezoic with no overlay ad on an app screen", async () => {
      const { calls, window } = await bootEzoicOn("/fr/programs", 390);

      expect(calls).toEqual([
        ["config", { anchorAdExpansion: false, disableVideo: true }],
        ["setEzoicAnchorAd", false],
        ["setOutstreamAllowed", false, { reason: "app-screen" }],
        ["setInterstitialAllowed", false, { reason: "app-screen" }],
        ["enable"],
        ["initRewardedAds", { anchor: false, interstitial: false, video: false, sideRails: true }],
      ]);
      expect(window.__wcAdOverlayKey).toBe("false|false|false");
    });

    it("keeps the anchor on a tool page, without the floating video on a phone", async () => {
      const { calls, window } = await bootEzoicOn("/fr/tools/bmi-calculator", 390);

      expect(calls).toContainEqual(["config", { anchorAdExpansion: false, disableVideo: true }]);
      expect(calls).toContainEqual(["setEzoicAnchorAd", true]);
      expect(calls).toContainEqual(["setOutstreamAllowed", false, { reason: "app-screen" }]);
      expect(calls).toContainEqual(["initRewardedAds", { anchor: true, interstitial: true, video: false, sideRails: true }]);
      expect(window.__wcAdOverlayKey).toBe("true|false|true");
    });

    it("keeps the floating video on a tool page seen on a wide screen", async () => {
      const { calls } = await bootEzoicOn("/en/tools", 1440);

      expect(calls).toContainEqual(["config", { anchorAdExpansion: false, disableVideo: false }]);
      expect(calls).toContainEqual(["setOutstreamAllowed", true, { reason: "app-screen" }]);
      expect(calls).toContainEqual(["initRewardedAds", { anchor: true, interstitial: true, video: true, sideRails: true }]);
    });

    it("still starts Ezoic, with no overlay ad, when the policy cannot be computed", async () => {
      const { calls, window } = await bootEzoicOn("/fr/tools", 1440, { breakPolicy: true });

      expect(calls).toContainEqual(["enable"]);
      expect(calls).toContainEqual(["initRewardedAds", { anchor: false, interstitial: false, video: false, sideRails: true }]);
      expect(window.__wcAdOverlayKey).toBe("false|false|false");
    });

    it("never lets the anchor ad expand", async () => {
      const { calls } = await bootEzoicOn("/fr/tools", 390);

      expect(calls[0]).toEqual(["config", { anchorAdExpansion: false, disableVideo: true }]);
    });
  });

  it("loads no ad script for a premium user", async () => {
    serverAuth.mockResolvedValue({ id: "premium", isPremium: true });

    expect(await renderAdScripts()).toBe("");
  });

  it("keeps the ads on when the session lookup fails", async () => {
    serverAuth.mockRejectedValue(new Error("database unreachable"));

    expect(await renderAdScripts()).toContain("ezoic/sa.min.js");
  });
});
