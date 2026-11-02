import { describe, expect, it } from "vitest";

import { resolveDownloadRedirect } from "./download-redirect";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_35.0.0";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const resolve = (pathname: string, query = "", userAgent: string | null = MAC) =>
  resolveDownloadRedirect({ pathname, searchParams: new URLSearchParams(query), userAgent });

describe("resolveDownloadRedirect", () => {
  it("only acts on the download path, with or without a locale prefix", () => {
    expect(resolve("/download", "", IPHONE)?.platform).toBe("ios");
    expect(resolve("/fr/download", "", IPHONE)?.platform).toBe("ios");
    expect(resolve("/zh-CN/download/", "", IPHONE)?.platform).toBe("ios");
    expect(resolve("/downloads", "", IPHONE)).toBeNull();
    expect(resolve("/tools/download", "", IPHONE)).toBeNull();
    expect(resolve("/", "", IPHONE)).toBeNull();
  });

  it("sends phones to their store with the source attached", () => {
    const ios = resolve("/download", "src=tiktok", IPHONE);
    expect(ios).toMatchObject({ platform: "ios", source: "tiktok", forced: false });
    expect(ios?.url).toContain("apps.apple.com/app/id6749820499");
    expect(ios?.url).toContain("ct=tiktok");

    const android = resolve("/download", "src=tiktok", ANDROID);
    expect(android).toMatchObject({ platform: "android", source: "tiktok", forced: false });
    expect(android?.url).toContain("play.google.com");
    expect(android?.url).toContain("utm_source%3Dtiktok");
  });

  it("keeps desktop visitors on the page unless a store is forced", () => {
    expect(resolve("/download", "src=tiktok", MAC)).toBeNull();
    expect(resolve("/download", "src=tiktok", null)).toBeNull();
    expect(resolve("/download", "store=android&src=x", MAC)).toMatchObject({ platform: "android", source: "x", forced: true });
    expect(resolve("/download", "store=windows", MAC)).toBeNull();
  });

  it("never forwards an unexpected source to the stores", () => {
    expect(resolve("/download", "src=tiktok%26utm_medium%3Devil", IPHONE)?.source).toBe("web");
  });
});
