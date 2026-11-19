import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeToggle from '../components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Feedback Inbox',
  description: 'Tell us what to change. An AI software factory builds it live.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#14161c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="stripe" />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
