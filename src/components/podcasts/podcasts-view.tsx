
"use client";

import React from 'react';
import { Mic2 } from 'lucide-react';

export default function PodcastsView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <Mic2 className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Sección de Podcasts</h2>
      <p className="text-muted-foreground">Esta sección estará disponible próximamente.</p>
    </div>
  );
}
