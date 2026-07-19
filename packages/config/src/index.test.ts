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
      publicOrigin: "https://vault.norvix.no"
    });
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
