import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Lora, Outfit } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Catechumenon - Estudo da Confissão de Fé',
  description: 'Plataforma dedicada ao estudo da Confissão de Fé de Westminster e seus catecismos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${lora.variable} ${outfit.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="grain-overlay">
              {children}
            </div>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
