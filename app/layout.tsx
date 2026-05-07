import './globals.css';
import { Fraunces, Schibsted_Grotesk, Geist_Mono } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
  display: 'swap',
});

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
    <html
      lang="en"
      className={`${fraunces.variable} ${schibsted.variable} ${geistMono.variable}`}
    >
      <body className="bg-bone text-charcoal min-h-screen">{children}</body>
    </html>
  );
}
