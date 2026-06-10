"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";

function AuthLoading() {
  const { t } = useLang();
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32 text-center">
      <Loader2 className="size-6 animate-spin text-coffee" />
      <span className="mono-caps text-xs text-muted-foreground">{t("auth.checking")}</span>
    </div>
  );
}

/**
 * Gate that keeps a route private. While Firebase resolves the session it
 * shows a loader; if there is no user it redirects to /signin (preserving
 * the intended destination), otherwise it renders the children.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
