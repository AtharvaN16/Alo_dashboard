'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/',             label: 'Overview' },
  { href: '/traffic',      label: 'Traffic' },
  { href: '/engagement',   label: 'Engagement' },
  { href: '/audience',     label: 'Audience' },
  { href: '/social',       label: 'Social' },
  { href: '/seo',          label: 'SEO' },
  { href: '/competitors',  label: 'Competitors' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed bottom-0 left-0 top-20 z-10 flex w-60 flex-col border-r border-line bg-bone">
      <nav className="flex-1 pt-6">
        {NAV.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-2.5 text-sm transition-colors duration-200 ease-out-quart',
                active
                  ? 'bg-cream text-charcoal'
                  : 'text-graphite hover:text-charcoal',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-200 ease-out-quart',
                  active ? 'bg-sage' : 'bg-transparent',
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-6 text-xs text-stone">
        Mock data. Refreshed 5 May 2026.
      </div>
    </aside>
  );
}
