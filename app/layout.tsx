import './globals.css';
import { Geist_Mono } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Alo Analytics',
  description: 'Mock digital analytics dashboard for Alo Yoga',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="bg-bone text-charcoal min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
