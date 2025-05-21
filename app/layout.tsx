import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import LayoutShell from '@/components/LayoutShell';
import LuciaWidget from '@/components/LuciaWidget'; // AÑADIR ESTA LÍNEA

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} font-sans`}>
      <body className="min-h-screen bg-background antialiased overflow-auto">
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <LayoutShell>{children}</LayoutShell>
          <LuciaWidget /> {/* AÑADIR ESTE WIDGET AQUÍ */}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
