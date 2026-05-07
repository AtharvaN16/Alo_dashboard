'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { buildActiveRange, type ActiveRange, type RangeLabel } from '@/lib/date-range';

type Ctx = {
  range: ActiveRange;
  label: RangeLabel;
  setLabel: (l: RangeLabel) => void;
  compare: boolean;
  setCompare: (v: boolean) => void;
};

const DateRangeCtx = createContext<Ctx | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<RangeLabel>('30D');
  const [compare, setCompare] = useState(false);
  const range = useMemo(() => buildActiveRange(label), [label]);
  return (
    <DateRangeCtx.Provider value={{ range, label, setLabel, compare, setCompare }}>
      {children}
    </DateRangeCtx.Provider>
  );
}

export function useDateRange(): Ctx {
  const v = useContext(DateRangeCtx);
  if (!v) throw new Error('useDateRange must be used within DateRangeProvider');
  return v;
}
