export function HealthGauge({ score = 74, size = 220 }: { score?: number; size?: number }) {
  const r = 90;
  const c = Math.PI * r;
  const offset = c - (c * score) / 100;
  return (
    <svg viewBox="0 0 220 130" width={size} height={(size * 130) / 220} className="block">
      <path d="M20 110 A 90 90 0 0 1 200 110" fill="none" stroke="var(--color-rule)" strokeWidth="14" />
      <path d="M20 110 A 90 90 0 0 1 200 110" fill="none" stroke="var(--color-ink)" strokeWidth="14" strokeDasharray={c} strokeDashoffset={offset} />
      {Array.from({ length: 11 }).map((_, i) => {
        const a = Math.PI - (i * Math.PI) / 10;
        const x1 = 110 + Math.cos(a) * 102;
        const y1 = 110 - Math.sin(a) * 102;
        const x2 = 110 + Math.cos(a) * 110;
        const y2 = 110 - Math.sin(a) * 110;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-ink)" strokeWidth="1" opacity="0.4" />;
      })}
      <text x="110" y="98" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="44" fontWeight="700" fill="var(--color-ink)">{score}</text>
      <text x="110" y="120" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="9" letterSpacing="2" fill="var(--color-muted-foreground)">/ 100</text>
    </svg>
  );
}
