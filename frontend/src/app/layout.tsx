import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}