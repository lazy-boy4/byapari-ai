import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byapari AI — Business Dashboard",
  description: "AI-powered business intelligence dashboard for your sales data",
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