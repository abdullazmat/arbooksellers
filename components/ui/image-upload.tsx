"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  X,
  Upload,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";
import { getProductImageUrl } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MAX_FILE_SIZE_BYTES } from "@/lib/uploadValidation";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  useCloudUpload?: boolean;
  isAdmin?: boolean;
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
  const [uploadProgress, setUploadProgress] = useState(0);
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
      setUploadProgress(0);
      try {
        const newImages: string[] = [];
        const totalFiles = acceptedFiles.length;

        for (let i = 0; i < totalFiles; i++) {
          const file = acceptedFiles[i];

          // Update progress
          setUploadProgress(Math.round((i / totalFiles) * 100));

          // Validate file type
          if (!file.type.startsWith("image/")) {
            toast({
              title: "Invalid file type",
              description: `${file.name} is not an image file`,
              variant: "destructive",
            });
            continue;
          }

          // Validate file size - use MAX_FILE_SIZE_BYTES from lib
          if (file.size > MAX_FILE_SIZE_BYTES) {
            toast({
              title: "File too large",
              description: `${file.name} is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`,
              variant: "destructive",
            });
            continue;
          }

          let imageUrl: string;

          try {
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

        setUploadProgress(100);
        onChange([...images, ...newImages]);

        if (newImages.length > 0) {
          toast({
            title: "Success",
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
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    [images, onChange, maxImages, useCloudUpload, toast, isAdmin],
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
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newImages = [...images];
    const newIndex = direction === "left" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      onChange(newImages);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = isAdmin
      ? {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2560,
          useWebWorker: true,
          quality: 0.85,
          initialQuality: 0.9,
        }
      : {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          quality: 0.8,
        };

    try {
      return await imageCompression(file, options);
    } catch (error) {
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
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-islamic-green-500 bg-islamic-green-500/5"
            : "border-border/50 hover:border-islamic-green-500 hover:bg-zinc-50 dark:hover:bg-white/2"
        } ${
          uploading || images.length >= maxImages
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="bg-zinc-100 dark:bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
          <Upload className="h-8 w-8 text-islamic-green-600" />
        </div>
        <p className="text-sm font-black text-foreground mb-1 uppercase tracking-wider">
          {isDragActive
            ? "Drop your files here"
            : "Drop images here, or click to browse"}
        </p>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          PNG, JPG, WEBP • MAX {MAX_FILE_SIZE_BYTES / 1024 / 1024}MB • UP TO{" "}
          {maxImages} IMAGES
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-6 h-10 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 border-border/50 hover:border-islamic-green-500 hover:bg-islamic-green-500/10 transition-all"
          disabled={uploading || images.length >= maxImages}
        >
          Select Files
        </Button>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-islamic-green-600">
            <span className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading Images...
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress
            value={uploadProgress}
            className="h-1.5 bg-islamic-green-500/10"
          />
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Uploaded Gallery ({images.length}/{maxImages})
            </p>
            <p className="text-[9px] font-bold text-islamic-green-600 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              First image is primary
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="group relative">
                {(() => {
                  const imageUrl = getProductImageUrl(
                    image,
                    "/placeholder.jpg",
                  );

                  return (
                    <div
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        index === 0
                          ? "border-islamic-green-500 shadow-lg shadow-islamic-green-500/20"
                          : "border-border/50"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-islamic-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg">
                          Primary
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 pointer-events-none">
                        <Button
                          asChild
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg bg-white/20 hover:bg-white text-white hover:text-black transition-colors pointer-events-auto"
                        >
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open image ${index + 1} in new tab`}
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg bg-white/20 hover:bg-white text-white hover:text-black transition-colors pointer-events-auto"
                          disabled={index === 0}
                          onClick={() => moveImage(index, "left")}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg bg-white/20 hover:bg-white text-white hover:text-black transition-colors pointer-events-auto"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, "right")}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg shadow-xl pointer-events-auto"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })()}

                {/* Index Indicator */}
                <div className="mt-2 text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Slt #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
