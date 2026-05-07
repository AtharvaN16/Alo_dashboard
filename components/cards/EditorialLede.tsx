import { cn } from '@/lib/cn';

type EditorialLedeProps = {
  eyebrow: string;
  number: string;
  narrative: string;
  className?: string;
};

export function EditorialLede({ eyebrow, number, narrative, className }: EditorialLedeProps) {
  return (
    <article className={cn('px-10 pt-2', className)}>
      <div className="text-2xs uppercase tracking-tracked text-stone">{eyebrow}</div>
      <div className="font-serif text-display-xl font-extralight leading-none text-charcoal">
        {number}
      </div>
      <p className="max-w-prose pt-4 text-base text-graphite">{narrative}</p>
    </article>
  );
}
