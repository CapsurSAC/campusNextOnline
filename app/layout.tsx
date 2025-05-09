import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import LayoutShell from '@/components/LayoutShell';

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} font-sans`}>
      <body className="min-h-screen bg-background antialiased overflow-auto">
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <LayoutShell>{children}</LayoutShell>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
