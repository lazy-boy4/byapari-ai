import type { Metadata } from "next";
import "./globals.css";
import { GrainOverlay } from "@/components/grain-overlay";
import { SiteHeader } from "@/components/site-header";
import { ConditionalFooter } from "@/components/conditional-footer";
import { LanguageProvider } from "@/lib/language-context";
import { AuthProvider } from "@/lib/auth-context";
import { LangBody } from "@/components/lang-body";

export const metadata: Metadata = {
  title: "B-AI · Byapari Intelligence",
  description:
    "B-AI is an AI-powered business intelligence platform by Team Nexion. " +
    "Upload your sales CSV and instantly receive KPIs, forecasts, AI recommendations " +
    "and a full business health score — designed for Bangladeshi merchants and beyond.",
  authors: [{ name: "S M Mohaiminul Islam", url: "https://github.com/Arik09013" }],
  keywords: ["business intelligence", "AI analytics", "sales dashboard", "byapari", "nexion"],
  openGraph: {
    title: "B-AI · Byapari Intelligence",
    description: "AI-powered business analytics for modern merchants",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <LanguageProvider>
        <AuthProvider>
          <LangBody className="font-body min-h-screen flex flex-col relative">
            <GrainOverlay />
            <SiteHeader />
            <main className="flex-1 flex flex-col relative z-10">{children}</main>
            <ConditionalFooter />
          </LangBody>
        </AuthProvider>
      </LanguageProvider>
    </html>
  );
}