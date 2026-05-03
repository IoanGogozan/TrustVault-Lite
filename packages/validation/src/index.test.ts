import { describe, expect, it } from "vitest";
import { validateDocumentUpload } from "./index.js";

describe("validateDocumentUpload", () => {
  it("accepts a PDF with a valid signature", () => {
    expect(
      validateDocumentUpload({
        filename: "evidence.pdf",
        mimeType: "application/pdf",
        sizeBytes: 5,
        content: Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d])
      })
    ).toEqual({ valid: true });
  });

  it("rejects forbidden extensions", () => {
    expect(
      validateDocumentUpload({
        filename: "payload.exe",
        mimeType: "application/pdf",
        sizeBytes: 5,
        content: Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d])
      })
    ).toEqual({ valid: false, reason: "extension_not_allowed" });
  });

  it("rejects mismatched file signatures", () => {
    expect(
      validateDocumentUpload({
        filename: "evidence.pdf",
        mimeType: "application/pdf",
        sizeBytes: 5,
        content: Uint8Array.from([0xff, 0xd8, 0xff, 0x00, 0x00])
      })
    ).toEqual({ valid: false, reason: "file_signature_mismatch" });
  });

  it("rejects mismatched declared file sizes", () => {
    expect(
      validateDocumentUpload({
        filename: "evidence.pdf",
        mimeType: "application/pdf",
        sizeBytes: 10,
        content: Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d])
      })
    ).toEqual({ valid: false, reason: "file_size_mismatch" });
  });
});
