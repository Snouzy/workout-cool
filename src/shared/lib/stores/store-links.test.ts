import { describe, expect, it } from "vitest";

import {
  buildAppStoreUrl,
  buildPlayStoreUrl,
  buildStoreUrl,
  detectStorePlatform,
  normalizeDownloadSource,
  parseStorePlatform,
} from "./store-links";

const UA = {
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  iphoneTikTok:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_35.0.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US",
  ipad: "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36",
  androidTikTok:
    "Mozilla/5.0 (Linux; Android 13; SM-S911B Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.54 Mobile Safari/537.36 trill_2023504040 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

describe("detectStorePlatform", () => {
  it("sends iPhones and iPads to the App Store, in Safari and in the TikTok in-app browser", () => {
    expect(detectStorePlatform(UA.iphoneSafari)).toBe("ios");
    expect(detectStorePlatform(UA.iphoneTikTok)).toBe("ios");
    expect(detectStorePlatform(UA.ipad)).toBe("ios");
  });

  it("sends Android phones to Google Play, in Chrome and in the TikTok webview", () => {
    expect(detectStorePlatform(UA.androidChrome)).toBe("android");
    expect(detectStorePlatform(UA.androidTikTok)).toBe("android");
  });

  it("keeps desktop browsers and missing user agents on the page", () => {
    expect(detectStorePlatform(UA.mac)).toBeNull();
    expect(detectStorePlatform(UA.windows)).toBeNull();
    expect(detectStorePlatform(null)).toBeNull();
    expect(detectStorePlatform("")).toBeNull();
  });
});

describe("parseStorePlatform", () => {
  it("accepts only ios and android", () => {
    expect(parseStorePlatform("ios")).toBe("ios");
    expect(parseStorePlatform("android")).toBe("android");
    expect(parseStorePlatform("windows")).toBeNull();
    expect(parseStorePlatform(undefined)).toBeNull();
  });
});

describe("normalizeDownloadSource", () => {
  it("lowercases a clean source", () => {
    expect(normalizeDownloadSource("TikTok")).toBe("tiktok");
    expect(normalizeDownloadSource(" x_bio-2 ")).toBe("x_bio-2");
  });

  it("falls back to the default for anything missing or unexpected", () => {
    expect(normalizeDownloadSource(undefined)).toBe("web");
    expect(normalizeDownloadSource("")).toBe("web");
    expect(normalizeDownloadSource("tiktok&utm_medium=evil")).toBe("web");
    expect(normalizeDownloadSource("a".repeat(33))).toBe("web");
  });
});

describe("store URLs", () => {
  it("builds an App Store campaign link only when the provider token is known", () => {
    const withToken = new URL(buildAppStoreUrl({ source: "tiktok", appStoreProviderToken: "123456" }));
    expect(withToken.origin + withToken.pathname).toBe("https://apps.apple.com/app/id6749820499");
    expect(withToken.searchParams.get("mt")).toBe("8");
    expect(withToken.searchParams.get("ct")).toBe("tiktok");
    expect(withToken.searchParams.get("pt")).toBe("123456");

    const withoutToken = new URL(buildAppStoreUrl({ source: "tiktok" }));
    expect(withoutToken.searchParams.has("pt")).toBe(false);
  });

  it("encodes the whole Play Store referrer as one value", () => {
    const url = new URL(buildPlayStoreUrl({ source: "tiktok" }));
    expect(url.searchParams.get("id")).toBe("com.workout.cool");
    expect(url.searchParams.get("referrer")).toBe("utm_source=tiktok&utm_medium=smart_link&utm_campaign=download_page");
    expect(url.search).toContain("referrer=utm_source%3Dtiktok%26utm_medium%3Dsmart_link");
  });

  it("dispatches on the platform", () => {
    expect(buildStoreUrl("ios", { source: "qr" })).toContain("apps.apple.com");
    expect(buildStoreUrl("android", { source: "qr" })).toContain("play.google.com");
  });
});
