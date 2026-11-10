import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "../proxy";

describe("Swedish locale routing", () => {
  it.each(["sv-SE", "sv-FI"])("selects Swedish for a first visit with %s", async (language) => {
    const request = new NextRequest("https://example.com/", {
      headers: { "accept-language": language },
    });

    const response = await proxy(request);

    expect(response.headers.get("location")).toBe("https://example.com/sv");
    expect(response.cookies.get("detected-locale")?.value).toBe("sv");
  });

  it("restores a saved preference when the session cookie has expired", async () => {
    const request = new NextRequest("https://example.com/tools", {
      headers: { "accept-language": "en", cookie: "detected-locale=sv" },
    });

    const response = await proxy(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe("https://example.com/sv/tools");
    expect(response.headers.get("Content-Language")).toBe("sv");
  });

  it("keeps an explicit Swedish link in Swedish after redirecting to the unprefixed URL", async () => {
    const request = new NextRequest("https://example.com/sv/tools", {
      headers: { "accept-language": "en", cookie: "detected-locale=en; Next-Locale=en" },
    });

    const redirect = await proxy(request);
    expect(redirect.headers.get("location")).toBe("https://example.com/tools");
    expect(redirect.cookies.get("detected-locale")?.value).toBe("sv");
    expect(redirect.cookies.get("Next-Locale")?.value).toBe("sv");

    const followup = await proxy(new NextRequest("https://example.com/tools", {
      headers: { "accept-language": "en", cookie: "detected-locale=sv; Next-Locale=sv" },
    }));
    expect(followup.headers.get("x-middleware-rewrite")).toBe("https://example.com/sv/tools");
    expect(followup.headers.get("Content-Language")).toBe("sv");
  });
});
