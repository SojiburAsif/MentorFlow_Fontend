import React from "react";

export type SparkBarDatum = { label: string; value: number };

export default function SparkBarChart({
  data,
  height = 56,
  barColor = "#38bdf8",
}: {
  data: SparkBarDatum[];
  height?: number;
  barColor?: string;
}) {
  const safe = Array.isArray(data) ? data : [];
  const max = Math.max(1, ...safe.map((d) => Number(d.value) || 0));
  const w = Math.max(120, safe.length * 18);

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Monthly activity chart"
      className="block"
      preserveAspectRatio="none"
    >
      {safe.map((d, i) => {
        const v = Number(d.value) || 0;
        const barH = Math.max(2, (v / max) * (height - 10));
        const x = i * 18 + 3;
        const y = height - barH - 3;
        return (
          <rect
            key={d.label ?? i}
            x={x}
            y={y}
            width={12}
            height={barH}
            rx={3}
            fill={barColor}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}

