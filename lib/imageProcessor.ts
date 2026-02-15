import sharp from "sharp";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = "public/uploads/products";
export const MAX_WIDTH = 1200;
export const WEBP_QUALITY = 80;

/**
 * Ensure the upload directory exists.
 */
export function ensureUploadDir(): string {
  const dir = path.join(process.cwd(), UPLOAD_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Generate a unique filename for a product image.
 * @param productId - Optional product ID to include in the name (e.g. for new product use "new")
 */
export function generateImageFilename(productId?: string): string {
  const prefix = productId || "product";
  const id = randomUUID().replace(/-/g, "").slice(0, 12);
  const timestamp = Date.now();
  return `${prefix}-${timestamp}-${id}.webp`;
}

export interface ProcessImageOptions {
  /** Max width in pixels; aspect ratio preserved. */
  maxWidth?: number;
  /** WebP quality 1–100. */
  quality?: number;
  /** Optional product ID for filename prefix. */
  productId?: string;
}

export interface ProcessImageResult {
  /** Public URL path to use in DB and frontend (e.g. /uploads/products/xxx.webp). */
  url: string;
  /** Full filesystem path of the saved file. */
  filePath: string;
  /** Generated filename. */
  filename: string;
}

/**
 * Process an image buffer: convert to WebP, optionally resize, compress, and save to disk.
 * @param buffer - Raw image buffer (e.g. from multipart upload or base64 decode).
 * @param options - Processing options.
 */
export async function processImageToWebP(
  buffer: Buffer,
  options: ProcessImageOptions = {}
): Promise<ProcessImageResult> {
  const maxWidth = options.maxWidth ?? MAX_WIDTH;
  const quality = options.quality ?? WEBP_QUALITY;
  const dir = ensureUploadDir();
  const filename = generateImageFilename(options.productId);
  const filePath = path.join(dir, filename);

  let pipeline = sharp(buffer);

  const metadata = await pipeline.metadata();
  const width = metadata.width ?? 0;

  if (width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, undefined, { withoutEnlargement: true });
  }

  await pipeline
    .webp({ quality })
    .toFile(filePath);

  const url = `/uploads/products/${filename}`;
  return { url, filePath, filename };
}

/**
 * Process multiple image buffers and return their public URLs.
 */
export async function processImagesToWebP(
  buffers: Buffer[],
  options: ProcessImageOptions = {}
): Promise<string[]> {
  const results = await Promise.all(
    buffers.map((buf) => processImageToWebP(buf, options))
  );
  return results.map((r) => r.url);
}
