"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  useCloudUpload?: boolean;
  isAdmin?: boolean; // New prop to identify admin uploads
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  className = "",
  useCloudUpload = false,
  isAdmin = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast({
          title: "Too many images",
          description: `Maximum ${maxImages} images allowed`,
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      try {
        const newImages: string[] = [];

        for (const file of acceptedFiles) {
          // Validate file type
          if (!file.type.startsWith("image/")) {
            toast({
              title: "Invalid file type",
              description: `${file.name} is not an image file`,
              variant: "destructive",
            });
            continue;
          }

          // Validate file size - no limit for admin, 5MB for regular users
          if (!isAdmin && file.size > 5 * 1024 * 1024) {
            toast({
              title: "File too large",
              description: `${file.name} is too large. Maximum size is 5MB per image.`,
              variant: "destructive",
            });
            continue;
          }

          let imageUrl: string;

          try {
            // For admin/server upload: send file to API; server converts to WebP and returns URL.
            if (useCloudUpload && isAdmin) {
              const formData = new FormData();
              formData.append("file", file);

              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Upload failed");
              }

              const data = await response.json();
              if (!data.url) throw new Error("No URL returned from upload");
              imageUrl = data.url;
            } else {
              // Non-admin or local: compress and use base64 (e.g. for non-product uploads)
              const compressedFile = await compressImage(file);
              if (useCloudUpload) {
                try {
                  const formData = new FormData();
                  formData.append("file", compressedFile);
                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  if (response.ok) {
                    const data = await response.json();
                    imageUrl = data.url ?? (await fileToBase64(compressedFile));
                  } else {
                    imageUrl = await fileToBase64(compressedFile);
                  }
                } catch {
                  imageUrl = await fileToBase64(compressedFile);
                }
              } else {
                imageUrl = await fileToBase64(compressedFile);
              }
            }

            newImages.push(imageUrl);
          } catch (error) {
            console.error("Error processing image:", error);
            toast({
              title: "Image processing failed",
              description: `Failed to process ${file.name}. Please try again.`,
              variant: "destructive",
            });
            continue;
          }
        }

        onChange([...images, ...newImages]);

        if (newImages.length > 0) {
          toast({
            title: "Images uploaded",
            description: `${newImages.length} image(s) uploaded and compressed successfully`,
          });
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, maxImages, useCloudUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast({
      title: "Image removed",
      description: "Image has been removed",
    });
  };

  const compressImage = async (file: File): Promise<File> => {
    // Different compression settings for admin vs regular users
    const options = isAdmin
      ? {
          maxSizeMB: 1.5, // Larger size limit for admin (1.5MB)
          maxWidthOrHeight: 2560, // Higher resolution for admin (2560px)
          useWebWorker: true,
          quality: 0.85, // Higher quality for admin (85%)
          initialQuality: 0.9, // Start with higher quality
        }
      : {
          maxSizeMB: 0.8, // Regular size limit (0.8MB)
          maxWidthOrHeight: 1920, // Regular resolution (1920px)
          useWebWorker: true,
          quality: 0.8, // Regular quality (80%)
        };

    try {
      const compressedFile = await imageCompression(file, options);

      // Log compression details for admin
      if (isAdmin) {
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(
          2
        );
        const compressionRatio = (
          ((file.size - compressedFile.size) / file.size) *
          100
        ).toFixed(1);

        console.log(`Admin Image Compression: ${file.name}`);
        console.log(
          `Original: ${originalSizeMB}MB → Compressed: ${compressedSizeMB}MB (${compressionRatio}% reduction)`
        );
      }

      return compressedFile;
    } catch (error) {
      console.error("Image compression failed:", error);
      // Return original file if compression fails
      return file;
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        } ${
          uploading || images.length >= maxImages
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          {isDragActive
            ? "Drop the images here..."
            : "Drag & drop images here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, WEBP up to 5MB each. Max {maxImages} images.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={uploading || images.length >= maxImages}
        >
          Select Images
        </Button>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm">
            Uploaded Images ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="image-preview-item">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="image-preview-actions h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Image Info */}
                <div className="image-preview-info">
                  <p className="truncate">
                    {image.startsWith("data:")
                      ? "Uploaded Image"
                      : "External URL"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Uploading images...
        </div>
      )}
    </div>
  );
}
