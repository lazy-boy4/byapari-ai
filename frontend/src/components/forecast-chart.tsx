import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ChartDataPoint {
  day?: string;
  date?: string;
  actual?: number | null;
  forecast?: number | null;
  predicted_sales?: number;
  upper_bound?: number;
  lower_bound?: number;
}

interface ForecastChartProps {
  data?: ChartDataPoint[];
  height?: number;
}

export function ForecastChart({ data, height = 280 }: ForecastChartProps) {
  // If no data is passed, use a default fallback (the mock forecast data)
  const chartData: ChartDataPoint[] = (data && data.length > 0) ? data : Array.from({ length: 30 }, (_, i) => {
    const base = 24000 + Math.sin(i / 4) * 6000 + i * 280;
    return {
      day: `D${i + 1}`,
      actual: i < 18 ? Math.round(base + (Math.random() - 0.5) * 3000) : null,
      forecast: i >= 14 ? Math.round(base + 2400) : null,
    };
  });

  const isMockData = !data || data.length === 0;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-rule)" strokeDasharray="2 4" vertical={false} />
          {isMockData ? (
            <XAxis dataKey="day" tick={{ fontFamily: "PT Mono, monospace", fontSize: 10, fill: "var(--color-muted-foreground)" }} stroke="var(--color-rule)" />
          ) : (
            <XAxis dataKey="date" tick={{ fontFamily: "PT Mono, monospace", fontSize: 10, fill: "var(--color-muted-foreground)" }} stroke="var(--color-rule)" tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth()+1}/${d.getDate()}`; }} />
          )}
          <YAxis tick={{ fontFamily: "PT Mono, monospace", fontSize: 10, fill: "var(--color-muted-foreground)" }} stroke="var(--color-rule)" tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
          <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-rule)", borderRadius: 4, fontFamily: "PT Mono, monospace", fontSize: 11 }} labelStyle={{ color: "var(--color-ink)" }} />
          {isMockData ? (
            <>
              <Line type="monotone" dataKey="actual" stroke="var(--color-ink)" strokeWidth={2} dot={false} connectNulls />
              <Line type="monotone" dataKey="forecast" stroke="var(--color-coffee)" strokeWidth={2} strokeDasharray="4 4" dot={false} connectNulls />
            </>
          ) : (
            <>
              <Line type="monotone" dataKey="predicted_sales" stroke="var(--color-ink)" strokeWidth={2} dot={false} connectNulls />
              {chartData.some(d => d.upper_bound !== undefined) && (
                <Line type="monotone" dataKey="upper_bound" stroke="var(--color-coffee)" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls />
              )}
              {chartData.some(d => d.lower_bound !== undefined) && (
                <Line type="monotone" dataKey="lower_bound" stroke="var(--color-coffee)" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls />
              )}
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
