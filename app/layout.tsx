import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feedback Inbox',
  description: 'Tell us what to change. An AI software factory builds it live.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#14161c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="stripe" />
        {children}
        <footer className="site-footer">Built live at Startup Week Louisville</footer>
      </body>
    </html>
  );
}
