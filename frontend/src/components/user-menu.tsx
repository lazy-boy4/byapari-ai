"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, loading, signOutUser } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // A new photo URL (e.g. after an upload) should get a fresh render attempt.
  useEffect(() => {
    setImgError(false);
  }, [user?.photoURL]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (loading) {
    return <span className="size-9 border border-rule bg-secondary/40 animate-pulse" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        className="mono-caps border border-ink bg-ink px-4 py-2 text-[color:var(--color-paper)] transition-colors hover:bg-transparent hover:text-ink"
      >
        {t("auth.signin")}
      </Link>
    );
  }

  const label = user.displayName || user.email || "Account";
  const initial = label.charAt(0).toUpperCase();
  const photo = !imgError ? user.photoURL : null;

  const handleSignOut = async () => {
    setOpen(false);
    await signOutUser();
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 border border-rule pl-1 pr-2 py-1 transition-colors hover:border-ink cursor-pointer"
      >
        <span className="size-7 flex items-center justify-center overflow-hidden bg-ink text-[color:var(--color-paper)] font-display text-sm font-bold">
          {photo ? (
            <Image src={photo} alt={label} width={28} height={28} unoptimized className="size-full object-cover" onError={() => setImgError(true)} />
          ) : (
            initial
          )}
        </span>
        <span className="hidden sm:inline max-w-[120px] truncate font-mono text-xs text-ink">{label}</span>
        <ChevronDown className={cn("size-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-48 border border-rule bg-background/95 backdrop-blur shadow-lg z-40"
        >
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 mono-caps text-xs text-ink hover:bg-secondary/60 transition-colors"
          >
            <UserIcon className="size-4" /> {t("nav.profile")}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 mono-caps text-xs text-danger hover:bg-danger/10 transition-colors cursor-pointer border-t border-rule"
          >
            <LogOut className="size-4" /> {t("auth.signout")}
          </button>
        </div>
      )}
    </div>
  );
}
