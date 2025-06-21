"use client";

import type { ReactNode } from 'react';
import { AudioPlayerProvider } from '@/contexts/audio-player-context';
import { FavoritesProvider } from '@/contexts/favorites-context';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AudioPlayerProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AudioPlayerProvider>
  );
}
