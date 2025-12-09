"use client";

import { useState } from "react";
import { uploadFileToIPFS, getHashFromUrl } from "@/lib/utils";
import TagsInput from "@/components/ui/tags-input";
import CreatorsInput from "@/components/ui/creators-input";

interface UploadFormProps {
  onNext: (data: any) => void;
  setNFTData?: (data: any) => void;
}

interface SocialMedia {
  platform: string;
  url: string;
}

interface Creator {
  name: string;
  address: string;
  description: string;
  contributionPercent: number;
  socialMedia: SocialMedia[];
}

export default function UploadForm({ onNext, setNFTData }: UploadFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ipType: "artwork",
    file: null as File | null,
    image: null as File | null,
    tags: [] as string[],
    creators: [] as Creator[],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }
      setFormData({ ...formData, image: file });
    } else {
      setError("Please upload an image file (PNG, JPG, GIF)");
    }
  };
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      const fileType = file.type;

      setFormData({ ...formData, file: file });
    } else {
      setError("Please upload an image file (PNG, JPG, GIF)");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");

    try {
      if (!(formData.file || formData.image))
        throw new Error("No file selected");

      const imgHash =
        formData.image && (await uploadFileToIPFS(formData.image));
      const fileHash = formData.file && (await uploadFileToIPFS(formData.file));

      const nftMetadata = {
        name: formData.title,
        description: "Image of" + formData.description.toLowerCase() + ", " + formData.title,
        image: `https://ipfs.io/ipfs/${imgHash}`,
      };

      onNext({
        title: formData.title,
        description: formData.description,
        createdAt: Date.now(),
        ipType: formData.ipType,
        image: `https://ipfs.io/ipfs/${imgHash}`,
        imageHash: await getHashFromUrl(`https://ipfs.io/ipfs/${imgHash}`),
        mediaUrl: `https://ipfs.io/ipfs/${fileHash}`,
        mediaHash: await getHashFromUrl(`https://ipfs.io/ipfs/${fileHash}`),
        mediaType: formData.file && formData.file.type,
        tags: formData.tags,
        creators: formData.creators,
      });

      setNFTData && setNFTData(nftMetadata);  
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Register Your IP
      </h2>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          IP Preview Image
        </label>

        {/* Click or Drag-and-Drop Area */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onDrop={handleImageDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
            id="image-input"
            accept="image/*"
            disabled={isUploading}
          />
          <label htmlFor="image-input" className="cursor-pointer block">
            {/* Preview or Upload Icon */}
            {formData.image ? (
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate max-w-full">
                  {formData.image.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to change
                </p>
              </div>
            ) : (
              <>
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-muted-foreground">
                  Click or drag to upload image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </label>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Upload File
        </label>
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files?.[0] || null })
            }
            id="file-input"
            disabled={isUploading}
          />
          <label htmlFor="file-input" className="cursor-pointer block">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-4m0-4v4m0-4H8m4 0h4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-muted-foreground">
              {formData.file ? formData.file.name : "Click or drag to upload"}
            </p>
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title</label>
        <input
          type="text"
          placeholder="My Creative Work"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={isUploading}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          placeholder="Describe your IP..."
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          disabled={isUploading}
        />
      </div>

      {/* ipType */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">ipType</label>
        <select
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          value={formData.ipType}
          onChange={(e) => setFormData({ ...formData, ipType: e.target.value })}
          disabled={isUploading}
        >
          <option value="artwork">Artwork</option>
          <option value="music">Music</option>
          <option value="video">Video</option>
          <option value="writing">Writing</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tags</label>
        <TagsInput
          value={formData.tags}
          onChange={(tags: string[]) => setFormData({ ...formData, tags })}
          disabled={isUploading}
          maxTags={15}
        />
      </div>

      {/* Creators */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Creators</label>
        <CreatorsInput
          value={formData.creators}
          onChange={(creators: Creator[]) =>
            setFormData({ ...formData, creators })
          }
          disabled={isUploading}
        />
      </div>

      <button
        type="submit"
        disabled={
          !formData.title ||
          !formData.description ||
          !formData.file ||
          !formData.image ||
          isUploading
        }
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading
          ? "Uploading to IPFS..."
          : "Continue to License Configuration"}
      </button>
    </form>
  );
}
