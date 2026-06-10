import type { Metadata } from "next";
import { PricingPlans } from "@/components/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing · B-AI",
  description:
    "Simple plans for growing businesses. Start free and upgrade as your business expands — KPIs, AI insights, forecasting and dynamic pricing.",
  openGraph: {
    title: "Pricing · B-AI",
    description: "Simple plans for growing businesses. Start free, upgrade as you scale.",
  },
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24 flex justify-center">
      <PricingPlans />
    </div>
  );
}
