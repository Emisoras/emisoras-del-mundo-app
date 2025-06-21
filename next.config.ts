
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.appcreator24.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-radiotime-logos.tunein.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'esplendida.com.pe',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.orbitaradio.com.pe',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-bog2-2.cdn.whatsapp.net',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'http', // Permitir HTTP para este dominio específico si es necesario
        hostname: '149.130.186.0', // Para Tu Salsa Radio y Voice Voz si tienen logos en ese servidor
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
