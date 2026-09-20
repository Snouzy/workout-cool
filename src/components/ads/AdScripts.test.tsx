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

  it("loads no ad script for a premium user", async () => {
    serverAuth.mockResolvedValue({ id: "premium", isPremium: true });

    expect(await renderAdScripts()).toBe("");
  });

  it("keeps the ads on when the session lookup fails", async () => {
    serverAuth.mockRejectedValue(new Error("database unreachable"));

    expect(await renderAdScripts()).toContain("ezoic/sa.min.js");
  });
});
