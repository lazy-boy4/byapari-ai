"use client";

import { PaperCard } from "@/components/paper-card";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

// ─────────────────────────────────────────────
// PRICING PLANS
// Shared between the standalone /pricing route and
// any in-app surface that needs the plan grid.
// ─────────────────────────────────────────────
export function PricingPlans() {
  const { t, lang } = useLang();

  const freeFeatures = lang === "bn"
    ? ["মাসে ১টি CSV আপলোড", "বেসিক KPIs", "বিক্রয় ট্রেন্ড চার্ট", "শীর্ষ ৫টি পণ্য"]
    : ["1 CSV upload/month", "Basic KPIs", "Sales trend chart", "Top 5 products"];
  const proFeatures = lang === "bn"
    ? ["আনলিমিটেড CSV আপলোড", "সম্পূর্ণ AI ইনসাইট", "বাংলা ভাষা সমর্থন", "বিক্রয় পূর্বাভাস", "অগ্রাধিকার সমর্থন"]
    : ["Unlimited CSV uploads", "Full AI insights", "Bengali language support", "Sales forecast", "Priority support"];
  const enterpriseFeatures = lang === "bn"
    ? ["প্রো-এর সবকিছু", "API অ্যাক্সেস", "কাস্টম ইন্টিগ্রেশন", "ডেডিকেটেড সাপোর্ট", "টিম অ্যাকাউন্ট"]
    : ["Everything in Pro", "API access", "Custom integrations", "Dedicated support", "Team accounts"];

  const plans = [
    {
      id: "free" as const,
      name: t("pricing.free_name"),
      price: t("pricing.free_price"),
      period: t("pricing.free_period"),
      color: "text-ink",
      features: freeFeatures,
      cta: t("pricing.free_cta"),
      popular: false,
    },
    {
      id: "pro" as const,
      name: t("pricing.pro_name"),
      price: t("pricing.pro_price"),
      period: t("pricing.pro_period"),
      color: "text-coffee",
      features: proFeatures,
      cta: t("pricing.pro_cta"),
      popular: true,
    },
    {
      id: "enterprise" as const,
      name: t("pricing.enterprise_name"),
      price: t("pricing.enterprise_price"),
      period: t("pricing.enterprise_period"),
      color: "text-muted-foreground",
      features: enterpriseFeatures,
      cta: t("pricing.enterprise_cta"),
      popular: false,
    },
  ];

  return (
    <div className="fade-up w-full max-w-5xl mx-auto space-y-12">
      <SectionHeading index="01" eyebrow={t("pricing.eyebrow")} title={t("pricing.title")} lead={t("pricing.lead")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PaperCard
            key={plan.id}
            className={cn(
              "p-8 relative flex flex-col justify-between min-h-[420px]",
              plan.popular && "border-coffee border-2"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-coffee text-[color:var(--color-paper)] text-[10px] font-bold px-3 py-1 uppercase tracking-wider font-mono">
                {t("pricing.most_popular")}
              </div>
            )}
            <div>
              <div className={cn("font-display font-bold text-lg uppercase tracking-tight mb-4", plan.color)}>
                {plan.name}
              </div>
              <div className="mb-6 flex items-baseline">
                <span className="font-display font-extrabold text-4xl text-ink tracking-tight">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground ml-2">/ {plan.period}</span>
              </div>
              <div className="h-px bg-rule mb-6" />
              <ul className="space-y-3.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <span className="text-coffee font-semibold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                if (plan.id === "enterprise") {
                  window.location.href = "mailto:blueberry.poison.1309@gmail.com";
                  return;
                }
                alert(t("pricing.coming_soon"));
              }}
              className={cn(
                "w-full py-2.5 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer",
                plan.popular
                  ? "bg-coffee border-coffee text-[color:var(--color-paper)] hover:bg-transparent hover:text-coffee"
                  : "bg-transparent border-ink text-ink hover:bg-ink hover:text-[color:var(--color-paper)]"
              )}
            >
              {plan.cta}
            </button>
          </PaperCard>
        ))}
      </div>
    </div>
  );
}
