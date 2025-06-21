
"use client";

import AppHeader from '@/components/layout/app-header';
import BottomPlayer from '@/components/layout/bottom-player';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PodcastsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-2 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Podcasts</h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Emisoras
            </Link>
          </Button>
        </div>
        <Separator className="mb-4"/>
        <div className="flex-grow relative rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.emisorasdelmundo.com/podcast"
            title="Podcasts Emisoras del Mundo"
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Added sandbox for security
          />
        </div>
      </div>
      <div className="pb-24"> {/* Increased Padding for BottomPlayer */}
      </div>
      <BottomPlayer />
    </div>
  );
}
