"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, User as UserIcon, Check } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { SectionHeading } from "@/components/section-heading";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const GoogleGlyph = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
  </svg>
);

export function AuthCard({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const redirect = searchParams.get("redirect") || "/dashboard";

  // Password strength rules (enforced on sign-up only).
  const pwChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const pwValid = Object.values(pwChecks).every(Boolean);
  const pwMatch = password === confirmPassword;
  const pwRequirements = [
    { ok: pwChecks.length, label: t("auth.pw_len") },
    { ok: pwChecks.upper, label: t("auth.pw_upper") },
    { ok: pwChecks.lower, label: t("auth.pw_lower") },
    { ok: pwChecks.number, label: t("auth.pw_number") },
    { ok: pwChecks.special, label: t("auth.pw_special") },
  ];

  // Already signed in? Send them on.
  useEffect(() => {
    if (!authLoading && user) router.replace(redirect);
  }, [authLoading, user, redirect, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isSignup) {
      if (!pwValid) {
        setError("auth.pw_requirements_error");
        return;
      }
      if (!pwMatch) {
        setError("auth.pw_mismatch");
        return;
      }
    }
    setSubmitting(true);
    try {
      if (isSignup) {
        await signUpWithEmail(email, password, name.trim() || undefined);
      } else {
        await signInWithEmail(email, password);
      }
      router.replace(redirect);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.replace(redirect);
    } catch (err) {
      const msg = authErrorMessage(err);
      if (msg) setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-rule bg-transparent pl-10 pr-3 py-2.5 text-sm text-ink font-mono placeholder:text-muted-foreground/70 focus:outline-none focus:border-ink transition-colors";

  return (
    <div className="fade-up w-full max-w-md mx-auto space-y-8">
      <SectionHeading
        index="01"
        eyebrow={isSignup ? t("auth.signup_eyebrow") : t("auth.signin_eyebrow")}
        title={isSignup ? t("auth.signup_title") : t("auth.signin_title")}
        lead={isSignup ? t("auth.signup_subtitle") : t("auth.signin_subtitle")}
      />

      <PaperCard className="p-8 space-y-6">
        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 border border-ink bg-transparent px-4 py-2.5 text-sm mono-caps text-ink transition-colors hover:bg-ink hover:text-[color:var(--color-paper)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleGlyph />
          {t("auth.google")}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-rule" />
          <span className="mono-caps text-[10px] text-muted-foreground">{t("auth.or")}</span>
          <span className="h-px flex-1 bg-rule" />
        </div>

        {/* Email / password */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {isSignup && (
            <label className="block space-y-1.5">
              <span className="mono-caps text-[10px] text-muted-foreground">{t("auth.name")}</span>
              <span className="relative block">
                <UserIcon className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.name_placeholder")}
                  className={inputClass}
                  autoComplete="name"
                />
              </span>
            </label>
          )}

          <label className="block space-y-1.5">
            <span className="mono-caps text-[10px] text-muted-foreground">{t("auth.email")}</span>
            <span className="relative block">
              <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
              />
            </span>
          </label>

          <label className="block space-y-1.5">
            <span className="mono-caps text-[10px] text-muted-foreground">{t("auth.password")}</span>
            <span className="relative block">
              <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={isSignup ? 8 : 6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </span>
          </label>

          {/* Password requirements (sign-up) */}
          {isSignup && password.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 border border-rule bg-secondary/20 p-3">
              {pwRequirements.map((r) => (
                <li
                  key={r.label}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] transition-colors",
                    r.ok ? "text-[color:var(--color-success)]" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center size-3.5 border shrink-0",
                      r.ok ? "border-[color:var(--color-success)] bg-[color:var(--color-success)]/15" : "border-rule"
                    )}
                  >
                    {r.ok && <Check className="size-2.5" strokeWidth={3} />}
                  </span>
                  {r.label}
                </li>
              ))}
            </ul>
          )}

          {/* Confirm password (sign-up) */}
          {isSignup && (
            <label className="block space-y-1.5">
              <span className="mono-caps text-[10px] text-muted-foreground">{t("auth.confirm_password")}</span>
              <span className="relative block">
                <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  autoComplete="new-password"
                />
              </span>
              {confirmPassword.length > 0 && !pwMatch && (
                <span className="text-[11px] text-danger">{t("auth.pw_mismatch")}</span>
              )}
            </label>
          )}

          {error && (
            <p className="text-xs text-danger border border-danger/40 bg-danger/10 px-3 py-2">{t(error)}</p>
          )}

          <button
            type="submit"
            disabled={submitting || (isSignup && (!pwValid || !pwMatch))}
            className={cn(
              "w-full flex items-center justify-center gap-2 border border-ink bg-ink px-4 py-2.5 text-sm mono-caps text-[color:var(--color-paper)] transition-colors hover:bg-transparent hover:text-ink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {isSignup ? t("auth.signup_cta") : t("auth.signin_cta")}
          </button>
        </form>
      </PaperCard>

      <p className="text-center text-xs text-muted-foreground">
        {isSignup ? t("auth.have_account") : t("auth.no_account")}{" "}
        <Link
          href={isSignup ? "/signin" : "/signup"}
          className="text-coffee font-semibold hover:underline"
        >
          {isSignup ? t("auth.signin_link") : t("auth.signup_link")}
        </Link>
      </p>
    </div>
  );
}
