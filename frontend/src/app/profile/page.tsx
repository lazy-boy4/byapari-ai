"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Check, LogOut, User as UserIcon, ImageIcon } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { MonoLabel } from "@/components/mono-label";
import { SectionHeading } from "@/components/section-heading";
import { ProtectedRoute } from "@/components/protected-route";
import { ImageUploader } from "@/components/image-uploader";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";

function ProfileContent() {
  const { t } = useLang();
  const router = useRouter();
  const { user, updateUserProfile, signOutUser } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Seed the form from the current user once it's available.
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      setPhotoURL(user.photoURL ?? "");
    }
  }, [user]);

  if (!user) return null;

  const provider = user.providerData[0]?.providerId ?? "password";
  const providerLabel = provider.includes("google") ? "Google" : t("profile.provider_email");
  const initial = (displayName || user.email || "?").charAt(0).toUpperCase();
  const previewSrc = imgError ? "" : photoURL.trim();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError(t("auth.error_generic"));
    } finally {
      setSaving(false);
    }
  };

  // Persist the uploaded image to Firebase right away so it sticks (and shows
  // in the navbar) without waiting for the Save button.
  const handleImageUploaded = async (url: string) => {
    setError(null);
    setPhotoURL(url);
    setImgError(false);
    try {
      await updateUserProfile({ photoURL: url });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError(t("auth.error_generic"));
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 lg:py-16 space-y-10">
      <SectionHeading index="01" eyebrow={t("profile.account_eyebrow")} title={t("profile.title")} lead={t("profile.subtitle")} />

      <div className="grid gap-8 md:grid-cols-[200px_1fr] items-start">
        {/* Preview */}
        <PaperCard className="p-6 flex flex-col items-center text-center gap-4">
          <MonoLabel className="self-start">{t("profile.preview")}</MonoLabel>
          <div className="size-24 border border-rule bg-secondary/50 flex items-center justify-center overflow-hidden">
            {previewSrc ? (
              <Image
                src={previewSrc}
                alt={displayName || "avatar"}
                width={96}
                height={96}
                unoptimized
                className="size-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-display text-3xl font-bold text-ink">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-display font-semibold text-ink truncate">{displayName || t("profile.no_name")}</div>
            <div className="font-mono text-[11px] text-muted-foreground truncate">{user.email}</div>
          </div>
        </PaperCard>

        {/* Form */}
        <PaperCard className="p-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            <label className="block space-y-1.5">
              <span className="mono-caps text-[10px] text-muted-foreground flex items-center gap-1.5">
                <UserIcon className="size-3" /> {t("profile.display_name")}
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("auth.name_placeholder")}
                className="w-full border border-rule bg-transparent px-3 py-2.5 text-sm text-ink font-mono placeholder:text-muted-foreground/70 focus:outline-none focus:border-ink transition-colors"
              />
            </label>

            <div className="space-y-1.5">
              <span className="mono-caps text-[10px] text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="size-3" /> {t("profile.photo_label")}
              </span>
              <ImageUploader
                value={photoURL}
                onChange={(url) => {
                  setPhotoURL(url);
                  setImgError(false);
                }}
                onUploaded={handleImageUploaded}
                fallbackInitial={initial}
              />
            </div>

            {/* Read-only account info */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-rule">
              <div className="space-y-1">
                <span className="mono-caps text-[10px] text-muted-foreground">{t("profile.email_label")}</span>
                <div className="text-sm text-ink font-mono truncate">{user.email}</div>
              </div>
              <div className="space-y-1">
                <span className="mono-caps text-[10px] text-muted-foreground">{t("profile.provider_label")}</span>
                <div className="text-sm text-ink font-mono">{providerLabel}</div>
              </div>
            </div>

            {error && <p className="text-xs text-danger border border-danger/40 bg-danger/10 px-3 py-2">{error}</p>}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-sm text-[color:var(--color-paper)] transition-colors hover:bg-transparent hover:text-ink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : null}
                {saving ? t("profile.saving") : saved ? t("profile.saved") : t("profile.save")}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="mono-caps inline-flex items-center gap-2 border border-rule bg-transparent px-4 py-2.5 text-sm text-ink transition-colors hover:bg-danger hover:border-danger hover:text-[color:var(--color-paper)] cursor-pointer"
              >
                <LogOut className="size-4" />
                {t("auth.signout")}
              </button>
            </div>
          </form>
        </PaperCard>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
