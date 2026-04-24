/**
 * Validation for product image uploads.
 * Accept only: jpg, jpeg, png, webp.
 * Enforce max file size.
 */

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

/** Max upload size: 20MB */
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export function isAllowedMimeType(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function isAllowedExtension(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

export function isWithinSizeLimit(sizeInBytes: number): boolean {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an uploaded file for product images.
 */
export function validateImageFile(
  file: { type: string; size: number; name: string }
): ValidationResult {
  if (!file.type || !isAllowedMimeType(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Allowed: JPG, JPEG, PNG, WEBP.",
    };
  }
  if (!isAllowedExtension(file.name)) {
    return {
      valid: false,
      error: "Invalid file extension. Allowed: .jpg, .jpeg, .png, .webp.",
    };
  }
  if (!isWithinSizeLimit(file.size)) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`,
    };
  }
  return { valid: true };
}
