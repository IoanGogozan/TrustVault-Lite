export const allowedDocumentExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".docx", ".xlsx"] as const;
export const allowedDocumentMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
] as const;

export const maxDocumentUploadBytes = 10 * 1024 * 1024;

export type AllowedDocumentExtension = (typeof allowedDocumentExtensions)[number];
export type AllowedDocumentMimeType = (typeof allowedDocumentMimeTypes)[number];

export type FileSignatureValidationInput = {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  content: Uint8Array;
};

export type FileValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason:
        | "empty_file"
        | "file_size_mismatch"
        | "file_too_large"
        | "extension_not_allowed"
        | "mime_type_not_allowed"
        | "file_signature_mismatch";
    };

export function hasAllowedDocumentExtension(filename: string): boolean {
  const normalized = filename.toLowerCase();

  return allowedDocumentExtensions.some((extension) => normalized.endsWith(extension));
}

export function hasAllowedDocumentMimeType(mimeType: string): mimeType is AllowedDocumentMimeType {
  return allowedDocumentMimeTypes.some((allowedMimeType) => allowedMimeType === mimeType);
}

export function validateDocumentUpload(
  input: FileSignatureValidationInput
): FileValidationResult {
  if (input.sizeBytes <= 0 || input.content.byteLength === 0) {
    return { valid: false, reason: "empty_file" };
  }

  if (input.sizeBytes !== input.content.byteLength) {
    return { valid: false, reason: "file_size_mismatch" };
  }

  if (input.sizeBytes > maxDocumentUploadBytes || input.content.byteLength > maxDocumentUploadBytes) {
    return { valid: false, reason: "file_too_large" };
  }

  if (!hasAllowedDocumentExtension(input.filename)) {
    return { valid: false, reason: "extension_not_allowed" };
  }

  if (!hasAllowedDocumentMimeType(input.mimeType)) {
    return { valid: false, reason: "mime_type_not_allowed" };
  }

  if (!hasExpectedSignature(input.filename, input.mimeType, input.content)) {
    return { valid: false, reason: "file_signature_mismatch" };
  }

  return { valid: true };
}

function hasExpectedSignature(filename: string, mimeType: string, content: Uint8Array): boolean {
  const normalized = filename.toLowerCase();

  if (normalized.endsWith(".pdf") || mimeType === "application/pdf") {
    return startsWithBytes(content, [0x25, 0x50, 0x44, 0x46]);
  }

  if (normalized.endsWith(".png") || mimeType === "image/png") {
    return startsWithBytes(content, [0x89, 0x50, 0x4e, 0x47]);
  }

  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg") || mimeType === "image/jpeg") {
    return startsWithBytes(content, [0xff, 0xd8, 0xff]);
  }

  if (normalized.endsWith(".docx") || normalized.endsWith(".xlsx")) {
    return startsWithBytes(content, [0x50, 0x4b, 0x03, 0x04]);
  }

  return false;
}

function startsWithBytes(content: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((byte, index) => content[index] === byte);
}
