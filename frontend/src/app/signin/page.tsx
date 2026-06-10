import { Suspense } from "react";
import { AuthCard } from "@/components/auth-card";

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24 flex justify-center">
      <Suspense fallback={null}>
        <AuthCard mode="signin" />
      </Suspense>
    </div>
  );
}
