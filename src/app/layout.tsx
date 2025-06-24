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
    apple: 'https://i.imgur.com/ZXpfIuw.jpeg',
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
        <meta name="theme-color" content="#E77918" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
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
