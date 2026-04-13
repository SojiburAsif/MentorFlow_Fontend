import React from "react";

export type DonutDatum = { label: string; value: number; color: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DonutChart({
  data,
  size = 120,
  stroke = 14,
}: {
  data: DonutDatum[];
  size?: number;
  stroke?: number;
}) {
  const safe = Array.isArray(data) ? data : [];
  const total = safe.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 1;

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arcs = safe.map((d) => {
    const v = Number(d.value) || 0;
    const frac = clamp(v / total, 0, 1);
    const dash = frac * c;
    return { ...d, dash };
  });
  const offsets = arcs.reduce<number[]>((acc, a, i) => {
    const prev = acc[i - 1] ?? 0;
    acc.push(prev + (i === 0 ? 0 : (arcs[i - 1]?.dash ?? 0)));
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Status distribution">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(148,163,184,0.15)"
          strokeWidth={stroke}
        />
        {arcs.map((d, idx) => {
          const dash = d.dash;
          const offset = offsets[idx] ?? 0;
          return (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="18" fontWeight="800">
          {total === 1 && safe.length === 0 ? "—" : safe.reduce((s, d) => s + (Number(d.value) || 0), 0)}
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="central" fill="rgba(148,163,184,0.9)" fontSize="10" fontWeight="600">
          total
        </text>
      </svg>

      <div className="space-y-2">
        {safe.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-400">{d.label}</span>
            <span className="ml-auto text-white font-bold tabular-nums">{Number(d.value) || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

