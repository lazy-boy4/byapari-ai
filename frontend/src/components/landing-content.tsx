"use client";

import Link from "next/link";
import { ArrowRight, Upload, FileSpreadsheet, Sparkles, TrendingUp, Tag, BookOpen, ShieldCheck } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { MonoLabel } from "@/components/mono-label";
import { SectionHeading } from "@/components/section-heading";
import { DashboardMock } from "@/components/dashboard-mock";
import { HealthGauge } from "@/components/health-gauge";
import { healthBreakdown, recommendations, personas } from "@/lib/mock-data";
import { useLang } from "@/lib/language-context";

const features = [
  { n: "01", icon: FileSpreadsheet, tKey: "landing.feature1_title", dKey: "landing.feature1_desc" },
  { n: "02", icon: ShieldCheck, tKey: "landing.feature2_title", dKey: "landing.feature2_desc" },
  { n: "03", icon: Sparkles, tKey: "landing.feature3_title", dKey: "landing.feature3_desc" },
  { n: "04", icon: TrendingUp, tKey: "landing.feature4_title", dKey: "landing.feature4_desc" },
  { n: "05", icon: Tag, tKey: "landing.feature5_title", dKey: "landing.feature5_desc" },
  { n: "06", icon: BookOpen, tKey: "landing.feature6_title", dKey: "landing.feature6_desc" },
];

export function LandingContent() {
  const { t } = useLang();
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <MonoLabel className="text-coffee">{t("landing.hero_badge1")}</MonoLabel>
              <div className="h-px w-12 bg-rule" />
              <MonoLabel>{t("landing.hero_badge2")}</MonoLabel>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
              {t("landing.hero_title1")}<br />
              <span className="italic font-medium text-coffee">{t("landing.hero_title2")}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t("landing.hero_desc")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-[color:var(--color-paper)] transition-colors hover:bg-transparent hover:text-ink">
                <Upload className="size-4" /> {t("landing.hero_cta1")}
              </Link>
              <Link href="/dashboard" className="mono-caps inline-flex items-center gap-2 border border-ink px-5 py-3 text-ink transition-colors hover:bg-ink hover:text-[color:var(--color-paper)]">
                {t("landing.hero_cta2")} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
              <MonoLabel>{t("landing.hero_source1")}</MonoLabel>
              <span className="text-rule">·</span>
              <MonoLabel>{t("landing.hero_source2")}</MonoLabel>
              <span className="text-rule">·</span>
              <MonoLabel>{t("landing.hero_source3")}</MonoLabel>
              <span className="text-rule">·</span>
              <MonoLabel>{t("landing.hero_source4")}</MonoLabel>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 border border-rule rule-line bg-transparent -rotate-1" />
              <div className="relative rotate-[0.6deg]">
                <DashboardMock />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <PaperCard className="px-3 py-2">
                  <MonoLabel className="text-coffee">{t("landing.hero_avg_time")}</MonoLabel>
                  <div className="font-display text-lg font-semibold">8.2s</div>
                </PaperCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="01 — capabilities"
          eyebrow={t("landing.features_eyebrow")}
          title={t("landing.features_title")}
          lead={t("landing.features_lead")}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
          {features.map((f) => (
            <div key={f.n} className="paper-grain bg-card p-8 hover:bg-secondary/40 transition-colors group">
              <div className="flex items-start justify-between mb-8">
                <f.icon className="size-6" strokeWidth={1.5} />
                <MonoLabel className="text-coffee">{f.n}</MonoLabel>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{t(f.tKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(f.dKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-rule bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            index="02 — workflow"
            eyebrow={t("landing.how_eyebrow")}
            title={t("landing.how_title")}
          />
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px rule-line" />
            {[
              { n: "01", tKey: "landing.step1_title", dKey: "landing.step1_desc" },
              { n: "02", tKey: "landing.step2_title", dKey: "landing.step2_desc" },
              { n: "03", tKey: "landing.step3_title", dKey: "landing.step3_desc" },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="paper-grain bg-card border border-rule p-8 relative z-[1]">
                  <div className="flex items-center justify-center size-10 border border-ink bg-card font-display font-bold text-lg mb-6">
                    {s.n}
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2">{t(s.tKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(s.dKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HEALTH SCORE FEATURE */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="03 — signal"
          eyebrow={t("landing.health_eyebrow")}
          title={t("landing.health_title")}
          lead={t("landing.health_lead")}
        />
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <PaperCard className="p-10 flex flex-col items-center">
            <MonoLabel>{t("landing.health_overall")}</MonoLabel>
            <div className="mt-4"><HealthGauge score={74} size={280} /></div>
            <div className="mt-2 mono-caps text-[color:var(--color-success)]">{t("health.vs_last")}</div>
          </PaperCard>
          <div>
            <ul className="divide-y divide-rule border-y border-rule">
              {healthBreakdown.map((b, i) => (
                <li key={b.label} className="py-5 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                  <MonoLabel className="text-coffee">{String(i + 1).padStart(2, "0")}</MonoLabel>
                  <div>
                    <div className="font-display font-semibold">{b.label}</div>
                    <div className="mt-2 h-1 bg-rule">
                      <div className="h-full bg-ink" style={{ width: `${b.score}%` }} />
                    </div>
                  </div>
                  <div className="font-mono text-lg tabular-nums">{b.score}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* INSIGHTS QUOTE */}
      <section className="border-y border-rule bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <MonoLabel className="text-coffee">{t("landing.sample_eyebrow")}</MonoLabel>
          <blockquote className="mt-6 font-display text-3xl md:text-4xl font-medium leading-[1.2] tracking-tight">
            &ldquo;{recommendations[2].en}&rdquo;
          </blockquote>
          <p className="mt-6 font-display text-2xl text-muted-foreground leading-snug">
            {recommendations[2].bn}
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="size-10 border border-ink flex items-center justify-center font-mono text-xs">AI</div>
            <div>
              <div className="font-display font-semibold">{t("landing.sample_module")}</div>
              <MonoLabel>{t("landing.sample_label")}</MonoLabel>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          index="05 — audience"
          eyebrow={t("landing.personas_eyebrow")}
          title={t("landing.personas_title")}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          {personas.map((p, i) => (
            <div key={p.who} className="paper-grain bg-card p-6">
              <MonoLabel className="text-coffee">{String(i + 1).padStart(2, "0")}</MonoLabel>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.who}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.what}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PaperCard className="p-12 md:p-16 text-center">
          <MonoLabel className="text-coffee">{t("landing.cta_eyebrow")}</MonoLabel>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]">
            {t("landing.cta_title")}
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            {t("landing.cta_desc")}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/dashboard" className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-[color:var(--color-paper)] transition-colors hover:bg-transparent hover:text-ink">
              <Upload className="size-4" /> {t("landing.cta_button1")}
            </Link>
            <Link href="/docs" className="mono-caps inline-flex items-center gap-2 border border-ink px-6 py-3 hover:bg-ink hover:text-[color:var(--color-paper)] transition-colors">
              {t("landing.cta_button2")}
            </Link>
          </div>
        </PaperCard>
      </section>
    </div>
  );
}
