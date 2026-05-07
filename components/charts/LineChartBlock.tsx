'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { useMemo } from 'react';
import type { TimePoint } from '@/lib/generators';
import { BRAND_COLORS } from '@/lib/brand';
import { compact } from '@/lib/format';
import { ChartTooltip } from './ChartTooltip';

export type LineSeries = {
  key: string;
  name: string;
  color: string;
  data: TimePoint[];
};

export function LineChartBlock({
  series, height = 240,
}: { series: LineSeries[]; height?: number }) {
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
        <LineChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          <Legend
            wrapperStyle={{ fontSize: 12, color: BRAND_COLORS.graphite }}
            iconType="plainline"
          />
          {series.map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
              animationDuration={400}
              animationEasing="ease-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
