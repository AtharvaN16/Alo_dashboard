import { cn } from '@/lib/cn';

type BadgeProps = {
  tone?: 'neutral' | 'sage' | 'clay';
  children: React.ReactNode;
  className?: string;
};

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs uppercase tracking-tracked',
        tone === 'neutral' && 'bg-cream text-graphite',
        tone === 'sage' && 'bg-sage/10 text-sage-deep',
        tone === 'clay' && 'bg-clay/10 text-clay',
        className,
      )}
    >
      {children}
    </span>
  );
}
