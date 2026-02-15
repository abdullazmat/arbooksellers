import { NextRequest, NextResponse } from "next/server";
import { validateImageFile } from "@/lib/uploadValidation";
import { processImageToWebP } from "@/lib/imageProcessor";
import { IMAGE_BASE_URL } from "@/lib/utils";

/**
 * POST /api/upload
 * Accepts multipart/form-data with field "file" (image).
 * Validates type (jpg, jpeg, png, webp) and size (max 5MB).
 * Converts to WebP, saves under public/uploads/products/, returns public URL.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const validation = validateImageFile({
      type: file.type,
      size: file.size,
      name: file.name,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { url: path } = await processImageToWebP(buffer, {
      maxWidth: 1200,
      quality: 80,
    });
    const url = `${IMAGE_BASE_URL}${path}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      url,
      filename: path.split("/").pop(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload - Upload service info (max size, allowed types).
 */
export async function GET() {
  const { MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS } = await import(
    "@/lib/uploadValidation"
  );
  return NextResponse.json({
    message: "Upload service running",
    maxFileSize: `${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    allowedExtensions: [...ALLOWED_EXTENSIONS],
  });
}
