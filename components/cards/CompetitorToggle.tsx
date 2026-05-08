'use client';

import { useState } from 'react';
import { PillToggle } from '@/components/ui/Pill';

type Props = {
  defaultOn?: boolean;
  onChange?: (v: boolean) => void;
};

export function useCompetitorToggle(defaultOn = false) {
  const [on, setOn] = useState(defaultOn);
  const node = <PillToggle label="Competition" checked={on} onChange={setOn} />;
  return { on, setOn, node };
}

export function CompetitorToggleStandalone({ defaultOn = false, onChange }: Props) {
  const [on, setOn] = useState(defaultOn);
  return (
    <PillToggle
      label="Competition"
      checked={on}
      onChange={v => { setOn(v); onChange?.(v); }}
    />
  );
}
