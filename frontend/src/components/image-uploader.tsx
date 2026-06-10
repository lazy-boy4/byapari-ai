"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, UploadCloud, Link2, X } from "lucide-react";
import { uploadToImgbb, IMGBB_MAX_BYTES } from "@/lib/imgbb";
import { useLang } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  /** Fired after a successful ImgBB upload — used to persist immediately. */
  onUploaded?: (url: string) => void | Promise<void>;
  /** Letter shown when there is no image. */
  fallbackInitial?: string;
}

/**
 * Avatar image picker. Supports drag & drop, clipboard paste, and click-to-
 * select; the chosen file is hosted on ImgBB and the resulting URL is emitted
 * via onChange. A manual URL field is offered as a fallback.
 */
export function ImageUploader({ value, onChange, onUploaded, fallbackInitial = "?" }: ImageUploaderProps) {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const previewSrc = !imgError && value.trim() ? value.trim() : "";

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError(t("upload_img.invalid"));
        return;
      }
      if (file.size > IMGBB_MAX_BYTES) {
        setError(t("upload_img.too_large"));
        return;
      }
      setError(null);
      setUploading(true);
      try {
        const url = await uploadToImgbb(file);
        setImgError(false);
        onChange(url);
        // Persist straight away (e.g. to Firebase) so the upload sticks
        // without requiring a separate save.
        if (onUploaded) await onUploaded(url);
      } catch {
        setError(t("upload_img.failed"));
      } finally {
        setUploading(false);
      }
    },
    [onChange, onUploaded, t]
  );

  const onPaste = (e: React.ClipboardEvent) => {
    const imageItem = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      handleFile(imageItem.getAsFile());
    }
  };

  return (
    <div className="space-y-3" onPaste={onPaste}>
      <div
        role="button"
        tabIndex={0}
        aria-label={t("upload_img.cta")}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex items-center gap-4 border border-dashed p-4 cursor-pointer transition-colors outline-none focus-visible:border-ink",
          dragOver ? "border-ink bg-secondary/50" : "border-rule hover:border-ink hover:bg-secondary/30"
        )}
      >
        <div className="size-16 shrink-0 border border-rule bg-secondary/50 flex items-center justify-center overflow-hidden">
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-coffee" />
          ) : previewSrc ? (
            <Image
              src={previewSrc}
              alt="avatar"
              width={64}
              height={64}
              unoptimized
              className="size-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="font-display text-2xl font-bold text-ink">{fallbackInitial}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-ink font-semibold">
            <UploadCloud className="size-4 text-coffee shrink-0" />
            <span>{uploading ? t("upload_img.uploading") : t("upload_img.cta")}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{t("upload_img.hint")}</p>
        </div>
      </div>

      {/* Manual URL fallback */}
      <div className="relative">
        <Link2 className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setImgError(false);
            setError(null);
          }}
          placeholder={t("upload_img.url_placeholder")}
          className="w-full border border-rule bg-transparent pl-10 pr-9 py-2.5 text-sm text-ink font-mono placeholder:text-muted-foreground/70 focus:outline-none focus:border-ink transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setImgError(false);
              setError(null);
            }}
            aria-label={t("upload_img.remove")}
            title={t("upload_img.remove")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-danger cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-danger border border-danger/40 bg-danger/10 px-3 py-2">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}
