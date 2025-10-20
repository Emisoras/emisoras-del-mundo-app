import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/components/providers/app-providers';

export const metadata: Metadata = {
  title: 'Emisoras del Mundo',
  description: 'Escucha tus emisoras favoritas de todo el mundo.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: 'https://i.imgur.com/IZQqWe0.jpeg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="application-name" content="Emisoras del Mundo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Emisoras" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://i.imgur.com/IZQqWe0.jpeg" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <AppProviders>
          <div className="flex-grow">{children}</div>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
