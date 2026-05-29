"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
} from "lucide-react";

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
    rawData?: Record<string, string | number>[]
  ) => void;
}

export default function CsvUpload({
  onDataLoaded,
}: CsvUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(0);
  const [error, setError] = useState("");
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [qualityReport, setQualityReport] = useState<any>(null);
  const [rawData, setRawData] = useState<Record<string, string | number>[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const data = await uploadCsv(file);
      console.log("UPLOAD RESPONSE:", data);
      setRows(data.rows ?? 0);
      setKpis(data.kpis);
      setQualityReport(data.data_quality ?? null);
      setState("success");
      const rawScore = (data as any).health_score as number ?? 0;
      const healthScore: HealthScore = {
        score: rawScore,
        label: rawScore >= 70 ? "Good" : rawScore >= 40 ? "Fair" : "Poor",
        color: rawScore >= 70 ? "#34d399" : rawScore >= 40 ? "#fbbf24" : "#f87171",
      };

      if (onDataLoaded) {
        onDataLoaded(
          data.kpis,
          data.insights,
          healthScore,
          data.sales_trend,
          data.top_products,
          data.raw_data || []
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

  const borderColor =
    state === "dragging"
      ? "var(--accent)"
      : state === "error"
      ? "#ef4444"
      : "var(--border)";

  return (
    <div className="flex flex-col gap-4">
      <div className="glow-card p-5">
        <div className="mb-5">
          <h3
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-primary)",
            }}
          >
            Upload Sales Data
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            Upload CSV and analyze business instantly
          </p>
        </div>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => state === "idle" && inputRef.current?.click()}
          className="rounded-xl flex flex-col items-center justify-center transition-all duration-200"
          style={{
            border: `2px dashed ${borderColor}`,
            background: state === "dragging" ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)",
            padding: "32px 20px",
            cursor: state === "idle" ? "pointer" : "default",
            minHeight: 160,
          }}
        >
                    {state === "idle" && (
            <>
              <Upload size={32} style={{ color: "var(--accent)", marginBottom: 12 }} />
              <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Drop CSV here or click to browse
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4, marginBottom: 12 }}>
                Supports .csv files only
              </p>
              <a
                href="/sample_data.csv"
                download
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "var(--accent)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.1)";
                }}
              >
                <Download size={14} />
                Download Sample CSV
              </a>
              <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(232,184,75,0.06)", border: "1px solid rgba(232,184,75,0.15)", maxWidth: 340 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", marginBottom: 6 }}>
                  🤖 Want to test with your own data?
                </p>
                <p style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 8 }}>
                  Ask ChatGPT or any AI to generate a CSV with these exact columns:
                </p>
                <code style={{
                  display: "block",
                  fontSize: 10.5,
                  color: "var(--accent)",
                  background: "rgba(82,157,255,0.06)",
                  border: "1px solid rgba(82,157,255,0.12)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  lineHeight: 1.8,
                  marginBottom: 8,
                  wordBreak: "break-all",
                }}>
                  date, product_name, product_category, sales, profit, quantity, rating, returned, stock, payment_method, customer_city
                </code>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      `Generate a CSV dataset with 200 rows for an e-commerce business with exactly these columns:\n\ndate, product_name, product_category, sales, profit, quantity, rating, returned, stock, payment_method, customer_city\n\nRules:\n- date: between 2024-01-01 and 2024-12-31 (YYYY-MM-DD format)\n- product_category: only Electronics, Clothing, Food, Sports, Home & Kitchen\n- sales: decimal number between 500 and 20000\n- profit: decimal, always less than sales\n- quantity: between 1 and 20\n- rating: between 1.0 and 5.0\n- returned: Yes or No (about 10% Yes)\n- stock: between 0 and 200\n- payment_method: Cash on Delivery, bKash, Nagad, Card, or Bank Transfer\n- customer_city: real cities from your country\n\nGive me only the CSV data, no explanation.`
                    );
                    alert("✅ Prompt copied! Paste it into ChatGPT or any AI.");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: "rgba(232,184,75,0.10)",
                    border: "1px solid rgba(232,184,75,0.25)",
                    color: "var(--gold)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  📋 Copy AI Prompt
                </button>
              </div>
            </>
          )}

          {state === "uploading" && (
            <>
              <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent)", marginBottom: 12 }} />
              <p style={{ color: "var(--text-primary)" }}>Uploading & analyzing...</p>
            </>
          )}

          {state === "error" && (
            <>
              <XCircle size={36} style={{ color: "#ef4444", marginBottom: 12 }} />
              <p style={{ color: "#ef4444", fontWeight: 700 }}>Upload Failed</p>
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
            Upload Another File
          </button>
        )}
      </div>

      {state === "success" && kpis && (
        <div className="glow-card p-5">
          <h3
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            Live KPI Results
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            {[
              { label: "Total Sales", value: `৳${(kpis.total_sales ?? 0).toLocaleString()}` },
              { label: "Total Orders", value: (kpis.total_orders ?? 0).toLocaleString() },
              { label: "Total Profit", value: `৳${(kpis.total_profit ?? 0).toLocaleString()}` },
              { label: "Avg Rating", value: `⭐ ${kpis.average_rating ?? 0}` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                  {item.label}
                </p>
                <h4
                  style={{
                    fontFamily: "Syne, sans-serif",
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