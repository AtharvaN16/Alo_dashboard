import { cn } from '@/lib/cn';

type EditorialLedeProps = {
  eyebrow: string;
  number: string;
  narrative: string;
  className?: string;
};

export function EditorialLede({ eyebrow, number, narrative, className }: EditorialLedeProps) {
  return (
    <article className={cn('px-10 pt-2 space-y-4', className)}>
      <div className="text-sm uppercase tracking-tracked text-stone">{eyebrow}</div>
      <div className="num text-display-xl font-medium leading-none text-charcoal">
        {number}
      </div>
      <p className="max-w-prose text-lg text-graphite">{narrative}</p>
    </article>
  );
}
