'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { useMemo } from 'react';
import type { TimePoint } from '@/lib/generators';
import { BRAND_COLORS } from '@/lib/brand';
import { compact } from '@/lib/format';
import { ChartTooltip } from './ChartTooltip';

export type AreaSeries = {
  key: string;
  name: string;
  color: string;
  data: TimePoint[];
};

export function AreaChartBlock({
  series, height = 280,
}: { series: AreaSeries[]; height?: number }) {
  const merged = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    series.forEach(s => {
      s.data.forEach(p => {
        const row = byDate.get(p.date) ?? { date: p.date };
        row[s.key] = p.value;
        byDate.set(p.date, row);
      });
    });
    return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [series]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map(s => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={BRAND_COLORS.line} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: BRAND_COLORS.stone, fontSize: 11 }}
            axisLine={{ stroke: BRAND_COLORS.line }}
            tickLine={false}
            minTickGap={48}
          />
          <YAxis
            tick={{ fill: BRAND_COLORS.stone, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => compact(Number(v))}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: BRAND_COLORS.line }} />
          <Legend wrapperStyle={{ fontSize: 12, color: BRAND_COLORS.graphite }} iconType="plainline" />
          {series.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={1.5}
              fill={`url(#fill-${s.key})`}
              isAnimationActive
              animationDuration={400}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
