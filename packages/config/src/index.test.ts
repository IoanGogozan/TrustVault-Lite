import { describe, expect, it } from "vitest";
import { readBaseConfig } from "./index.js";

describe("readBaseConfig", () => {
  it("requires a public origin in production", () => {
    expect(() => readBaseConfig({ NODE_ENV: "production" })).toThrow(
      "PUBLIC_ORIGIN is required in production"
    );
  });

  it("accepts the production HTTPS origin", () => {
    expect(
      readBaseConfig({ NODE_ENV: "production", PUBLIC_ORIGIN: "https://vault.norvix.no" })
    ).toMatchObject({
      env: "production",
      demoMode: false,
      publicOrigin: "https://vault.norvix.no"
    });
  });

  it("enables demo mode independently from the production environment", () => {
    expect(
      readBaseConfig({
        NODE_ENV: "production",
        DEMO_MODE: "true",
        PUBLIC_ORIGIN: "https://vault.norvix.no"
      }).demoMode
    ).toBe(true);
  });

  it("rejects ambiguous demo mode values", () => {
    expect(() => readBaseConfig({ NODE_ENV: "test", DEMO_MODE: "yes" })).toThrow(
      "DEMO_MODE must be either true or false"
    );
  });

  it.each([
    "http://vault.norvix.no",
    "https://vault.norvix.no/path",
    "https://user:password@vault.norvix.no"
  ])("rejects unsafe or non-origin PUBLIC_ORIGIN %s", (publicOrigin) => {
    expect(() =>
      readBaseConfig({ NODE_ENV: "production", PUBLIC_ORIGIN: publicOrigin })
    ).toThrow();
  });
});
