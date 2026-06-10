import Link from "next/link";
import { LandingContent } from "@/components/landing-content";
import { PaperCard } from "@/components/paper-card";
import { MonoLabel } from "@/components/mono-label";
import { SectionHeading } from "@/components/section-heading";
import { DashboardMock } from "@/components/dashboard-mock";
import { HealthGauge } from "@/components/health-gauge";
import { healthBreakdown, recommendations, personas } from "@/lib/mock-data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Byapari AI — Drop a CSV in. Walk out with a plan.",
  description: "AI-powered business intelligence for Bangladeshi merchants. KPI dashboard, health score, forecast, pricing — from a single sales CSV.",
  openGraph: {
    title: "Byapari AI — Drop a CSV in. Walk out with a plan.",
    description: "AI-powered business intelligence for Bangladeshi merchants.",
  },
};

export default function LandingPage() {
  return <LandingContent />;
}
