"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  useCloudUpload?: boolean;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  className = "",
  useCloudUpload = false,
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

          // Validate file size (max 1MB per image to prevent total size issues)
          if (file.size > 1 * 1024 * 1024) {
            toast({
              title: "File too large",
              description: `${file.name} is too large. Maximum size is 1MB per image.`,
              variant: "destructive",
            });
            continue;
          }

          let imageUrl: string;

          if (useCloudUpload) {
            // Upload to cloud storage
            try {
              const formData = new FormData();
              formData.append("file", file);

              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                // For now, we'll still use base64 since the API is a placeholder
                // In production, you would use: imageUrl = data.url
                imageUrl = await fileToBase64(file);
              } else {
                throw new Error("Upload failed");
              }
            } catch (error) {
              console.error(
                "Cloud upload failed, falling back to base64:",
                error
              );
              // Fallback to base64 if cloud upload fails
              imageUrl = await fileToBase64(file);
            }
          } else {
            // Use base64 for local storage
            imageUrl = await fileToBase64(file);
          }

          newImages.push(imageUrl);
        }

        onChange([...images, ...newImages]);

        if (newImages.length > 0) {
          toast({
            title: "Images uploaded",
            description: `${newImages.length} image(s) uploaded successfully`,
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
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
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
          PNG, JPG, GIF, WEBP up to 5MB each. Max {maxImages} images.
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
