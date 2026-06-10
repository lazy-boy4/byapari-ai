"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
} from "lucide-react";
import { useLang } from "@/lib/language-context";

import {
  uploadCsv,
  KpiData,
  AiRecommendation,
  HealthScore,
  SalesDataPoint,
  ProductData,
} from "@/lib/api";

type UploadState =
  | "idle"
  | "dragging"
  | "uploading"
  | "success"
  | "error";

interface CsvUploadProps {
  onDataLoaded?: (
    kpis: KpiData,
    insights: AiRecommendation[],
    healthScore: HealthScore,
    salesTrend: SalesDataPoint[],
    topProducts: ProductData[],
    rawData?: Record<string, string | number>[],
    fileName?: string
  ) => void;
  /** Signed-in user's id/email — sent so the analysis is saved to history. */
  userId?: string;
  email?: string | null;
}

export default function CsvUpload({
  onDataLoaded,
  userId,
  email,
}: CsvUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(0);
  const [error, setError] = useState("");
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [qualityReport, setQualityReport] = useState<any>(null);
  const [rawData, setRawData] = useState<Record<string, string | number>[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, lang } = useLang();

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      setState("error");
      return;
    }

    setFileName(file.name);
    setState("uploading");
    setError("");
    setKpis(null);

    try {
      const data = await uploadCsv(file, lang, userId, email);
      console.log("UPLOAD RESPONSE:", data);
      setRows(data.rows ?? 0);
      setKpis(data.kpis);
      setQualityReport(data.data_quality ?? null);
      setState("success");
      const rawScore = (data as any).health_score as number ?? 0;
      const healthScore: HealthScore = {
        score: rawScore,
        label: rawScore >= 70 ? "Good" : rawScore >= 40 ? "Fair" : "Poor",
        color: rawScore >= 70 ? "var(--green)" : rawScore >= 40 ? "var(--amber)" : "var(--red)",
      };

      if (onDataLoaded) {
        onDataLoaded(
          data.kpis,
          data.insights,
          healthScore,
          data.sales_trend,
          data.top_products,
          data.raw_data || [],
          file.name
        );
      }
    } catch (err: any) {
      setError(err.message || "Upload failed. Is backend running?");
      setState("error");
    }
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setState("dragging");
  };

  const onDragLeave = () => setState("idle");

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setError("");
    setFileName("");
    setKpis(null);
    setQualityReport(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── LEFT COLUMN: Upload Zone ── */}
        <div className="paper-panel p-5 flex flex-col">
          <div className="mb-5">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {t("upload.title")}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {t("upload.subtitle")}
            </p>
          </div>

          <div className="flex-1 flex flex-col">
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => state === "idle" && inputRef.current?.click()}
              className={`upload-zone rounded-xl flex flex-col items-center justify-center ${state === "dragging" ? "drag-over" : ""}`}
              style={{
                padding: "40px 24px",
                cursor: state === "idle" ? "pointer" : "default",
                minHeight: 220,
                border: "2px dashed var(--border)",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              {state === "idle" && (
                <>
                  <div className="size-14 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center mb-4">
                    <Upload size={28} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <p className="text-[var(--text-primary)] font-semibold text-base">
                    {t("upload.drop_here")}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mt-1.5 mb-4">
                    {t("upload.csv_only")}
                  </p>
                </>
              )}

              {state === "uploading" && (
                <>
                  <Loader2 size={36} className="animate-spin" style={{ color: "var(--secondary)", marginBottom: 12 }} />
                  <p style={{ color: "var(--text-primary)" }}>{t("upload.generating")}</p>
                </>
              )}

              {state === "error" && (
                <>
                  <XCircle size={40} style={{ color: "var(--red)", marginBottom: 12 }} />
                  <p style={{ color: "var(--red)", fontWeight: 700 }}>{t("upload.failed")}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{error}</p>
                </>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={onFileChange}
              style={{ display: "none" }}
            />

            {(state === "success" || state === "error") && (
              <button
                onClick={reset}
                className="w-full mt-4 rounded-xl py-2.5 font-semibold text-sm"
                style={{
                  background: "var(--border)",
                  color: "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("upload.retry")}
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Prompt + Download ── */}
        <div className="paper-panel p-5 flex flex-col">
          <div className="mb-5">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {t("upload.generate_title")}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {t("upload.generate_subtitle")}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-4">
            <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", background: "var(--amber-dim)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "oklch(0.450 0.120 65)", marginBottom: 8 }}>
                {t("upload.prompt_title")}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 10 }}>
                {t("upload.prompt_desc")}
              </p>
              <code style={{
                display: "block",
                fontSize: 10.5,
                fontFamily: "var(--font-mono)",
                color: "var(--text-primary)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "8px 10px",
                lineHeight: 1.8,
                marginBottom: 10,
                wordBreak: "break-all",
              }}>
                date, product_name, product_category, sales, profit, quantity, rating, returned, stock, payment_method, customer_city
              </code>
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(
                    `Generate a CSV dataset with 200 rows for an e-commerce business with exactly these columns:\n\ndate, product_name, product_category, sales, profit, quantity, rating, returned, stock, payment_method, customer_city\n\nRules:\n- date: between 2024-01-01 and 2024-12-31 (YYYY-MM-DD format)\n- product_category: only Electronics, Clothing, Food, Sports, Home & Kitchen\n- sales: decimal number between 500 and 20000\n- profit: decimal, always less than sales\n- quantity: between 1 and 20\n- rating: between 1.0 and 5.0\n- returned: Yes or No (about 10% Yes)\n- stock: between 0 and 200\n- payment_method: Cash on Delivery, bKash, Nagad, Card, or Bank Transfer\n- customer_city: real cities from your country\n\nGive me only the CSV data, no explanation.`
                  );
                  alert("✅ Prompt copied! Paste it into ChatGPT or any AI.");
                }}
                className="btn-ghost"
                style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
              >
                📋 {t("upload.copy_prompt")}
              </button>
            </div>

            <a
              href="/sample_data.csv"
              download
              className="btn-ghost flex items-center justify-center gap-2 py-2.5 text-sm"
              style={{ textDecoration: "none" }}
            >
              <Download size={16} />
              {t("upload.download_sample")}
            </a>
          </div>
        </div>
      </div>

      {state === "success" && kpis && (
        <div className="paper-panel p-5">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            {t("upload.kpi_title")}
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            {[
              { label: t("upload.kpi_sales"), value: `৳${(kpis.total_sales ?? 0).toLocaleString()}` },
              { label: t("upload.kpi_orders"), value: (kpis.total_orders ?? 0).toLocaleString() },
              { label: t("upload.kpi_profit"), value: `৳${(kpis.total_profit ?? 0).toLocaleString()}` },
              { label: t("upload.kpi_rating"), value: `⭐ ${kpis.average_rating ?? 0}` },
            ].map((item) => (
              <div
                key={item.label}
                className="paper-panel p-3"
              >
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                  {item.label}
                </p>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.value}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}